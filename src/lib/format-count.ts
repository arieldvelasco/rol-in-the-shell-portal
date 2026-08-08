// Formatea contadores de reacciones para que el ancho del botón no cambie
// al pasar de una a dos/tres cifras: 0-999 tal cual, de ahí en más en "k".
export function formatReactionCount(n: number): string {
	if (n < 1000) return String(n);
	return `${Math.floor(n / 1000)}k`;
}
