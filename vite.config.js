import { defineConfig } from 'vite';
import { resolve } from 'path';
import netlifyPlugin from '@netlify/vite-plugin';

export default defineConfig({
  root: 'src', // Your source files are here
  publicDir: 'public',
  plugins: [netlifyPlugin()],
  build: {
    outDir: '../dist', // Output goes here
    emptyOutDir: true, // Cleans the dist folder before building
    rollupOptions: {
      input: {
        // 1. The Main Homepage
        main: resolve(__dirname, 'src/index.html'),

        // 2. The Inner Pages (in the /pages/ folder)
        about: resolve(__dirname, 'src/pages/about.html'),
        work: resolve(__dirname, 'src/pages/our-work.html'),
        getInvolved: resolve(__dirname, 'src/pages/get-involved.html'),

        // 3. The State Pages (in the root of src/)
        comingSoon: resolve(__dirname, 'src/coming-soon.html'),
        notFound: resolve(__dirname, 'src/404.html'),
        offline: resolve(__dirname, 'src/offline.html'),
      },
    },
  },
});