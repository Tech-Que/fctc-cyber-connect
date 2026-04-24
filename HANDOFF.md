# Claude Code Handoff — FCTC Cyber Connect PWA

You are helping build **FCTC Cyber Connect**, a mobile-first Progressive Web App for First Coast Technical College's cybersecurity program. This document is your source of truth. Architectural decisions have already been made — do not relitigate them unless you find a concrete blocker.

---

## 1. Product Vision

A modern, mobile-first PWA that helps prospective, current, and alumni students connect with FCTC's cybersecurity program through:

- Program overview and immersive classroom/lab feel
- Community message board
- AI assistant for program questions
- Student journey guidance
- Admin-managed content
- **Future SaaS play:** multi-tenant platform for other technical schools

The app must feel like a cybersecurity lab and a tech career launchpad — not a corporate portal and not a childish school app.

---

## 2. Locked Architectural Decisions

These were debated and decided. Do not change without explicit approval.

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript** | SSR for SEO on public pages, API routes in the same repo, middleware enables future multi-tenant SaaS routing |
| Styling | **Tailwind CSS** | Mobile-first utility classes, easy theming per-tenant later |
| Database | **Neon Postgres** (MVP) → RDS later | Real PostgreSQL, serverless-friendly pooling, zero ops, clean `pg_dump` migration path to RDS when scaling |
| ORM | **Prisma** | Type-safe queries, excellent migrations, works with both Neon and RDS unchanged |
| Auth | **AWS Cognito** | Part of the AWS portfolio story; scaffold with an `AuthProvider` abstraction so Auth.js can be swapped in if Cognito blocks MVP delivery |
| Media | **AWS S3** | Standard for user uploads and video content |
| AI | **Provider abstraction** (`AIProvider` interface) | `mock` → `ollama` → `openai` / `bedrock`. Never hard-code a provider. |
| Hosting | **Vercel** | Zero-config for Next.js; environment variable management built-in |
| Repo | **GitHub** | Standard |
| PWA | **`next-pwa`** or custom service worker | Installable, offline shell required |

**Do not introduce:** Kubernetes, EC2, custom auth, microservices, DynamoDB, AppSync, Redux, tRPC, or any additional framework without asking first.

---

## 3. User Roles

The permission system must support exactly these four roles. Store as a Postgres enum.

1. **Prospective Student** — view program info, ask AI, view public threads, submit interest form
2. **Current Student** — post in message board, reply to threads, access student resources
3. **Alumni** — post advice, share job/certification insights
4. **Admin** — manage posts, manage content, moderate users, update FAQs, view audit log

---

## 4. Moderation & Safety (Non-Negotiable)

Because this is a school-facing app with real student data:

- **Soft-delete only.** Never hard-delete posts, comments, or users. Add `deleted_at` timestamp and `deleted_by` user reference.
- **Audit log table.** Every moderation action (delete, hide, role change, ban) writes to `audit_log` with actor, target, action, timestamp, and reason.
- **Report button** on every post and comment. Reports go to an admin queue.
- **Rate limiting** on posts, comments, and AI queries from day one (even if it's just in-memory for MVP).
- **Content length caps** enforced server-side, not just in the UI.

This is also your GRC case study material. Document the access controls in `docs/security.md` as you build.

---

## 5. Build Phases

**Build in strict order. Do not skip ahead.** Each phase must be demo-ready before starting the next.

- **Phase 1 — Frontend Shell** (UI, routing, mock data, PWA config, docs)
- **Phase 2 — Auth** (Cognito integration, protected routes, role-based access)
- **Phase 3 — Database** (Neon + Prisma, schema, migrations, seed data)
- **Phase 4 — Message Board** (threads, posts, comments, categories, moderation)
- **Phase 5 — AI Assistant** (provider abstraction, mock provider first, then Ollama)
- **Phase 6 — Admin Panel** (moderation queue, user management, FAQ editor)
- **Phase 7 — Polish** (animations, loading states, error boundaries, analytics)
- **Phase 8 — SaaS readiness** (multi-tenant schema review, tenant routing middleware)

See `PHASE_1_BUILD_ORDER.md` for the Phase 1 step-by-step.

---

## 6. Folder Structure

```
fctc-cyber-connect/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/           # Unauthenticated routes
│   │   │   ├── page.tsx        # Landing
│   │   │   ├── program/
│   │   │   ├── community/      # Public read-only view
│   │   │   ├── assistant/
│   │   │   ├── resources/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (app)/              # Authenticated routes
│   │   │   ├── dashboard/
│   │   │   └── admin/
│   │   ├── api/                # Route handlers
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                 # Primitives: Button, Card, Input
│   │   ├── layout/             # Nav, Footer, Shell
│   │   └── features/           # Feature-specific components
│   ├── features/
│   │   ├── auth/
│   │   ├── message-board/
│   │   ├── ai-assistant/
│   │   ├── admin/
│   │   └── resources/
│   ├── lib/
│   │   ├── aws/                # Cognito, S3 clients
│   │   ├── auth/               # AuthProvider abstraction
│   │   ├── db/                 # Prisma client, query helpers
│   │   ├── ai/                 # AIProvider abstraction + providers
│   │   ├── mock/               # Mock data for Phase 1
│   │   └── utils/
│   ├── types/                  # Shared TypeScript types
│   └── styles/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   ├── icons/                  # PWA icons
│   └── manifest.json
├── docs/
│   ├── architecture.md
│   ├── decisions.md            # ADRs — Architecture Decision Records
│   ├── security.md             # GRC notes: access controls, audit, threat model
│   ├── setup.md
│   └── roadmap.md
├── .env.example
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 7. Design System

**Aesthetic:** Clean dark cyber theme. Think Linear, Vercel, or GitHub dark mode — not neon-hacker-movie and not bootstrap-corporate.

**Color palette (use Tailwind config):**
- Background: deep near-black (`#0a0e1a` base, `#111827` cards)
- Primary accent: cyan/teal (`#06b6d4` or `#14b8a6`)
- Secondary accent: electric blue (`#3b82f6`)
- Success: green (`#10b981`)
- Warning: amber (`#f59e0b`)
- Text: high-contrast off-white (`#e5e7eb`), muted (`#94a3b8`)

**Typography:**
- Sans: Inter or Geist Sans
- Mono: JetBrains Mono or Geist Mono (for code blocks, timestamps, IDs)

**Components must be:**
- Mobile-first (design 375px-wide first, then scale up)
- Keyboard-navigable (real `<button>` tags, visible focus rings)
- Accessible (semantic HTML, ARIA only where needed, color contrast WCAG AA)
- Soft-cornered (`rounded-xl` / `rounded-2xl`) with subtle borders, not heavy shadows

**Hero section:** video or image background with a dark gradient overlay. The hero sets the tone for the whole app.

---

## 8. Pages Required

| Route | Phase | Purpose | Auth |
|---|---|---|---|
| `/` | 1 | Landing / hero | Public |
| `/program` | 1 | Cybersecurity program overview | Public |
| `/community` | 1/4 | Message board | Public read, auth write |
| `/assistant` | 1/5 | AI assistant chat | Public |
| `/resources` | 1 | Certification & resource links | Public |
| `/login` | 1/2 | Sign in | Public |
| `/signup` | 1/2 | Sign up | Public |
| `/dashboard` | 1/2 | User dashboard | Authenticated |
| `/admin` | 1/6 | Admin panel | Admin only |

In Phase 1, all pages render with placeholder or mock content. No auth gating yet — use a client-side stub.

---

## 9. AI Provider Abstraction

```ts
// src/lib/ai/types.ts
export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIProvider {
  name: string;
  generateResponse(messages: AIMessage[], context?: Record<string, unknown>): Promise<string>;
}
```

Providers to implement (in this order):

1. `MockProvider` — returns canned responses based on keywords. **Phase 1.**
2. `OllamaProvider` — calls `http://localhost:11434/api/generate`. **Phase 5.**
3. `OpenAIProvider` — uses OpenAI SDK. **Phase 5+.**
4. `BedrockProvider` — uses AWS Bedrock SDK. **Phase 5+.**

The provider is selected via `AI_PROVIDER` env var at runtime. Never import a provider directly from a page or component — always go through a factory.

---

## 10. Environment Variables

All env vars must be in `.env.example` with comments from day one. Missing vars should fail loudly at startup, not silently at runtime.

```env
# --- App ---
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=FCTC Cyber Connect

# --- Database (Phase 3) ---
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
DIRECT_URL=postgresql://user:pass@host/db?sslmode=require   # Neon: direct (non-pooled) for migrations

# --- Auth (Phase 2) ---
COGNITO_USER_POOL_ID=
COGNITO_CLIENT_ID=
COGNITO_REGION=us-east-1
AUTH_SECRET=                                                 # random 32+ char string

# --- AI (Phase 5) ---
AI_PROVIDER=mock                                             # mock | ollama | openai | bedrock
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3
OPENAI_API_KEY=
AWS_BEDROCK_REGION=us-east-1

# --- Storage (Later) ---
AWS_S3_BUCKET=
AWS_S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

---

## 11. Database Schema (Phase 3 reference)

You will implement this in Prisma in Phase 3. Listed here so Phase 1 mock data can match the shape.

```
users           id, email, cognito_sub, role, created_at, deleted_at
profiles        user_id, display_name, bio, avatar_url, graduation_year, cert_list
threads         id, title, category_id, author_id, created_at, pinned, locked, deleted_at
posts           id, thread_id, author_id, body, created_at, edited_at, deleted_at
comments        id, post_id, author_id, body, created_at, deleted_at
categories      id, name, slug, description, sort_order
resources       id, title, url, description, category, sort_order
faqs            id, question, answer, sort_order, published
interest_forms  id, name, email, phone, message, submitted_at, contacted
ai_sessions     id, user_id (nullable), started_at
ai_messages     id, session_id, role, content, created_at
audit_log       id, actor_id, target_type, target_id, action, reason, created_at
reports         id, reporter_id, target_type, target_id, reason, status, created_at
```

---

## 12. PWA Requirements

- `manifest.json` with app name, icons (192, 512, maskable), theme color, start_url
- Service worker (via `next-pwa` or hand-rolled) caching app shell
- Offline fallback page
- Add-to-home-screen prompt handling on mobile
- Verified installable via Lighthouse PWA audit

---

## 13. Deployment Targets

- **GitHub:** public or private repo, `main` branch protected once past Phase 2
- **Vercel:** auto-deploy `main`, preview deploys on PRs
- **Neon:** one project, two branches — `main` and `dev`
- **AWS:** Cognito User Pool + S3 bucket in `us-east-1`

---

## 14. Working Agreement

When building, follow these rules:

1. **Explain before you build.** Before creating or modifying files, state what you're about to do and why. One or two sentences is enough.
2. **Work incrementally.** Never dump 20 files at once. Build, test, commit, move on.
3. **Prefer full updated files over diffs** when the file is under ~150 lines. For larger files, surgical edits are fine.
4. **Document decisions.** Every non-obvious choice goes in `docs/decisions.md` as an ADR (number, title, context, decision, consequences).
5. **Teach as you go.** This is a portfolio project. Explain what each new file does, why it matters, and how it connects to the broader AWS/AI/GRC story.
6. **Commit often.** Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`). One logical change per commit.
7. **No TODOs in shipped code.** Either do it now or file it in `docs/roadmap.md`.
8. **Test the happy path before moving on.** Every phase ends with a manual smoke test and a note in the relevant doc.

---

## 15. Success Criteria

Phase 1 is complete when:

- [ ] `npm run dev` starts the app on `localhost:3000` with no errors
- [ ] All 9 routes render without 404s
- [ ] Mobile navigation works (hamburger on <768px, horizontal on larger)
- [ ] Lighthouse PWA audit passes installability check
- [ ] `docs/architecture.md`, `docs/decisions.md`, `docs/setup.md`, `README.md` all exist with real content
- [ ] Repo is pushed to GitHub with a working Vercel preview deploy
- [ ] `.env.example` documents every variable the app will eventually need

---

## 16. Out of Scope (For Now)

To keep the MVP focused, the following are deferred:

- Email sending (SES, Resend, etc.) — deferred to Phase 2
- Push notifications — deferred to Phase 7
- Real-time features (WebSockets, Server-Sent Events) — deferred post-MVP
- Internationalization — deferred post-MVP
- Analytics dashboards — deferred to Phase 7
- Mobile app wrappers (Capacitor, React Native) — out of scope entirely; PWA is the mobile strategy
- Multi-tenant SaaS features — deferred to Phase 8

---

## 17. When in Doubt

Ask before building. Better to pause and confirm than to generate 500 lines that have to be thrown away.
