// ---------- State ---------- //
let users = [
  { name: "Cosmo Kramer", universityNo: "12123434", email: "ckramer@mynwu.ac.za", role: "Student" },
  { name: "Jerry Seinfeld", universityNo: "10067546", email: "jseinfeld@nwu.ac.za", role: "Lab Manager" },
  { name: "George Costanza", universityNo: "23454567", email: "gcostanza@nwu.ac.za", role: "Lab Assistant" }
];

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
// roleInput already exists for role

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
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.universityNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
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
    <h2 style="color:#8d5fc5;font-size:2.5rem;margin-bottom:0.2rem;font-weight:bold;">User Management</h2>
    <div style="color:#8d5fc5;font-size:1.3rem;margin-bottom:0.5rem;">View, add, update and delete users.</div>
    <button style="float:right;margin-bottom:1.5rem;background:#8d5fc5;color:#fff;font-size:1.2rem;padding:0.7rem 2.5rem;border-radius:8px;border:none;box-shadow:0 2px 8px #bdbdbd;" @click=${openAddUser}>Create User</button>
    <div style="clear:both"></div>
    <div style="background:#fff;border-radius:20px;box-shadow:0 4px 15px #e0d3f3;padding:2rem 1.5rem 1.5rem 1.5rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.2rem;">
        <div style="display:flex;align-items:center;gap:0.5rem;">
          <select @change=${handleSort} style="font-size:1.1rem;padding:0.4rem 2.2rem 0.4rem 1.2rem;border-radius:8px;border:2px solid #8d5fc5;background:#fff;color:#8d5fc5;font-weight:bold;">
            <option value="name">Sort by</option>
            <option value="name">Name</option>
            <option value="universityNo">University No</option>
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
          ${[...getFilteredSortedList(), {}, {}, {}].slice(0, 5).map((u, i) => u.name ? html`
            <tr style="background:${i%2===1?'#f7f6fb':'#fff'};">
              <td><span style="font-weight:bold;color:#6d4eb0;">${u.name}</span></td>
              <td>${u.universityNo}</td>
              <td>${u.email}</td>
              <td>${u.role}</td>
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
/**
 * Opens the Add User modal dialog.
 */
function openAddUser() {
  editingUserIndex = null;
  userModalTitle.textContent = "User Profile";
  nameInput.value = "";
  surnameInput.value = "";
  universityNoInput.value = "";
  emailInput.value = "";
  cellInput.value = "";
  facultyInput.value = "";
  departmentInput.value = "";
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
  // Split name into first and last if possible
  const [first, ...last] = (u.name || "").split(" ");
  nameInput.value = first || "";
  surnameInput.value = last.join(" ") || "";
  universityNoInput.value = u.universityNo || "";
  emailInput.value = u.email || "";
  cellInput.value = u.cell || "";
  facultyInput.value = u.faculty || "";
  departmentInput.value = u.department || "";
  passwordInput.value = u.password || "";
  repasswordInput.value = u.password || "";
  // roleInput is not present in modal, so skip
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
  const name = nameInput.value.trim();
  const surname = surnameInput.value.trim();
  const universityNo = universityNoInput.value.trim();
  const email = emailInput.value.trim();
  const cell = cellInput.value.trim();
  const faculty = facultyInput.value.trim();
  const department = departmentInput.value.trim();
  const password = passwordInput.value;
  const repassword = repasswordInput.value;
  const role = document.getElementById("roleInput") ? /** @type {HTMLSelectElement} */ (document.getElementById("roleInput")).value : "";

  if (!name || !surname || !universityNo || !email || !cell || !faculty || !department || !password || !repassword) {
    alert("All fields are required.");
    return;
  }
  if (password !== repassword) {
    alert("Passwords do not match.");
    return;
  }

  const userObj = {
    name: name + " " + surname,
    universityNo,
    email,
    cell,
    faculty,
    department,
    password,
    role
  };

  if (editingUserIndex !== null) {
    users[editingUserIndex] = userObj;
  } else {
    users.push(userObj);
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
