---
title: SSH Settings Help
---

## Why SSH Settings Matter

- Secure transport: All command execution happens over an authenticated SSH channel instead of ad‑hoc HTTP endpoints or exposed scripts.
- Least privilege: Point this at a dedicated, minimally‑privileged user.
- Key‑based only: The app generates and stores an encrypted private key server‑side; no passwords in the database.
- Observability: A successful test records latency so you can notice regressions.

## Prerequisites

1. Reachable host (IP / DNS)
2. User account on that host
3. Ability to edit `~/.ssh/authorized_keys`

## Basic Flow

1. Enter Host + Username → Save
2. Generate (or Regenerate) key pair
3. Copy / Download public key
4. Add to server `authorized_keys`
5. Test Connection until success

## Troubleshooting

- Host not reachable (network / DNS / firewall)
- Public key pasted with wrapped line / missing chars
- File permissions: `~/.ssh` = 700, `authorized_keys` = 600
- Unsupported key algorithm (enable rsa or ed25519)

## Key Rotation

Regenerating invalidates the prior private key. Remove or replace old lines in `authorized_keys` to avoid clutter.

## Security Notes

- Private key never leaves the server
- Avoid `root`; if needed, grant narrow sudo rules, not blanket access
- Rotate keys periodically or after suspected compromise

## After Success

Return to the dashboard and run catalog commands. If something later fails, retest here first—most issues are network, key removal, or the host being offline.

---

Need help adding the key? See the separate “Using the Public Key” snippet below the key panel.
