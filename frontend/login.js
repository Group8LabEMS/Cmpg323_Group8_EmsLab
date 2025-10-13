import { apiFetch } from './src/api/api.js';
import './src/util/toast.js';

document.addEventListener('DOMContentLoaded', async function() {
  // Check if already logged in
  try {
    await apiFetch('GET', '/api/Auth/me');
    window.location.href = 'index.html';
    return;
  } catch (err) { /* Not logged in, continue */ }

  const form = document.getElementById('loginForm');
  if (!form) return;

  // if user is already logged in, redirect to index
  if (localStorage.getItem('role') && localStorage.getItem('userId')) {
    window.location.href = 'index.html';
    return;
  }

  form.onsubmit = async function(e) {
    e.preventDefault();

    const username = form.username.value.trim();
    const password = form.password.value.trim();

    if (!username || !password) {
      addToast('Login Failed', 'Please enter both username and password', 2000);
      return;
    }

    try {
      await apiFetch('POST', '/api/Auth/login', { body: { username, password } });
      addToast('Login Successful', 'Welcome back! Redirecting...', 2000);
      setTimeout(() => window.location.href = 'index.html', 1000);
    }
    catch (err) {
      const status = String(err).includes("status:") ? Number(String(err).split("status:").at(-1).trim()) : 0;
      if (status === 401) {
        addToast('Authentication Failed', 'Invalid username or password. Please check your credentials.', 3000);
      } else if (status === 429) {
        addToast('Too Many Attempts', 'Please wait before trying again.', 3000);
      } else if (status >= 500) {
        addToast('Server Error', 'Unable to connect to server. Please try again later.', 3000);
      } else if (status === 0) {
        addToast('Connection Error', 'No internet connection. Please check your network.', 3000);
      } else {
        addToast('Login Failed', 'An unexpected error occurred. Please try again.', 3000);
      }
    }
  };
});
