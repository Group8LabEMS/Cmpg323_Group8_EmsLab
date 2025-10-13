import { html, render as litRender } from "lit";
import { apiFetch } from "../api/api.js";
import { addToast } from "../util/toast.js";

// ---------- DOM Refs ---------- //
const maintenanceTableBody = document.getElementById("maintenanceTableBody");

// ---------- State ---------- //

export let maintenanceList = [];

// --- API Integration --- //
export async function fetchMaintenance() {
  try {
    const data = await apiFetch('GET', '/api/Equipment/maintenance');
    maintenanceList = data.map(eq => ({
      id: eq.equipmentId,
      name: eq.name || '',
      desc: eq.equipmentType?.name || '',
      loc: eq.availability || '',
      status: eq.equipmentStatus?.name || '',
    }));
    renderMaintenanceTable();
  } catch (e) {
    maintenanceList = [];
    renderMaintenanceTable();
    addToast('Error', 'Could not load maintenance data from server.');
  }
}

// ---------- Render ---------- //
function renderMaintenanceTable() {
  const rows = maintenanceList.map(eq => html`
    <tr>
      <td>${eq.name}</td>
      <td>${eq.desc}</td>
      <td>${eq.loc}</td>
      <td><span class="${statusClass(eq.status)}">${eq.status}</span></td>
      <td>
        <button class="btn btn-primary" @click=${() => markAsAvailable(eq.id)}>Done</button>
      </td>
    </tr>
  `);

  litRender(html`${rows}`, maintenanceTableBody);
}

export async function renderMaintenance() {
  await fetchMaintenance();
}

// ---------- Update Status ---------- //
async function markAsAvailable(equipmentId) {
  try {
    await apiFetch('PUT', `/api/Equipment/${equipmentId}/maintenance/complete`);
    await fetchMaintenance();
    addToast('Success', 'Equipment moved out of maintenance successfully');
  } catch (e) {
    addToast('Error', 'Failed to update equipment status.');
  }
}
// Fetch maintenance data on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', fetchMaintenance);
} else {
  fetchMaintenance();
}

function statusClass(status) {
  switch (status) {
    case "Needs Repair": return "status-needs-repair";
    case "Repair In Progress": return "status-repair-progress";
    case "Repair Completed": return "status-repair-completed";
    default: return "status-maintenance";
  }
}
