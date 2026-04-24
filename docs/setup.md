# Setup

Local development setup for FCTC Cyber Connect. This is a minimal seed; Step 12 expands it with the full dev-env guide.

## Troubleshooting

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
