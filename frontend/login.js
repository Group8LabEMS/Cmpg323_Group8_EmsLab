document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');
  if (!form) return;
  form.onsubmit = async function(e) {
    e.preventDefault();
    const username = form.username.value.trim();
    const password = form.password.value.trim();
    try {
      const res = await fetch('/api/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('role', data.role);
        window.location.href = 'index.html';
      } else {
        alert('Invalid username or password.');
      }
    } catch (err) {
      alert('Login failed.');
    }
  };
});
