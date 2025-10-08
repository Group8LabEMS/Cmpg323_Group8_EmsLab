import { html, render as litRender } from "lit-html";

// Global state
let users = [];
let editingUserIndex = null;
let pendingDeleteUserIndex = null;

// DOM element references
let userModal, userModalTitle, nameInput, surnameInput, universityNoInput, emailInput, cellInput, passwordInput, repasswordInput;
let confirmUserBtn, cancelUserBtn, userDeleteModal, userDeleteMessage, confirmUserDeleteBtn, cancelUserDeleteBtn;

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
                <button class="btn btn-sm btn-danger" @click=${() => openUserDeleteModal(i)}>Delete</button>
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
  userModalTitle.textContent = "User Profile";
  nameInput.value = "";
  surnameInput.value = "";
  universityNoInput.value = "";
  emailInput.value = "";
  cellInput.value = "";

  passwordInput.value = "";
  repasswordInput.value = "";
  userModal.classList.remove("hidden");
}

/**
 * Opens the Edit User modal dialog for a specific user.
 * @param {number} index - Index of the user to edit.
 */
function openEditUser(index) {
  editingUserIndex = index;
  userModalTitle.textContent = "User Profile";
  const u = users[index];
  // Split displayName into first and last if possible
  const [first, ...last] = (u.displayName || "").split(" ");
  nameInput.value = first || "";
  surnameInput.value = last.join(" ") || "";
  universityNoInput.value = u.ssoId || "";
  emailInput.value = u.email || "";
  cellInput.value = u.cell || "";

  passwordInput.value = u.password || "";
  repasswordInput.value = u.password || "";
  
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
        await fetch(`/api/User/${user.userId}`, { method: "DELETE" });
        await fetchUsers();
      } catch (e) {
        alert("Failed to delete user.");
      }
    }
    closeUserDeleteModal();
  }
}

// ---------- Actions ---------- //


// Setup event listeners after DOM is loaded
function setupEventListeners() {
  confirmUserBtn.addEventListener("click", async () => {
    const name = nameInput.value.trim();
    const surname = surnameInput.value.trim();
    const ssoId = universityNoInput.value.trim();
    const email = emailInput.value.trim();
    const cell = cellInput.value.trim();

    const password = passwordInput.value;
    const repassword = repasswordInput.value;
    const role = document.getElementById("roleInput") ? /** @type {HTMLSelectElement} */ (document.getElementById("roleInput")).value : "";

    if (!name || !surname || !ssoId || !email || !cell || !password || !repassword) {
      alert("All fields are required.");
      return;
    }
    if (password !== repassword) {
      alert("Passwords do not match.");
      return;
    }

    const userObj = {
      displayName: name + " " + surname,
      ssoId,
      email,
      password,
    };

    try {
      if (editingUserIndex !== null) {
        // Update
        const user = users[editingUserIndex];
        await fetch(`/api/User/${user.userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...user, ...userObj, userId: user.userId })
        });
      } else {
        // Create
        await fetch(`/api/User`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userObj)
        });
      }
      await fetchUsers();
      closeUserModal();
    } catch (e) {
      alert("Failed to save user.");
    }
  });

  cancelUserBtn.addEventListener("click", closeUserModal);
  confirmUserDeleteBtn.addEventListener("click", confirmUserDelete);
  cancelUserDeleteBtn.addEventListener("click", closeUserDeleteModal);
}

// --- API Integration --- //
async function fetchUsers() {
  try {
    const res = await fetch("/api/User");
    if (!res.ok) throw new Error("Failed to fetch users");
    users = await res.json();
    renderUsers();
  } catch (e) {
    users = [];
    renderUsers();
    alert("Could not load users from server.");
  }
}

// Initial load
window.addEventListener("DOMContentLoaded", () => {
  // Initialize DOM element references
  userModal            = document.getElementById("userModal");
  userModalTitle       = document.getElementById("userModalTitle");
  nameInput            = document.getElementById("nameInput");
  surnameInput         = document.getElementById("surnameInput");
  universityNoInput    = document.getElementById("universityNoInput");
  emailInput           = document.getElementById("emailInput");
  cellInput            = document.getElementById("cellInput");

  passwordInput        = document.getElementById("passwordInput");
  repasswordInput      = document.getElementById("repasswordInput");
  confirmUserBtn       = document.getElementById("confirmUser");
  cancelUserBtn        = document.getElementById("cancelUser");
  userDeleteModal      = document.getElementById("userDeleteModal");
  userDeleteMessage    = document.getElementById("userDeleteMessage");
  confirmUserDeleteBtn = document.getElementById("confirmUserDelete");
  cancelUserDeleteBtn  = document.getElementById("cancelUserDelete");
  
  setupEventListeners();
  fetchUsers();
});
