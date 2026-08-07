const STORAGE_KEY = 'anon-fingerprint';

// Id anónimo estable por navegador, usado para deduplicar reactions y views.
// No es a prueba de abuso deliberado (ver Arquitectura Técnica del Portal).
export function getFingerprint(): string {
	let id = localStorage.getItem(STORAGE_KEY);
	if (!id) {
		id = crypto.randomUUID();
		localStorage.setItem(STORAGE_KEY, id);
	}
	return id;
}
