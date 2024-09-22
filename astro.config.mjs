// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import expressiveCode from 'astro-expressive-code'
import remarkMermaid from 'remark-mermaidjs';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.kyana.dev',
	markdown: {
		remarkPlugins: [remarkMermaid]
	},
	integrations: [expressiveCode(), mdx(), sitemap()],
});
