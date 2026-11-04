# lmedeiros-leiman.github.io

Personal blog built with [Astro](https://astro.build), deployed to GitHub Pages.

## Workflow

1. Branch off `main`, write a post in `src/content/blog/` (see Post dates below).
2. Open a PR — CI runs `npm run build` as a required check.
3. Merge — GitHub Actions builds and deploys to https://lmedeiros-leiman.github.io/

## Post dates

`pubDate` is required and `updatedDate` is optional. Both must be in quotes, in one of
these forms; anything else (or an impossible day like Feb 30) fails the build:

- `'Nov 03 2026'`, `'November 3, 2026'` or `'Sept 3 2026'`
- `'2026-11-03'`
- `'2026-11-03T12:00:00'` (read as UTC) or `'2026-11-03T12:00:00-03:00'`

The site shows every date as its UTC day. A timestamp late in the evening with your own
offset can therefore show the next day: `'2026-11-03T23:30:00-03:00'` is Nov 4 in UTC.
Use the date-only forms when the day is what matters.

## Local dev

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/
```

The previous portfolio site lives on the `archived` branch.
