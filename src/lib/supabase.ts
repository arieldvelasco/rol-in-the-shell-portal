import { createClient } from '@supabase/supabase-js';

// Cliente pensado para usarse desde el navegador (islands/scripts de las
// páginas de detalle), no desde el frontmatter de Astro en build time.
export const supabase = createClient(
	import.meta.env.PUBLIC_SUPABASE_URL,
	import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);
