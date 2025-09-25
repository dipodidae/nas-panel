# NAS Panel

A full-stack Nuxt 4 application providing a minimal administrative panel for executing whitelisted server commands with real-time streaming output, cancellation, and command history.

NAS Panel is a security-focused server management tool that allows you to execute predefined shell commands through a web interface. It features live command output streaming, graceful process cancellation, execution history, and authentication, all built on modern web technologies.

Key features include:

- Whitelisted command catalog with server-side validation
- Real-time stdout/stderr streaming over WebSocket
- Command cancellation with graceful SIGTERM handling
- Execution history with exit codes and timestamps
- Authentication middleware for API routes and WebSocket endpoints
- Progressive Web App (PWA) support with offline caching
- Strongly typed TypeScript architecture with centralized domain types

---

## Getting Started

Use the following commands to set up the project locally:

```bash
git clone <repository-url>
cd nas-panel
pnpm install
pnpm dev
```

The application will be available at `http://localhost:3000`.

For PWA functionality during development:

```bash
pnpm dev:pwa
```

## Development

The project uses a modern development stack with comprehensive tooling:

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
pnpm typecheck    # TypeScript type checking
```

## Architecture

NAS Panel is built with a layered architecture focusing on type safety and maintainability:

- **UI Layer**: Focused components for command output, history, and controls
- **State Management**: Pinia stores managing command state and execution history
- **API Layer**: RESTful endpoints for command operations with WebSocket streaming
- **Type System**: Centralized TypeScript definitions with ambient global types
- **Security**: Authentication middleware protecting all command operations

The command execution flow starts with user selection from a predefined catalog, spawns server processes with real-time output streaming, and maintains comprehensive execution history.

## Configuration

Runtime configuration is managed through environment variables:

```
NUXT_AUTH_SECRET=your-secret-key
NUXT_AUTH_ADMIN_USERNAME=admin
NUXT_AUTH_ADMIN_PASSWORD=password

# Required for SSH key generation & encryption (min 32 chars)
NUXT_SSH_PRIVATE_KEY_SECRET=32+_character_random_string_here________________
```

Notes:

- `NUXT_SSH_PRIVATE_KEY_SECRET` is used to symmetrically encrypt the generated SSH private key at rest (AES-256-GCM). If it is missing or shorter than 32 characters, keypair generation will fail with: `NUXT_SSH_PRIVATE_KEY_SECRET missing or too short (min 32 chars)`.
- In production, generate a high-entropy value (e.g. from a password manager or `openssl rand -base64 48`).
- Changing the secret after keys are generated invalidates the stored encrypted private key (you would need to force-regenerate the keypair).

All configuration values are server-side only and not exposed to the client.

## Security

Security is a core principle of NAS Panel:

- Only whitelisted commands can be executed through server-side validation
- Commands inherit the hosting process permissions
- Authentication guards all API endpoints and WebSocket connections
- Output is sanitized and treated as plain text to prevent injection attacks

## Deployment

### Docker

Multi-stage Dockerfile for containerized deployment:

```bash
docker build -t nas-panel .
docker run -p 3000:3000 nas-panel
```

### Manual Deployment

Build and deploy the Nitro server output:

```bash
pnpm build
pnpm start
```
