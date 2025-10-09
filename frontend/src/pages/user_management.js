// ---------- State ---------- //

let users = [];

let editingUserIndex = null;

// ---------- DOM Refs ---------- //
import { html, render as litRender } from "lit";
const userTableBody = document.getElementById("userTableBody");
const userModal = document.getElementById("userModal");
const userModalTitle = document.getElementById("userModalTitle");

const nameInput = /** @type {HTMLInputElement} */ (
  document.getElementById("nameInput")
);
const surnameInput = /** @type {HTMLInputElement} */ (
  document.getElementById("surnameInput")
);
const universityNoInput = /** @type {HTMLInputElement} */ (
  document.getElementById("universityNoInput")
);
const emailInput = /** @type {HTMLInputElement} */ (
  document.getElementById("emailInput")
);
const cellInput = /** @type {HTMLInputElement} */ (
  document.getElementById("cellInput")
);
const facultyInput = /** @type {HTMLInputElement} */ (
  document.getElementById("facultyInput")
);
const departmentInput = /** @type {HTMLInputElement} */ (
  document.getElementById("departmentInput")
);
const passwordInput = /** @type {HTMLInputElement} */ (
  document.getElementById("passwordInput")
);
const repasswordInput = /** @type {HTMLInputElement} */ (
  document.getElementById("repasswordInput")
);

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
    list = list.filter(
      (u) =>
        (u.displayName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
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
  litRender(
    html`
    <div class="mainContentButtons-Wrapper">
      <button @click=${openAddUser} class="mainContentPrimaryButtons" >New User</button>
    </div>

    <div class="controllers-container">
      <div class="sort-Wrapper">
        <select class="sortDropDown" @change=${handleSort} >
            <option value="displayName">Sort by</option>
            <option value="displayName">Name</option>
            <option value="ssoId">University No</option>
            <option value="email">Email</option>
            <option value="role">Role</option>
        </select>
        <button class="sortAscDescButton" @click=${toggleSortDir}>
          <span style="font-size:1.2rem;">${sortAsc ? 
            html`<img src='../Assets/SortZA.svg' alt='Sort' style='width:25px;height:25px;' />` : 
            html`<img src='../Assets/SortAZ.svg' alt='Sort' style='width:25px;height:25px;' />`}</span>
        </button>
      </div>
      <div class="searchfilter-Wrapper">
        <div class="search-Wrapper">
          <input class="search-Input" type="text" placeholder="Search ..." @input=${handleSearch} value=${searchTerm}  />
          <button class="search-Button">
            <img src="../Assets/Search.svg" alt="Search" style="width:25px;height:25px;" />
          </button>
        </div>
        <button class="filter-Button">
          <img src="../Assets/Filter.svg" alt="Search" style="width:25px;height:25px;" /> FILTER
        </button>
      </div>
    </div>

      <table>
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
            <tr style="background:${i%2===1?'#f7f6fb':'#fff'};">
              <td><span style="font-weight:bold;color:#6d4eb0;">${u.displayName}</span></td>
              <td>${u.ssoId}</td>
              <td>${u.email}</td>
              <td>${u.role || ''}</td>
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
  `,
    section
  );
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
  // Split displayName into first and last if possible
  const [first, ...last] = (u.displayName || "").split(" ");
  nameInput.value = first || "";
  surnameInput.value = last.join(" ") || "";
  universityNoInput.value = u.ssoId || "";
  emailInput.value = u.email || "";
  cellInput.value = u.cell || "";
  facultyInput.value = u.faculty || "";
  departmentInput.value = u.department || "";
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

confirmUserBtn.addEventListener("click", async () => {
  const name = nameInput.value.trim();
  const surname = surnameInput.value.trim();
  const ssoId = universityNoInput.value.trim();
  const email = emailInput.value.trim();
  const cell = cellInput.value.trim();
  const faculty = facultyInput.value.trim();
  const department = departmentInput.value.trim();
  const password = passwordInput.value;
  const repassword = repasswordInput.value;
  const role = document.getElementById("roleInput")
    ? /** @type {HTMLSelectElement} */ (document.getElementById("roleInput"))
      .value
    : "";

  if (
    !name ||
    !surname ||
    !ssoId ||
    !email ||
    !cell ||
    !faculty ||
    !department ||
    !password ||
    !repassword
  ) {
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
        body: JSON.stringify({ ...user, ...userObj, userId: user.userId }),
      });
    } else {
      // Create
      await fetch(`/api/User`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userObj),
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
window.addEventListener("DOMContentLoaded", fetchUsers);
