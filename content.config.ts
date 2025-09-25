import { defineCollection, defineContentConfig } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    // Primary collection including all markdown files in /content (recursive)
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
    }),
    // (Optional) retain snippets collection if you later move snippet-specific files
    // snippets: defineCollection({
    //   type: 'page',
    //   source: 'snippets/**/*.md'
    // })
  },
})
