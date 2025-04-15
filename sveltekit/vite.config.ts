import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
	  proxy: {
		'/store': {
		  target: 'http://localhost:9000', // Your Medusa backend URL
		  changeOrigin: true,
		  secure: false
		}
	  }
	}
  });