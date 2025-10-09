import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    // Default location for serving static content in ASP.NET
    outDir: '../Backend/Group8.LabEms.Api/Group8.LabEms.Api/wwwroot',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        forgot: resolve(__dirname, 'forgot_password.html'),
      },
    },
  },
  server: {
    open: '/login.html', // Default page
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
