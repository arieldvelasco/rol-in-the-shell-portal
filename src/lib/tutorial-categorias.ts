import { tutorialCategorias } from '../content.config';

export type TutorialCategoria = (typeof tutorialCategorias)[number];

export const tutorialCategoriaLabels: Record<TutorialCategoria, string> = {
	herramienta: 'Herramientas',
	vtt: 'VTT',
	sistema: 'Sistemas de rol',
};

export { tutorialCategorias };
