# lmedeiros-leiman.github.io

Personal blog built with [Astro](https://astro.build), deployed to GitHub Pages.

## Workflow

1. Branch off `main`, write a post in `src/content/blog/`.
2. Open a PR — CI runs `npm run build` as a required check.
3. Merge — GitHub Actions builds and deploys to https://lmedeiros-leiman.github.io/

## Local dev

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/
```

The previous portfolio site lives on the `archived` branch.
