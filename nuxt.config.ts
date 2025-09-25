import { pwa } from './app/config/pwa'

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/content',
    '@sidebase/nuxt-auth',
  ],

  imports: {
    // Ensure all files under /types are scanned for type auto import side-effects
    dirs: ['types'],
  },

  devtools: {
    enabled: true,
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    authSecret: '',
    authAdminUsername: '',
    authAdminPassword: '',
    sshPrivateKeySecret: '', // NUXT_SSH_PRIVATE_KEY_SECRET (min 32 chars) used for encrypting SSH private key
  },

  alias: {
    '@/types': './types',
  },

  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
  },

  compatibilityDate: '2024-08-14',

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: false,
      routes: ['/'],
    },
    experimental: {
      database: true,
    },
    database: {
      default: {
        connector: 'sqlite',
        options: { name: 'db' }, // stored at .data/db.sqlite3
      },
    },
  },

  auth: {
    baseURL: '/api/auth',
    globalAppMiddleware: true,
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/login', method: 'post' },
        signOut: { path: '/logout', method: 'post' },
        getSession: { path: '/session', method: 'get' },
      },
      pages: {
        login: '/login',
      },
      token: {
        signInResponseTokenPointer: '/token',
        type: 'Bearer',
        headerName: 'Authorization',
        maxAgeInSeconds: 60 * 60 * 24, // 24 hours
        sameSiteAttribute: 'lax',
      },
    },
  },

  eslint: {
    config: {
      standalone: false,
      nuxt: {
        sortConfigKeys: true,
      },
    },
  },

  pwa,
})
