// @ts-check
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import expressiveCode from 'astro-expressive-code'
import remarkMermaid from 'remark-mermaidjs'

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.kyana.dev',
  markdown: {
    remarkPlugins: [remarkMermaid],
  },
  integrations: [
    expressiveCode({
      themes: ['github-dark'],
    }),
    mdx(),
    sitemap(),
  ],
})
