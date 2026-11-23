/** Words a reader gets through per minute, reading prose on a screen. */
export const WORDS_PER_MINUTE = 230;

/**
 * Estimated reading time of a post's Markdown, in whole minutes (at least one).
 * Counts only what a reader reads: code blocks, image descriptions, link
 * addresses, HTML comments and Markdown symbols are left out.
 */
export function readingTime(markdown: string | undefined): number {
	const prose = (markdown ?? '')
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/<!--[\s\S]*?-->/g, ' ')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
	const words = prose.split(/\s+/).filter((token) => /[\p{L}\p{N}]/u.test(token) && !/^\d+\.$/.test(token));
	return Math.max(1, Math.round(words.length / WORDS_PER_MINUTE));
}
