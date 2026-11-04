import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Dates like 'Nov 03 2026' would be parsed in the build machine's timezone, so
// the same post could show a different day locally and on GitHub. Read every
// date without an explicit timezone as UTC.
const ISO_DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/; // already parsed as UTC
const ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/; // no zone
// A zone only counts right after a time ("12:00-03:00", "12:00Z", "12:00 EST")
// or as a UTC/GMT marker, so dates like "11-03-2026" aren't mistaken for an
// offset and "10:00 am" isn't mistaken for a zone name. An unknown zone name
// makes an invalid date, which fails the build instead of shifting the date.
const HAS_ZONE =
	/(?:\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?\s*(?:z|[+-]\d{2}:?\d{2}|(?!(?:am|pm)$)[a-z]{2,5})|\b(?:utc|gmt)(?:[+-]\d{2}:?\d{2})?)$/i;

function toUtcDateInput(value: unknown): unknown {
	if (typeof value !== 'string') return value; // YAML dates arrive as Date objects
	const text = value.trim();
	if (ISO_DATE_ONLY.test(text) || HAS_ZONE.test(text)) return text;
	if (ISO_DATE_TIME.test(text)) return `${text}Z`;
	return `${text} UTC`;
}

const utcDate = z.preprocess(toUtcDateInput, z.coerce.date());

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
