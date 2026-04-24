# Session Log

A durable, append-only record of completed steps for FCTC Cyber Connect. One line per completed step.

Format: `YYYY-MM-DD | Step N | <commit subject or short action description>`

---

<!-- Entries below. Newest at the bottom. -->

2026-04-23 | Step 0 | Prereqs verified: Node v24.15.0, npm 11.12.1, git 2.54.0, user Q Andersen / quentonand@gmail.com. gh CLI installed via winget (auth pending). Vercel account confirmation pending. Decisions locked: npm (ADR-0001), private repo flip-to-public after Phase 2, Node 24 LTS (ADR-0005), still-image hero with CSS motion.
2026-04-23 | Setup | Created CONTRIBUTING.md with 3 standing rules. Reconstructed Step 0 decisions that did not persist from previous session.
2026-04-23 | Step 0 | Vercel account confirmed, linked to GitHub quentonand. All Step 0 prereqs closed.
2026-04-23 | Step 1 | Scaffolded Next.js 15.5.15 + React 19.1.0 + Tailwind 4 + Turbopack. ADR-0006 (Next 15 pin) and ADR-0007 (Tailwind 4 accept) documented. Package renamed. Engines pinned (Node >=20). .nvmrc set to 24. Dev server verified.
2026-04-23 | Step 1.1 | Reverted build script to webpack per ADR-0007. Dev continues on Turbopack. Dev server currently running on 3001 due to port 3000 occupied by unrelated node.exe (PID 21980); not a blocker.
2026-04-23 | Step 2 | Folder structure established per HANDOFF §6 (minus prisma/ and public/icons/ which come in later phases). .gitkeep placeholders in empty dirs.
2026-04-23 | Step 2.1 | Hardened .gitignore for AI agent settings, IDE, OS, and local env files. Pre-emptive guard before public-flip at end of Phase 2.
2026-04-23 | Step 3 | Tailwind 4 @theme cyber palette in globals.css. Inter + JetBrains Mono wired via next/font/google. Dark mode default. Visual verification on localhost.
2026-04-23 | Step 3.1 | Brand kit adopted (ADR-0008). Hybrid light/dark theme (ADR-0009). Semantic color tokens in globals.css, both light and dark variants. Orbitron added as --font-display. Theme defaults move to route group layouts (public=light, app=dark). ADR-0002 superseded by ADR-0008. Brand assets at public/brand/. ADR seed file created at docs/decisions.md.
2026-04-23 | Step 3.2 | docs/roadmap.md created with PNG/SVG deferral note. docs/setup.md seeded with Turbopack stale-process troubleshooting entry from live debugging during Step 3.1.
2026-04-23 | Step 4 | Five UI primitives in src/components/ui/ with barrel export. cn() helper at src/lib/utils/cn.ts (clsx + tailwind-merge). Showcase rendered in page.tsx for visual verification.
