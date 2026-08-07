import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Ver /home/demian/Documentos/Vaults/Rol in the Shell/02 Portal/Arquitectura Técnica del Portal.md
// `sistema` es texto libre a propósito: no se restringe a los sistemas más
// reseñados (D&D 5e, Pathfinder 2e, Savage Worlds, CoC) porque cualquier
// otro sistema debe poder reseñarse/etiquetarse sin tocar el schema.

const blog = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.coerce.date(),
		cover: z.string().optional(),
		tags: z.array(z.string()).default([]),
	}),
});

const resenas = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/resenas' }),
	schema: z.object({
		title: z.string(),
		sistema: z.string(),
		producto: z.string(),
		editorial: z.string(),
		puntuacion: z.number().min(1).max(10),
		pros: z.array(z.string()).default([]),
		contras: z.array(z.string()).default([]),
		date: z.coerce.date(),
		cover: z.string().optional(),
		tags: z.array(z.string()).default([]),
	}),
});

const assetTipos = ['personaje', 'npc', 'mapa', 'aventura', 'tabla'] as const;

const assets = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/assets' }),
	schema: z.object({
		title: z.string(),
		tipo: z.enum(assetTipos),
		sistema: z.string().default('generico'),
		nivel: z.number().optional(),
		archivo: z.string(),
		tags: z.array(z.string()).default([]),
		description: z.string().optional(),
		cover: z.string().optional(),
		date: z.coerce.date(),
	}),
});

export const collections = { blog, resenas, assets };
export { assetTipos };
