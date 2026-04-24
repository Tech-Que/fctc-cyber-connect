# Contributing to FCTC Cyber Connect

## Standing Rules

These rules apply to every work session, whether human or AI-assisted.

### 1. Read source-of-truth docs at session start

Before taking any action in a new session, read in full:
- `HANDOFF.md` — project vision, stack decisions, non-negotiables
- The current `PHASE_N_BUILD_ORDER.md` — active phase plan
- `docs/SESSION_LOG.md` — progress log from prior sessions

Do not work from memory summaries. The filesystem is the source of truth.

### 2. Use absolute Windows paths with forward slashes

All file references use `C:/Users/Tech_/fctc-cyber-connect/...` format.
Do not use `~/`, `$HOME`, or relative paths except inside the project dir.
Shell-dependent path expansion on Windows is a known source of silent bugs.

### 3. Append to SESSION_LOG.md at the end of every step

The same turn a step completes, append a one-line entry to `docs/SESSION_LOG.md`:
`YYYY-MM-DD | Step N | <commit message or summary>`

A step is not considered done until the log entry is written.
