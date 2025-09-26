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
          <canvas id="bookingsBarChart" width="420" height="270" style="max-width:420px;max-height:270px;"></canvas>
        </div>
        <div class="admin-chart-card" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div class="admin-chart-title">Equipment Usage</div>
          <canvas id="equipmentUsageChart" width="320" height="320" style="max-width:320px;max-height:320px;"></canvas>
        </div>
      </div>
    </div>
  `, dashboardSection);
}

// Chart.js loader
if (!window.Chart) {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
  script.onload = () => {
    renderEquipmentUsageChart();
    renderBookingsBarChart();
  };
  document.head.appendChild(script);
} else {
  renderEquipmentUsageChart();
  renderBookingsBarChart();
}

function renderEquipmentUsageChart() {
  const ctx = document.getElementById('equipmentUsageChart');
  if (!ctx) return;
  const data = {
    labels: ['Spectrometer', 'Microscope', 'Centrifuge', 'Laser Cutter'],
    datasets: [{
      label: 'Equipment Usage',
      data: [12, 19, 7, 5],
      backgroundColor: [
        '#7A4EB0',
        '#999',
        '#C77DFF',
        '#BDBDBD'
      ],
      hoverOffset: 4
    }]
  };
  const config = {
    type: 'doughnut',
    data: data,
    options: {
      cutout: '45%',
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            boxWidth: 20,
            padding: 20,
          }
        }
      }
    }
  };
  new Chart(ctx, config);
}

function renderBookingsBarChart() {
  const ctx = document.getElementById('bookingsBarChart');
  if (!ctx) return;
  const data = {
    labels: ['May', 'June', 'July', 'August'],
    datasets: [{
      label: 'Bookings',
      data: [10, 25, 20, 5],
      backgroundColor: '#7A4EB0',
      borderRadius: 8,
      barPercentage: 0.7,
      categoryPercentage: 0.7
    }]
  };
  const config = {
    type: 'bar',
    data: data,
    options: {
      responsive: false,
      plugins: {
        legend: { display: false },
        title: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 5 }
        }
      }
    }
  };
  new Chart(ctx, config);
}
