-- Alias de comentario, respuestas anidadas y likes/dislikes por comentario.
-- Ver /home/demian/Documentos/Vaults/Rol in the Shell/02 Portal/Arquitectura Técnica del Portal.md
--
-- Correr este archivo en el SQL editor del dashboard de Supabase
-- (Project → SQL Editor → New query → pegar y ejecutar).

-- ────────────────────────────────────────────────────────────
-- comments: alias opcional (nombre a mostrar, distinto del que
-- da el proveedor OAuth) + hilo de respuestas.
-- `author_name` sigue siendo el nombre del proveedor OAuth,
-- obligatorio, sin cambios. `alias`, si está cargado, se muestra
-- en su lugar.
-- ────────────────────────────────────────────────────────────
alter table comments add column alias text;
alter table comments add column parent_comment_id uuid references comments (id) on delete cascade;

create index comments_parent_idx on comments (parent_comment_id);

-- ────────────────────────────────────────────────────────────
-- comment_reactions: like/dislike por comentario, mismo patrón
-- que `reactions` (anónimo, deduplicado por fingerprint).
-- ────────────────────────────────────────────────────────────
create table comment_reactions (
	id uuid primary key default gen_random_uuid(),
	comment_id uuid not null references comments (id) on delete cascade,
	kind text not null check (kind in ('like', 'dislike')),
	fingerprint text not null,
	created_at timestamptz not null default now(),
	unique (comment_id, fingerprint, kind)
);

create index comment_reactions_comment_idx on comment_reactions (comment_id);

alter table comment_reactions enable row level security;

create policy "comment_reactions son públicas" on comment_reactions
	for select using (true);

create policy "cualquiera puede reaccionar a un comentario" on comment_reactions
	for insert to anon, authenticated
	with check (true);

create policy "cualquiera puede sacar su propia reacción a un comentario" on comment_reactions
	for delete to anon, authenticated
	using (true);
