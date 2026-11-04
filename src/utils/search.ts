// Shared by the build (to index posts) and the browser (to match the query),
// so both sides fold text the same way: lowercase, no accents, no markup.

/** Lowercases, removes accents ("conversão" -> "conversao") and collapses spaces. */
export function normalize(text: string): string {
	return text
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/\s+/g, ' ')
		.trim();
}

/** Plain, normalized text of a post, used as its search index. */
export function searchText(title: string, description: string, body: string): string {
	const plainBody = body
		.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1') // links and images: keep the label
		.replace(/[`*_#>|~]/g, ' '); // markdown symbols
	return normalize(`${title} ${description} ${plainBody}`);
}
