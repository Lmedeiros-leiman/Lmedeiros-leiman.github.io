// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://lmedeiros-leiman.github.io',
	integrations: [mdx(), sitemap()],
	markdown: {
		shikiConfig: {
			// Both themes are emitted; global.css picks one with prefers-color-scheme.
			themes: { light: 'github-light', dark: 'vesper' },
		},
	},
	fonts: [
		{
			// Newsreader (SIL Open Font License), variable weight, latin subset.
			// Used for headings and post text.
			provider: fontProviders.local(),
			name: 'Newsreader',
			cssVariable: '--font-serif',
			fallbacks: ['Georgia', 'Times New Roman', 'serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/newsreader-latin.woff2'],
						weight: '400 700',
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
		{
			// Atkinson Hyperlegible. Used for navigation, dates and other small text.
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-sans',
			fallbacks: ['system-ui', 'sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
