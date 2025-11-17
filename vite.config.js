import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src', // Set the root to the src directory
  build: {
    outDir: '../dist', // Output to a 'dist' folder in the project root
    emptyOutDir: true, // Empty the output directory on build
  },
});