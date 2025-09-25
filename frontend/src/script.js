
import { renderDashboard } from "./pages/dashboard.js";
import { renderProfile } from "./pages/profile.js";
import { renderBookings } from "./pages/bookings.js";
import { renderEquipment } from "./pages/equipent.js";
import { renderUsers } from "./pages/user_management.js";
import { renderAdminDashboard } from "./pages/admin_dashboard.js";
import { renderMaintenance } from "./pages/maintenance.js";


const tabRenderers = {
  dashboard: renderDashboard,
  profile: renderProfile,
  bookings: renderBookings,
  equipment: renderEquipment,
  userManagement: renderUsers,
  adminDashboard: renderAdminDashboard,
   maintenance: renderMaintenance,
};

document.querySelectorAll(".sidebar-btn[data-target]").forEach(btn => {
  const button = /** @type {HTMLButtonElement} */ (btn);
  button.addEventListener("click", () => {
    const target = button.dataset.target;

    // Hide all tabs
    document.querySelectorAll(".tab").forEach(tab => tab.classList.add("hidden"));
    document.querySelectorAll(".sidebar-btn").forEach(b => b.classList.remove("active"));

    // Show selected tab
    const targetEl = document.getElementById(target);
    if (targetEl) {
      targetEl.classList.remove("hidden");
      btn.classList.add("active");

      // Call renderer
      if (tabRenderers[target]) {
        tabRenderers[target]();
      }
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
  const totalUsersEl = document.getElementById("total-users");
  const totalBookingsEl = document.getElementById("total-bookings");

  // Example: populate with data (replace later with real logic)
  if (totalUsersEl) totalUsersEl.textContent = "123";
  if (totalBookingsEl) totalBookingsEl.textContent = "45";
});