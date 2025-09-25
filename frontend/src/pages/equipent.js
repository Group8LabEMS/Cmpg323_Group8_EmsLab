import { html, render as litRender } from "lit";
import { openBooking } from "./bookings.js";
import { getEquipment } from "../util/api";

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
  getEquipment()
    .then(equipment => {
      // Use the fetched equipment array to render your table
      const tableRows = equipment.map(eq => html`
        <tr>
          <td>${eq.name}</td>
          <td>${eq.equipmentStatus.description}</td>
        </tr>
      `);
      litRender(html`${tableRows}`, equipmentTableBody);
    })
    .catch(err => console.error(err));



}
