// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.erben-bau.de',
  integrations: [
    sitemap({
      // Rechtsseiten: noindex + kein Sitemap-Eintrag
      filter: (page) => !page.includes('/datenschutz/') && !page.includes('/impressum/'),
      lastmod: new Date(),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
