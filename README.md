# Rol in the Shell — portal

Portal de contenido de rol en español: blog de opinión, reseñas de sistemas,
tutoriales técnicos y recursos descargables para GMs y jugadores.

## Stack

- **Astro** (output estático) — landing, blog, reseñas, tutoriales y recursos
  son Content Collections en Markdown
- **Supabase** (Postgres + Auth) — comentarios, reacciones y vistas, capa
  dinámica aparte del contenido versionado en git
- **Tailwind CSS v4** — tokens del design system Nocturne/Orange (oscuro y
  claro) en `src/styles/global.css`
- **Vercel** para hosting y deploy automático desde este repo

## Desarrollo local

```sh
yarn install
yarn dev        # http://localhost:4321
```

Necesita un `.env` con `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_ANON_KEY`
(ver `.env.example`) para que funcionen comentarios/reacciones/vistas.

## Comandos

| Comando         | Acción                                      |
| :--------------- | :------------------------------------------- |
| `yarn install`   | Instala dependencias                          |
| `yarn dev`       | Servidor de desarrollo en `localhost:4321`    |
| `yarn build`     | Build de producción a `./dist/`               |
| `yarn preview`   | Preview local del build antes de deployar     |

Las migraciones de la base están en `supabase/migrations/`, se corren a mano
en el SQL Editor del dashboard de Supabase.
