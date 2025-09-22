export default defineAppConfig({
  ui: {
    colors: {
      // Map aliases to palettes (must match defined or default Tailwind names)
      primary: 'primary', // our custom phosphor green palette
      neutral: 'neutral',
      // Keep other defaults implicit (success, info, warning, error)
    },
    button: {
      // Slightly denser buttons for terminal feel
      slots: {
        base: 'font-medium tracking-tight',
      },
      variants: {
        size: {
          md: {
            base: 'h-9 px-3 text-[13px]',
          },
        },
      },
    },
    card: {
      slots: {
        root: 'bg-elevated/70 ring-1 ring-default divide-default/70 divide-y rounded-md',
      },
    },
  },
})
