# Roadmap

Deferred work, technical debt, and post-MVP ideas.

## Technical debt / deferred optimizations

- **Brand PNG → SVG master + build-time generation.** Logo currently committed as PNG (~1.8 MB). Future: commit SVG master in `public/brand/`, generate PNG variants (nav, favicon, PWA 192/512/maskable) at build time via a script. Keeps repo lean and rendering crisp. Operating rule in the meantime: update the logo by overwriting the existing filename rather than committing a new filename, so git stores deltas rather than full copies. Captured 2026-04-23 during Step 3.1.

## Deferred polish

- **Fresh-visit flash on direct-linked (app) routes.** A user landing directly on `/dashboard` or `/admin` with no stored theme preference sees one paint of light before `AppThemeDefault`'s `useEffect` flips them to dark. Path-aware pre-hydration script would fix; deferred until auth gating changes the scenario — in Phase 2 these routes become auth-gated and unauthenticated direct visits redirect, so the flash window disappears naturally for anyone actually reaching the page. Captured 2026-04-23 during Step 6.
