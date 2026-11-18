import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { sparklineAiApiPlugin } from './src/server/ai-proxy-middleware';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), sparklineAiApiPlugin()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-react': ['react', 'react-dom', 'react-router-dom'],
                    'vendor-charts': ['recharts'],
                    'vendor-icons': ['lucide-react'],
                },
            },
        },
        chunkSizeWarningLimit: 600,
    },
    server: {
        port: 5173,
        host: true,
    },
});
