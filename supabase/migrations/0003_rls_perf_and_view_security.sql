-- Correcciones de performance/seguridad detectadas por los advisors de Supabase
-- (alineadas con la skill supabase-postgres-best-practices):
--
-- 1. content_stats corría como SECURITY DEFINER (default de las vistas) —
--    la cambiamos a SECURITY INVOKER para que respete los permisos/RLS de
--    quien consulta, no los del creador.
-- 2. Las policies de `comments` reevaluaban auth.uid() por fila — se
--    envuelven en (select auth.uid()) para que el planner lo cachee.
-- 3. comments.user_id (FK a auth.users) no tenía índice — afecta JOINs y
--    el ON DELETE CASCADE.
--
-- Correr en el SQL editor del dashboard de Supabase.

alter view content_stats set (security_invoker = true);

alter policy "usuarios autenticados pueden comentar" on comments
	with check ((select auth.uid()) = user_id);

alter policy "el autor puede borrar su propio comentario" on comments
	using ((select auth.uid()) = user_id)
	with check ((select auth.uid()) = user_id);

create index comments_user_id_idx on comments (user_id);
