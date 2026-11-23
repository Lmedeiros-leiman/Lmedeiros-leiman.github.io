import { type CollectionEntry, getCollection } from 'astro:content';

export interface PostEntry {
	post: CollectionEntry<'blog'>;
	/** 1-based, in publishing order: the first post ever published is No. 1. */
	number: number;
	/** Estimated reading time in whole minutes. */
	minutes: number;
}

const WORDS_PER_MINUTE = 200;

export function readingTime(body: string | undefined): number {
	const text = (body ?? '').replace(/```[\s\S]*?```/g, ' ');
	const words = text.split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function formatNumber(n: number): string {
	return `No. ${String(n).padStart(2, '0')}`;
}

/** All posts, newest first, each with its number and reading time. */
export async function getPosts(): Promise<PostEntry[]> {
	const posts = await getCollection('blog');
	posts.sort(
		(a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf() || a.id.localeCompare(b.id),
	);
	return posts
		.map((post, i) => ({ post, number: i + 1, minutes: readingTime(post.body) }))
		.reverse();
}
