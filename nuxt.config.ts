import { pwa } from './app/config/pwa'
import { appDescription } from './app/constants/index'

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
    '@nuxt/eslint',
    '@nuxt/ui-pro',
    '@sidebase/nuxt-auth',
  ],

  imports: {
    // Ensure all files under /types are scanned for type auto import side-effects
    dirs: ['types'],
  },

  devtools: {
    enabled: true,
  },

  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/nuxt.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: appDescription },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: 'white' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#222222' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    authSecret: '',
    authAdminUsername: '',
    authAdminPassword: '',
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
