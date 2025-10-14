import { html, render as litRender } from "lit-html";
import { apiFetch } from "../api/api.js";
import { getCurrentUser } from "../util/auth.js";
import { addToast } from "../util/toast.js";

// DOM element references
let section;
let form, firstName, lastName, universityNo, emailInput, passwordInput, repasswordInput;
let isInitialized = false;

export function renderProfile() {
  section = document.getElementById("profile");
  if (!section) return;

  litRender(html`
    <div class="card-header">
      <h2 class="card-title">Profile</h2>
      <div class="card-subtitle">View and update your personal information</div>
    </div>
    <div class="card">
      <form id="profileForm" class="profile-form" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md); align-items: end;">
        <div class="form-group">
          <label class="form-label">First Name</label>
          <input id="firstName" class="form-input form-input-full" type="text" placeholder="First Name" readonly>
        </div>
        <div class="form-group">
          <label class="form-label">Last Name</label>
          <input id="lastName" class="form-input form-input-full" type="text" placeholder="Last Name" readonly>
        </div>
        <div class="form-group">
          <label class="form-label">University Number</label>
          <input id="universityNo" class="form-input form-input-full" type="text" placeholder="University No" readonly>
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input id="email" class="form-input form-input-full" type="email" placeholder="Email" readonly>
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input id="password" class="form-input form-input-full" type="password" placeholder="New Password">
        </div>
        <div class="form-group">
          <label class="form-label">Confirm Password</label>
          <input id="confirmPassword" class="form-input form-input-full" type="password" placeholder="Confirm New Password">
        </div>
        <div class="form-group" style="grid-column: 1 / -1; display:flex; justify-content:center;">
          <button id="saveProfileBtn" class="btn btn-primary" type="submit">Save Changes</button>
        </div>
      </form>
    </div>
  `, section);

  // Initialize DOM elements and event listeners if not already initialized
  if (!isInitialized) {
    initializeDOMElements();
    setupEventListeners();
    isInitialized = true;
    prefillProfile();
  } 
  
}

function initializeDOMElements() {
  form = document.getElementById('profileForm');
  firstName = document.getElementById('firstName');
  lastName = document.getElementById('lastName');
  universityNo  = document.getElementById('universityNo');
  emailInput = document.getElementById('email');
  passwordInput = document.getElementById('password');
  repasswordInput = document.getElementById('confirmPassword');  
}

function setupEventListeners() {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      const password = passwordInput?.value || '';
      const confirm = repasswordInput?.value || '';
      if ((password || confirm) && password !== confirm) { addToast('Validation Error', 'Passwords do not match.'); return; }
      
      let user = window.currentUser || await getCurrentUser();
      const users = /** @type {any} */ (user);
      if (users && !users.ssoId && users.userId) {
         user = await apiFetch('GET', `/api/User/${users.userId}`); 
      }
      if (!user) { addToast('Not found', 'No user found with that email.'); return; }

      const u = /** @type {any} */ (user);
      const updated = { ...u };
      //update to new password
      if (password) updated.password = password;    
      await apiFetch('PUT', `/api/User/${u.userId}`, { body: updated });
      addToast('Success', 'Profile updated successfully');
      window.currentUser = await getCurrentUser(); 
      
    } catch (e) {
      addToast('Error', 'Failed to update profile.');
    }
  });
}

//User details loaded into profile ppage fields populated from database
async function prefillProfile() {
  
    let user = window.currentUser || await getCurrentUser();
    const users = /** @type {any} */ (user);
    if (users && !users.displayName && users.userId) {
      const full = await apiFetch('GET', `/api/User/${users.userId}`);
      if (full) user = full;
    }

    if (!user) return;

    const u = /** @type {any} */ (user);
    if (firstName) firstName.value = u.firstName || u.givenName || (u.displayName ? (u.displayName.split(' ')[0] || '') : '') || '';
    if (lastName) lastName.value = u.lastName || u.surname || (u.displayName ? u.displayName.split(' ').slice(1).join(' ') : '') || '';
    if (universityNo) universityNo.value = u.ssoId || u.universityNo || u.studentNumber || '';
    if (emailInput) emailInput.value = u.email || '';
      
    
  }

