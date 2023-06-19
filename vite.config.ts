import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	css: {
		preprocessorOptions: {
			scss: {}
		}
	},
	resolve: {
		alias: {
			'~bootstrap': fileURLToPath(new URL('node_modules/bootstrap', import.meta.url))
		}
	}
});