import { html, render as litRender } from "lit";

export function renderAdminDashboard() {
  const dashboardSection = document.getElementById("dashboard");
  if (!dashboardSection) return;
  litRender(html`
    
    <div class="admin-dashboard-grid">
      <div class="admin-stats-row">
        <div class="admin-stat-card">
          <div class="admin-stat-value">5</div>
          <div class="admin-stat-label">Total Users</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-value">12</div>
          <div class="admin-stat-label">Active Bookings</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-value">2</div>
          <div class="admin-stat-label">Equipment in maintenance</div>
        </div>
      </div>
      <div class="admin-charts-row">
        <div class="admin-chart-card">
          <div class="admin-chart-title">Bookings Per Month</div>
          <svg width="340" height="220" style="display:block;">
            <g>
              <!-- Y axis lines -->
              <line x1="50" y1="30" x2="50" y2="180" stroke="#bbb" stroke-width="2" />
              <line x1="50" y1="180" x2="320" y2="180" stroke="#bbb" stroke-width="2" />
              <line x1="50" y1="130" x2="320" y2="130" stroke="#eee" stroke-width="1" />
              <line x1="50" y1="80" x2="320" y2="80" stroke="#eee" stroke-width="1" />
              <!-- Bars -->
              <rect x="70" y="130" width="40" height="50" fill="#7A4EB0" />
              <rect x="130" y="80" width="40" height="100" fill="#7A4EB0" />
              <rect x="190" y="105" width="40" height="75" fill="#7A4EB0" />
              <rect x="250" y="155" width="40" height="25" fill="#7A4EB0" />
              <!-- Y axis labels -->
              <text x="40" y="185" font-size="18" fill="#888">0</text>
              <text x="30" y="135" font-size="18" fill="#888">10</text>
              <text x="25" y="85" font-size="18" fill="#888">20</text>
              <text x="15" y="35" font-size="18" fill="#888">25</text>
              <!-- X axis labels -->
              <text x="80" y="205" font-size="18" fill="#888">May</text>
              <text x="140" y="205" font-size="18" fill="#888">June</text>
              <text x="200" y="205" font-size="18" fill="#888">July</text>
              <text x="260" y="205" font-size="18" fill="#888">August</text>
            </g>
          </svg>
        </div>
        <div class="admin-chart-card">
          <div class="admin-chart-title">Equipment Usage</div>
          <svg width="200" height="200" viewBox="0 0 32 32">
            <circle r="16" cx="16" cy="16" fill="#eee" />
            <path d="M16 16 L16 0 A16 16 0 0 1 31.5 19.5 Z" fill="#7A4EB0" />
            <path d="M16 16 L31.5 19.5 A16 16 0 0 1 8 30 Z" fill="#999" />
            <path d="M16 16 L8 30 A16 16 0 0 1 2 16 Z" fill="#C77DFF" />
            <path d="M16 16 L2 16 A16 16 0 0 1 16 0 Z" fill="#BDBDBD" />
            <circle r="7" cx="16" cy="16" fill="#fff" />
          </svg>
          <ul class="admin-pie-legend">
            <li><span style="background:#7A4EB0"></span>Spectrometer</li>
            <li><span style="background:#999"></span>Microscope</li>
            <li><span style="background:#C77DFF"></span>Centrifuge</li>
            <li><span style="background:#BDBDBD"></span>Laser Cutter</li>
          </ul>
        </div>
      </div>
    </div>
  `, dashboardSection);
}
