# Architecture Decision Records

Each ADR captures: **Context** (why a decision was needed), **Decision** (what was chosen), **Consequences** (what this means — including the negative tradeoffs).

ADRs are append-only. When a decision is replaced, the original ADR stays — its status flips to `Superseded` and a pointer to the replacing ADR is added. Past decisions are part of the historical record; readers want to know what was thought at the time, not just what survived.

---

## ADR-0001: Use npm over pnpm

**Date:** 2026-04-23
**Status:** Accepted

**Context:** Need to choose a Node package manager. Options: npm (default, ubiquitous, slower), pnpm (faster installs, stricter hoisting, better monorepo support), yarn (largely legacy at this point for greenfield projects).

**Decision:** npm.

**Consequences:** Universal tooling support. No learning curve for contributors — `npm install`, `npm run dev` are the commands every Node developer already knows. The HANDOFF document examples use npm, so the docs stay accurate. Trade-offs: slightly slower installs and larger `node_modules` than pnpm. Acceptable for a single-repo project where install time isn't on the critical path.

---

## ADR-0002: Superseded

**Date:** 2026-04-23
**Status:** Superseded by [ADR-0008](#adr-0008-official-brand-identity-adopted) on 2026-04-23 (same-day supersession during Step 3.1).

**Originally:** Cyber dark palette (dark-theme-first with cyan/teal accents).

**Context (historical):** At Phase 1 Step 3, no official brand kit existed. The HANDOFF document specified a generic "cyber dark" aesthetic in the spirit of Linear, Vercel, or GitHub's dark mode. Step 3 needed a concrete palette to wire up Tailwind 4's `@theme` tokens so the rest of Phase 1 could keep moving.

**Decision (historical):** Adopt a dark-theme-first cyber accent palette:
- Background: deep near-black (`#0a0e1a` base, `#111827` cards)
- Primary accent: cyan/teal (`#06b6d4`)
- Secondary accent: electric blue (`#3b82f6`)
- Status colors: green `#10b981`, amber `#f59e0b`, red — TBD
- Text: high-contrast off-white (`#e5e7eb`), muted (`#94a3b8`)

**Consequences (historical):** Step 3 shipped a working theme; subsequent Phase 1 steps had a real palette to build against. Components consumed semantic tokens (`bg-bg-base`, `text-accent-cyan`, `border-bg-card`) rather than literal hex values, which paid off when this ADR was superseded — the swap to the brand palette in ADR-0008 was a `globals.css`-only change, with zero component edits.

**Why superseded:** The official FCTC brand kit arrived during Step 3.1, with a project-specific identity (logo, typography, five-color palette) replacing the placeholder cyber-dark palette. See [ADR-0008](#adr-0008-official-brand-identity-adopted). The architecture (semantic tokens, CSS-first `@theme`, `.dark` variant) carried over unchanged — only the literal hex values flipped.

---

## ADR-0003: AIProvider abstraction with factory-only access

**Date:** 2026-04-23
**Status:** Accepted

**Context:** HANDOFF §9 mandates a swappable AI provider — mock for Phase 1, then Ollama, OpenAI, Bedrock as the project matures. Without an abstraction, switching providers means find-and-replace across every page or route handler that calls the AI. That's the wrong place to make a change in Phase 5, and it leaks provider-specific concerns (auth, retry logic, cost shape) into UI code.

**Decision:** Define an `AIProvider` interface with a single method `generateResponse(messages: AIMessage[], context?: Record<string, unknown>): Promise<string>`. Implement four concrete providers (`mockProvider`, `ollamaProvider`, `openaiProvider`, `bedrockProvider`) — mock fully wired today; the others throw `"Phase 5+"` errors. Provider selection happens through `getAIProvider()` which reads `env.AI_PROVIDER`. **Components and routes never import a concrete provider directly.** They take or call `AIProvider`.

**Consequences:** Swapping providers is one env var change. Each new provider is a single file implementing one interface. The mock provider's canned responses live server-side and don't ship to the client bundle (verified by inspecting compiled JS chunks). Trade-off: a tiny amount of upfront ceremony — interface, factory, four files instead of one — for what could be a one-liner today. That cost is paid back the moment the second provider lands; the wiring is already exercised.

---

## ADR-0004: next-pwa over hand-rolled service worker

**Date:** 2026-04-23
**Status:** Accepted (with caveats — see consequences)

**Context:** Step 10 needed to ship a PWA — manifest, service worker, offline fallback, Lighthouse-pass installability. Options: hand-roll a service worker (full control, full responsibility for cache strategy and Workbox-equivalent logic), use a Workbox-based wrapper like `next-pwa` (proven cache strategies, less code, generated SW).

**Decision:** `next-pwa@5.6.0`. Workbox-based, integrates with the Next.js build, generates the SW automatically, handles precache + runtime cache routes for fonts / images / JS / CSS / API responses out of the box.

**Consequences:** Lighthouse PWA category 100/100 with minimal config. Cache strategies come for free. Three real trade-offs that came out of integration:

1. **Workbox v6 transitive dependencies** ship 7 npm-audit warnings (2 moderate, 5 high). Predominantly dev-time impact, not runtime-exploitable in current usage. Risk-accepted for Phase 1; planned migration to `@ducanh2912/next-pwa` (community fork on Workbox v7) in Phase 7. Tracked in `roadmap.md`.
2. **App Router auto-injection is broken in 5.6.0.** The plugin's auto-register behavior was built for Pages Router; it doesn't add a `<script>` to App Router HTML. Worked around with a manual SW-registration `<script>` injected via `dangerouslySetInnerHTML` in the root layout's `<head>`.
3. **Default precache scope delays SW activation** past Lighthouse's measurement window — the precache list (~50 assets, multi-MB) blocks the install→activate transition for several seconds. Disabled it (`buildExcludes: [/.*/]`, `publicExcludes: ["!**/*"]`); runtime caching does the heavy lifting instead. First-page-load is now a normal network fetch with no SW pre-warmed cache; subsequent visits hit the runtime cache.

---

## ADR-0005: Node 24 LTS target

**Date:** 2026-04-23
**Status:** Accepted

**Context:** PHASE_1_BUILD_ORDER.md was originally written assuming Node 20 LTS as the stable target. By the time scaffolding happened, Node 24 had become the active LTS (October 2025). Node 24 ships fresh-enough features (improved test runner, native `--env-file` support, native ESM in scripts) that "Node 20 because the plan said so" felt like the wrong default.

**Decision:** Target Node 24 LTS. Pin via `.nvmrc` (single line: `24`). Set `"engines": { "node": ">=20" }` in `package.json` so contributors on Node 20 aren't blocked.

**Consequences:** Local-dev consistency is explicit (anyone with `nvm` picks up the right version on `cd`). Latest stable Node features are available. The `engines: ">=20"` floor means future-Phase contributors don't need to upgrade Node to start contributing if they're on a still-supported LTS. Plan documents updated to reflect Node 24.

---

## ADR-0006: Pin Next.js 15 (not 16)

**Date:** 2026-04-23
**Status:** Accepted

**Context:** `create-next-app@latest` installed Next.js 16.2.4 during initial scaffolding. Next 16's own auto-generated `AGENTS.md` warned: *"This version has breaking changes — APIs, conventions, and file structure may all differ from training data."* The HANDOFF document was written for Next.js 15 (App Router, server components, `next/image`, the metadata + viewport API surface), and the project relies on AI-assisted development where the agents have solid Next 15 training data. Downstream impact of Next 16 also included Tailwind 4 (new) and `next.config.ts` (vs `.js` in original plans), both of which were divergences from the plan.

**Decision:** Pin to Next.js 15 explicitly. Re-scaffold with `create-next-app@^15`. Got Next 15.5.15 + React 19.1.0.

**Consequences:** Plan docs and folder structure remained accurate. AI-assisted development is reliable on a version both human contributors and AI agents have solid context for. Richer ecosystem of tutorials, issue threads, and Stack Overflow answers for a learning/portfolio project. Trade-off: a known Next 16 migration becomes future work — but it's a known-quantity upgrade rather than navigating breaking changes during initial development. React pinned to 19 since Next 15.5 supports it cleanly. Kept `next.config.ts` (not `.js`) and Turbopack dev (`next dev --turbopack`) as scaffold defaults; production build switched back to webpack via `next build` (no `--turbopack` flag in the build script).

---

## ADR-0007: Accept Tailwind 4 (CSS-first config)

**Date:** 2026-04-23
**Status:** Accepted

**Context:** `create-next-app@^15` ships Tailwind 4 as the default CSS framework, regardless of the Next version pin. Tailwind 4 has been stable since January 2025 and uses a CSS-first configuration model — theme tokens defined via the `@theme` directive inside CSS, not a `tailwind.config.ts` JS file. The original PHASE_1_BUILD_ORDER assumed Tailwind 3 with the JS config. Briefly considered downgrading to Tailwind 3 to match the plan literally; decided fighting the scaffold here would mean every future upgrade is uphill.

**Decision:** Accept Tailwind 4. Define theme tokens in `src/app/globals.css` via `@theme` directives (brand literals + semantic tokens + a `.dark` override block). Stay on the framework's tested default pairing (Next 15 + Tailwind 4).

**Consequences:** Step 3 reshaped to write theme in CSS, not TS — and the CSS-first model is actually cleaner for design tokens, closer to how designers think about colors. Opacity modifiers on CSS-var theme tokens (e.g., `bg-accent/15`) work correctly via `color-mix(in oklab, ...)`. No `tailwind.config.ts` file in the project. Trade-offs: less ecosystem material on Tailwind 4 vs 3 (still maturing in early 2026), and any plan documents that mention `tailwind.config.ts` get amended as we encounter them.

---

## ADR-0008: Official brand identity adopted

**Date:** 2026-04-23
**Status:** Accepted (supersedes [ADR-0002](#adr-0002-superseded))

**Context:** A brand kit arrived during Phase 1 Step 3.1 — official FCTC Cyber Connect identity with logo (owl + shield + circuit motif), tagline ("CONNECT. LEARN. PROTECT."), typography (Orbitron display + Inter body + JetBrains Mono code), and a five-color palette:
- `--color-brand-navy`  `#0B1D34`
- `--color-brand-teal`  `#00E5FF`
- `--color-brand-green` `#39FF14`
- `--color-brand-white` `#F8FAFC`
- `--color-brand-gray`  `#A7B2BF`

The provisional cyber-dark palette of ADR-0002 was generic; the brand kit is project-specific identity. Replacing the palette is a one-time chance to lock in the project's actual visual language.

**Decision:** Adopt the brand kit as the official visual identity. Logo mark used for nav lockup (desktop + mobile drawer + footer) and as the source for all PWA icons. Add Orbitron via `next/font/google` for wordmarks and display headings. Inter remains the body font. Brand colors become the `--color-brand-*` literals in `@theme`; semantic tokens (`--color-bg-base`, `--color-text-primary`, `--color-accent`, etc.) point to them. Components consume only semantic tokens — no component class anywhere references a brand literal directly, with one documented exception (the landing-page hero, which is intentionally theme-agnostic).

**Consequences:** ADR-0002 superseded. Step 3 `globals.css` updated. Step 5 nav integrates the logo via `next/image`. Step 10 PWA icons generated from the logo via `scripts/generate-icons.mjs` (sharp). The semantic-token architecture stayed unchanged — only the literal hex values flipped, demonstrating the value of having that abstraction layer in the first place. PNG logo (1.83 MB) committed to `public/brand/`; SVG-master + build-time-generation migration tracked in `roadmap.md` for Phase 7+.

---

## ADR-0009: Hybrid light/dark theme strategy

**Date:** 2026-04-23
**Status:** Accepted

**Context:** Original HANDOFF called for dark-only throughout. Product review during Step 3.1 identified that text-heavy surfaces (threads, program info, AI chat) read better on light backgrounds for sustained reading. Modern apps (GitHub, Notion, Linear) treat dark/light as first-class toggleable themes. Defaulting everything to dark makes the marketing surfaces feel like a tool rather than a welcoming community for prospective students.

**Decision:** Hybrid theme defaults:
- **Light** by default on public-facing marketing surfaces (`/`, `/program`, `/community`, `/resources`, `/login`, `/signup`).
- **Dark** by default on authenticated app surfaces (`/dashboard`, `/admin`). Other routes follow the light default of their route group; the user's explicit toggle overrides anything.
- **Global theme toggle** available everywhere. The user's explicit choice (stored in `localStorage["fctc-theme"]`) overrides the route-group default — always.

Implemented via tiny client components (`PublicThemeDefault`, `AppThemeDefault`) rendered by each route group's `layout.tsx`. Each runs a `useEffect` on mount: if no preference is stored, it adds or removes `.dark` to match the route-group default; otherwise it does nothing.

**Consequences:** `globals.css` defines both themes via `@theme` (light defaults) and a `.dark` selector override. Every component uses semantic tokens — never hardcoded colors or direct brand color names. Route group layouts control default theme. Theme toggle component lives in `Nav` (Step 5). An inline pre-hydration script in the root layout's `<head>` reads `localStorage` synchronously and applies `.dark` before React hydrates, preventing a light-mode flash on reload for users who chose dark.

Theme persistence beyond the local browser is deferred to Phase 2 (user-preference column in the database) with `localStorage` as the Phase 1 fallback. Trade-off: a one-paint flash on direct-linked `(app)` routes for first-time visitors with no stored preference (the inline script doesn't know the route is `(app)` until React renders the layout). Captured in `roadmap.md` under Deferred polish; will resolve naturally in Phase 2 when those routes become auth-gated and unauthenticated direct visits redirect.
