# Roadmap

Phase plan, deferred work, and post-MVP ideas. Source-of-truth detail behind the one-line phase status in [README.md](../README.md).

## Currently in progress

- **Phase 1 — Frontend Shell.** Wrap-up underway. Documentation set (Step 12) and GitHub/Vercel setup (Steps 13–14) remain. Everything else from the [HANDOFF §15 success criteria](../HANDOFF.md) is met or pending verification.
- **Phase 2 — Auth (next).** AWS Cognito + AuthProvider abstraction, role-based middleware, gated `(app)` routes, session persistence. Pre-public-flip secret scan gates the public-flip at the end of the phase.

## Planned phases

- **Phase 1 — Frontend Shell.** UI primitives, route groups, mock data, brand identity, hybrid light/dark theme, AI provider abstraction with mock + API route + rate limiting, PWA configuration (Lighthouse 100/100), Zod-validated env, full documentation set.
- **Phase 2 — Auth.** AWS Cognito integration. AuthProvider abstraction with Cognito as default, Auth.js as documented fallback. Server-side role checks via middleware. Gated `(app)` routes (dashboard, admin) redirect unauthenticated visitors to `/login`. Session JWT verified per request; role re-checked from DB on every protected route. Pre-public-flip secret scan completes the phase.
- **Phase 3 — Database.** Neon Postgres + Prisma. Schema with soft-delete (`deleted_at` + `deleted_by` on every user-facing entity), audit log table (append-only, `INSERT`/`SELECT` only at the DB role level), role enum on `users`. Mock-layer helpers swap their backing data source from arrays to Prisma queries; helper signatures stay.
- **Phase 4 — Message Board.** Real thread/post/comment writes. Reports queue. Soft-delete + audit log get exercised by moderation actions. Per-user creation quotas (replacing IP-based rate limit on AI for write paths).
- **Phase 5 — AI Assistant.** Real provider implementations: Ollama (local), OpenAI (cloud), Bedrock (AWS-tenanted). Provider switching is a single env-var change per [ADR-0003](./decisions.md#adr-0003-aiprovider-abstraction-with-factory-only-access). Persisted `ai_sessions` and `ai_messages` tables for the conversation history.
- **Phase 6 — Admin Panel.** Moderation tools, user management, FAQ editor, audit log viewer. Programmatic content moderation pipeline begins here (regex / classifier / third-party moderation API).
- **Phase 7 — Polish.** Animations, error boundaries, analytics, deferred-polish items (see "Deferred polish / Phase 7+" below). Migration off `next-pwa@5.6.0` to the v7 community fork lands here.
- **Phase 8 — SaaS readiness.** Multi-tenant schema review (`tenant_id` foreign keys, row-level security), tenant-aware middleware (subdomain or path-based), per-tenant theming. The single-tenant Phase 1–7 architecture is intended to scale without rewrite.

## Phase 2 prep

- **Pick a project license before flipping repo to public.** Default recommendation: MIT (with an informal note about SaaS-use) unless decided otherwise.

## Technical debt / deferred optimizations

- **Brand PNG → SVG master + build-time generation.** Logo currently committed as PNG (~1.8 MB). Future: commit SVG master in `public/brand/`, generate PNG variants (nav, favicon, PWA 192/512/maskable) at build time via a script. Keeps repo lean and rendering crisp. Operating rule in the meantime: update the logo by overwriting the existing filename rather than committing a new filename, so git stores deltas rather than full copies. Captured 2026-04-23 during Step 3.1.

## Deferred polish / Phase 7+

- **Fresh-visit flash on direct-linked (app) routes.** A user landing directly on `/dashboard` or `/admin` with no stored theme preference sees one paint of light before `AppThemeDefault`'s `useEffect` flips them to dark. Path-aware pre-hydration script would fix; deferred until auth gating changes the scenario — in Phase 2 these routes become auth-gated and unauthenticated direct visits redirect, so the flash window disappears naturally for anyone actually reaching the page. Captured 2026-04-23 during Step 6.
- **Rate limiter: replace in-memory `requestLog` Map with Redis-backed implementation** when deploying to multi-instance hosting. Current implementation works for single-instance dev; per-instance counting on Vercel is acceptable but imperfect.
- **Assistant input length cap:** add `maxLength={2000}` plus visible character counter that turns red as the cap approaches. Server-side cap (10k chars) already enforced; UI prevention is UX polish.
- **Real-iPhone verification:** complete the device-testing pass when back on home WiFi (hotel network blocked direct phone connection during Phase 1; DevTools iPhone 14 Pro Max viewport used as substitute).
- **Replace `next-pwa@5.6.0` with `@ducanh2912/next-pwa`** (community-maintained fork on Workbox v7) when Phase 7 polish allows. The 7 npm audit warnings (2 moderate, 5 high) are workbox v6 transitive deps; predominantly dev-time impact, not runtime-exploitable in current usage. Risk-accepted for Phase 1.
- **Auth: store Cognito AccessToken in a third HTTP-only cookie (`fctc-access`) and call `GlobalSignOut` on signout to invalidate all refresh tokens server-side.** Phase 2 Step 3d ships local-only signout (clears the `fctc-session` and `fctc-refresh` cookies) which is sufficient for the current single-device threat model. Adding `GlobalSignOut` requires the AccessToken (it doesn't accept an IdToken) — hence the third cookie. Worth doing once we add multi-device session listings or "sign out everywhere" UX. Captured 2026-04-27 during Step 3d.

## Out of scope (or deferred post-MVP)

Pulled from [HANDOFF §16](../HANDOFF.md). These are deferred or out entirely to keep MVP scope focused:

- **Email sending** (SES, Resend, etc.) — deferred to Phase 2 (auth flows need email for verification).
- **Push notifications** — deferred to Phase 7.
- **Real-time features** (WebSockets, Server-Sent Events) — deferred post-MVP.
- **Internationalization** — deferred post-MVP.
- **Analytics dashboards** — deferred to Phase 7.
- **Mobile app wrappers** (Capacitor, React Native) — out of scope entirely. PWA is the mobile strategy.

## Content to source later

- **Additional FCTC-specific URLs** — locate real student-resources pages on fctc.edu and add to `src/lib/mock/resources.ts` as source material becomes available.
