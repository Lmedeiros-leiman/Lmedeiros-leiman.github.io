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

// Fenced blocks (``` or ~~~) and inline `code`. Their text is shown exactly as
// written, so it is indexed verbatim: List<string> must stay searchable.
const CODE = /(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]+`)/g;

/** Turns Markdown prose (not code) into the text a reader sees. */
function proseText(text: string): string {
	return (
		text
			// Links and images: keep both the label and the address, so "beebeep.net" is found.
			.replace(/!?\[([^\]]*)\]\(([^)]*)\)/g, '$1 $2')
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
	// split() with a capturing group alternates prose (even) and code (odd) parts.
	const plainBody = body
		.split(CODE)
		.map((part, i) => (i % 2 ? part : proseText(part)))
		.join(' ');
	return normalize(`${title} ${description} ${plainBody}`);
}
