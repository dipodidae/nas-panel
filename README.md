<div align="center">

# Nuxt 4 + Nuxt UI Boilerplate

Modern, strongly‑typed, battery‑included Nuxt 4 starter focused on fast DX, clean conventions and production readiness — featuring Nuxt UI Pro components, PWA, server API routes, opinionated linting, and zero‑overhead Git hooks.

<p>
<sup>Nuxt 4 • Vite • TypeScript • Pinia • Nuxt UI Pro • VueUse • PWA • ESM • Simple Git Hooks</sup>
</p>

</div>

---

## 📌 Why this boilerplate?

You want to ship a Nuxt app that:

- Starts instantly (Vite + HMR) and typechecks cleanly
- Has a coherent UI system out of the box (Nuxt UI / UI Pro)
- Includes progressive enhancement (PWA + offline + auto update)
- Lets you mix SSR, static and API endpoints seamlessly (Nitro)
- Enforces code & commit quality without slowing you down
- Deploys easily to Docker, Netlify, or any Node host

This template gives you guarded defaults while staying minimal—remove what you don’t need without unraveling a framework stack.

---

## ✨ Feature Overview

| Category       | Included                                                  |
| -------------- | --------------------------------------------------------- |
| Framework      | Nuxt 4 (compatibility version 4 enabled)                  |
| Rendering      | Hybrid SSR / SSG (Nitro) + prerendered home route         |
| UI             | Nuxt UI Pro (component library + tokens)                  |
| State          | Pinia (auto-registered)                                   |
| Utilities      | VueUse / Auto imports                                     |
| PWA            | `@vite-pwa/nuxt` (auto update, fonts caching, offline)    |
| Type Safety    | TypeScript + `nuxt typecheck` + typed pages               |
| Linting        | ESLint (Antfu config + Tailwind plugin & formatting)      |
| Git Discipline | `simple-git-hooks` + `lint-staged` + Commitlint           |
| API            | Server routes under `server/api` (example: `pageview.ts`) |
| Styling        | Nuxt UI tokens + global CSS (`assets/css/main.css`)       |
| Tooling        | Nuxt DevTools enabled in dev                              |
| Docker         | Multi‑stage build for production SSR                      |

---

## � Project Structure (excerpt)

```
app/
  app.vue                # Root application shell
  components/            # Auto‑registered Vue components
  layouts/               # Layouts (default.vue)
  pages/                 # File‑based routing (index, counter, pageview)
  stores/                # Pinia stores (counter.ts)
  config/pwa.ts          # Central PWA module options
  constants/             # App name/description
assets/css/main.css      # Global styles
server/api/pageview.ts   # Example server endpoint
public/                  # Static assets (icons, manifest assets)
nuxt.config.ts           # Nuxt configuration
Dockerfile               # Production build (SSR)
netlify.toml             # Deployment config (see notes)
```

---

## 🚀 Quick Start

Create a new project via `degit`:

```bash
npx degit dipodidae/nuxt4-boilerplate-nuxt-ui my-nuxt-app
cd my-nuxt-app
pnpm install
pnpm dev
```

Open: http://localhost:3000

Enable PWA behavior in development (optional) with:

```bash
pnpm dev:pwa
```

---

## 🔧 Scripts

| Script                | Description                                                       |
| --------------------- | ----------------------------------------------------------------- |
| `pnpm dev`            | Start dev server (HMR)                                            |
| `pnpm dev:pwa`        | Dev with service worker (sets `VITE_PLUGIN_PWA=true`)             |
| `pnpm build`          | Production build (SSR / Nitro output in `.output`)                |
| `pnpm preview`        | Preview production build locally                                  |
| `pnpm generate`       | Generate static site (`dist/`) (experimental with current config) |
| `pnpm start`          | Run SSR server from `.output/server`                              |
| `pnpm start:generate` | Serve generated static assets from `.output/public`               |
| `pnpm lint`           | Run ESLint across project                                         |
| `pnpm typecheck`      | Run TypeScript / vue-tsc checks                                   |

---

## 🧩 Nuxt Modules Used

- `@nuxt/ui-pro` – Pro component suite (license required for private/commercial use—see Nuxt UI Pro terms)
- `@pinia/nuxt` – Store auto‑registration
- `@vueuse/nuxt` – Utility composables (auto‑imports)
- `@vite-pwa/nuxt` – PWA manifest + Workbox runtime caching
- `@nuxt/eslint` – Integrated linting command/module
- `@nuxt/devtools` – Enhanced developer tools overlay (dev only)

---

## 📱 PWA Details

Defined in `app/config/pwa.ts`:

- `registerType: autoUpdate` – Users get updates after SW install cycle
- Runtime caching for Google Fonts (365 days)
- Explicit icon set + maskable icon
- Navigation fallback excludes API routes (`/^\/api\//`)
- Dev mode opt‑in via `VITE_PLUGIN_PWA=true`

Production build automatically injects the manifest & service worker. In dev, use `pnpm dev:pwa` to approximate behavior.

---

## 🧪 API Example

The file `server/api/pageview.ts` demonstrates a simple JSON endpoint. All files under `server/api` automatically become routes (e.g. `/api/pageview`). You can add SSR logic, caching, and platform‑specific bindings via Nitro adapters if deploying to serverless.

---

## 🛠 Code Quality & Git Workflow

### Hooks

Implemented using `simple-git-hooks` (no extra Husky install phase):

| Hook         | Action                                                    |
| ------------ | --------------------------------------------------------- |
| `pre-commit` | `npx lint-staged` – Lint & format only staged files       |
| `commit-msg` | `npx commitlint --edit $1` – Enforce Conventional Commits |

Re‑apply hooks after editing config:

```bash
pnpm dlx simple-git-hooks
```

Skip temporarily:

```bash
git commit -m "wip" --no-verify
```

Disable for a session:

```bash
export SKIP_SIMPLE_GIT_HOOKS=1
```

### Lint Staged Pattern

Defined in `package.json` to run ESLint (with auto‑fix) on staged JS/TS/Vue/JSON/MD/CSS/YML files.

### Commit Message Examples

```
feat: add counter store example
fix: correct pageview endpoint schema
docs: rewrite README with deployment section
refactor: simplify layout wrapper
chore: bump dependencies
```

---

## 🧠 Type Safety

- Nuxt typed pages enabled (`experimental.typedPages: true`)
- `nuxt typecheck` script uses `vue-tsc`
- ESLint includes TypeScript rules via Antfu config

---

## 🔐 Environment Variables

Currently no required runtime env vars are defined. Add a `.env` (ignored) for secrets and reference using `useRuntimeConfig()` in Nuxt if needed. Example:

```
NUXT_PUBLIC_API_BASE=/api
NUXT_MY_SECRET=supersecret
```

Public variables must be prefixed with `NUXT_PUBLIC_` to be exposed client-side.

---

## 🐳 Docker (Production SSR)

The multi‑stage `Dockerfile` builds the app and runs the Nitro output:

1. Install dependencies with cached PNPM store
2. Build Nuxt -> `.output`
3. Run Node Alpine container exposing port 3000

Build & run:

```bash
docker build -t my-nuxt-app .
docker run -p 3000:3000 my-nuxt-app
```

---

## ☁️ Netlify Deployment (Important Note)

`netlify.toml` currently sets:

```
[build]
publish = "dist"
command = "pnpm run build"
```

`pnpm run build` produces `.output` (Nitro) NOT `dist`. If you want a static site, use `pnpm generate` and keep `publish = "dist"`. For SSR on Netlify you should instead:

1. Set `command = "pnpm run build"`
2. Use a Nitro preset (`NITRO_PRESET=netlify` env var) so Netlify functions get generated
3. Adjust `publish` to the generated public folder (usually `.output/public`)

Verify which deployment mode you prefer and update the file accordingly.

---

## 📦 Updating Dependencies

Nuxt & ecosystem updates:

```bash
npx nuxt upgrade --dedupe
```

Then run lint/typecheck to ensure nothing broke.

---

## 🧪 Testing (Not Included Yet)

No test framework is bundled (keeps template lean). Recommended options:

- Vitest for unit tests
- Playwright for E2E

Add a future `tests/` directory and integrate into `pre-commit` if desired.

---

## 🛣 Potential Roadmap Ideas

- Add Vitest + example component test
- Playwright E2E harness
- CI workflow (GitHub Actions) for lint + typecheck + build
- Storybook integration (or Nuxt UI playground)
- i18n (Nuxt I18n module)
- Sentry error reporting

---

## 🤔 FAQ

**Q: Why not UnoCSS or Tailwind directly?**
Nuxt UI provides design tokens + accessible components out of the box. You can still reintroduce utility engines later.

**Q: How do I add a new module?**
Install it, add to `modules` in `nuxt.config.ts`, restart dev server.

**Q: Static export vs SSR?**
Use `pnpm generate` for a mostly static site. Keep SSR for dynamic endpoints or personalization. You can prerender selective routes via `nitro.prerender` config (already set for `/`).

**Q: Where do I put composables?**
Create `composables/` (auto-imported) at project root or under `app/` depending on convention—Nuxt will pick them up.

**Q: How is page meta set?**
Global meta in `nuxt.config.ts` (`app.head`). Per-page meta via `<script setup> useSeoMeta({...})` or `definePageMeta`.

---

## 🛠 Recommended VS Code Extensions

- Volar (Vue Language Features) – Disable Vetur
- TypeScript Vue Plugin (bundled with Volar)
- ESLint
- Iconify IntelliSense (if editing icons)

---

## 🙌 Inspiration

- [vitesse-nuxt](https://github.com/antfu/vitesse-nuxt)
- [Nuxt UI](https://ui.nuxt.com/)
- Nuxt Docs & Nitro design philosophy

---
