// ---------- State ---------- //

let users = [];
let userRoles = [];

let editingUserIndex = null;

// ---------- DOM Refs ---------- //
import { html, render as litRender } from "lit";
const userTableBody = document.getElementById("userTableBody");
const userModal = document.getElementById("userModal");
const userModalTitle = document.getElementById("userModalTitle");

const nameInput = /** @type {HTMLInputElement} */ (document.getElementById("nameInput"));
const surnameInput = /** @type {HTMLInputElement} */ (document.getElementById("surnameInput"));
const universityNoInput = /** @type {HTMLInputElement} */ (document.getElementById("universityNoInput"));
const emailInput = /** @type {HTMLInputElement} */ (document.getElementById("emailInput"));
const cellInput = /** @type {HTMLInputElement} */ (document.getElementById("cellInput"));
const facultyInput = /** @type {HTMLInputElement} */ (document.getElementById("facultyInput"));
const departmentInput = /** @type {HTMLInputElement} */ (document.getElementById("departmentInput"));

const passwordInput = /** @type {HTMLInputElement} */ (document.getElementById("passwordInput"));
const repasswordInput = /** @type {HTMLInputElement} */ (document.getElementById("repasswordInput"));
const roleInput = /** @type {HTMLSelectElement} */ (document.getElementById("roleInput"));
let availableRoles = ["Student", "Administrator"];
let roleMap = {};

async function fetchRoles() {
  try {
    const res = await fetch("/api/Role");
    if (!res.ok) throw new Error("Failed to fetch roles");
    const roles = await res.json();
    if (Array.isArray(roles) && roles.length > 0) {
      availableRoles = roles.map(r => r.name || r.roleName || r);
      // Build a map of role name to role object for lookup
      roleMap = {};
      roles.forEach(r => {
        const name = r.name || r.roleName || r;
        roleMap[name] = r;
      });
    }
  } catch (e) {
    availableRoles = ["Student", "Admin"];
  }
  renderRoleDropdown();
}

function renderRoleDropdown() {
  const roleInput = document.getElementById("roleInput");
  if (!roleInput) return;
  roleInput.innerHTML = availableRoles.map(role => `<option value="${role}">${role}</option>`).join("");
}


const confirmUserBtn = document.getElementById("confirmUser");
const cancelUserBtn = document.getElementById("cancelUser");

// User Delete Modal Refs
const userDeleteModal = document.getElementById("userDeleteModal");
const userDeleteMessage = document.getElementById("userDeleteMessage");
const confirmUserDeleteBtn = document.getElementById("confirmUserDelete");
const cancelUserDeleteBtn = document.getElementById("cancelUserDelete");
let pendingDeleteUserIndex = null;

// ---------- Render ---------- //
// --- UI State ---
let searchTerm = "";
let sortKey = "name";
let sortAsc = true;

function handleSearch(e) {
  searchTerm = e.target.value;
  renderUsers();
}
function handleSort(e) {
  sortKey = e.target.value;
  renderUsers();
}
function toggleSortDir() {
  sortAsc = !sortAsc;
  renderUsers();
}

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
    <h2 style="color:#8d5fc5;font-size:2.5rem;margin-bottom:0.2rem;font-weight:bold;margin: 1rem -7%">User Management</h2>
    <div style="color:#8d5fc5;font-size:1.3rem;margin-bottom:0.5rem;margin: 1rem -7%">View, add, update and delete users.</div>
    <button style="float:right;margin-bottom:1.5rem;background:#8d5fc5;color:#fff;font-size:1.2rem;padding:0.7rem 2.5rem;border-radius:8px;border:none;box-shadow:0 2px 8px #bdbdbd;margin-right:4rem" @click=${openAddUser}>Create User</button>
    <div style="clear:both"></div>
    <div style="background:#fff;border-radius:20px;box-shadow:0 4px 15px #e0d3f3;padding:2rem 1.5rem 1.5rem 1.5rem;margin-left:-6.2rem;margin-right:4rem">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.2rem;">
        <div style="display:flex;align-items:center;gap:0.5rem;">
          <select @change=${handleSort} style="font-size:1.1rem;padding:0.4rem 2.2rem 0.4rem 1.2rem;border-radius:8px;border:2px solid #8d5fc5;background:#fff;color:#8d5fc5;font-weight:bold;">
            <option value="displayName">Sort by</option>
            <option value="displayName">Name</option>
            <option value="ssoId">University No</option>
            <option value="email">Email</option>
            <option value="role">Role</option>
          </select>
          <button style="background:#8d5fc5;color:#fff;padding:0.5rem 1.2rem;border-radius:8px;border:none;font-size:1.1rem;margin-left:0.5rem;display:flex;align-items:center;gap:0.3rem;" @click=${toggleSortDir}>
            <span style="font-size:1.2rem;">${sortAsc ? "\u25B2" : "\u25BC"}</span>
          </button>
        </div>
        <div style="display:flex;align-items:center;gap:0.5rem;">
          <input type="text" placeholder="Search ..." @input=${handleSearch} value=${searchTerm} style="font-size:1.1rem;padding:0.4rem 1.2rem;border-radius:8px;border:2px solid #8d5fc5;" />
          <button style="background:#8d5fc5;color:#fff;padding:0.5rem 1.2rem;border-radius:8px;border:none;font-size:1.1rem;display:flex;align-items:center;gap:0.3rem;">
            <span style="font-size:1.2rem;">&#128269;</span>
          </button>
          <button style="background:#8d5fc5;color:#fff;padding:0.5rem 1.2rem;border-radius:8px;border:none;font-size:1.1rem;display:flex;align-items:center;gap:0.3rem;">
            <span style="font-size:1.2rem;">&#128465;</span> FILTER
          </button>
        </div>
      </div>
      <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px #e0d3f3;">
        <thead>
          <tr style="background:#8d5fc5;color:#fff;">
            <th style="padding:1rem 0.5rem;">NAME</th>
            <th>UNIVERSITY NO</th>
            <th>EMAIL</th>
            <th>ROLE</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          ${getFilteredSortedList().map((u, i) => u.displayName ? html`
            <tr style="background:${i%2===1?'#f7f6fb':'#fff'};">
              <td>${u.displayName}</td>
              <td>${u.ssoId}</td>
              <td>${u.email}</td>
              <td style="font-weight:normal;">${u.role || ''}</td>
              <td>
                <a href="#" style="color:#8d5fc5;font-weight:bold;cursor:pointer;" @click=${e => { e.preventDefault(); openEditUser(i); }}>Update</a>
                |
                <a href="#" style="color:#8d5fc5;font-weight:bold;cursor:pointer;" @click=${e => { e.preventDefault(); openUserDeleteModal(i); }}>Delete</a>
              </td>
            </tr>
          ` : html`<tr><td></td><td></td><td></td><td></td><td></td></tr>`)}
        </tbody>
      </table>
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
  renderRoleDropdown();
  if (roleInput) roleInput.value = availableRoles[0] || "Student";
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
  
  renderRoleDropdown();
  if (roleInput) {
    if (availableRoles.includes(u.role)) {
      roleInput.value = u.role;
    } else {
      roleInput.value = availableRoles[0] || "Student";
    }
  }
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
    // role is not sent directly, handled via UserRole
  };

  try {
    let userId = null;
    if (editingUserIndex !== null) {
      // Update
      const user = users[editingUserIndex];
      await fetch(`/api/User/${user.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...user, ...userObj, userId: user.userId })
      });
      userId = user.userId;
    } else {
      // Create
       const res = await fetch(`/api/User?role=${role}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userObj)
      });
      if (!res.ok) throw new Error("Failed to create user");
      const created = await res.json();
      userId = created.userId || created.id || created.UserId;
    }

    // Assign role to user via /api/UserRole
    if (userId && roleInput && roleMap[roleInput.value]) {
      const roleId = roleMap[roleInput.value].roleId;
      await fetch(`/api/UserRole`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, roleId })
      });
    }

    await fetchUsers();
    closeUserModal();
  } catch (e) {
    alert("Failed to save user.");
  }
});


cancelUserBtn.addEventListener("click", closeUserModal);


// User delete modal actions
confirmUserDeleteBtn.addEventListener("click", confirmUserDelete);
cancelUserDeleteBtn.addEventListener("click", closeUserDeleteModal);

// --- API Integration --- //
async function fetchUsers() {
  try {
    // Fetch users
    const res = await fetch("/api/User");
    if (!res.ok) throw new Error("Failed to fetch users");
    users = await res.json();

    // Fetch user roles
    const roleRes = await fetch("/api/UserRole");
    if (!roleRes.ok) throw new Error("Failed to fetch user roles");
    userRoles = await roleRes.json();

    // Join user roles to users (assume userId and role.name)
    users.forEach(u => {
      const ur = userRoles.find(r => r.userId === u.userId);
      u.role = ur && ur.role && (ur.role.name || ur.role.roleName) ? (ur.role.name || ur.role.roleName) : '';
    });

    renderUsers();
  } catch (e) {
    users = [];
    renderUsers();
    alert("Could not load users from server.");
  }
}

// Initial load
window.addEventListener("DOMContentLoaded", async () => {
  await fetchRoles();
  fetchUsers();
});
