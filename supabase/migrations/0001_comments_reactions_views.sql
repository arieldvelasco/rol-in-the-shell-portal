-- Comentarios, reacciones (like/dislike) y vistas para el portal.
-- Ver /home/demian/Documentos/Vaults/Rol in the Shell/02 Portal/Arquitectura Técnica del Portal.md
--
-- Correr este archivo en el SQL editor del dashboard de Supabase
-- (Project → SQL Editor → New query → pegar y ejecutar).

-- ────────────────────────────────────────────────────────────
-- comments: requieren login (Discord/Google vía Supabase Auth).
-- Publicación instantánea; `deleted` es soft-delete para moderación.
-- ────────────────────────────────────────────────────────────
create table comments (
	id uuid primary key default gen_random_uuid(),
	content_type text not null check (content_type in ('blog', 'resena', 'asset')),
	content_slug text not null,
	user_id uuid not null references auth.users (id) on delete cascade,
	-- Denormalizado a propósito: auth.users no es consultable via API con la
	-- anon key, así que el nombre/avatar se copian una vez al comentar en
	-- vez de requerir una tabla `profiles` + trigger para este MVP.
	author_name text not null,
	author_avatar_url text,
	body text not null check (char_length(trim(body)) > 0),
	created_at timestamptz not null default now(),
	deleted boolean not null default false
);

create index comments_content_idx on comments (content_type, content_slug);

alter table comments enable row level security;

create policy "comments son públicos si no están borrados" on comments
	for select using (deleted = false);

create policy "usuarios autenticados pueden comentar" on comments
	for insert to authenticated
	with check (auth.uid() = user_id);

create policy "el autor puede borrar su propio comentario" on comments
	for update to authenticated
	using (auth.uid() = user_id)
	with check (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- reactions: like/dislike anónimos, deduplicados por fingerprint
-- (id de navegador guardado en localStorage, no a prueba de abuso
-- deliberado, ver nota en la arquitectura documentada).
-- ────────────────────────────────────────────────────────────
create table reactions (
	id uuid primary key default gen_random_uuid(),
	content_type text not null check (content_type in ('blog', 'resena', 'asset')),
	content_slug text not null,
	kind text not null check (kind in ('like', 'dislike')),
	fingerprint text not null,
	created_at timestamptz not null default now(),
	unique (content_slug, fingerprint, kind)
);

create index reactions_content_idx on reactions (content_type, content_slug);

alter table reactions enable row level security;

create policy "reactions son públicas" on reactions
	for select using (true);

create policy "cualquiera puede reaccionar" on reactions
	for insert to anon, authenticated
	with check (true);

create policy "cualquiera puede sacar su propia reacción" on reactions
	for delete to anon, authenticated
	using (true);

-- ────────────────────────────────────────────────────────────
-- views: una vista por fingerprint y día (evita inflar recargando).
-- ────────────────────────────────────────────────────────────
create table views (
	id uuid primary key default gen_random_uuid(),
	content_type text not null check (content_type in ('blog', 'resena', 'asset')),
	content_slug text not null,
	fingerprint text not null,
	created_at timestamptz not null default now(),
	view_date date generated always as ((created_at at time zone 'utc')::date) stored,
	unique (content_slug, fingerprint, view_date)
);

create index views_content_idx on views (content_type, content_slug);

alter table views enable row level security;

create policy "views son públicas" on views
	for select using (true);

create policy "cualquiera puede registrar una vista" on views
	for insert to anon, authenticated
	with check (true);

-- ────────────────────────────────────────────────────────────
-- content_stats: agregados listos para un futuro widget de
-- "más leídos" / "mejor valorados" en el home.
-- ────────────────────────────────────────────────────────────
create view content_stats as
select
	coalesce(v.content_type, r.content_type) as content_type,
	coalesce(v.content_slug, r.content_slug) as content_slug,
	coalesce(v.view_count, 0) as view_count,
	coalesce(r.like_count, 0) as like_count,
	coalesce(r.dislike_count, 0) as dislike_count
from
	(
		select content_type, content_slug, count(*) as view_count
		from views
		group by content_type, content_slug
	) v
	full outer join (
		select
			content_type,
			content_slug,
			count(*) filter (where kind = 'like') as like_count,
			count(*) filter (where kind = 'dislike') as dislike_count
		from reactions
		group by content_type, content_slug
	) r on v.content_type = r.content_type and v.content_slug = r.content_slug;
