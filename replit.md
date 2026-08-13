# Eman Ali — Romance Ghostwriter

An imported author and ghostwriter portfolio site based on https://github.com/ALGOTOP/po.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/po run dev` — run the portfolio preview (managed workflow)
- `pnpm run typecheck` — full typecheck across all packages
- `PORT=18206 BASE_PATH=/ pnpm --filter @workspace/po run build` — build the portfolio outside the managed workflow
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/po/src/page.tsx` — portfolio page composition and copy
- `artifacts/po/src/components/` — imported interactive sections and CSS modules
- `artifacts/po/public/` — imported photography, book covers, fonts, badge, and local testimonial avatars
- `artifacts/po/.replit-artifact/artifact.toml` — preview and production routing

## Architecture decisions

- The imported Next.js presentation site was adapted to the existing React + Vite artifact so it can use the managed preview and production routing.
- The original visual sections and local assets are preserved; Next.js `Image`, `Link`, and local-font helpers were replaced with browser-native equivalents.
- The portfolio is static and does not need the shared API server or database.

## Product

The site presents Eman Ali’s ghostwriting background, credibility signals, books, testimonials, speaking work, and newsletter signup in a scroll-driven one-page experience.

## User preferences

No additional preferences recorded.

## Gotchas

- The portfolio build expects `PORT` and `BASE_PATH`; the managed workflow supplies both automatically.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
