// @ts-check
import antfu from '@antfu/eslint-config'
import tailwindcss from 'eslint-plugin-tailwindcss'
import nuxt from './.nuxt/eslint.config.mjs'

export default antfu(
  {
    formatters: true,
    pnpm: true,
  },
)
  .append(nuxt())
  .append({
    plugins: {
      tailwindcss,
    },
    rules: {
      'tailwindcss/classnames-order': 'warn',
      'tailwindcss/enforces-negative-arbitrary-values': 'warn',
      'tailwindcss/enforces-shorthand': 'warn',
      'tailwindcss/no-contradicting-classname': 'off', // Disabled for Tailwind v4 compatibility
      'tailwindcss/no-custom-classname': 'off', // Allow custom classes for Nuxt UI
      'tailwindcss/no-unnecessary-arbitrary-value': 'warn',
    },
    settings: {
      tailwindcss: {
        config: false, // Disable config path requirement for Nuxt UI
        callees: ['cn', 'cva'],
        classRegex: '^class(Name)?$',
      },
    },
  })
