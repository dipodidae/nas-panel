## Progress Log

Date: 2025-09-25

### Added

- Command streaming client integration (`useCommandStream` composable) with WebSocket handling, output parsing, and state management.
- Output display component `CommandOutput.vue` (scrollback, follow tail, clear, status, exit code badge).
- Normalized WebSocket server handler to emit consistent raw line objects (removed wrapped shape).
- Integrated output component into `index.vue` page beneath command buttons.
- Created this progress log per project guidelines.

### Notes / Next Ideas

- Consider adding cancel endpoint (graceful termination) and UI Stop button.
- Add authentication/authorization check inside WS handler if session not implicitly enforced.
- Persist a short command history (last N exit codes) in store for UX.
- Add download/export of output for long-running commands.

### Enhancements (Second Pass)

- Implemented cancel command endpoint & front-end cancel button.
- Added execution history (last 25) with exit codes + timestamps.
- WebSocket now enforces auth via `requireAuth`.
- Store exposes `markExited` to archive results.
- UI renders recent history list.

### UI Polish (Loading Indicator)

- Replaced default `<NuxtLoadingIndicator>` with custom `<AppLoadingIndicator>` using Tailwind + project CSS vars (gradient aligns with semantic `--ui-*` colors, Nuxt page lifecycle hooks, throttle/hide/reset timings configurable). Exposes manual control via DOM events & component expose.

### Architectural Consolidation (Unified WebSocket)

- Removed per-command WebSocket endpoint (`/api/ws/command/:id`).
- Removed REST start endpoint (`POST /api/commands/:command`) and associated `StartCommandResponse` / `wsPath` shape.
- Client (`useCommandStream`) now always uses single persistent `/api/ws/command` socket.
- Legacy runtime flag `wsUnified` dropped; unified path is canonical.
- Removed REST cancel fallback; cancel now exclusively via `{ action: 'cancel' }` WS message.
- Pruned unused types (StartCommandResponse) and config flag, cleaned global type aliases.
- Added meta dispatcher (ASSIGNED, START ERROR, CANCEL REQUESTED/FAILED) before buffering lines.
- Simplified auth: query token only (Bearer prefix stripped if present).
- Updated constants: removed `COMMAND_WS_BASE_PATH` (fixed path, no variants needed).
- Reduced surface area for race conditions & handshake failures.

### Admin Credentials (DB Seed + Management) - 2025-09-26

- Added SQLite-backed `users` table with automatic schema init in `server/plugins/db-init.ts`.
- Seeds default admin credentials (`admin` / `admin`) only if DB empty; flagged with `is_default`.
- Replaced env-based credential check with DB lookup & SHA-256 hashed password.
- New auth endpoints: `GET /api/auth/credentials` (status) & `PUT /api/auth/credentials` (update & clear default flag).
- Added composable `useAdminCredentials` for reactive status + update.
- UI components: `DefaultCredentialsWarning` (global banner) and `AdminCredentialsForm` (update credentials) integrated into settings page & default layout.
- Warning auto-dismisses after credentials updated; persists across pages until resolved.
- Removed requirement to set admin credentials in `.env`, DB file remains gitignored.
- Follow-up: add password strength validation & optional forced change at first login.

### Auth Hardening (Signed Tokens) - 2025-09-26

- Implemented HMAC-SHA256 signed tokens (format: base64(payload).hex(hmac)).
- Backward compatible: legacy unsigned tokens accepted until clients refresh.
- Warning logged (console.warn) if `authSecret` unset; unsigned tokens issued in that case.
- Added timing-safe signature verification.
- Payload version field `v:1` included for future migrations.
