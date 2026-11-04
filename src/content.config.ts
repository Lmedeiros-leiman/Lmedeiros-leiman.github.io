import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Dates like 'Nov 03 2026' would be parsed in the build machine's timezone, so
// the same post could show a different day locally and on GitHub. Read every
// date without an explicit timezone as UTC ('2026-11-03' already is).
const utcDate = z.preprocess((value) => {
	if (typeof value !== 'string') return value;
	const text = value.trim();
	const isIsoDate = /^d{4}-d{2}-d{2}/.test(text);
	const hasZone = /(utc|gmt|z|[+-]d{2}:?d{2})$/i.test(text);
	return isIsoDate || hasZone ? text : `${text} UTC`;
}, z.coerce.date());

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: utcDate,
			updatedDate: utcDate.optional(),
			heroImage: z.optional(image()),
		}),
});

export const collections = { blog };
