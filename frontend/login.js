document.addEventListener('DOMContentLoaded', function() {
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
    try {
  const res = await fetch('http://localhost:5237/api/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('role', data.role);
        if (data.userId) {
          localStorage.setItem('userId', data.userId);
          localStorage.setItem('email', data.email);
          localStorage.setItem('name', data.name);
        }
        window.location.href = 'index.html';
      } else {
        alert('Invalid username or password.');
      }
    } catch (err) {
      alert('Login failed.');
    }
  };
});
