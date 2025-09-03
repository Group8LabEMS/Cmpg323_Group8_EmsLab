// Fake Data for testing (not needed in final)
let equipment = [
  { id: 1, name: "Centrifuge", type: "Lab Equipment", status: "Available" },
  { id: 2, name: "Microscope", type: "Lab Equipment", status: "In Use" }
];
let bookings = [];
let maintenance = [];
let audit = [];

// Role-based menu items
const roleMenus = {
  demi: ["dashboard", "equipment", "bookings"],
  postgraduate: ["dashboard", "equipment", "bookings", "maintenance"],
  admin: ["dashboard", "equipment", "maintenance", "audit"],
  lecturer: ["dashboard", "equipment", "bookings", "maintenance", "audit"]
};

let currentUser = null;

// Login
function login(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const role = document.getElementById("role").value;
  currentUser = { username, role };
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  window.location.href = "index.html";
}

// Logout
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// Init App
window.onload = function() {
  if (document.body.classList.contains("login-body")) return; // Skip on login.html
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) window.location.href = "login.html";

  setupMenu();
  updateDashboard();
};

// Setup navigation menu based on users role
function setupMenu() {
  const navMenu = document.getElementById("navMenu");
  navMenu.innerHTML = "";
  roleMenus[currentUser.role].forEach(page => {
    const link = document.createElement("a");
    link.href = "#";
    link.innerText = page.charAt(0).toUpperCase() + page.slice(1);
    link.onclick = () => showPage(page);
    navMenu.appendChild(link);
  });

  // Toggle forms based on users role
  if (currentUser.role === "admin" || currentUser.role === "lecturer") {
    document.getElementById("equipmentForm").classList.remove("hidden");
  }
  if (currentUser.role === "postgraduate" || currentUser.role === "admin" || currentUser.role === "lecturer") {
    document.getElementById("maintenanceForm").classList.remove("hidden");
  }
  if (currentUser.role === "admin" || currentUser.role === "lecturer") {
    document.getElementById("audit").classList.remove("hidden");
  }
}

// Page navigation
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");

  if(pageId === "equipment") renderEquipment();
  if(pageId === "bookings") renderBookings();
  if(pageId === "maintenance") renderMaintenance();
  if(pageId === "audit") renderAudit();
  if(pageId === "dashboard") updateDashboard();
}

// Render functions
function renderEquipment() {
  const tbody = document.getElementById("equipmentTable");
  tbody.innerHTML = "";
  equipment.forEach(eq => {
    tbody.innerHTML += `<tr><td>${eq.id}</td><td>${eq.name}</td><td>${eq.type}</td><td>${eq.status}</td></tr>`;
  });
}
function renderBookings() {
  const tbody = document.getElementById("bookingTable");
  tbody.innerHTML = "";
  bookings.forEach(bk => {
    tbody.innerHTML += `<tr><td>${bk.id}</td><td>${bk.user}</td><td>${bk.equipment}</td><td>${bk.from}</td><td>${bk.to}</td><td>${bk.status}</td></tr>`;
  });
}
function renderMaintenance() {
  const tbody = document.getElementById("maintenanceTable");
  tbody.innerHTML = "";
  maintenance.forEach(mt => {
    tbody.innerHTML += `<tr><td>${mt.id}</td><td>${mt.equipment}</td><td>${mt.type}</td><td>${mt.status}</td><td>${mt.scheduled}</td></tr>`;
  });
}
function renderAudit() {
  const tbody = document.getElementById("auditTable");
  tbody.innerHTML = "";
  audit.forEach(log => {
    tbody.innerHTML += `<tr><td>${log.id}</td><td>${log.user}</td><td>${log.action}</td><td>${log.entity}</td><td>${log.timestamp}</td></tr>`;
  });
}

// Add functions
function addEquipment() {
  const name = document.getElementById("eqName").value;
  const type = document.getElementById("eqType").value;
  const status = document.getElementById("eqStatus").value;
  if(name) {
    equipment.push({ id: equipment.length+1, name, type, status });
    renderEquipment();
    updateDashboard();
    document.getElementById("eqName").value = "";
    logAction("Added Equipment", "Equipment");
  }
}
function addBooking() {
  const user = document.getElementById("bkUser").value;
  const eq = document.getElementById("bkEquipment").value;
  const from = document.getElementById("bkFrom").value;
  const to = document.getElementById("bkTo").value;
  const status = document.getElementById("bkStatus").value;
  if(user && eq && from && to) {
    bookings.push({ id: bookings.length+1, user, equipment: eq, from, to, status });
    renderBookings();
    updateDashboard();
    logAction("Created Booking", "Booking");
  }
}
function addMaintenance() {
  const eq = document.getElementById("mtEquipment").value;
  const type = document.getElementById("mtType").value;
  const status = document.getElementById("mtStatus").value;
  const scheduled = document.getElementById("mtScheduled").value;
  if(eq && scheduled) {
    maintenance.push({ id: maintenance.length+1, equipment: eq, type, status, scheduled });
    renderMaintenance();
    updateDashboard();
    logAction("Scheduled Maintenance", "Maintenance");
  }
}

// Audit
function login(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const role = document.getElementById("role").value;
  const errorEl = document.getElementById("loginError");

  // Validate student/staff number
  if (!/^\d{8}$/.test(username)) {
    errorEl.textContent = "Invalid number. Please enter an 8-digit student/staff number.";
    return;
  }

  if (!role) {
    errorEl.textContent = "Please select a role.";
    return;
  }

  // Save user and redirect
  currentUser = { username, role };
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  window.location.href = "index.html";
}