// Role-based tab config
const TABS_BY_ROLE = {
  user: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'profile', label: 'Profile' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'equipment', label: 'Equipment' }
  ],
  admin: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'userManagement', label: 'User Management' },
    { id: 'bookings', label: 'Bookings Management' },
    { id: 'equipment', label: 'Equipment Management' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'adminDashboard', label: 'Audit Trails' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' }
  ]
};

// Redirect to login if not logged in
const roleFromStorage = localStorage.getItem('role');
if (!roleFromStorage) {
  window.location.href = 'Login.html';
}
let currentRole = roleFromStorage || 'user';

function renderSidebar() {
  const sidebar = document.querySelector('aside.sidebar');
  if (!sidebar) return;
  // Keep the user name and logout button
  const userName = sidebar.querySelector('h3')?.outerHTML || '';
  const logoutBtn = sidebar.querySelector('.logout')?.outerHTML || '';
  // Render allowed tabs
  const tabs = TABS_BY_ROLE[currentRole] || [];
  sidebar.innerHTML = userName +
    tabs.map(tab => `<button class="sidebar-btn" data-target="${tab.id}">${tab.label}</button>`).join('') +
    logoutBtn;
  // Re-attach event listeners
  sidebar.querySelectorAll('.sidebar-btn[data-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = (btn instanceof HTMLElement && btn.dataset) ? btn.dataset.target : undefined;
      if (target) window.location.hash = `#${target}`;
    });
  });
  // Logout event
  const logout = sidebar.querySelector('.logout');
  if (logout) logout.addEventListener('click', () => {
    // Clear login and redirect to login page
    localStorage.removeItem('role');
    window.location.href = 'Login.html';
  });
}

function showAllowedTabs() {
  // Hide all tabs
  document.querySelectorAll('.tab').forEach(tab => tab.classList.add('hidden'));
  // Show only allowed tab sections
  const allowed = (TABS_BY_ROLE[currentRole] || []).map(t => t.id);
  allowed.forEach(id => {
    const el = document.getElementById(id);
    if (el && el instanceof HTMLElement) el.style.display = '';
  });
  // Hide all others
  document.querySelectorAll('.tab').forEach(tab => {
    if (!allowed.includes(tab.id) && tab instanceof HTMLElement) tab.style.display = 'none';
  });
}

import { renderDashboard } from "./pages/dashboard.js";
import { renderProfile } from "./pages/profile.js";
import { renderBookings } from "./pages/bookings.js";
import { renderEquipmentManagement } from "./pages/admin_equipment.js";
import { renderEquipment } from "./pages/equipent.js";
import { renderUsers } from "./pages/user_management.js";
import { renderAdminDashboard } from "./pages/admin_dashboard.js";
import { renderMaintenance } from "./pages/maintenance.js";



// Dynamically select equipment renderer based on role
const tabRenderers = {
  dashboard: renderDashboard,
  profile: renderProfile,
  bookings: renderBookings,
  equipment: currentRole === 'admin' ? renderEquipmentManagement : renderEquipment,
  userManagement: renderUsers,
  adminDashboard: renderAdminDashboard,
  maintenance: renderMaintenance,
};

document.querySelectorAll(".sidebar-btn[data-target]").forEach(btn => {
  const button = /** @type {HTMLButtonElement} */ (btn);
  button.addEventListener("click", () => {
    const target = button.dataset.target;
    if (target) {
      window.location.hash = `#${target}`;
    }
  });
});

//---------- Book now ----------//
// Book Now button in topbar redirects user to the equipment section
const bookNowBtn = document.getElementById("bookNowBtn");
if (bookNowBtn) {
  bookNowBtn.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelectorAll(".tab").forEach(tab => tab.classList.add("hidden"));
    document.querySelectorAll(".sidebar-btn").forEach(b => b.classList.remove("active"));
    document.getElementById("equipment").classList.remove("hidden");
    document.querySelector('.sidebar-btn[data-target="equipment"]').classList.add("active");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Simulate login: set currentRole to 'user' or 'admin' here
  // currentRole = 'admin'; // Uncomment to test admin
  renderSidebar();
  showAllowedTabs();

  function showSectionFromHash() {
    const hash = window.location.hash.replace('#', '') || TABS_BY_ROLE[currentRole][0].id;
    showAllowedTabs();
    // Show the section matching the hash (id) if allowed
    const allowed = (TABS_BY_ROLE[currentRole] || []).map(t => t.id);
    if (allowed.includes(hash)) {
      const section = document.getElementById(hash);
      if (section) {
        section.classList.remove('hidden');
        if (tabRenderers[hash]) tabRenderers[hash]();
      }
    }
    // Set active sidebar button
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
      const target = (btn instanceof HTMLElement && btn.dataset) ? btn.dataset.target : undefined;
      btn.classList.toggle('active', target === hash);
    });
  }

  window.addEventListener('hashchange', showSectionFromHash);
  showSectionFromHash();

  // Example: populate with data (replace later with real logic)
  const totalUsersEl = document.getElementById("total-users");
  const totalBookingsEl = document.getElementById("total-bookings");
  if (totalUsersEl) totalUsersEl.textContent = "123";
  if (totalBookingsEl) totalBookingsEl.textContent = "45";
});