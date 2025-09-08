import { openBooking } from "./bookings.js";

//---------- Element references ----------//
const equipmentTableBody = document.getElementById("equipmentTableBody");


//---------- State ----------//

/**
 * Currently selected equipment.
 * @type {{ id: number, name: string, desc: string, loc: string, status: string } | null}
 */
export let selectedEquipment = null;

/**
 * List of all available equipment.
 * @type {Array<{ id: number, name: string, desc: string, loc: string, status: string }>}
 */
export let equipmentList = [
  { id: 1, name: "Microscope", desc: "MSC-132", loc: "Lab A", status: "Available" },
  { id: 2, name: "Spectrometer", desc: "SPM-2004", loc: "Lab A", status: "Available" },
];


//---------- Renderers ----------//

/**
 * Renders the equipment list into the equipment table.
 * Displays name, description, location, status, and booking action.
 * If equipment is available, a "Book" button is shown that opens the booking modal.
 */
export function renderEquipment() {
  // DOM safe version - new
  equipmentTableBody.replaceChildren();

  equipmentList.forEach(eq => {
    const row = document.createElement("tr");

    // Name
    const nameTd = document.createElement("td");
    nameTd.textContent = eq.name;
    row.appendChild(nameTd);

    // Description
    const descTd = document.createElement("td");
    descTd.textContent = eq.desc;
    row.appendChild(descTd);

    // Location
    const locTd = document.createElement("td");
    locTd.textContent = eq.loc;
    row.appendChild(locTd);

    // Status
    const statusTd = document.createElement("td");
    const statusSpan = document.createElement("span");
    statusSpan.textContent = eq.status;
    statusSpan.className = eq.status === "Available" ? "status-available" : "status-maintenance";
    statusTd.appendChild(statusSpan);
    row.appendChild(statusTd);

    // Action
    const actionTd = document.createElement("td");
    const btn = document.createElement("button");
    if (eq.status === "Available") {
      btn.textContent = "Book";
      btn.className = "action-book";
      btn.addEventListener("click", () => openBooking(eq.id));
    } else {
      btn.textContent = "N/A";
      btn.className = "action-disabled";
      btn.disabled = true;
    }
    actionTd.appendChild(btn);
    row.appendChild(actionTd);

    equipmentTableBody.appendChild(row);
  });
}
