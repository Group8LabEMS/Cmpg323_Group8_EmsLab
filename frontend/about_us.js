document.addEventListener('DOMContentLoaded', function() {
  // if user is already logged in, redirect to index
  if (localStorage.getItem('role') && localStorage.getItem('userId')) {
    window.location.href = 'index.html';
    return;
  }
  //else load form and make login on header visable 



  const form = document.getElementById('aboutus_header');
  if (!form) return;




});
