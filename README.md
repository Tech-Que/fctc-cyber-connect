# FCTC Cyber Connect

A mobile-first Progressive Web App connecting cybersecurity students at First Coast Technical College — for prospective applicants, current students, and alumni.

**Status:** ✅ Phase 1 + Phase 2 complete. Phase 3 (Database) is next. Live at [fctc-cyber-connect.vercel.app](https://fctc-cyber-connect.vercel.app).

<!-- TODO: add screenshot after Vercel deploy -->

## What it does

A community hub and learning surface in one app: program overview, message board for current students and alumni, AI assistant for prospective-student questions, certification and study resources, and an admin moderation surface. Designed mobile-first because most students reach it from their phones.

## Tech stack

Next.js 15 · TypeScript · Tailwind 4 · Prisma · Postgres (Neon) · AWS (Cognito, S3, Bedrock) · Vercel

## Quick start

**Prerequisites:** Node 20+ (24 recommended; `.nvmrc` pins it), npm, Git. Optionally Ollama if you want local LLM responses instead of the canned mock.

```bash
git clone <repo-url> fctc-cyber-connect
cd fctc-cyber-connect
npm install
cp .env.example .env.local         # Phase 1 only needs AI_PROVIDER=mock
npm run dev
```

Open `http://localhost:3000` (or whichever port Next picks if 3000 is busy). The default `AI_PROVIDER=mock` runs the assistant against keyword-matched canned responses — no external services needed.

For full setup including production builds and mobile-device testing, see [`docs/setup.md`](./docs/setup.md).

## Project structure

```
src/
├── app/                    Next.js App Router pages, API routes, layouts
│   ├── (public)/          Routes accessible without auth (light theme default)
│   └── (app)/             Routes requiring auth (dark theme default; gated in Phase 2)
├── components/             Reusable UI primitives and layout chrome
├── features/               Domain-specific code grouped by feature area
├── lib/                    Cross-cutting utilities (env validation, AI factory, mock data)
└── types/                  Shared TypeScript types

public/                     Static assets — brand logo, generated PWA icons, manifest
docs/                       Architecture, decisions, setup, security, roadmap
scripts/                    One-off scripts (icon generation)
prisma/                     Reserved for Phase 3 (database schema)
```

See [`docs/architecture.md`](./docs/architecture.md) for the full picture.

## Phase status

- ✅ **Phase 1 — Frontend Shell:** UI primitives, route groups, mock data, brand identity, hybrid light/dark theme, AI provider abstraction with mock + API route + rate limiting, PWA configuration (Lighthouse 100/100), Zod-validated env, full documentation set.
- ✅ **Phase 2 — Auth:** AWS Cognito integration, AuthProvider abstraction, role-based middleware, gated `(app)` routes, conditional nav, route guards.
- ⏳ **Phase 3 — Database:** Neon Postgres + Prisma, schema with soft-delete + audit log, migrations, seed data swap from mocks.
- ⏳ **Phase 4 — Message Board:** Threads, posts, comments, categories, reports, moderation queue.
- ⏳ **Phase 5 — AI Assistant:** Real provider implementations (Ollama → OpenAI → Bedrock).
- ⏳ **Phase 6 — Admin Panel:** Moderation tools, user management, FAQ editor, audit log viewer.
- ⏳ **Phase 7 — Polish:** Animations, error boundaries, analytics, deferred-polish items from `docs/roadmap.md`.
- ⏳ **Phase 8 — SaaS readiness:** Multi-tenant schema review and tenant routing middleware.

## Documentation

- [Architecture](./docs/architecture.md) — system design, layers, request flow
- [Architecture decisions](./docs/decisions.md) — ADRs explaining major technical choices
- [Setup](./docs/setup.md) — clone-to-running-dev guide with troubleshooting
- [Security](./docs/security.md) — threat model, access control, AI governance
- [Roadmap](./docs/roadmap.md) — phase plan and deferred work
- [Contributing](./docs/CONTRIBUTING.md) — standing rules for working on this project
- [Session log](./docs/SESSION_LOG.md) — append-only history of work completed

## License

[MIT](./LICENSE) — see LICENSE file. This project is published as a portfolio reference for First Coast Technical College's cybersecurity program. If you want to use it commercially as a SaaS for another school, please reach out first.

---

Built for **First Coast Technical College — Cybersecurity Program**.
