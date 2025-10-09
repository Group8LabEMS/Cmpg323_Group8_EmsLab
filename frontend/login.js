import { apiFetch } from './src/api/api.js';

document.addEventListener('DOMContentLoaded', async function() {
  // Check if already logged in
  try {
    await apiFetch('GET', '/api/Auth/me');
    window.location.href = 'index.html';
    return;
  } catch (err) { /* Not logged in, continue */ }

  const form = document.getElementById('loginForm');
  if (!form) return;
  form.onsubmit = async function(e) {
    e.preventDefault();

    const username = form.username.value.trim();
    const password = form.password.value.trim();

    try {
      await apiFetch('POST', '/api/Auth/login', {
        body: { username, password }
      });
      window.location.href = 'index.html';
    }
    catch (err) { alert('Invalid username or password.'); }
  };
});
