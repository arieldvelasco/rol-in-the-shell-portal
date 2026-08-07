import { assetTipos } from '../content.config';

export type AssetTipo = (typeof assetTipos)[number];

export const assetTipoLabels: Record<AssetTipo, string> = {
	personaje: 'Personajes',
	npc: 'NPCs',
	mapa: 'Mapas',
	aventura: 'Aventuras y campañas',
	tabla: 'Tablas',
};

export const assetTipoSingularLabels: Record<AssetTipo, string> = {
	personaje: 'Personaje',
	npc: 'NPC',
	mapa: 'Mapa',
	aventura: 'Aventura',
	tabla: 'Tabla',
};

export { assetTipos };
