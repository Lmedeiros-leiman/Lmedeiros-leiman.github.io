import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Post dates must mean the same day on every machine, and a typo must fail the
// build instead of publishing a wrong date. JavaScript reads many date strings
// in the local timezone and silently rolls impossible days over (Feb 30 ->
// Mar 2), so dates are parsed here by hand and only these quoted forms pass:
//   'Nov 03 2026' or 'November 3, 2026'  -> that day, in UTC
//   '2026-11-03'                         -> that day, in UTC
//   '2026-11-03T12:00:00'                -> that time, in UTC
//   '2026-11-03T12:00:00-03:00' / ...Z   -> that exact moment
// Unquoted YAML dates are refused: the YAML parser has already rolled an
// impossible day over before we see it, so the mistake can't be detected.
const ISO =
	/^(?<year>[1-9]\d{3})-(?<month>\d{2})-(?<day>\d{2})(?:T(?<hour>[01]\d|2[0-3]):(?<minute>[0-5]\d)(?::(?<second>[0-5]\d)(?<fraction>\.\d+)?)?(?<zone>Z|[+-](?:[01]\d|2[0-3]):?[0-5]\d)?)?$/i;
const NAMED = /^(?<month>[a-z]+)\.? (?<day>\d{1,2}),? (?<year>[1-9]\d{3})$/i;
const MONTHS = [
	['jan', 'january'],
	['feb', 'february'],
	['mar', 'march'],
	['apr', 'april'],
	['may'],
	['jun', 'june'],
	['jul', 'july'],
	['aug', 'august'],
	['sep', 'sept', 'september'],
	['oct', 'october'],
	['nov', 'november'],
	['dec', 'december'],
];

/** The UTC midnight of that day, or undefined if the day doesn't exist. */
function utcDay(year: number, month: number, day: number): Date | undefined {
	const date = new Date(Date.UTC(year, month - 1, day));
	const real =
		date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
	return real ? date : undefined;
}

function parseUtcDate(value: string): Date | undefined {
	const text = value.trim();

	const named = NAMED.exec(text)?.groups;
	if (named) {
		const month = MONTHS.findIndex((names) => names.includes(named.month.toLowerCase())) + 1;
		return month ? utcDay(Number(named.year), month, Number(named.day)) : undefined;
	}

	const iso = ISO.exec(text)?.groups;
	if (!iso) return undefined;
	const day = utcDay(Number(iso.year), Number(iso.month), Number(iso.day));
	if (!day || !iso.hour) return day;
	// A valid, fully checked ISO timestamp: the engine parses these exactly.
	// Without a zone it would be local time, so add Z to make it UTC.
	const date = new Date(iso.zone ? text : `${text}Z`);
	return Number.isNaN(date.valueOf()) ? undefined : date;
}

const FORMATS = `Use a quoted date: 'Nov 03 2026', '2026-11-03', or an ISO timestamp such as '2026-11-03T12:00:00-03:00'.`;

const utcDate = z.unknown().transform((value, ctx): Date => {
	const date = typeof value === 'string' ? parseUtcDate(value) : undefined;
	if (date) return date;
	ctx.addIssue({
		code: 'custom',
		message:
			value === undefined || value === null
				? `Required. ${FORMATS}`
				: value instanceof Date
					? `Dates must be in quotes, so a typo like 2026-02-30 can't silently become another day. ${FORMATS}`
					: `Unsupported date ${JSON.stringify(value)}. ${FORMATS}`,
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
			// A blank `updatedDate:` (YAML null) counts as no update date.
			updatedDate: z.preprocess((value) => value ?? undefined, utcDate.optional()),
			heroImage: z.optional(image()),
		}),
});

export const collections = { blog };
