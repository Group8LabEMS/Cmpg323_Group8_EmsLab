// ---------- State ---------- //
let users = [
  { username: "john_doe", role: "Admin", status: "Active" },
  { username: "jane_smith", role: "User", status: "Inactive" }
];

let editingUserIndex = null;

// ---------- DOM Refs ---------- //
import { html, render as litRender } from "lit";
const userTableBody = document.getElementById("userTableBody");
const userModal = document.getElementById("userModal");
const userModalTitle = document.getElementById("userModalTitle");

const usernameInput = /** @type {HTMLInputElement} */ (document.getElementById("usernameInput"));
const roleInput = /** @type {HTMLSelectElement} */ (document.getElementById("roleInput"));
const statusInput = /** @type {HTMLSelectElement} */ (document.getElementById("statusInput"));

const confirmUserBtn = document.getElementById("confirmUser");
const cancelUserBtn = document.getElementById("cancelUser");
const addUserBtn = document.getElementById("addUserBtn");

// User Delete Modal Refs
const userDeleteModal = document.getElementById("userDeleteModal");
const userDeleteMessage = document.getElementById("userDeleteMessage");
const confirmUserDeleteBtn = document.getElementById("confirmUserDelete");
const cancelUserDeleteBtn = document.getElementById("cancelUserDelete");
let pendingDeleteUserIndex = null;

// ---------- Render ---------- //
export function renderUsers() {
  const tableRows = users.map((u, i) => html`
    <tr>
      <td>${u.username}</td>
      <td>${u.role}</td>
      <td>${u.status}</td>
      <td>
        <button class="action-book user-action-btn" title="Edit user" @click=${() => openEditUser(i)}>Edit</button>
  <button class="action-delete-outline user-action-btn" title="Delete user" @click=${() => openUserDeleteModal(i)}>Delete</button>
      </td>
    </tr>
  `);
  litRender(html`${tableRows}`, userTableBody);
}

// ---------- Modal Handling ---------- //
/**
 * Opens the Add User modal dialog.
 */
function openAddUser() {
  editingUserIndex = null;
  userModalTitle.textContent = "Add User";
  usernameInput.value = "";
  roleInput.value = "User";
  statusInput.value = "Active";
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
  usernameInput.value = u.username;
  roleInput.value = u.role;
  statusInput.value = u.status;
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
  userDeleteMessage.textContent = `Are you sure you want to delete user '${users[index].username}'?`;
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
function confirmUserDelete() {
  if (pendingDeleteUserIndex !== null) {
    users.splice(pendingDeleteUserIndex, 1);
    renderUsers();
    closeUserDeleteModal();
  }
}

// ---------- Actions ---------- //
/**
 * Handles confirming add/edit user in modal.
 */
confirmUserBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const role = roleInput.value;
  const status = statusInput.value;

  if (!username) {
    alert("Username is required.");
    return;
  }

  if (editingUserIndex !== null) {
    // Update existing
    users[editingUserIndex] = { username, role, status };
  } else {
    // Add new
    users.push({ username, role, status });
  }

  renderUsers();
  closeUserModal();
});

/**
 * Handles canceling user modal.
 */
cancelUserBtn.addEventListener("click", closeUserModal);
addUserBtn.addEventListener("click", openAddUser);

// User delete modal actions
confirmUserDeleteBtn.addEventListener("click", confirmUserDelete);
cancelUserDeleteBtn.addEventListener("click", closeUserDeleteModal);
