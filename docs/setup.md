# Setup

Clone-to-running-dev guide for FCTC Cyber Connect. Phase 1 only — Phase 2+ extensions (Cognito setup, Neon database provisioning, AWS credentials) are added as those phases ship.

## Prerequisites

- **Node 20+** — Node 24 LTS recommended; pinned via `.nvmrc`. With `nvm`, `cd` into the project and run `nvm use` to pick it up automatically.
- **npm** — comes with Node. Locked in by [ADR-0001](./decisions.md#adr-0001-use-npm-over-pnpm).
- **Git** — any modern version.
- **Optional: Ollama** — only needed if you want real LLM responses instead of the mock provider. The default `AI_PROVIDER=mock` runs fully offline against keyword-matched canned responses; no external services required.

## Clone and install

```bash
git clone <repo-url> fctc-cyber-connect
cd fctc-cyber-connect
nvm use            # if you have nvm; otherwise verify node -v reports >=20
npm install
```

The `npm install` runs Workbox + Sharp postinstall hooks. Expect ~30 seconds on a fast connection. You may see ~7 npm audit warnings — these come from `next-pwa@5.6.0`'s Workbox v6 transitive dependencies and are risk-accepted for Phase 1. See [roadmap.md](./roadmap.md) for the planned migration.

## Environment configuration

Copy the example file and fill in only what the current phase needs:

```bash
cp .env.example .env.local
```

For Phase 1, the only required value is:

```env
AI_PROVIDER=mock
```

Everything else can stay blank. The mock provider doesn't need any credentials. The Zod-validated schema in `src/lib/env.ts` enforces this — and conversely, if you set `AI_PROVIDER=openai` without `OPENAI_API_KEY`, the app refuses to start with a clear error. See [ADR-0003](./decisions.md#adr-0003-aiprovider-abstraction-with-factory-only-access) for the abstraction.

`.env.local` is gitignored. `.env.example` is tracked. Never commit `.env.local`.

## Running locally

```bash
npm run dev
```

Next.js will report the actual URL it bound to:

```
   ▲ Next.js 15.5.15 (Turbopack)
   - Local:        http://localhost:3000
   - Network:      http://10.0.0.156:3000
```

Open `http://localhost:3000` in a browser. If port 3000 is busy (another Node process, another project, etc.), Next falls back to 3001, 3002, and so on — **always read the actual port from the terminal output**, don't assume 3000.

The PWA service worker is **disabled in dev** (it caches aggressively and breaks hot-reload). Production builds re-enable it.

## Mobile device testing

The "Network:" URL Next prints (`http://<your-LAN-IP>:<port>`) is reachable from any device on the same WiFi network. To find the IP manually:

```powershell
ipconfig
```

Look for the IPv4 address on your active adapter (usually under "Wireless LAN adapter Wi-Fi"). Visit `http://<that-IP>:<port>` from your phone's browser.

Two real-world gotchas:

1. **Hotel / AP-isolated WiFi blocks device-to-device traffic.** Your phone on the same SSID as your laptop can't reach the dev server because the router enforces client isolation. Workaround: use Chrome DevTools' mobile viewport (Toggle Device Toolbar → iPhone 14 Pro Max or similar) instead of a real device. It's not a perfect substitute for touch testing, but it covers most layout verification. Real-device testing then deferred until you're back on a normal network.
2. **Windows Firewall blocks inbound Node connections** by default on networks classified as "Public." The local dev server starts fine, but other devices can't reach it. See Troubleshooting below.

## Production build

```bash
npm run build
npm run start
```

`npm run build` produces an optimized production bundle and (importantly) generates the service worker into `public/sw.js`. `npm run start` serves it on port 3000 by default.

To verify the PWA installability, run a Lighthouse audit against the production server. Either via Chrome DevTools (Lighthouse tab → "Mobile" + relevant categories → Analyze) or CLI:

```bash
npx lighthouse@10 http://localhost:3000 \
  --only-categories=pwa \
  --output=html \
  --output-path=./lighthouse-pwa.html \
  --chrome-flags="--headless --no-sandbox"
```

Note the `@10` pin — Lighthouse 12+ removed the PWA category (it's now folded into other audits). Phase 1's installability target was 100/100 on Lighthouse 10, hit during Step 10.

## Troubleshooting

If you hit one of these, jump to the relevant entry:

| If you see... | See |
|---|---|
| CSS edits not appearing in browser despite hard-refresh | [Tailwind/CSS edits not appearing](#tailwindcss-edits-not-appearing-in-browser-after-save) |
| Dev server reports "port already in use" | [Port already in use](#port-already-in-use) |
| Phone on same WiFi can't reach `http://[laptop-IP]:[port]` | [Mobile device can't reach dev server](#mobile-device-cant-reach-dev-server-on-hotelap-isolated-wifi) |
| Inbound connection refused from another device on the network | [Windows Firewall blocks Node](#windows-firewall-blocks-inbound-node-connections-from-other-devices) |
| Yellow audit warnings on `npm install` about workbox-* | [npm audit warnings on next-pwa](#npm-audit-warnings-on-next-pwa-transitive-dependencies) |

### Tailwind/CSS edits not appearing in browser after save

**Symptom:** CSS changes in `globals.css` or Tailwind theme tokens don't reflect in the browser even after hard-refresh.

**First thing to check:** orphan dev server process. Turbopack can leave a zombie `node.exe` running that serves a stale CSS bundle while you think the new one is active.

**Diagnostic:**

```powershell
Get-Process node | Select-Object Id, Path, StartTime
```

Look for any `node.exe` with a start time older than your current session.

**Fix:**

- Kill the orphan: `Stop-Process -Id <PID>` or via Task Manager
- Wipe the build cache: `Remove-Item -Recurse -Force .next`
- Restart: `npm run dev`

**When to suspect this:** theme token changes not rendering, hot-reload stopped working, unexplained CSS from a previous session still visible. Always suspect this before suspecting the CSS itself.

Logged the first time this happened: 2026-04-23, during Step 3.1 palette swap.

---

### Port already in use

**Symptom:** `npm run dev` reports `Port 3000 is in use by process <PID>, using available port 3001 instead.` Subsequent runs may land on 3002, 3003, etc.

**Why it happens:** another Node process is squatting the port. Could be an orphan dev server (see above), another project's dev server, or an unrelated tool.

**Quick fix:** read the actual port from the terminal output and use that — Next has already moved on. Bookmark links inside the project that say `:3000` will need an update if you're stuck on a fallback port.

**Real fix:** find and kill the squatter.

```powershell
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue |
  Select-Object LocalPort, State, OwningProcess
Get-Process -Id <OwningProcess>
Stop-Process -Id <OwningProcess> -Force
```

If you want to force a specific port: `PORT=3050 npm run dev` (works on Windows bash and PowerShell).

---

### Mobile device can't reach dev server on hotel/AP-isolated WiFi

**Symptom:** `http://<your-LAN-IP>:3000` from your phone times out or refuses connection, even though the laptop is on the same SSID and the dev server says it's bound to that IP.

**Why it happens:** AP isolation (also called "client isolation") is a router setting common on hotel, coffee-shop, and conference WiFi. It prevents devices on the same access point from talking to each other, so your phone literally can't reach your laptop.

**Diagnostic:** try `ping <laptop-IP>` from another device on the same network. If ping fails, AP isolation is on (or the laptop firewall is blocking — see next entry).

**Fix:** none, from your side — the router's the gatekeeper. **Workaround for the duration:** use Chrome DevTools mobile viewport (Toggle Device Toolbar) for layout testing. Real-device verification has to wait for a network you control.

This is also the reason the Phase 1 SESSION_LOG carries a "real-iPhone verification deferred to home WiFi" entry.

---

### Windows Firewall blocks inbound Node connections from other devices

**Symptom:** Same WiFi network (no AP isolation), `http://<your-LAN-IP>:3000` from another device still fails. Localhost works fine on the laptop.

**Why it happens:** Windows Firewall blocks inbound connections to Node by default on networks classified as **Public**. First time you `npm run dev`, Windows pops a "Allow Node.js through firewall?" dialog — if you click "Cancel" or miss it, Node stays blocked on Public networks indefinitely.

**Diagnostic:**

```powershell
Get-NetFirewallRule -DisplayName "Node*" |
  Select-Object DisplayName, Profile, Action, Enabled
```

If any rule shows `Profile=Public` and `Action=Block`, that's the culprit.

**Fix (preferred):** add an explicit Allow rule for Node on Private networks only.

```powershell
New-NetFirewallRule -DisplayName "Node.js dev server" `
  -Direction Inbound -Action Allow -Program "C:\Program Files\nodejs\node.exe" `
  -Profile Private
```

**Fix (alternative, less secure):** change your network category from Public to Private. Settings → Network & Internet → WiFi → click your network → Network profile type → Private.

Run as administrator either way.

---

### npm audit warnings on `next-pwa` transitive dependencies

**Symptom:** `npm install` reports something like *"7 vulnerabilities (2 moderate, 5 high)"*, and `npm audit` traces them all to `workbox-*` v6 packages.

**Why it happens:** `next-pwa@5.6.0` (the most recent stable release) ships Workbox v6, which has known low-severity issues mostly around dev-time tooling rather than production runtime.

**Fix:** none in Phase 1 — risk-accepted. Don't run `npm audit fix --force` because it'll attempt to upgrade `next-pwa` to a major version that's not actually published, leaving the install broken.

**Planned resolution:** migrate to `@ducanh2912/next-pwa` (community fork on Workbox v7) during Phase 7 polish. Tracked in [roadmap.md](./roadmap.md) under "Deferred polish / Phase 7+."

## Still stuck?

If your issue isn't above:

- Check `docs/SESSION_LOG.md` for entries from previous phases — many development pain points get logged there as they're discovered, before they're formalized into a Troubleshooting entry here.
- If you find a recurring issue not yet documented, add a Troubleshooting entry here in the same Symptom / Why / Diagnostic / Fix format.
