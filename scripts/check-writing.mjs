#!/usr/bin/env node
// Measures each paragraph of a blog post for formula writing.
//
// Hard rules fail the check: they are structures that announce, delay or dress
// up a point instead of stating it. Soft markers (AI-era vocabulary, intensifiers,
// hedges, stock phrases) only add to a per-100-words score, and concrete detail
// (numbers, names, code, quotes) is counted next to it, so a paragraph that is
// both vague and padded stands out. A paragraph can opt out of one rule with an
// HTML comment on the line above it: <!-- writing-check: allow announce -->
//
// Usage: node scripts/check-writing.mjs [files...] [--changed <git-ref>] [--json]
// With no files it checks every post in src/content/blog.

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HARD_RULES = [
	{
		rule: 'announce',
		hint: 'State the realisation itself as the first sentence.',
		patterns: [
			/\b(?:then|that'?s when|that is when) (?:i|we) (?:realised|realized|noticed|understood|figured)\b/i,
			/\b(?:i|we) (?:realised|realized|noticed|understood) (?:something|one thing|two things|the (?:real|big))\b/i,
			/\b(?:something|this|that|it) (?:changed|shifted|flipped) (?:the whole|everything|how (?:i|we)|my)\b/i,
			/\bthen came the (?:day|moment|time|night)\b/i,
			/\bhere'?s the (?:thing|catch|twist|kicker)\b/i,
			/\b(?:it )?turns? out\b/i,
			/\bsurprised me (?:even )?more\b/i,
			/\b(?:that'?s|this is) (?:where|when) (?:it|things) (?:got|gets|became|started)\b/i,
			/\b(?:something|it|everything) (?:clicked|fell into place)\b/i,
		],
	},
	{
		rule: 'pseudo-cleft',
		hint: 'Start with the subject and the fact ("It had to prove every change.").',
		patterns: [/(?:^|[.!?]["”')]*\s+)(?:(?:but|and|so)\s+)?what\s+[^.!?,]{2,40}?\s(?:was|is)\b/i],
	},
	{
		rule: 'contrast',
		hint: 'Say what it is. Mention the alternative only if a reader would really have assumed it.',
		patterns: [
			/\b(?:it|this|that|they|he|she) (?:wasn'?t|isn'?t|wouldn'?t|won'?t|doesn'?t|didn'?t)\b[^.!?]{0,80}[.!?]\s+(?:it|this|that|they|he|she) (?:was|is|would|will|does|did)\b/i,
			/\bnot (?:just|only|merely)\b[^.!?]{0,80}\b(?:but|it'?s)\b/i,
			/\b(?:isn'?t|wasn'?t) (?:about|just)\b/i,
			/\bit'?s not [^.!?,]{1,40}, it'?s\b/i,
			/\b(?:it|this|that)(?:'s|’s| is| was) not\b[^.!?]{0,60}[.!?]\s+(?:it|this|that)(?:'s|’s| is| was)\b/i,
			/(?:^|[.!?]["”')]*\s+)not [^.!?]{1,60}, but\b/i,
			/\bi (?:didn'?t|don'?t|wasn'?t|won'?t) (\w{3,}) (\w+)\b[^.!?]{0,60}[.!?]\s+i \1(?:e?d|t)? \2\b/i,
			/\b(?:didn'?t|doesn'?t|wasn'?t|isn'?t) \w+ (from|about|because|for)\b[^.!?]{0,60}[.!?]\s+(?:it|this|that) (?:was |is )?\w+ \1\b/i,
		],
	},
	{
		rule: 'foreshadow',
		hint: 'Cut it, and explain the detail where it matters.',
		patterns: [/\bremember (?:that|this)\b/i, /\b(?:it|this|that) (?:comes|will come) back\b/i, /\bmore on (?:that|this) later\b/i],
	},
	{
		rule: 'dash',
		hint: 'Use a period or a comma.',
		patterns: [/—|\s–\s/],
	},
	{
		rule: 'emphasis',
		hint: 'Let word order carry the weight; keep the words plain.',
		patterns: [/\*\*[^*\s][^*]*\*\*|(?<![\w*])\*[^*\s][^*]*?\*(?![\w*])|(?<![\w`])_[^_\s][^_]*?_(?![\w`])/],
	},
];

const KICKER = {
	rule: 'kicker',
	hint: 'End on the last fact, or merge the punchline into the sentence before it.',
};

const SOFT = [
	{ name: 'ai-vocabulary', weight: 3, re: /\b(?:delv|crucial|pivotal|intricat|meticulous|commendabl|showcas|underscor|tapestr|testament|vibrant|foster|garner|interplay|landscape|enhanc|realm|seamless|robust|leverag|utiliz|notabl|additionally|moreover|furthermore|comprehensive|nuanc|journey|elevat|embark|game.?changer|ever.?evolving)\w*|\bunlock\w* (?:new|the|your|its|their|real) (?:potential|power|value|possibilit\w*)/gi },
	{ name: 'stock-phrase', weight: 3, re: /\b(?:every single|kept me coming back|changed how i felt|that was enough|at the end of the day|little did i know|the rest is history|needless to say|in a nutshell|the whole plan)\b/gi },
	{ name: 'moral', weight: 3, re: /\b(?:so if (?:you|something)|if you take one thing|the lesson here|in the end|ultimately|all in all|in conclusion)\b/gi },
	{ name: 'intensifier', weight: 1, re: /\b(?:really|very|honestly|actually|literally|truly|simply|incredibly|extremely|completely|absolutely|basically|definitely)\b/gi },
	{ name: 'hedge', weight: 1, re: /\b(?:perhaps|arguably|somewhat|fairly|quite|kind of|sort of)\b/gi },
];

/** Splits a post into checkable paragraphs, with the line each starts on. */
function paragraphs(md) {
	let text = md.replace(/\r\n/g, '\n');
	let offset = 0;
	const front = /^---\n[\s\S]*?\n---\n/.exec(text);
	if (front) {
		offset = front[0].split('\n').length - 1;
		text = text.slice(front[0].length);
	}
	// Blank out fenced code but keep its lines, so line numbers stay right.
	text = text.replace(/```[\s\S]*?```/g, (block) => block.replace(/[^\n]/g, ''));
	const out = [];
	let line = offset + 1;
	for (const block of text.split(/\n[ \t]*\n/)) {
		const start = line + (block.match(/^\n*/)?.[0].length ?? 0);
		line += block.split('\n').length + 1;
		let body = block.trim();
		if (!body) continue;
		const allowed = new Set();
		const allow = /^<!--\s*writing-check:\s*allow\s+([\w\s-]+?)\s*-->\s*/i.exec(body);
		if (allow) {
			allow[1].split(/\s+/).forEach((rule) => allowed.add(rule));
			body = body.slice(allow[0].length);
		}
		if (!body || /^(?:#|!\[|<|\||```)/.test(body)) continue;
		const plain = body
			.split('\n')
			.map((l) => l.replace(/^\s*(?:[-*+]|\d+\.)\s+/, '').trim())
			.join(' ')
			.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
			.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
			.trim();
		if (plain) out.push({ line: allow ? start + 1 : start, text: plain, allowed });
	}
	return out;
}

const sentencesOf = (text) => text.split(/(?<=[.!?])["”')\]]*\s+/).filter((s) => s.trim());
const wordsOf = (text) => text.match(/[\p{L}\p{N}'’+#.-]+/gu)?.filter((w) => /[\p{L}\p{N}]/u.test(w)) ?? [];

function snippet(text, index, length) {
	const from = Math.max(0, index - 20);
	return `${from > 0 ? '…' : ''}${text.slice(from, index + length + 20).trim()}${index + length + 20 < text.length ? '…' : ''}`;
}

function checkParagraph({ line, text, allowed }) {
	const hits = [];
	// Inline code is quoted material, not the author's prose.
	const prose = text.replace(/`[^`]*`/g, '');
	for (const { rule, hint, patterns } of HARD_RULES) {
		if (allowed.has(rule)) continue;
		for (const re of patterns) {
			const m = re.exec(prose);
			if (m) {
				hits.push({ rule, hint, match: snippet(prose, m.index, m[0].length) });
				break;
			}
		}
	}
	const sentences = sentencesOf(text);
	const last = sentences.at(-1) ?? '';
	if (!allowed.has('kicker') && sentences.length >= 3 && /^(?:And|But|So)\b/.test(last) && /[.!]["”')]*$/.test(last.trim()) && wordsOf(last).length <= 12) {
		hits.push({ ...KICKER, match: last.trim() });
	}
	const words = wordsOf(text).length || 1;
	const soft = {};
	let weighted = 0;
	for (const { name, weight, re } of SOFT) {
		const count = text.match(re)?.length ?? 0;
		if (count) {
			soft[name] = count;
			weighted += weight * count;
		}
	}
	let concrete = text.match(/\b\d[\d.,:]*\b/g)?.length ?? 0;
	concrete += text.match(/`[^`]+`|"[^"]+"|“[^”]+”/g)?.length ?? 0;
	for (const sentence of sentences) {
		concrete += wordsOf(sentence).slice(1).filter((w) => /^\p{Lu}/u.test(w) && w !== 'I' && !/^I['’]/.test(w)).length;
	}
	const softPer100 = Math.round((1000 * weighted) / words) / 10;
	const concretePer100 = Math.round((1000 * concrete) / words) / 10;
	return {
		line,
		text,
		words,
		sentences: sentences.length,
		hits,
		soft,
		softPer100,
		concretePer100,
		// A story paragraph may carry no numbers or names; it is vague only when it is also padded.
		vague: words >= VAGUE_WARN.minWords && concretePer100 <= VAGUE_WARN.maxConcretePer100 && softPer100 >= VAGUE_WARN.minSoftPer100,
	};
}

/** Checks one Markdown document. */
export function checkMarkdown(md) {
	const checked = paragraphs(md).map(checkParagraph);
	const lengths = checked.flatMap((p) => sentencesOf(p.text).map((s) => wordsOf(s).length)).filter(Boolean);
	const mean = lengths.reduce((a, b) => a + b, 0) / (lengths.length || 1);
	const sd = Math.sqrt(lengths.reduce((a, b) => a + (b - mean) ** 2, 0) / (lengths.length || 1));
	const openers = {};
	for (const p of checked) {
		const first = wordsOf(p.text)[0];
		if (first) openers[first] = (openers[first] ?? 0) + 1;
	}
	return {
		paragraphs: checked,
		doc: {
			paragraphs: checked.length,
			words: checked.reduce((a, p) => a + p.words, 0),
			meanSentenceLength: Math.round(mean * 10) / 10,
			// Burstiness: low variation in sentence length reads as templated.
			sentenceLengthCv: Math.round((sd / (mean || 1)) * 100) / 100,
			openers,
		},
	};
}

const SOFT_WARN = 8; // weighted soft markers per 100 words
const VAGUE_WARN = { minWords: 40, maxConcretePer100: 1.5, minSoftPer100: 4 };

function postsToCheck(args) {
	const changed = args.indexOf('--changed');
	if (changed !== -1) {
		const ref = args[changed + 1];
		const out = execFileSync('git', ['diff', '--name-only', '--diff-filter=AM', `${ref}...HEAD`, '--', 'src/content/blog'], { encoding: 'utf8' });
		return out.split('\n').filter((f) => /\.mdx?$/.test(f) && existsSync(f));
	}
	const files = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--changed');
	if (files.length) return files;
	const dir = 'src/content/blog';
	return readdirSync(dir).filter((f) => /\.mdx?$/.test(f)).map((f) => join(dir, f));
}

function main(args) {
	const files = postsToCheck(args);
	const results = files.map((file) => ({ file, ...checkMarkdown(readFileSync(file, 'utf8')) }));
	if (args.includes('--json')) {
		console.log(JSON.stringify(results, null, 2));
	} else {
		for (const { file, paragraphs: ps, doc } of results) {
			console.log(`\n${file}: ${doc.paragraphs} paragraphs, ${doc.words} words, mean sentence ${doc.meanSentenceLength} words, length variation ${doc.sentenceLengthCv}`);
			for (const p of ps) {
				for (const h of p.hits) console.log(`  ✖ ${file}:${p.line} [${h.rule}] ${h.match}\n      → ${h.hint}`);
				if (p.softPer100 >= SOFT_WARN) console.log(`  ⚠ ${file}:${p.line} padded: ${p.softPer100} per 100 words ${JSON.stringify(p.soft)}`);
				if (p.vague) console.log(`  ⚠ ${file}:${p.line} vague: ${p.words} words, ${p.concretePer100} concrete details per 100 words, padding ${JSON.stringify(p.soft)}`);
			}
			const repeated = Object.entries(doc.openers).filter(([w, n]) => /^(?:then|so|and|but)$/i.test(w) && n >= 3);
			for (const [w, n] of repeated) console.log(`  ⚠ ${file}: ${n} paragraphs start with "${w}"`);
		}
		const failures = results.reduce((a, r) => a + r.paragraphs.reduce((b, p) => b + p.hits.length, 0), 0);
		console.log(failures ? `\n${failures} formula pattern(s) to fix.` : '\nNo formula patterns found.');
	}
	process.exitCode = results.some((r) => r.paragraphs.some((p) => p.hits.length)) ? 1 : 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main(process.argv.slice(2));
