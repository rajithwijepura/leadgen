import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Your backend server address
        changeOrigin: true,
        secure: false, // If your backend is not HTTPS
        // rewrite: (path) => path.replace(/^\/api/, ''), // Optional: if you need to remove /api prefix
      },
    },
  },
});
