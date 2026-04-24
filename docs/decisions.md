# Architecture Decision Records

Working record of architectural decisions shaping FCTC Cyber Connect. Each entry uses the **Context / Decision / Consequences** format.

ADR-0001 through ADR-0007 (package manager, dark-theme-first cyber palette, AI abstraction, PWA approach, Node target version, Next 15 pin, Tailwind 4 accept) are tracked inline in `PHASE_1_BUILD_ORDER.md` and will be formalized here during Step 12.

**ADR-0002 (dark-theme-first cyber palette) is superseded by ADR-0008.**

---

## ADR-0008 — Official brand identity adopted

**Context:** Brand kit produced with logo (owl/shield/circuit mark), tagline ("CONNECT. LEARN. PROTECT."), typography (Orbitron display + Inter body), and a five-color palette. Replaces the generic cyber-dark palette of ADR-0002 with a project-specific identity.

**Decision:** Adopt the brand kit as the official visual identity. Logo mark used for nav and PWA icon. Orbitron added for wordmark and display headings. Inter remains the body font. Color palette replaces the provisional Step 3 palette.

**Consequences:** Step 3 `globals.css` theme tokens updated to the new palette. Step 5 (Nav) integrates the logo mark. Step 10 (PWA icons) generates from the logo. Orbitron added via `next/font/google`. ADR-0002 is superseded by this one.

---

## ADR-0009 — Hybrid light/dark theme strategy

**Context:** Original HANDOFF called for dark-only throughout. Product review identified that text-heavy surfaces (threads, program info, AI chat) benefit from light backgrounds for sustained reading. Modern apps (GitHub, Notion, Linear) treat dark/light as first-class toggleable themes.

**Decision:** Light mode default on public-facing marketing surfaces (landing, program, resources, community read view). Dark mode default on authenticated app surfaces (dashboard, assistant, admin). Global theme toggle available everywhere. Both themes use the same brand palette with semantic token roles remapped.

**Consequences:** `globals.css` defines both themes via `@theme` (light defaults) and a `.dark` variant. Every component uses semantic tokens, never hardcoded colors or direct brand color names. Route group layouts control default theme. Theme toggle component added in Step 5. Theme persistence deferred to Phase 2 (user preference in DB) with localStorage fallback for MVP.
