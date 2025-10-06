import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    open: '/Login.html', // Open the login page by default
    proxy: {
      '/api': {
  target: 'http://localhost:8000', // Updated to match backend port
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
