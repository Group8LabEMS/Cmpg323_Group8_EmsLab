document.addEventListener('DOMContentLoaded', async function() {
  // Check if already logged in
  try {
    const res = await fetch('http://localhost:8000/api/Auth/me', { credentials: 'include' });
    if (res.ok) { window.location.href = 'index.html'; return; }
  } catch (err) { /* Not logged in, continue */ }

  const form = document.getElementById('loginForm');
  if (!form) return;
  form.onsubmit = async function(e) {
    e.preventDefault();

    const username = form.username.value.trim();
    const password = form.password.value.trim();

    try {
      const res = await fetch('http://localhost:8000/api/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });
      if (res.ok) { window.location.href = 'index.html'; }
      else { alert('Invalid username or password.'); }
    }
    catch (err) { alert('Login failed.'); }
  };
});
