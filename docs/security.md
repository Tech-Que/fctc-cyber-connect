# Security

How FCTC Cyber Connect handles security, privacy, and governance — the threat model, access control, data handling, AI governance, and compliance mapping.

> **Disclaimer.** This is a self-assessment of design intent, not the result of a third-party audit. Implementation status varies — controls labeled "Phase 2+" or similar are designed but not yet enforced in code. Where a control is wired today, that is called out explicitly. Where a control is architectural intent, it is labeled with the phase that lands it.

---

## Security philosophy

Governance is designed in, not retrofitted. The schema, abstractions, and route handlers are shaped so that audit, soft-delete, role-based access, rate limits, and input validation become primitives of the system rather than features bolted on later. The cost of doing this up front is a small amount of plumbing in Phase 1 — an `audit_log` table specification before there is anyone to log, a role enum on `users` before authentication ships, a soft-delete column on every user-facing entity before there is anything to delete. The payoff is that by the time the system has real users in Phase 2+, the controls that protect them are already part of the data model rather than retrofits that fight existing assumptions. (The case-study narrative for this project, kept in a sibling repo, names this Pattern #7 — "build the audit surface before the actor exists.")

---

## Threat model

A six-row STRIDE pass tailored to this app's actual surface. Each row names a concrete attacker scenario, then states the mitigation in place today and the one planned for the phase that lands real auth and data.

| Threat category | Relevant here? | Current mitigation | Planned mitigation |
|---|---|---|---|
| **Spoofing** (impersonation) | Yes — a Current Student could try to impersonate Admin to delete others' threads, or impersonate another user to vote/post under their name. | No real auth in Phase 1; client-side stub only. The four placeholder pages (Login, Signup, Dashboard, Admin) carry "Phase 2" banners. | Phase 2: Cognito JWT validation in `src/middleware.ts`; role enum is server-side, never trusted from client claims. Every protected route re-checks the role on each request, not just at login. |
| **Tampering** (unauthorized modification) | Yes — modified request bodies bypassing client-side limits; modified content after creation by someone other than the author; modified audit log to hide a moderation action. | Server-side body validation on `POST /api/ai/generate` (messages array shape; total content ≤ 10,000 chars; provider name validated by Zod env schema). | Phase 3: Prisma write paths run server-side only; per-resource ownership checks (`authorId === session.userId` for edits); audit log table is append-only at the database level (no `UPDATE`/`DELETE` grants in the role used by app code). |
| **Repudiation** (denying an action took place) | Yes — a user denying they posted harmful content; an admin denying they deleted someone's thread without cause. | Minimal — no real writes yet. | Phase 3+: every moderation action writes a row to `audit_log` (actor, target_type, target_id, action, reason, timestamp). Append-only, retained indefinitely. Combined with signed JWTs (Phase 2), every action is tied to an authenticated identity. |
| **Information Disclosure** (data leaks across trust boundaries) | Yes — Admin-only data leaking to Current Students; soft-deleted content reappearing in public listings; private profile fields exposed in public API responses. | Route-group separation (`(public)` vs `(app)`) keeps render-time concerns split. Server-side rendering means no auth-protected data is fetched into the public client bundle. Mock data layer's helpers already filter `deletedAt != null` to exercise the pattern. | Phase 3: Prisma queries always include `deletedAt: null` filter on user-facing reads; explicit allowlists in API responses (return `displayName`, `bio`, `avatarUrl` — never `email`, never `cognito_sub`). Phase 6: row-level filters in admin tools so non-admins can never query the audit log even via direct API calls. |
| **Denial of Service** (resource exhaustion) | Yes — runaway AI request cost from a single client; flooding `/api/ai/generate` with garbage bodies; future flood of thread/post creation. | In-memory rate limiter on `/api/ai/generate` (10 req/min/IP); 10,000-character cap on total AI input. Validation-failure responses (400) also count toward the rate limit so bots can't free-pass. | Phase 7: Redis-backed rate limiter to cover multi-instance hosting (current `Map` is per-Node-process). Phase 4: per-user thread/post creation quotas. Vercel-level edge limits as defense in depth. |
| **Elevation of Privilege** (regular user becomes admin) | Yes — most direct path to total compromise. | Stubbed. | Phase 2: role enum stored in database, server-side check on every protected route, **admin role only granted by an existing admin** via a dedicated admin-action endpoint that writes to `audit_log`. No self-promotion path exists in the schema or the route handlers. Phase 6: admin promotion requires a reason string, which becomes part of the audit record. |

---

## Access control matrix

Roles are an enum on `users.role` — `prospective | current | alumni | admin`. The matrix below is the source-of-truth specification for what each role can do; route handlers enforce it server-side starting in Phase 2.

**Legend.** R = Read · C = Create · E = Edit own · M = Moderate (soft-delete any, edit any, restore) · — = no access

| Role | Threads | Posts | Comments | Resources | FAQs | Audit Log | Other Users |
|---|---|---|---|---|---|---|---|
| Prospective Student | R | — | — | R | R | — | R public profile |
| Current Student | R, C | R, C, E | R, C, E | R | R | — | R public profile |
| Alumni | R, C | R, C, E | R, C, E | R | R | — | R public profile |
| Admin | R, C, M | R, C, E, M | R, C, E, M | R, E | R, E, publish/unpublish | R | R all, role change, suspend |

**Notes on the matrix.**

- **Prospective vs Current/Alumni** differs only in posting. Both groups read freely; only authenticated students with progressing-or-completed status can post. This protects the community from drive-by accounts.
- **Alumni and Current Student have identical permissions.** The role distinction exists for community context (an "Alumni" badge is meaningful even when access is the same).
- **Admin is never granted via signup.** The signup form (`src/app/(public)/signup/page.tsx`) intentionally omits Admin from the role selector. Admin is conferred only by an existing admin via an audit-logged action.
- **Audit Log read access is admin-only.** Writes happen automatically by the system; no role can write directly.
- **Suspension** (Phase 6) sets a soft flag on the user record; the user can sign in but their content is hidden from public listings. Different from soft-delete, which is a content-level action.

---

## Data handling

### Soft-delete on every user-facing entity

Every entity a user can create or own carries two columns: `deleted_at TIMESTAMP NULL` and `deleted_by UUID NULL` (referencing `users.id`). Threads, posts, comments, users, FAQs — all soft-deleted, never hard-deleted by any application code path. Restoration is a single `UPDATE` setting `deleted_at = NULL`.

The mock layer (`src/lib/mock/`) already exercises this pattern. Every helper function — `getAllThreads`, `getThreadsByCategory`, `getPostsByThread`, `getCommentsByPost`, `getUserById`, `getResourcesByCategory`, `getPublishedFaqs` — filters `deletedAt != null` before returning. Phase 3 swaps the mock arrays for Prisma queries; the helper signatures stay; the soft-delete filter migrates from `Array.filter` to a `where: { deletedAt: null }` clause.

The only path to hard-delete is a deliberate admin action in Phase 6+ for genuine GDPR / right-to-be-forgotten requests. Even then, the deletion itself is logged in `audit_log` (actor, target user, action, reason, timestamp) before the row is removed.

### Audit log table specification

```
audit_log
├── id           UUID PRIMARY KEY
├── actor_id     UUID NOT NULL REFERENCES users(id)
├── target_type  TEXT NOT NULL   -- 'thread' | 'post' | 'comment' | 'user' | 'faq'
├── target_id    UUID NOT NULL
├── action       TEXT NOT NULL   -- 'delete' | 'restore' | 'edit' | 'role_change' | 'suspend' | 'publish'
├── reason       TEXT            -- optional free-text justification
└── created_at   TIMESTAMP NOT NULL DEFAULT NOW()
```

Append-only. The application's database role grants `INSERT` and `SELECT` on this table; no `UPDATE` or `DELETE` privileges. Retention is indefinite — the audit log is the system's memory of what was done and why.

### Data retention defaults

| Data type | Retention | Notes |
|---|---|---|
| Audit log records | Indefinite | Append-only by design. Survives soft-delete of the target. |
| Soft-deleted user content (threads/posts/comments) | Indefinite by default; admin can purge to hard-delete | Purge action itself is audit-logged. |
| Soft-deleted user accounts | Indefinite by default; hard-delete only on right-to-be-forgotten request | Hard-delete cascades to soft-delete the user's content if not already deleted; audit trail of the request and the action persists. |
| AI session transcripts (Phase 5+) | 90 days, then anonymize | Per-session ID retained; user_id replaced with NULL. Reasoning: support debugging and pattern analysis without indefinitely retaining identifiable conversation data. |
| Rate limit records (in-memory `Map`) | 60 seconds (sliding window) | Not persisted. Lost on Node process restart. |

---

## Authentication and authorization

**Status: Phase 2 work. Architecture laid out below; enforcement comes online with the Phase 2 commit.**

### AuthProvider abstraction

`src/lib/auth/AuthProvider` (Phase 2) defines the interface every concrete provider implements. Cognito is the default; Auth.js is the documented fallback if Cognito blocks MVP delivery. The interface scopes are:

- `signIn(credentials) → Session` — exchange credentials for a session token
- `getSession() → Session | null` — read the current session from cookies/headers
- `signOut() → void` — invalidate the session
- `verify(token) → DecodedClaims | null` — validate a JWT and return claims

Components and routes never import a concrete provider directly. They take an `AuthProvider` interface from a factory, identical in spirit to the AI provider abstraction (see [ADR-0003](./decisions.md#adr-0003-aiprovider-abstraction-with-factory-only-access)).

### Session model

Cognito issues a JWT on successful sign-in. Refresh tokens are stored in HttpOnly cookies; access tokens are short-lived. Every protected request validates the JWT signature and expiry server-side — never trust a `role` claim from the client without re-verification. The role used for authorization is the one currently in the database, not the one in a possibly-stale token (a user demoted from admin should lose admin powers immediately, not at next login).

### Middleware-based route guards

`src/middleware.ts` (Phase 2) intercepts requests for the `(app)` route group:

1. Read session cookie. If missing or invalid → redirect to `/login`.
2. Verify JWT signature. If invalid → redirect with session-expired message.
3. Look up user's current role from database. If user is suspended → redirect to a "your account is suspended" page.
4. Attach `userId` and `role` to request context for downstream route handlers.

Admin-only routes additionally check `role === 'admin'`. Insufficient role → 403, audit-logged as a denied access attempt (Phase 6).

### Password handling

Cognito handles password storage, hashing, and reset flows. The application code never sees a password — it only sees the JWT issued after Cognito's authentication exchange. This intentionally constrains the project's surface area for password-related vulnerabilities to Cognito's own audited implementation.

---

## Input validation and rate limiting

Each is a discrete control with stated limits.

### Environment validation (CM-7)

`src/lib/env.ts` parses `process.env` against a Zod schema at startup. Three failure modes:

1. **Required value missing** → schema parse fails → app refuses to start with a JSON-tree error showing exactly which field failed and why.
2. **Wrong type or format** → ditto. Example: `AI_PROVIDER=foo` fails because `foo` is not in the enum `mock | ollama | openai | bedrock`.
3. **Cross-field rule violation** → custom check throws. Example: `AI_PROVIDER=ollama` without `OLLAMA_BASE_URL` set → `Error: AI_PROVIDER=ollama requires OLLAMA_BASE_URL to be set.`

Verified at Step 11 via three test cases (happy / bad-enum / missing-conditional). The validator's behavior is the closest thing the project has to a "smoke test" today: if the env is wrong, nothing else gets to run.

### API input validation (SI-10)

`POST /api/ai/generate` enforces:

- Request body parses as JSON (else 400 `Invalid JSON body`)
- `messages` is an array (else 400 `messages must be a non-empty array`)
- `messages.length > 0` (same 400 path)
- Sum of `messages[].content` lengths ≤ 10,000 characters (else 400 with the cap stated explicitly)

These run server-side. The client UI may also enforce them, but the server cap is authoritative.

### Rate limiting (SC-5)

`POST /api/ai/generate`: 10 requests per minute per source IP, sliding window, in-memory `Map<ip, timestamp[]>`. Source IP resolves from `x-forwarded-for` (first entry, trimmed), `x-real-ip`, or the literal string `unknown` if neither is present. Limit-exceeded responses return 429 with a JSON body: `{ error: "Rate limit exceeded. 10 requests per minute." }`. Validation-failure paths (400 responses) **also** count toward the rate budget — this prevents bots from sending malformed requests as a way to bypass the limit.

The current implementation is per-Node-process, which means it doesn't survive a server restart and doesn't aggregate across multiple Vercel function instances. Tracked in `roadmap.md` as a Phase 7 migration to a Redis-backed limiter.

---

## Secrets management

- **No secrets in code.** All sensitive config flows through env vars.
- **`.env.local` is gitignored.** The project's `.gitignore` has `.env*` with an explicit `!.env.example` negation so the template tracks while real env files don't. Verified during Step 9 when `git add .env.example` initially failed.
- **`.env.example` is tracked** with placeholder values and phase-tagged comments for each variable.
- **Pre-public-flip secret scan.** Before flipping the repo to public (planned at end of Phase 2), run:
  ```bash
  git log --all --full-history --source -- ".env*" | head
  ```
  Should return empty. If any commit ever touched `.env`, `.env.local`, or any non-example env file, that's history to clean up before going public. This scan is a Phase 2 completion gate — the repo does not flip from private to public until it passes.
- **Vercel deployment** (Phase 2+): secrets injected via Vercel's encrypted env-config UI, not committed anywhere.
- **AWS credentials** (Phase 2+): IAM roles for service-to-service calls preferred over long-lived access keys. Where keys are unavoidable, scope them to least-privilege per service (S3 bucket access ≠ Cognito admin access).

---

## AI governance

This section is the most distinctive in the document. AI features create governance concerns that don't have direct analogues in traditional web apps. The project addresses them at four layers.

### Provider abstraction means data-handling is a configuration choice

The `AIProvider` interface ([ADR-0003](./decisions.md#adr-0003-aiprovider-abstraction-with-factory-only-access)) means the system is not married to any single vendor's data-handling policy. Switching from a cloud-tenanted provider (OpenAI, Bedrock) to a self-hosted one (Ollama running locally on a campus server) is a single env-var change. This is a real lever for governance: data sensitivity drives provider choice. Pre-launch product questions ("can a student's question include their FAFSA status?") become tractable because the answer can be "we route it to Ollama, not OpenAI" without rewriting the route handler.

The API response includes a `provider` field naming which provider generated the response. This makes provider attribution recoverable from logs in Phase 5+.

### Content length caps prevent prompt-stuffing attacks

`/api/ai/generate` rejects any request whose total `messages[].content` length exceeds 10,000 characters. Without this cap, a malicious user could:
- Pad input to drive AI cost up arbitrarily (each token is billed)
- Attempt prompt injection via gigantic system-prompt overrides
- DoS the provider with oversize requests until rate limits or quotas trigger

The 10,000-char cap is conservative — typical mock-response questions are well under 500 characters. Phase 5 will likely tighten this further per provider (OpenAI gpt-4o-mini accepts 128k context but billing is the concern; Ollama may have smaller practical limits).

### Rate limiting protects cost and availability

10 req/min/IP on `/api/ai/generate`. Future per-user limits (Phase 4+) will replace the IP-based limit once authentication ties requests to identities — a single household behind a NAT shouldn't share a budget across all members.

### Future response moderation (Phase 6 admin tools)

The admin moderation queue (Phase 6) will include AI response review. The `audit_log` schema already accommodates `target_type = 'ai_response'` for flagging. Programmatic moderation (e.g., OpenAI's moderation endpoint, or a Bedrock-hosted classifier) is deferred to Phase 6+ when there's enough real traffic to tune thresholds.

### AI agents as untrusted actors

This is the project's most novel governance contribution: the discipline of treating AI agents the same way the system treats any other actor — as an untrusted source of claims that must be verified against ground truth.

Concretely, this project is built using AI-assisted development. The agents involved (Claude, in this case) self-report task completion, file edits, decisions made. **Those self-reports are unverified until checked against ground truth — the filesystem, `git status`, the actual contents of files on disk.** The principle was established during Phase 0 when an AI agent's session-memory summary diverged from on-disk reality (the "memory-drift incident") and key Phase-0 decisions had to be reconstructed from disk rather than from chat memory. From that point forward, every step in the build process verifies output via filesystem reads, shell commands, and git operations rather than accepting agent self-reports.

The pattern carries forward into the production system: when the AI assistant generates a response, the route handler does not trust the response to be safe content. The 10,000-char cap, the response moderation hook (Phase 6+), and the audit-logged provenance all exist because the AI provider's output is treated as input from an untrusted actor — not because the providers are adversarial, but because their outputs are non-deterministic and shouldn't be a trust boundary the system relies on.

This is the link to ISO/IEC 42001's traceability and accountability requirements: every AI interaction can be reconstructed from logs (Phase 5+), every response is attributed to a specific provider, and the human-in-the-loop moderation surface (Phase 6+) gives accountability a concrete enforcement path.

---

## Compliance posture

> Repeating the disclaimer because this section invites the strongest reading: this is a self-assessment of design intent, not a third-party audit. Some controls are wired today; others are architectural intent landing in named phases.

### NIST SP 800-53 mapping

| Control | Title | How it's addressed |
|---|---|---|
| **AC-2** | Account Management | `users.role` enum (`prospective, current, alumni, admin`) is the source of truth. Admin role granted only by existing admin (Phase 2+). Suspension is a soft flag, audit-logged (Phase 6+). |
| **AC-3** | Access Enforcement | Server-side role checks on every protected route (Phase 2 middleware). No client-side role gate is trusted. |
| **AC-6** | Least Privilege | Role enum constrains action set per role. App database role gets `INSERT`/`SELECT` on `audit_log` but not `UPDATE`/`DELETE` (Phase 3). |
| **AU-2** | Event Logging | `audit_log` table specification — every moderation action (delete, restore, edit, role change, suspend, publish) writes a row. |
| **AU-3** | Content of Audit Records | Schema captures actor (`actor_id`), target (`target_type` + `target_id`), action, optional reason, timestamp. |
| **AU-11** | Audit Record Retention | `audit_log` is append-only and retained indefinitely. Soft-delete on user-facing entities preserves the trail of what existed. |
| **CM-7** | Least Functionality | Zod-validated env config; app refuses to start on invalid configuration (fail-closed). Specific dependencies justified by ADRs in `decisions.md`. |
| **SC-5** | Denial of Service Protection | In-memory rate limiter on `/api/ai/generate` (10 req/min/IP). 10,000-char cap on AI input. Phase 7: Redis-backed limiter for multi-instance deployment. |
| **SI-10** | Information Input Validation | Server-side body validation on `/api/ai/generate` (JSON shape, array non-empty, content length cap). Phase 4+: per-resource validation on thread/post/comment writes. |

### ISO/IEC 42001 (AI Management Systems)

ISO 42001 covers AI-specific management requirements. Two areas of the standard map cleanly to this project's design:

- **Accountability and traceability of AI interactions.** The provider abstraction means every response is attributed to a named provider (`provider` field in the API response). Phase 5+ adds persisted `ai_sessions` and `ai_messages` tables (per the schema reference in HANDOFF §11) so the full conversation history is queryable for post-hoc audit.
- **Risk management of AI components.** Provider switchability is itself a risk-management control: changing vendor data-handling policy is a config change, not a re-architecture. The "AI agents as untrusted actors" pattern (above) operationalizes this — the system never depends on AI output being safe, accurate, or appropriate; human moderation (Phase 6+) is the trust boundary.

A formal ISO 42001 conformance assessment is well beyond Phase 1 scope. The mapping is here so a security/compliance reader can see that the project's architecture anticipates the standard's requirements rather than retrofitting them later.

---

## Known gaps and forward roadmap

These are gaps known to the project today. Each is tracked in [`roadmap.md`](./roadmap.md):

- **Production-grade rate limiter.** In-memory `Map` works for single-instance dev; multi-instance Vercel deployment needs Redis-backed limiter. Phase 7+.
- **Real-iPhone verification.** Phase 1 verification used DevTools mobile viewport (iPhone 14 Pro Max) because hotel WiFi blocked direct device access. Real-device pass deferred to home WiFi.
- **Full-text content moderation pipeline.** Phase 6 admin tools include the report queue UI; programmatic moderation (regex, classifier, third-party moderation API) is deferred to Phase 6+ when there's traffic to tune against.
- **Persistent audit log.** `audit_log` is a schema specification today; the table comes online with the Phase 3 Prisma migration.
- **Persistent rate-limit state.** Tied to the production-grade rate limiter item above.
- **License decision.** Repo is currently private; project license must be chosen before public-flip at end of Phase 2. Tracked under "Phase 2 prep" in roadmap.
- **All Phase 2+ controls** listed in the matrix and STRIDE table above are architectural intent, not enforced in code today. The whole point of this document is to make that state of affairs explicit and trackable rather than to overclaim.
