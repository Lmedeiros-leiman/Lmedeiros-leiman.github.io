import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readingTime, WORDS_PER_MINUTE } from './readingTime.ts';

const words = (n: number) => Array.from({ length: n }, () => 'word').join(' ');

test('minutes are the prose word count at the reading pace, rounded, at least one', () => {
	assert.equal(WORDS_PER_MINUTE, 230);
	assert.equal(readingTime(words(230 * 3)), 3);
	assert.equal(readingTime(words(230 * 3 + 114)), 3);
	assert.equal(readingTime(words(230 * 3 + 116)), 4);
	assert.equal(readingTime(''), 1);
	assert.equal(readingTime(undefined), 1);
});

test('image descriptions and link addresses are not read, link text is', () => {
	const alt = words(460);
	assert.equal(readingTime(`${words(230)}\n\n![${alt}](../../assets/diagram.svg)`), 1);
	assert.equal(readingTime(`[${words(460)}](https://example.com/${words(460).replaceAll(' ', '/')})`), 2);
});

test('code blocks, HTML comments and Markdown symbols are not read', () => {
	// 344 words is 1.496 minutes: any extra token counted would round up to 2.
	const md = [
		words(344),
		'```xml',
		words(460),
		'```',
		'<!-- writing-check: allow contrast -->',
		'- # > * 1. ---',
	].join('\n');
	assert.equal(readingTime(md), 1);
});
