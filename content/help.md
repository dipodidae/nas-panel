---
title: Help & User Guide
description: How to configure, secure, and use the NAS Panel effectively.
---

# NAS Panel Help

Welcome to the built‑in help guide. This page explains the core concepts, initial setup, security considerations, and how to troubleshoot common issues.

## Overview

This application provides a thin, secure UI for running predefined (catalog) commands against a single remote host over **SSH**. It does **not** expose an arbitrary shell. Instead, it focuses on:

- Repeatable, safe execution
- Key‑based auth only
- Clear separation of configuration (Settings) and usage (Dashboard)

## Quick Start

1. Log in (or create a session if auth is enabled externally)
2. Go to **Settings** → Configure SSH host + username
3. Generate the SSH key pair (if not already)
4. Install the public key on the target server (see help under the key panel)
5. Test the connection until it reports success
6. Return to the main page and run catalog commands

> Until SSH is healthy, most command execution will fail or be disabled.

## SSH Configuration Recap

You only configure one remote endpoint. All commands use that session. Use a **non‑root** account and grant only the minimal permissions required. If you later need elevated operations, prefer adding narrowly scoped sudo rules instead of switching to `root`.

### Key Management

- Private key: Stored server‑side (encrypted) and never shown.
- Public key: Visible in the UI for copy/download.
- Rotation: Regenerate → Replace old line in `authorized_keys` → Retest.

## Command Catalog

The command list (UI section on the main page) is derived from a server‑side registry. Each command usually has:

- An identifier / name
- A description
- Optional parameters or modes (future enhancement)

Executed output streams back live via a WebSocket so you can monitor progress without waiting for completion.

## Security Principles

- Single SSH identity reduces surface area
- Key‑based auth only; no password storage
- Avoid privileged accounts; isolate what the panel can do
- Rotate keys periodically or after any suspicion of compromise
- Log out active sessions when not in use (if multi‑user deployment)

## Troubleshooting Checklist

| Symptom                       | Likely Cause                  | Quick Action                                           |
| ----------------------------- | ----------------------------- | ------------------------------------------------------ |
| Connection test fails         | Wrong host / firewall / DNS   | Try `ssh user@host` manually from server running panel |
| Test fails after key rotation | Old public key still in place | Replace line in `authorized_keys`, remove stale keys   |
| Commands stuck with no output | SSH session not established   | Re-test in Settings, reload page                       |
| Permission denied             | User lacks rights             | Adjust remote user perms / sudo rules                  |
| Latency spike                 | Network congestion            | Re-test later; verify route / VPN                      |

## FAQ

### Can I target multiple hosts?

Not currently—single target keeps complexity and risk low. Multiple profiles could be added in the future.

### Where is the private key stored?

Encrypted on the server hosting this panel. Only the public key is ever sent to the browser.

### Can I run arbitrary shell commands?

No. Only registered catalog commands execute. This protects you from unsafe ad‑hoc input.

### How do I revoke access?

Remove the public key line from the remote `authorized_keys` file and optionally rotate credentials inside the panel.

## Good Practices

- Keep the remote user’s home clean—remove stale keys after rotation.
- Monitor latency trends (re-test occasionally) to catch network issues early.
- Document what each catalog command does in your internal ops docs.
- Back up server‑side configuration/state regularly (including encrypted key store) if persistence matters.

## When Things Break

1. Re-test SSH in **Settings**
2. Confirm the remote host is reachable and SSH is running
3. Validate key presence + permissions (`~/.ssh` 700, `authorized_keys` 600)
4. Check server logs (future: structured logging export)
5. Regenerate key pair only if you suspect compromise or corruption

## Next Steps / Roadmap (Potential)

- Multiple host profiles
- Role-based command visibility
- Command parameterization & validation
- Connection health history / graphs
- Audit log export

If a feature here is critical for you, track it or open a ticket in the repository.

---

Need the SSH specifics? Head to the **Settings** page and use the inline & modal help there.
