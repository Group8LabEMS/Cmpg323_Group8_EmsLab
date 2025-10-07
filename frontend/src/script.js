import { logout as doLogout } from "./util/auth.js";

// Role-based tab config
const TABS_BY_ROLE = {
  Student: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'profile', label: 'Profile' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'equipment', label: 'Equipment' }
  ],
  Admin: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'userManagement', label: 'User Management' },
    { id: 'bookings', label: 'Bookings Management' },
    { id: 'equipment', label: 'Equipment Management' },
    { id: 'maintenance', label: 'Maintenance' },
  { id: 'adminAudit', label: 'Audit Trails' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' }
  ]
};

// Check authentication and get user info
let currentUser = null;
let currentRole = 'Student';

async function initAuth() {
  try {
    const res = await fetch('http://localhost:8000/api/Auth/me', { credentials: 'include' });
    if (res.ok) {
      currentUser = await res.json();
      currentRole = currentUser.role || 'Student';
      // Expose globally for other modules
      window.currentUser = currentUser;
      window.currentRole = currentRole;
    } else {
      window.location.href = 'login.html';
      return;
    }
  } catch (err) {
    window.location.href = 'login.html';
    return;
  }
}

// Render sidebar
function renderSidebar() {
  const sidebar = document.querySelector('aside.sidebar');
  if (!sidebar) return;

  const userName = sidebar.querySelector('h3')?.outerHTML || '';
  const logoutBtn = sidebar.querySelector('.logout')?.outerHTML || '';

  const tabs = TABS_BY_ROLE[currentRole] || [];
  sidebar.innerHTML = userName +
    tabs.map(tab => `<button class="sidebar-btn" data-target="${tab.id}">${tab.label}</button>`).join('') +
    logoutBtn;

  // Attach click events for sidebar buttons
  sidebar.querySelectorAll('.sidebar-btn[data-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn instanceof HTMLElement ? btn.dataset.target : undefined;
      if (target) window.location.hash = `#${target}`;
    });
  });

  // Logout button
  const logout = sidebar.querySelector('.logout');
  if (logout) logout.addEventListener('click', async () => {
    try {
      // await fetch('http://localhost:8000/api/Auth/logout', { method: 'POST', credentials: 'include' });
      await doLogout();
    }
    catch (err) { console.error('Logout error:', err); }
    window.location.href = 'login.html';
  });
}

// Show only allowed tabs
function showAllowedTabs() {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.add('hidden'));

  const allowed = (TABS_BY_ROLE[currentRole] || []).map(t => t.id);
  allowed.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
  });
}

// Import page renderers
import { renderDashboard } from "./pages/dashboard.js";
import { renderProfile } from "./pages/profile.js";
import { renderBookings } from "./pages/bookings.js";
import { renderEquipmentManagement } from "./pages/admin_equipment.js";
import { renderEquipment } from "./pages/equipent.js";
import { renderUsers } from "./pages/user_management.js";
import { renderAdminDashboard } from "./pages/admin_dashboard.js";
import { renderAdminAudit } from "./pages/admin_audit.js";
import { renderAdminBookings, fetchBookings } from "./pages/admin_bookings.js";
import { renderMaintenance } from "./pages/maintenance.js";

import { renderReports } from "./pages/admin_reports.js";



// Dynamically select equipment renderer based on role
// Map tab to renderer
const tabRenderers = {
  dashboard: function() {
    if (currentRole && currentRole.toLowerCase() === 'admin') {
      renderAdminDashboard();
    } else {
      renderDashboard();
    }
  },
  profile: renderProfile,
  bookings: function() {
    // Hide both bookings tables first
    const userBookingsSection = document.getElementById('bookings');
    const adminBookingsSection = document.getElementById('admin-bookings');
    if (userBookingsSection) userBookingsSection.classList.add('hidden');
    if (adminBookingsSection) adminBookingsSection.classList.add('hidden');
    if (currentRole === 'Admin') {
      if (adminBookingsSection) adminBookingsSection.classList.remove('hidden');
      // Always fetch fresh bookings when switching to admin tab
      fetchBookings();
    } else {
      if (userBookingsSection) userBookingsSection.classList.remove('hidden');
      renderBookings();
    }
  },
  equipment: function() {
    if (currentRole === 'Admin') {
      renderEquipmentManagement();
    } else {
      renderEquipment();
    }
  },
  userManagement: renderUsers,
  adminDashboard: renderAdminDashboard,
  adminAudit: renderAdminAudit,
  maintenance: renderMaintenance,
   reports: renderReports,
};

// Book Now button
const bookNowBtn = document.getElementById("bookNowBtn");
if (bookNowBtn) {
  bookNowBtn.addEventListener("click", e => {
    e.preventDefault();
    document.querySelectorAll(".tab").forEach(tab => tab.classList.add("hidden"));
    document.querySelectorAll(".sidebar-btn").forEach(b => b.classList.remove("active"));
    document.getElementById("equipment").classList.remove("hidden");
    const btn = document.querySelector('.sidebar-btn[data-target="equipment"]');
    if (btn) btn.classList.add("active");
  });
}

// Initialize on DOMContentLoaded
document.addEventListener("DOMContentLoaded", async () => {
  await initAuth();
  renderSidebar();

  // Hide all tabs by default
  document.querySelectorAll('.tab').forEach(tab => tab.classList.add('hidden'));

  function showSectionFromHash() {
    // Hide all tabs first
    document.querySelectorAll('.tab').forEach(tab => tab.classList.add('hidden'));
    const hash = window.location.hash.replace('#', '') || (TABS_BY_ROLE[currentRole] || [])[0]?.id;
    const allowed = (TABS_BY_ROLE[currentRole] || []).map(t => t.id);
    if (allowed.includes(hash)) {
      const section = document.getElementById(hash);
      if (section) {
        section.classList.remove('hidden');
        if (tabRenderers[hash]) tabRenderers[hash]();
      }
    }
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
      const target = btn instanceof HTMLElement ? btn.dataset.target : undefined;
      if (btn instanceof HTMLElement) btn.classList.toggle('active', target === hash);
    });
  }

  window.addEventListener('hashchange', showSectionFromHash);
  showSectionFromHash();

  // Example dashboard counters
  const totalUsersEl = document.getElementById("total-users");
  const totalBookingsEl = document.getElementById("total-bookings");
  if (totalUsersEl) totalUsersEl.textContent = "123";
  if (totalBookingsEl) totalBookingsEl.textContent = "45";
});
