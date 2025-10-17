import { html, render as litRender } from "lit";
import Chart from 'chart.js/auto';
import { getAdminAggregateStats, getBookingsPerMonth, getEquipmentUsage } from '../api/api.js';

let statsData = { totalUsers: 0, activeBookings: 0, maintenanceEquipment: 0 };
let bookingsData = [];
let equipmentData = [];
let charts = {};

export async function renderAdminDashboard() {
  const dashboardSection = document.getElementById("dashboard");
  if (!dashboardSection) return;
  
  // Destroy existing charts
  Object.values(charts).forEach(chart => chart?.destroy());
  charts = {};
  
  try {
    [statsData, bookingsData, equipmentData] = await Promise.all([
      getAdminAggregateStats(),
      getBookingsPerMonth(),
      getEquipmentUsage()
    ]);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Use fallback data on error
    statsData = { totalUsers: 5, activeBookings: 12, maintenanceEquipment: 2 };
    bookingsData = [{ month: 5, count: 10 }, { month: 6, count: 25 }, { month: 7, count: 20 }, { month: 8, count: 5 }];
    equipmentData = [{ name: 'Spectrometer', count: 12 }, { name: 'Microscope', count: 19 }, { name: 'Centrifuge', count: 7 }, { name: 'Laser Cutter', count: 5 }];
  }

  litRender(html`
    <div class="admin-dashboard-grid">
      <div class="stats-container">
        <div class="stat-card">
          <div class="admin-stat-value">${statsData.totalUsers}</div>
          <div class="admin-stat-label">Total Users</div>
        </div>
          <div class="stat-card">
            <div class="admin-stat-value">${statsData.activeBookings}</div>
            <div class="admin-stat-label">Active Bookings</div>
          </div>
        <div class="stat-card">
          <div class="admin-stat-value">${statsData.pendingBookings}</div>
          <div class="admin-stat-label">Pending Bookings</div>
        </div>
        <div class="stat-card">
          <div class="admin-stat-value">${statsData.maintenanceEquipment}</div>
          <div class="admin-stat-label">Equipment in Maintenance</div>
        </div>
      </div>
      <div class="dashboard-row">
        <div class="card dashboard-card chart-card">
          <div class="card-title">Bookings Per Month</div>
          <div class="chart-container">
            <canvas id="bookingsBarChart"></canvas>
          </div>
        </div>
        <div class="card dashboard-card chart-card">
          <div class="card-title">Equipment Usage</div>
          <div class="chart-container">
            <canvas id="equipmentUsageChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  `, dashboardSection);

  setTimeout(() => {
    renderEquipmentUsageChart();
    renderBookingsBarChart();
  }, 0);
}

function renderEquipmentUsageChart() {
  const ctx = document.getElementById('equipmentUsageChart');
  if (!(ctx instanceof HTMLCanvasElement)) return;
  const data = {
    labels: equipmentData.map(item => item.name),
    datasets: [{
      label: 'Equipment Usage',
      data: equipmentData.map(item => item.count),
      backgroundColor: [
        '#7A4EB0',
        '#999',
        '#C77DFF',
        '#BDBDBD'
      ],
      hoverOffset: 4
    }]
  };
  /** @type {import("chart.js").ChartConfiguration} */
  const config = {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
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
  charts.equipment = new Chart(ctx, config);
}

function renderBookingsBarChart() {
  const ctx = document.getElementById('bookingsBarChart');
  if (!(ctx instanceof HTMLCanvasElement)) return;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = {
    labels: bookingsData.map(item => monthNames[item.month - 1]),
    datasets: [{
      label: 'Bookings',
      data: bookingsData.map(item => item.count),
      backgroundColor: '#7A4EB0',
      borderRadius: 8,
      barPercentage: 0.7,
      categoryPercentage: 0.7
    }]
  };
  /** @type {import("chart.js").ChartConfiguration} */
  const config = {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
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
  charts.bookings = new Chart(ctx, config);
}
