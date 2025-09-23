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

// ---------- Render ---------- //
export function renderUsers() {
  const tableRows = users.map((u, i) => html`
    <tr>
      <td>${u.username}</td>
      <td>${u.role}</td>
      <td>${u.status}</td>
      <td>
        <button class="action-book user-action-btn" title="Edit user" @click=${() => openEditUser(i)}>Edit</button>
        <button class="action-delete user-action-btn" title="Delete user" @click=${() => handleDeleteUser(i)}>Delete</button>
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
 * Handles deleting a user from the list.
 * @param {number} index - Index of the user to delete.
 */
function handleDeleteUser(index) {
  if (confirm("Are you sure you want to delete this user?")) {
    users.splice(index, 1);
    renderUsers();
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
/**
 * Handles opening add user modal.
 */
addUserBtn.addEventListener("click", openAddUser);

function deleteUser(index) {
  if (confirm("Are you sure you want to delete this user?")) {
    users.splice(index, 1);
    renderUsers();
  }
}
