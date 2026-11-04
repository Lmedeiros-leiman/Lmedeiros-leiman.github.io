import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Post dates must mean the same day on every machine. JavaScript reads many
// date strings in the local timezone, and guessing every format people might
// type is a losing game, so only these forms are accepted:
//   'Nov 03 2026' or 'November 3, 2026'  -> that day, in UTC
//   '2026-11-03'                         -> that day, in UTC
//   '2026-11-03T12:00:00'                -> that time, in UTC
//   '2026-11-03T12:00:00-03:00' / ...Z   -> that exact moment
//   unquoted YAML dates (2026-11-03)     -> already UTC
// Anything else fails the build with a message, instead of shifting the date.
// Groups: year, month, day, time, zone.
const ISO = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)(Z|[+-]\d{2}:?\d{2})?)?$/i;
// Groups: day.
const MONTH_DAY_YEAR = /^[a-z]{3,9}\.? (\d{1,2}),? \d{4}$/i;

/** True if the day exists in that month (rejects '2026-02-30', which JS rolls to Mar 2). */
function isRealDay(year: number, month: number, day: number): boolean {
	const date = new Date(Date.UTC(year, month - 1, day));
	return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function parseUtcDate(value: string): Date | undefined {
	const text = value.trim();
	let candidate: string | undefined;
	const iso = ISO.exec(text);
	const named = MONTH_DAY_YEAR.exec(text);
	if (iso) {
		if (!isRealDay(Number(iso[1]), Number(iso[2]), Number(iso[3]))) return undefined;
		candidate = iso[4] && !iso[5] ? `${text}Z` : text; // a time without a zone means UTC
	} else if (named) {
		candidate = `${text} UTC`;
	}
	if (!candidate) return undefined;
	const date = new Date(candidate);
	if (Number.isNaN(date.valueOf())) return undefined;
	// 'Feb 30 2026' would also roll over; the day must survive parsing unchanged.
	if (named && date.getUTCDate() !== Number(named[1])) return undefined;
	return date;
}

const utcDate = z.unknown().transform((value, ctx): Date => {
	if (value instanceof Date && !Number.isNaN(value.valueOf())) return value;
	const date = typeof value === 'string' ? parseUtcDate(value) : undefined;
	if (date) return date;
	ctx.addIssue({
		code: 'custom',
		message: `Unsupported date ${JSON.stringify(value)}. Use 'Nov 03 2026', '2026-11-03', or an ISO timestamp such as '2026-11-03T12:00:00-03:00'.`,
	});
	return z.NEVER;
});

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
