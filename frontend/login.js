document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');
  if (!form) return;
  form.onsubmit = function(e) {
    e.preventDefault();
    const username = form.username.value.trim();
    const password = form.password.value.trim();
    // Demo: Admin/Admin = admin, User/User or user/user = user
    if (username === 'Admin' && password === 'Admin') {
      localStorage.setItem('role', 'admin');
      window.location.href = 'index.html';
    } else if ((username === 'User' && password === 'User') || (username === 'user' && password === 'user')) {
      localStorage.setItem('role', 'user');
      window.location.href = 'index.html';
    } else {
      alert('Invalid username or password. Use Admin/Admin or User/User or user/user');
    }
  };
});
