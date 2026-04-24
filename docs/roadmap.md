# Roadmap

Deferred work, technical debt, and post-MVP ideas.

## Technical debt / deferred optimizations

- **Brand PNG → SVG master + build-time generation.** Logo currently committed as PNG (~1.8 MB). Future: commit SVG master in `public/brand/`, generate PNG variants (nav, favicon, PWA 192/512/maskable) at build time via a script. Keeps repo lean and rendering crisp. Operating rule in the meantime: update the logo by overwriting the existing filename rather than committing a new filename, so git stores deltas rather than full copies. Captured 2026-04-23 during Step 3.1.
