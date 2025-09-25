# Clean Code Refactor Plan

This document tracks the application of Clean Code principles to the project. Refactor will be incremental and focused on clarity, cohesion, and testability.

## Goals

- Improve naming consistency and remove magic values.
- Isolate I/O & side-effects (process spawning, auth header parsing) from pure logic.
- Reduce duplication across API handlers (auth validation, error responses).
- Provide composables for repeated client logic (auth-derived display name, command stream management).
- Introduce tests targeting critical server utilities.
- Enhance lint rules to enforce parts of the Clean Code guideline automatically.

## Scope Overview

| Area                         | Issues Found                                                         | Planned Action                                                                             |
| ---------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| commandRegistry.ts           | Mixed concerns: spawn, buffering, serialization; magic numbers (500) | Extract constants, split push logic, add guard helpers, add stop/cleanup, pure line-mapper |
| WS handler                   | Inline parsing, duplicated buffer replay logic assumptions           | Wrap parsing & replay into helper, improve parameter validation                            |
| Auth endpoints               | Minimal validation, repeated token logic, weak error messages        | Centralize token decode/validation utility, consistent error factory                       |
| Components (Terminal, Index) | Mixed UI + connection mgmt, magic numbers (1000)                     | Stream logic consolidated into `Terminal.vue` (removed `useCommandStream` composable)      |
| Login & header               | Inline display name logic                                            | `useUserDisplayName` composable                                                            |
| Constants                    | Dispersed numeric literals                                           | Central `constants/app.ts` and `constants/server.ts`                                       |
| Testing                      | None currently                                                       | Add Vitest config + unit tests for command registry + token utils                          |

## New Files Planned

- `server/utils/constants.ts` – server-side constants (buffer sizes, env defaults)
- `server/utils/auth.ts` – token creation & validation utilities
- `server/utils/commandTypes.ts` – shared types for command structures
- `composables/useUserDisplayName.ts` – derive display name
- (Removed) `composables/useCommandStream.ts` – logic migrated into `Terminal.vue` for cohesion
- `tests/server/commandRegistry.test.ts` – process simulation tests (mock spawn)
- `tests/server/auth.test.ts` – token validation edge cases

## Constants

```
BUFFER_MAX_LINES = 500            # server buffer
CLIENT_MAX_LINES = 1000           # UI retained lines
COMMAND_WS_BASE = '/api/ws/command'
```

## API Improvements

- All handlers use a shared `requireAuth(event)` returning session or throwing 401.
- Standard error surface: `{ statusCode, statusMessage }` with clearer messages.

## Component Improvements

- `Terminal.vue` becomes presentational only; streaming moved to composable.
- Index page simplified to call composable `startCommand(key)`.

## Testing Strategy

- Mock child process: simulate stdout/stderr, close, error events.
- Ensure buffer trimming behavior.
- Ensure WebSocket replay order logic via helper unit test (pure function for framing lines).

## Lint/Quality Enhancements

Rules to enable/add (if not already via existing config):

- no-magic-numbers (tolerate small [-1, 0, 1])
- complexity (default threshold 10)
- consistent-return
- max-lines-per-function (enforce small handlers)

## Incremental Steps

1. Add constants/types/util helpers (non-breaking).
2. Refactor command registry to use them.
3. Refactor auth utilities (token encode/decode) while keeping same external contract.
4. Adjust API endpoints to use helpers.
5. Introduce composables & refactor components.
6. Add tests & Vitest setup.
7. Strengthen ESLint config.
8. Final cleanup & docs.

## Risks & Mitigations

- Behavior regression: Mitigate with unit tests after step 2 before further refactors.
- Over-abstraction: Keep helpers small & focused; avoid premature generalization.
- Token logic remains insecure (base64) by design; clearly documented.

## Out of Scope (Future Work)

- Real JWT signing & verification.
- Command cancellation & concurrency limits.
- Multi-command UI with persistent history.

---

This file will be updated as refactor progresses.
