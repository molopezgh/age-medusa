// File: sveltekit/vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    // Make sure to use 127.0.0.1 here, not “localhost”
    proxy: {
      '/store': {
        target: 'http://127.0.0.1:9000',
        changeOrigin: true,
        secure: false
      },
      '/admin': {
        target: 'http://127.0.0.1:9000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
