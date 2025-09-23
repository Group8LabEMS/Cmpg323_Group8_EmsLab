// ---------- State ---------- //
let users = [
  { username: "john_doe", role: "Admin", status: "Active" },
  { username: "jane_smith", role: "User", status: "Inactive" }
];

let editingUserIndex = null;

// ---------- DOM Refs ---------- //
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
  userTableBody.replaceChildren();

  users.forEach((u, i) => {
    const row = document.createElement("tr");

    // Username
    const userTd = document.createElement("td");
    userTd.textContent = u.username;
    row.appendChild(userTd);

    // Role
    const roleTd = document.createElement("td");
    roleTd.textContent = u.role;
    row.appendChild(roleTd);

    // Status
    const statusTd = document.createElement("td");
    statusTd.textContent = u.status;
    row.appendChild(statusTd);

    // Actions
    const actionTd = document.createElement("td");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "action-book"; 


    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "action-book";

    actionTd.appendChild(editBtn);
    actionTd.appendChild(deleteBtn);
    row.appendChild(actionTd);

    userTableBody.appendChild(row);
  });
}

// ---------- Modal Handling ---------- //
function openAddUser() {
  editingUserIndex = null;
  userModalTitle.textContent = "Add User";
  usernameInput.value = "";
  roleInput.value = "User";
  statusInput.value = "Active";
  userModal.classList.remove("hidden");
}

function openEditUser(index) {
  editingUserIndex = index;
  userModalTitle.textContent = "Edit User";
  const u = users[index];
  usernameInput.value = u.username;
  roleInput.value = u.role;
  statusInput.value = u.status;
  userModal.classList.remove("hidden");
}

function closeUserModal() {
  userModal.classList.add("hidden");
}

// ---------- Actions ---------- //
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

cancelUserBtn.addEventListener("click", closeUserModal);
addUserBtn.addEventListener("click", openAddUser);

function deleteUser(index) {
  if (confirm("Are you sure you want to delete this user?")) {
    users.splice(index, 1);
    renderUsers();
  }
}
