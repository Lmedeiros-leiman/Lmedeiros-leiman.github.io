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
		.replace(/[“”]/g, '"')
		.replace(/[`*>|~]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

/** Plain, normalized text of a post, used as its search index. */
export function searchText(title: string, description: string, body: string): string {
	// Links and images: keep both the label and the address, so "beebeep.net" is found.
	const plainBody = body.replace(/!?\[([^\]]*)\]\(([^)]*)\)/g, '$1 $2');
	return normalize(`${title} ${description} ${plainBody}`);
}
