import { appDescription } from './constants'

export default defineAppConfig({
  head: {
    viewport: 'width=device-width,initial-scale=1',
    link: [
      { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
      { rel: 'icon', type: 'image/svg+xml', href: '/nuxt.svg' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    ],
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: appDescription },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'theme-color', media: '(prefers-color-scheme: light)', content: 'white' },
      { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#222222' },
    ],
  },

  ui: {
    colors: {
      primary: 'cyan',
      secondary: 'purple',
      neutral: 'zinc',
      success: 'teal',
      info: 'blue',
      warning: 'yellow',
      error: 'pink',
    },
    button: {
      slots: {
        base: 'font-medium',
      },
    },
    input: {
      variants: {
        variant: {
          outline: 'text-highlighted bg-white dark:bg-neutral-950 ring ring-inset ring-accented',
        },
      },
    },
  },
})
