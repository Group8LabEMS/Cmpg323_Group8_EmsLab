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
        login: resolve(__dirname, 'Login.html'),
        register: resolve(__dirname, 'register.html'),
        about: resolve(__dirname, 'about_us.html'),
        contact: resolve(__dirname, 'contact_us.html'),
        forgot: resolve(__dirname, 'forgot_password.html'),
      },
    },
  },
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
