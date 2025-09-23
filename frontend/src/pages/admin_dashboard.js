// ---------- State ---------- //
let users = [
  { username: "admin", role: "Admin", status: "Active" },
  { username: "johndoe", role: "User", status: "Inactive" },
  { username: "janedoe", role: "User", status: "Active" }
];

let bookings = [
  { equipment: "Microscope", date: "2025-09-24", time: "10:00-12:00", status: "Confirmed", price: 500 },
  { equipment: "Spectrometer", date: "2025-09-25", time: "14:00-16:00", status: "Pending", price: 300 }
];

document.addEventListener("DOMContentLoaded", () => {
  renderAdminDashboard();
});

export function renderAdminDashboard() {
  // sample demo data – connect this to your real arrays later
  const users = [
    { username: "admin", role: "Admin", status: "Active" },
    { username: "johndoe", role: "User", status: "Inactive" }
  ];

  const bookings = [
    { equipment: "Microscope", price: 500 },
    { equipment: "Spectrometer", price: 300 }
  ];

  const totalUsers = users.length;
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.price || 0), 0);

  const statsDiv = document.getElementById("adminStats");
  statsDiv.innerHTML = `
      <div class="stat-card">👥 Users: ${totalUsers}</div>
      <div class="stat-card">📅 Bookings: ${totalBookings}</div>
      <div class="stat-card">💰 Revenue: $${totalRevenue.toLocaleString()}</div>
  `;
}
