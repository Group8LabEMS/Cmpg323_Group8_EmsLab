import { html, render as litRender } from "lit-html";
import { apiFetch } from "../api/api.js";
import { addToast } from "../util/toast.js";

// Global state
let users = [];
let editingUserIndex = null;
let pendingDeleteUserIndex = null;

// DOM element references
let userModal, userModalTitle, displayNameInput, universityNoInput, emailInput, passwordInput, repasswordInput;
let confirmUserBtn, cancelUserBtn, userDeleteModal, userDeleteMessage, confirmUserDeleteBtn, cancelUserDeleteBtn;
let isInitialized = false;

// ---------- Render ---------- //
// --- UI State ---
let searchTerm = "";
let sortKey = "name";
let sortAsc = true;

function handleSearch(e) { searchTerm = e.target.value; renderUsers(); }
function handleSort(e)   { sortKey = e.target.value;    renderUsers(); }
function toggleSortDir() { sortAsc = !sortAsc;          renderUsers(); }

function getFilteredSortedList() {
  let list = [...users];
  if (searchTerm)
    list = list.filter(u =>
      (u.displayName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.ssoId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.role || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  list.sort((a, b) => {
    let v1 = a[sortKey]?.toLowerCase?.() || a[sortKey];
    let v2 = b[sortKey]?.toLowerCase?.() || b[sortKey];
    if (v1 < v2) return sortAsc ? -1 : 1;
    if (v1 > v2) return sortAsc ? 1 : -1;
    return 0;
  });
  return list;
}

export function renderUsers() {
  const section = document.getElementById("userManagement");
  if (!section) return;
  
  // Initialize DOM elements and event listeners if not already initialized
  if (!isInitialized) {
    initializeDOMElements();
    setupEventListeners();
    isInitialized = true;
    fetchUsers();
  }

  litRender(html`
    <div class="card-header">
      <h2 class="card-title">User Management</h2>
      <div class="card-subtitle">View, add, update and delete users.</div>
    </div>
    <div class="card">
      <div class="controls-container">
        <div class="controls-left">
          <button class="btn btn-primary" @click=${openAddUser}>Create User</button>
        </div>
        <div class="controls-right">
          <select @change=${handleSort} class="form-select">
            <option value="displayName">Sort by</option>
            <option value="displayName">Name</option>
            <option value="ssoId">University No</option>
            <option value="email">Email</option>
            <option value="role">Role</option>
          </select>
          <button class="btn btn-primary" @click=${toggleSortDir}>
            <span>${sortAsc ? "\u25B2" : "\u25BC"}</span>
          </button>
          <input type="text" placeholder="Search ..." @input=${handleSearch} value=${searchTerm} class="form-input" />
          <button class="btn btn-primary">
            <span>&#128269;</span>
          </button>
          <button class="btn btn-primary filter-btn">
            <span>&#128465;</span> FILTER
          </button>
        </div>
      </div>
      <div class="table-container">
        <table class="table">
        <thead>
          <tr>
            <th>NAME</th>
            <th>UNIVERSITY NO</th>
            <th>EMAIL</th>
            <th>ROLE</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          ${getFilteredSortedList().map((u, i) => u.displayName ? html`
            <tr>
              <td><strong>${u.displayName}</strong></td>
              <td>${u.ssoId}</td>
              <td>${u.email}</td>
              <td>${u.role || ''}</td>
              <td>
                <button class="btn btn-sm btn-secondary" @click=${() => openEditUser(i)}>Update</button>
                <button class="btn btn-sm ${String(u.userId) === window.currentUser?.userId ? 'btn-disabled' : 'btn-danger'}" 
                        @click=${
                          () => String(u.userId) === window.currentUser?.userId
                            ? addToast("Nice try", "You cannot delete yourself")
                            : openUserDeleteModal(i)
                        }>Delete</button>
              </td>
            </tr>
          ` : html`<tr><td></td><td></td><td></td><td></td><td></td></tr>`)}
        </tbody>
        </table>
      </div>
    </div>
  `, section);
}

// ---------- Modal Handling ---------- //

function openAddUser() {
  editingUserIndex = null;
  userModalTitle.textContent = "Create User";
  displayNameInput.value = "";
  universityNoInput.value = "";
  emailInput.value = "";
  passwordInput.value = "";
  repasswordInput.value = "";
  
  // Show password fields for new user
  passwordInput.style.display = "block";
  repasswordInput.style.display = "block";
  
  userModal.classList.remove("hidden");
}

/**
 * Opens the Edit User modal dialog for a specific user.
 * @param {number} index - Index of the user to edit.
 */
function openEditUser(index) {
  editingUserIndex = index;
  userModalTitle.textContent = "Edit User";
  const u = users[index];
  displayNameInput.value = u.displayName || "";
  universityNoInput.value = u.ssoId || "";
  emailInput.value = u.email || "";
  
  // Set role value for editing
  const roleInput = /** @type {HTMLInputElement} */ (document.getElementById("roleInput"));
  if (roleInput) { roleInput.value = u.role || "Student"; }
  
  // Hide password fields for editing (passwords should be changed separately)
  passwordInput.style.display = "none";
  repasswordInput.style.display = "none";
  passwordInput.value = "";
  repasswordInput.value = "";
  
  userModal.classList.remove("hidden");
}

/**
 * Closes the user modal dialog.
 */
function closeUserModal() {
  userModal.classList.add("hidden");
}


/**
 * Opens the user delete confirmation modal.
 * @param {number} index - Index of the user to delete.
 */
function openUserDeleteModal(index) {
  pendingDeleteUserIndex = index;
  userDeleteMessage.textContent = `Are you sure you want to delete user '${users[index].displayName}'?`;
  userDeleteModal.classList.remove("hidden");
}

/**
 * Closes the user delete modal.
 */
function closeUserDeleteModal() {
  userDeleteModal.classList.add("hidden");
  pendingDeleteUserIndex = null;
}

/**
 * Confirms user deletion.
 */
async function confirmUserDelete() {
  if (pendingDeleteUserIndex !== null) {
    const user = users[pendingDeleteUserIndex];
    if (user && user.userId) {
      try {
        await apiFetch('DELETE', `/api/User/${user.userId}`, { responseType: 'void' });
        await fetchUsers();
        addToast('Success', 'User deleted successfully');
      } catch (e) {
        // Handle backend constraint violation
        const errorMsg = e?.message || e?.toString() || '';

        if (
          errorMsg.includes('FOREIGN KEY') || 
          errorMsg.includes('constraint') || 
          errorMsg.includes('Booking') ||
          (e.status === 409) // or if your API returns HTTP 409 Conflict
        ) {
          addToast(
            'Delete Blocked',
            'User cannot be deleted because they have an active booking.',
            3000
          );
        } else {
          addToast('Error', 'Failed to delete user.');
        }
      }
    }
    closeUserDeleteModal();
  }
}

// ---------- Actions ---------- //


// Initialize DOM element references
function initializeDOMElements() {
  userModal            = document.getElementById("userModal");
  userModalTitle       = document.getElementById("userModalTitle");
  displayNameInput     = document.getElementById("displayNameInput");
  universityNoInput    = document.getElementById("universityNoInput");
  emailInput           = document.getElementById("emailInput");
  passwordInput        = document.getElementById("passwordInput");
  repasswordInput      = document.getElementById("repasswordInput");
  confirmUserBtn       = document.getElementById("confirmUser");
  cancelUserBtn        = document.getElementById("cancelUser");
  userDeleteModal      = document.getElementById("userDeleteModal");
  userDeleteMessage    = document.getElementById("userDeleteMessage");
  confirmUserDeleteBtn = document.getElementById("confirmUserDelete");
  cancelUserDeleteBtn  = document.getElementById("cancelUserDelete");
}

// Setup event listeners
function setupEventListeners() {
  confirmUserBtn.addEventListener("click", async () => {
    const displayName = displayNameInput.value.trim();
    const ssoId = universityNoInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const repassword = repasswordInput.value;
    const role = document.getElementById("roleInput") ? /** @type {HTMLSelectElement} */ (document.getElementById("roleInput")).value : "Student";

    if (!displayName || !ssoId || !email) {
      addToast('Validation Error', 'Display name, university number, and email are required.');
      return;
    }

    // For new users, password is required
    if (editingUserIndex === null) {
      if (!password || !repassword) {
        addToast('Validation Error', 'Password is required for new users.');
        return;
      }
      if (password !== repassword) {
        addToast('Validation Error', 'Passwords do not match.');
        return;
      }
    }

    // For existing users, only validate password if provided
    if (editingUserIndex !== null && password && password !== repassword) {
      addToast('Validation Error', 'Passwords do not match.');
      return;
    }

    const userObj = { displayName, ssoId, email, role };

    // Only include password if provided
    if (password) {
      userObj.password = password;
    }

    try {
      if (editingUserIndex !== null) {
        // Update
        const user = users[editingUserIndex];
        await apiFetch('PUT', `/api/User/${user.userId}`, { body: userObj });
      } else {
        // Create
        await apiFetch('POST', `/api/User?role=${encodeURIComponent(role)}`, { body: userObj });
      }
      await fetchUsers();
      closeUserModal();
      addToast('Success', editingUserIndex !== null ? 'User updated successfully' : 'User created successfully');
    } catch (e) {
      addToast('Error', 'Failed to save user.');
    }
  });

  cancelUserBtn.addEventListener("click", closeUserModal);
  confirmUserDeleteBtn.addEventListener("click", confirmUserDelete);
  cancelUserDeleteBtn.addEventListener("click", closeUserDeleteModal);
}

// --- API Integration --- //
async function fetchUsers() {
  try {
    users = await apiFetch('GET', '/api/User');
    renderUsers();
  } catch (e) {
    users = [];
    renderUsers();
    addToast('Error', 'Could not load users from server.');
  }
}


