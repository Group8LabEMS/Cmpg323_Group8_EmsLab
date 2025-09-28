import { html, render as litRender } from "lit";

// ---------- DOM Refs ---------- //
const maintenanceTableBody = document.getElementById("maintenanceTableBody");

// ---------- State ---------- //

export let maintenanceList = [
  { id: 1, name: "Centrifuge", desc: "CF-900", loc: "Lab B", status: "Needs Repair" },
  { id: 2, name: "Oscilloscope", desc: "OSC-500", loc: "Lab C", status: "Repair In Progress" },
  { id: 3, name: "Balance", desc: "BAL-42", loc: "Lab D", status: "Repair Completed" }
];

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
          <button class="action-book" @click=${() => updateStatus(eq.id, "Repair In Progress")}>Start Repair</button>
        ` : eq.status === "Repair In Progress" ? html`
          <button class="action-book" @click=${() => updateStatus(eq.id, "Repair Completed")}>Mark Completed</button>
        ` : html`
          <button class="action-disabled" disabled>Done</button>
        `}
      </td>
    </tr>
  `);

  litRender(html`${rows}`, maintenanceTableBody);
}

// ---------- Helpers ---------- //
function updateStatus(id, newStatus) {
  const eq = maintenanceList.find(e => e.id === id);
  if (eq) {
    eq.status = newStatus;
    renderMaintenance();
  }
}

function statusClass(status) {
  switch (status) {
    case "Needs Repair": return "status-needs-repair";
    case "Repair In Progress": return "status-repair-progress";
    case "Repair Completed": return "status-repair-completed";
    default: return "status-maintenance";
  }
}
