import { html, render } from "lit";

let toastContainer;
let toasts = [];

function initToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
}

/**
 * Add a new toast notification
 * @param {string} title 
 * @param {string} desc 
 * @param {number} duration 
 */
export function addToast(title, desc, duration = 3000) {
  initToastContainer();
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  
  const progressBar = document.createElement('div');
  progressBar.className = 'toast-progress';
  
  render(html`
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-desc">${desc}</div>
    </div>
  `, toast);
  
  toast.appendChild(progressBar);
  toastContainer.insertBefore(toast, toastContainer.firstChild);
  toasts.unshift(toast);
  
  // Animate progress bar
  progressBar.style.animation = `toast-progress ${duration}ms linear`;
  
  // Remove toast after duration
  setTimeout(() => {
    toast.remove();
    toasts = toasts.filter(t => t !== toast);
  }, duration);
}

// Make addToast globally available
window.addToast = addToast;