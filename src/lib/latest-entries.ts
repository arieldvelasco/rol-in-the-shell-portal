import { getCollection } from 'astro:content';
import { recursoTipoSingularLabels } from './recurso-tipos';

export interface ContentEntry {
	title: string;
	href: string;
	date: Date;
	kind: string;
	excerpt: string;
	contentType: 'blog' | 'resena' | 'tutorial' | 'asset';
	contentSlug: string;
}

export async function getAllEntries(): Promise<ContentEntry[]> {
	const [blog, resenas, tutoriales, recursos] = await Promise.all([
		getCollection('blog'),
		getCollection('resenas'),
		getCollection('tutoriales'),
		getCollection('recursos'),
	]);

	return [
		...blog.map((post) => ({
			title: post.data.title,
			href: `/blog/${post.id}`,
			date: post.data.date,
			kind: 'Blog',
			excerpt: post.data.description,
			contentType: 'blog' as const,
			contentSlug: post.id,
		})),
		...resenas.map((resena) => ({
			title: resena.data.title,
			href: `/resenas/${resena.id}`,
			date: resena.data.date,
			kind: 'Reseña',
			excerpt: `${resena.data.producto} — ${resena.data.editorial}`,
			contentType: 'resena' as const,
			contentSlug: resena.id,
		})),
		...tutoriales.map((tutorial) => ({
			title: tutorial.data.title,
			href: `/tutoriales/${tutorial.id}`,
			date: tutorial.data.date,
			kind: 'Tutorial',
			excerpt: tutorial.data.description,
			contentType: 'tutorial' as const,
			contentSlug: tutorial.id,
		})),
		...recursos.map((recurso) => ({
			title: recurso.data.title,
			href: `/recursos/${recurso.data.tipo}/${recurso.id}`,
			date: recurso.data.date,
			kind: recursoTipoSingularLabels[recurso.data.tipo],
			excerpt: recurso.data.description ?? '',
			contentType: 'asset' as const,
			contentSlug: recurso.id,
		})),
	];
}

export async function getLatestEntries(limit: number): Promise<ContentEntry[]> {
	const entries = await getAllEntries();
	return entries.sort((a, b) => b.date.valueOf() - a.date.valueOf()).slice(0, limit);
}
