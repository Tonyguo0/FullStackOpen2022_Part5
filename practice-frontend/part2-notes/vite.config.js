import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        outDir: './dist/notes',
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            },
        },
        host: 'localhost',
        watch: { usePolling: true },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: 'src/setupTests.js',
        css: true,
    },
    plugins: [react()],
});
