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
    const data = await apiFetch('GET', '/api/Maintenance');
    maintenanceList = data.map(m => ({
      id: m.maintenanceId,
      name: m.equipment?.name || '',
      desc: m.description,
      loc: m.location,
      status: m.maintenanceStatus?.name || '',
      // add other fields as needed
    }));
    renderMaintenance();
  } catch (e) {
    maintenanceList = [];
    renderMaintenance();
    addToast('Error', 'Could not load maintenance data from server.');
  }
}

// ---------- Render ---------- //
export function renderMaintenance() {
  const rows = maintenanceList.map(eq => html`
    <tr>
      <td>${eq.name}</td>
      <td>${eq.desc}</td>
      <td>${eq.loc}</td>
      <td><span class="${statusClass(eq.status)}">${eq.status}</span></td>
      <td>
        ${eq.status === "Needs Repair" ? html`
          <button class="btn btn-primary" @click=${() => updateStatus(eq.id, "Repair In Progress")}>Start Repair</button>
        ` : eq.status === "Repair In Progress" ? html`
          <button class="btn btn-primary" @click=${() => updateStatus(eq.id, "Repair Completed")}>Mark Completed</button>
        ` : html`
          <button class="btn btn-secondary" disabled>Done</button>
        `}
      </td>
    </tr>
  `);

  litRender(html`${rows}`, maintenanceTableBody);
}

// ---------- Update Status ---------- //
async function updateStatus(id, newStatus) {
  // Find the maintenance item
  const eq = maintenanceList.find(e => e.id === id);
  if (!eq) return;
  try {
    // Call backend to update status
    await apiFetch('PUT', `/api/Maintenance/${id}/status`, {
      body: { status: newStatus }
    });
    await fetchMaintenance();
    addToast('Success', 'Maintenance status updated successfully');
  } catch (e) {
    addToast('Error', 'Failed to update maintenance status.');
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
