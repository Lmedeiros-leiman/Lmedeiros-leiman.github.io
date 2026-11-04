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

/** Plain, normalized text of a post, used as its search index. */
export function searchText(title: string, description: string, body: string): string {
	const plainBody = body
		// Links and images: keep both the label and the address, so "beebeep.net" is found.
		.replace(/!?\[([^\]]*)\]\(([^)]*)\)/g, '$1 $2')
		// Raw HTML tags: <kbd>Ctrl</kbd>+<kbd>C</kbd> -> Ctrl+C.
		.replace(/<\/?[a-z][^>\n]*>/gi, '')
		// Index the text as readers see it: foo\_bar -> foo_bar, h\@llo -> h@llo
		// (Markdown lets any ASCII punctuation be escaped), AT&amp;T -> AT&T.
		.replace(/\\([!-/:-@[-`{-~])/g, '$1')
		.replace(/&(amp|lt|gt|quot|#39|apos);/g, (_, name: string) =>
			({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'" })[name] ?? _,
		);
	return normalize(`${title} ${description} ${plainBody}`);
}
