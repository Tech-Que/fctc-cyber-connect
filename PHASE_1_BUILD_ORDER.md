# Phase 1 — Frontend Shell: Build Order

**Goal:** A Next.js 15 + Tailwind PWA where all 9 routes render with mock content, mobile nav works, Lighthouse says "installable," and the repo is deploying to Vercel on every push. No database, no real auth, no real AI yet.

**Definition of done:** every checkbox in `handoff.md §15 Success Criteria` passes.

**Working rules (from handoff §14):** explain → build → test → commit. One logical change per commit. Conventional commits. ADR any non-obvious choice. Stop and ask when in doubt.

---

## Step 0 — Prereqs (confirm before Step 1)

- [x] Node 24 LTS installed (`node -v` → `v24.x`). Next 15 requires ≥18.17; Node 24 is current Active LTS (Oct 2025). Target updated from Node 20 per ADR-0005. — Node v24.15.0 verified 2026-04-23
- [x] Package manager: **npm**. Record as ADR-0001 in `docs/decisions.md` at Step 12. Rationale: simpler, handoff shows `npm run dev`, minimal learning-curve tax. — npm chosen over pnpm, ADR-0001, locked 2026-04-23
- [x] Git configured (`git config --global user.name` / `user.email` set). — Q Andersen / quentonand@gmail.com verified 2026-04-23
- [x] Repo visibility: **private** for Phases 1–2; flip to public only after Phase 2 completion-checklist secret scan passes (see `PHASE_2_BUILD_ORDER.md`). — private repo, flip to public after Phase 2, locked 2026-04-23
- [ ] Vercel account linked to GitHub. — pending user confirmation before Step 13

**No code written in this step.** Just verify and decide.

---

## Step 1 — Scaffold Next.js 15 app

**Scaffold procedure — sibling-dir merge (locked 2026-04-23):**

**Scaffold outcome (2026-04-23):** Next 15.5.15 + React 19.1.0 + Tailwind 4 + Turbopack dev. Next 15 pinned explicitly via `@^15` per ADR-0006 (avoid Next 16 drift). Tailwind 4 accepted as the scaffold's tested default per ADR-0007. `next.config.ts` (not `.js`) accepted as scaffold default.

```
# from C:/Users/Tech_/
npx create-next-app@^15 fctc-cyber-connect-scaffold \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-npm
```

- [ ] Run from `C:/Users/Tech_/` so scaffold lands at `C:/Users/Tech_/fctc-cyber-connect-scaffold/` — a **sibling** of the existing project dir, leaving `HANDOFF.md`, `PHASE_1_BUILD_ORDER.md`, `PHASE_2_BUILD_ORDER.md`, and `docs/SESSION_LOG.md` untouched.
- [ ] Merge scaffold into project: copy every file/dir from `fctc-cyber-connect-scaffold/` into `fctc-cyber-connect/`. On any collision, keep the project-dir version (should not happen — scaffold dir is empty of our docs).
- [ ] Delete `C:/Users/Tech_/fctc-cyber-connect-scaffold/`.
- [ ] Verify integrity: `HANDOFF.md`, `PHASE_1_BUILD_ORDER.md`, `PHASE_2_BUILD_ORDER.md`, `docs/SESSION_LOG.md` all present and byte-identical to pre-scaffold. Next.js files (`package.json`, `next.config.ts`, `tsconfig.json`, `src/app/`, `public/`) now present.
- [ ] Rename `package.json` `"name"` from `fctc-cyber-connect-scaffold` to `fctc-cyber-connect` (scaffold-name artifact).
- [ ] Add `"engines": { "node": ">=20" }` to `package.json`.
- [ ] Create `.nvmrc` at project root with content `24` (single line).
- [ ] `npm run dev` → `http://localhost:3000` renders default page.
- [ ] **Commit:** `chore: scaffold Next.js 15 + TypeScript + Tailwind 4, pin Node engines`

---

## Step 2 — Folder structure per handoff §6

Create the empty skeleton so future work has a home. Include `.gitkeep` files in empty dirs so git tracks them.

```
src/
  app/
    (public)/
    (app)/
    api/
  components/
    ui/
    layout/
    features/
  features/
    auth/
    message-board/
    ai-assistant/
    admin/
    resources/
  lib/
    aws/
    auth/
    db/
    ai/
    mock/
    utils/
  types/
  styles/
prisma/                 # empty for now; schema lands in Phase 3
public/
  icons/
docs/
```

- [ ] Folders created, `.gitkeep` placeholders in empty ones.
- [ ] **Commit:** `chore: establish folder structure`

---

## Step 3 — Tailwind 4 theme + fonts

Tailwind 4 uses **CSS-first configuration** (`@theme` directive inside `globals.css`) instead of a JS/TS config file. See ADR-0007.

- [ ] `src/app/globals.css` — define the §7 palette inside a `@theme` block. Tailwind auto-generates utility classes (`bg-bg-base`, `text-accent-cyan`, `border-bg-card`, etc.):

  ```css
  @theme {
    --color-bg-base: #0a0e1a;
    --color-bg-card: #111827;
    --color-accent-cyan: #06b6d4;
    --color-accent-blue: #3b82f6;
    --color-success: #10b981;
    --color-warning: #f59e0b;
    --color-text-primary: #e5e7eb;
    --color-text-muted: #94a3b8;
  }
  ```
- [ ] `src/app/globals.css` — base styles, focus ring, text selection color, smooth scroll.
- [ ] Dark mode: set `<html className="dark">` on the root layout so the cyber theme is default. Tailwind 4's `dark:` variants still work via the class-based toggle.
- [ ] Fonts: wire Inter (sans) + JetBrains Mono (mono) via `next/font/google` in `src/app/layout.tsx`.
- [ ] **Commit:** `feat(theme): cyber dark palette (Tailwind 4 @theme), Inter + JetBrains Mono fonts`
- [ ] **ADR-0002:** Dark-theme-first with a cyber accent palette (rationale, alternatives).

---

## Step 4 — Base UI primitives

Only build what Phase 1 pages actually use. No premature abstraction.

- [ ] `components/ui/Button.tsx` — variants: `primary`, `secondary`, `ghost`. Real `<button>`. Visible focus ring.
- [ ] `components/ui/Card.tsx` — rounded-xl, subtle border, dark bg.
- [ ] `components/ui/Input.tsx` — label + input, error state.
- [ ] `components/ui/Badge.tsx` — for category tags on threads.
- [ ] `components/ui/Container.tsx` — max-width wrapper with responsive padding (e.g., `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`). Used by every page to keep content readable on wide screens.
- [ ] **Commit:** `feat(ui): Button, Card, Input, Badge, Container primitives`

---

## Step 5 — Layout & navigation

- [ ] `components/layout/Nav.tsx` — hamburger drawer at <768px, horizontal nav at ≥768px. Links: Home, Program, Community, Assistant, Resources, Login, Signup.
- [ ] `components/layout/Footer.tsx` — brand, minimal links.
- [ ] `app/layout.tsx` — wires Nav + Footer, sets metadata (title, description, theme-color), applies fonts.
- [ ] Keyboard-test: Tab through nav, Enter to activate, Esc to close drawer.
- [ ] **Commit:** `feat(layout): mobile-first Nav + Footer`

---

## Step 6 — Route group scaffolds (all 9 routes)

Per handoff §8. Placeholder content is fine; every route must render without a 404.

- [ ] `(public)/page.tsx` — `/`  landing
- [ ] `(public)/program/page.tsx` — `/program`
- [ ] `(public)/community/page.tsx` — `/community`
- [ ] `(public)/assistant/page.tsx` — `/assistant`
- [ ] `(public)/resources/page.tsx` — `/resources`
- [ ] `(public)/login/page.tsx` — `/login`
- [ ] `(public)/signup/page.tsx` — `/signup`
- [ ] `(app)/dashboard/page.tsx` — `/dashboard`
- [ ] `(app)/admin/page.tsx` — `/admin`
- [ ] Each route group has its own `layout.tsx` (public is unauthenticated shell; app is a stub now, becomes auth-gated in Phase 2).
- [ ] **Commit:** `feat(routes): scaffold all 9 route placeholders`

---

## Step 7 — Mock data

Shapes match the Phase 3 Prisma schema (handoff §11) so swapping mock → real DB is a clean refactor.

- [ ] `lib/mock/users.ts` — a handful of users across all 4 roles.
- [ ] `lib/mock/threads.ts` + `lib/mock/posts.ts` + `lib/mock/comments.ts`
- [ ] `lib/mock/categories.ts`
- [ ] `lib/mock/resources.ts`
- [ ] `lib/mock/faqs.ts`
- [ ] `types/` — shared interfaces that the mocks and future Prisma types both satisfy.
- [ ] **Commit:** `feat(mock): seed data matching future Prisma schema`

---

## Step 8 — Page content (placeholder, uses mocks)

- [ ] Landing hero: still image with gradient overlay and CSS motion (subtle parallax, animated accents). Video deferred to Phase 7. Plus tagline, 3 program pillars, CTA.
- [ ] Program: section headers, cert list, "what you'll learn" cards.
- [ ] Community: thread list rendering from `lib/mock/threads.ts`, category filters, "Sign in to reply" state.
- [ ] Assistant: chat UI shell — message list + input. Not wired to a provider yet; shows "AI mock — returning canned response" on submit.
- [ ] Resources: grouped link cards from `lib/mock/resources.ts`.
- [ ] Login / Signup: form UI only, no submit handler (or handler logs and does nothing).
- [ ] Dashboard / Admin: placeholder "(Phase 2+) — requires auth" message.
- [ ] **Commit:** `feat(pages): placeholder content for all Phase 1 routes`

---

## Step 9 — AI mock provider + `/api/ai/generate`

Building the abstraction now — even with only a mock — because handoff §9 is explicit: no provider imported directly from a page/component.

- [ ] `lib/ai/types.ts` — `AIMessage`, `AIProvider` interface (per §9).
- [ ] `lib/ai/providers/mock.ts` — keyword-triggered canned responses about the FCTC program.
- [ ] `lib/ai/factory.ts` — reads `AI_PROVIDER` env, returns the configured provider. Unknown value → throws at startup.
- [ ] `app/api/ai/generate/route.ts` — POST handler: takes messages, calls provider, returns response. In-memory rate limit (e.g., 10 requests / minute / IP) even in Phase 1.
- [ ] Wire `/assistant` client to call `/api/ai/generate`.
- [ ] **Commit:** `feat(ai): AIProvider abstraction + mock provider + /api/ai/generate`
- [ ] **ADR-0003:** AIProvider abstraction and factory-only access.

---

## Step 10 — PWA (manifest, service worker, offline)

- [ ] `npm i next-pwa` (or decide on hand-rolled SW — *ADR-0004 candidate*).
- [ ] `public/manifest.json` — name, short_name, start_url, theme_color, background_color, display `standalone`, icons (192, 512, maskable).
- [ ] Icon set in `public/icons/` — generate from a source SVG.
- [ ] Service worker caches app shell (html, css, JS bundles, core routes).
- [ ] `app/offline/page.tsx` — friendly offline fallback.
- [ ] Metadata (`themeColor`, `manifest`) wired in `app/layout.tsx`.
- [ ] Lighthouse PWA audit → installability check passes.
- [ ] **Commit:** `feat(pwa): manifest, service worker, offline fallback`
- [ ] **ADR-0004:** next-pwa vs custom service worker.

---

## Step 11 — Env handling

- [ ] `.env.example` — every variable from handoff §10, with comments.
- [ ] `src/lib/env.ts` — zod-validated env object. Missing required vars throw at startup with a clear message (per handoff §10: "fail loudly at startup, not silently at runtime"). Phase 1 only requires `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_APP_NAME`, `AI_PROVIDER`.
- [ ] Usage: import `env` from `lib/env.ts` rather than reading `process.env` directly.
- [ ] **Commit:** `feat(env): zod-validated env, .env.example with full surface`

---

## Step 12 — Docs (required for Phase 1 completion)

Write real content, not stubs. Handoff §15 requires each to be populated.

- [ ] `README.md` — what it is, stack, `npm i` / `npm run dev`, screenshots placeholder, link to docs.
- [ ] `docs/architecture.md` — layers diagram, phase plan, the AWS/AI/GRC narrative.
- [ ] `docs/decisions.md` — ADR-0001 through ADR-0007 (package manager, theme, AI abstraction, PWA approach, Node target version, Next 15 pin, Tailwind 4 accept). Template: Context / Decision / Consequences.
- [ ] **ADR-0005:** Target Node 24 LTS with engines floor at 20 — context (Node 24 became current LTS Oct 2025; plan was written assuming Node 20), decision (accept Node 24, pin engines floor at 20 for flexibility), consequences (future contributors need Node 20+; .nvmrc specifies 24 for local dev consistency).
- [ ] **ADR-0006:** Pin to Next.js 15 instead of Next 16 (current latest) — context (`create-next-app@latest` installed Next 16, which the framework's own `AGENTS.md` flags as "breaking changes — APIs, conventions, and file structure may all differ from training data"; downstream impact includes Tailwind 4 and `next.config.ts` divergences from the original plan), decision (pin to Next 15 via `create-next-app@^15`; use Tailwind 4 and accept `next.config.ts` as scaffold defaults), consequences (plan docs and folder structure remain largely accurate; more reliable AI-assisted development on a version agents have solid training data for; richer tutorial/SO ecosystem; trade-off of a known-quantity Next 16 migration later; React pinned to 19 since Next 15 supports it cleanly).
- [ ] **ADR-0007:** Accept Tailwind 4 (CSS-first config) instead of Tailwind 3 — context (`create-next-app@^15` ships Tailwind 4 as the default CSS framework; Tailwind 4 has been stable since January 2025 and uses a CSS-first configuration model via the `@theme` directive instead of a JS config file; the Next 15 + Tailwind 4 pairing is the framework team's tested default), decision (accept Tailwind 4; define the cyber-dark theme palette in `src/app/globals.css` using `@theme` directives rather than `tailwind.config.ts`), consequences (Step 3 rewritten to CSS-first config; `next.config.ts` and Turbopack dev (`next dev --turbopack`) accepted as scaffold defaults; production build remains webpack unless explicitly changed; staying on the framework's tested default pairing reduces upgrade friction over time).
- [ ] `docs/setup.md` — local dev setup, Node version, env vars, common issues.
- [ ] `docs/security.md` — access-control model (role enum), moderation non-negotiables (soft-delete, audit log, reports, rate limits, server-side caps), threat model outline. Phase 1 notes what's stubbed; each later phase fills in its column.
- [ ] `docs/roadmap.md` — anything deferred, Out-of-Scope items from §16.
- [ ] **Commit:** `docs: architecture, decisions, setup, security, roadmap`

---

## Step 13 — GitHub + Vercel

- [ ] `git init` (if `create-next-app` didn't), sensible `.gitignore` (Next default is fine).
- [ ] Create GitHub repo, push `main`.
- [ ] Connect Vercel to the repo, confirm first build succeeds.
- [ ] Open a throwaway PR to verify preview deploys work.
- [ ] **(Deferred to Phase 2):** branch protection on `main` — per handoff §13, protect "once past Phase 2."
- [ ] **Commit(s):** already landed; this step is infra, not code.

---

## Step 14 — Phase 1 smoke test + sign-off

Walk the handoff §15 checklist end-to-end on a real device if possible (phone on local Wi-Fi via `next dev -H 0.0.0.0` or the Vercel preview URL).

- [ ] `npm run dev` starts clean.
- [ ] All 9 routes render.
- [ ] Hamburger works <768px, horizontal nav ≥768px.
- [ ] Lighthouse PWA installability ✅.
- [ ] All four docs populated + `README.md`.
- [ ] Vercel preview deploy live.
- [ ] `.env.example` covers every variable the app will eventually need.
- [ ] Append a "Phase 1 smoke test — YYYY-MM-DD" note to `docs/setup.md` listing what was verified.
- [ ] **Commit:** `docs: phase 1 smoke-test notes`

---

## Open questions for you before Step 1

1. **Package manager — npm or pnpm?** npm is simpler and the handoff shows `npm run dev`; pnpm is faster and stricter about hoisting. Either is fine; answer decides ADR-0001.
2. **GitHub repo — public or private?** Portfolio value argues public; student-data optics argue private until auth is real. Private until end of Phase 2, flip to public?
3. **Step 1 logistics:** `create-next-app` expects an empty target dir. I'll temporarily move `PHASE_1_BUILD_ORDER.md` out, scaffold, then move it back — unless you'd rather I scaffold into a sibling dir and merge. Either works; first is less noisy.
4. **Hero media:** video or still image for the landing hero? Video is higher-impact but costs a bundle. A still with gradient + subtle motion (CSS) is a good Phase 1 default with a Phase 7 upgrade path.

Once you're good with the plan above and answer those four questions, I'll start at Step 0.
