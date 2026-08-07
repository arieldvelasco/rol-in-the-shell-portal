import { getCollection } from 'astro:content';
import { assetTipoSingularLabels } from './asset-tipos';

export interface ContentEntry {
	title: string;
	href: string;
	date: Date;
	kind: string;
	contentType: 'blog' | 'resena' | 'asset';
	contentSlug: string;
}

export async function getAllEntries(): Promise<ContentEntry[]> {
	const [blog, resenas, assets] = await Promise.all([
		getCollection('blog'),
		getCollection('resenas'),
		getCollection('assets'),
	]);

	return [
		...blog.map((post) => ({
			title: post.data.title,
			href: `/blog/${post.id}`,
			date: post.data.date,
			kind: 'Blog',
			contentType: 'blog' as const,
			contentSlug: post.id,
		})),
		...resenas.map((resena) => ({
			title: resena.data.title,
			href: `/resenas/${resena.id}`,
			date: resena.data.date,
			kind: 'Reseña',
			contentType: 'resena' as const,
			contentSlug: resena.id,
		})),
		...assets.map((asset) => ({
			title: asset.data.title,
			href: `/assets/${asset.data.tipo}/${asset.id}`,
			date: asset.data.date,
			kind: assetTipoSingularLabels[asset.data.tipo],
			contentType: 'asset' as const,
			contentSlug: asset.id,
		})),
	];
}

export async function getLatestEntries(limit: number): Promise<ContentEntry[]> {
	const entries = await getAllEntries();
	return entries.sort((a, b) => b.date.valueOf() - a.date.valueOf()).slice(0, limit);
}
