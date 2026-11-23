// Shared by the build (to index posts) and the browser (to match the query),
// so both sides fold text exactly the same way.

/**
 * Lowercases, removes accents ("conversão" -> "conversao"), drops Markdown
 * formatting characters and collapses spaces. Characters that are part of
 * names people search for, like "_" in snake_case or "#" in C#, are kept.
 */
export function normalize(text: string): string {
	return text
		.normalize('NFD')
		.replace(/\p{M}/gu, '')
		.toLowerCase()
		.replace(/[‘’]/g, "'") // phones often type curly quotes: can’t -> can't
		.replace(/[`*>|~"“”]/g, ' ') // formatting, and quotes around a search like "messengers"
		.replace(/\s+/g, ' ')
		// Single quotes around a word ('messengers'), but not inside one (can't).
		.replace(/(^| )'+|'+(?= |$)/g, '$1')
		.trim();
}

// One left-to-right scan over code and HTML comments, so whichever starts first
// wins: code inside a comment stays hidden, a comment inside code stays visible.
//   group 1: fenced blocks (``` or ~~~) and inline `code`, shown exactly as
//            written, so indexed verbatim (List<string> must stay searchable)
//   no group: <!-- comments -->, invisible on the page, so never indexed
//            (draft notes must not end up in the page's search data)
const CODE_OR_COMMENT = /(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]+`)|<!--[\s\S]*?(?:-->|$)/g;

/** Turns Markdown prose (no code, no comments) into the text a reader sees. */
function proseText(text: string): string {
	return (
		text
			// Links and images: keep both the label and the address, so "beebeep.net" is
			// found. The address may be wrapped in <...> and followed by a "title".
			.replace(/!?\[([^\]]*)\]\((?:<([^>]*)>|([^)\s]*))(?:\s+"[^"]*")?\)/g, '$1 $2$3')
			// Autolinks: <https://beebeep.net/> and <me@example.com> keep their address.
			.replace(/<((?:https?|ftp|mailto):[^>\s]*|[^>\s@]+@[^>\s@]+)>/gi, '$1')
			// Raw HTML tags: <kbd>Ctrl</kbd>+<kbd>C</kbd> -> Ctrl+C.
			.replace(/<\/?[a-z][^>\n]*>/gi, '')
			// foo\_bar -> foo_bar, h\@llo -> h@llo (any ASCII punctuation can be escaped).
			.replace(/\\([!-/:-@[-`{-~])/g, '$1')
			// AT&amp;T -> AT&T.
			.replace(/&(amp|lt|gt|quot|#39|apos);/g, (entity, name: string) =>
				({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'" })[name] ?? entity,
			)
	);
}

/** Plain, normalized text of a post, used as its search index. */
export function searchText(title: string, description: string, body: string): string {
	let plainBody = '';
	let last = 0;
	for (const match of body.matchAll(CODE_OR_COMMENT)) {
		plainBody += proseText(body.slice(last, match.index)) + ' ';
		if (match[1]) plainBody += match[1] + ' '; // code: verbatim; comment: dropped
		last = match.index + match[0].length;
	}
	plainBody += proseText(body.slice(last));
	return normalize(`${title} ${description} ${plainBody}`);
}
