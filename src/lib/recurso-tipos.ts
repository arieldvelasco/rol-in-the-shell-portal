import { recursoTipos } from '../content.config';

export type RecursoTipo = (typeof recursoTipos)[number];

export const recursoTipoLabels: Record<RecursoTipo, string> = {
	personaje: 'Personajes',
	npc: 'NPCs',
	mapa: 'Mapas',
	aventura: 'Aventuras y campañas',
	tabla: 'Tablas',
};

export const recursoTipoSingularLabels: Record<RecursoTipo, string> = {
	personaje: 'Personaje',
	npc: 'NPC',
	mapa: 'Mapa',
	aventura: 'Aventura',
	tabla: 'Tabla',
};

export { recursoTipos };
