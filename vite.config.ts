import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // HMR is disabled in AI Studio via the DISABLE_HMR env var.
    // File watching is turned off there to prevent flicker during agent edits.
    hmr: process.env.DISABLE_HMR !== 'true',
  },
  build: {
    // Modern evergreen browsers — drops legacy polyfills, smaller output.
    target: 'es2022',
    rollupOptions: {
      output: {
        // Split the heaviest deps off the main chunk so the hero JS is small
        // and motion / lenis only download once across all lazy sections.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('react-dom') || id.match(/[\\/]react[\\/]/)) return 'vendor-react';
          if (id.includes('motion')) return 'vendor-motion';
          if (id.includes('lenis') || id.includes('vanilla-tilt')) return 'vendor-scroll';
          return 'vendor';
        },
      },
    },
  },
});
