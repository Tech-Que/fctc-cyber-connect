# Phase 2 — Auth: Build Order (placeholder)

This file is a **stub**. The full Phase 2 plan will be drafted when Phase 1 closes. For now it holds forward-looking items committed to during Phase 1 so they are not lost.

Phase 2 goal (per `HANDOFF.md` §5): Cognito integration, protected routes, role-based access. Preserve the `AuthProvider` abstraction so Auth.js can be swapped in if Cognito blocks delivery (per §2).

---

## Phase 2 completion checklist (carried forward from Phase 1)

Items that must pass before Phase 2 is considered closed:

- [ ] **Secret-history scan before any visibility flip.** Run `git log --all --full-history -- .env*` from the repo root. Output must be empty (no `.env` or `.env.*` secret file has ever been committed — `.env.example` is the only allowed `.env*` file in history). Record the result (or a `git log --oneline` snippet of any matches) in `docs/security.md` under an "Audit" heading.
- [ ] Only if the scan is clean: flip GitHub repo visibility from private to public. Locked 2026-04-23 in `PHASE_1_BUILD_ORDER.md` Step 0.
- [ ] Enable branch protection on `main` (per `HANDOFF.md` §13: "protected once past Phase 2").

---

## Placeholders (expand when Phase 2 begins)

- [ ] Draft Cognito User Pool config (region, password policy, MFA stance).
- [ ] Design `AuthProvider` interface in `src/lib/auth/` — mirrors the `AIProvider` pattern from Phase 1 Step 9.
- [ ] Protected-route middleware for `(app)/` group.
- [ ] Role enum wiring (Prospective, Current, Alumni, Admin — per `HANDOFF.md` §3).
- [ ] Email verification flow (note: §16 defers email sending to Phase 2 — revisit SES / Resend decision here).
