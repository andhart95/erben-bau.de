// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Microsite-Rebuild von erben-bau.de — deploy auf erbenbau.voyagedigital.de (noindex).
export default defineConfig({
  site: 'https://erbenbau.voyagedigital.de',
  vite: {
    plugins: [tailwindcss()],
  },
});
