-- Agrega la sección de Tutoriales: permite content_type = 'tutorial' en
-- comments/reactions/views además de 'blog', 'resena', 'asset'.
-- ('asset' se mantiene como identificador interno para la sección
-- renombrada de Assets a Recursos en el sitio — solo cambia la etiqueta
-- visible y las URLs, no el valor guardado en la base.)
--
-- Correr en el SQL editor del dashboard de Supabase.

alter table comments drop constraint comments_content_type_check;
alter table comments add constraint comments_content_type_check
	check (content_type in ('blog', 'resena', 'tutorial', 'asset'));

alter table reactions drop constraint reactions_content_type_check;
alter table reactions add constraint reactions_content_type_check
	check (content_type in ('blog', 'resena', 'tutorial', 'asset'));

alter table views drop constraint views_content_type_check;
alter table views add constraint views_content_type_check
	check (content_type in ('blog', 'resena', 'tutorial', 'asset'));
