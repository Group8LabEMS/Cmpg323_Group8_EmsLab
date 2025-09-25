import { html, render as litRender } from "lit";
import { deleteMessage } from "../util/modals.js";
import { equipmentList } from "./equipent.js";
import { updateModal, deleteModal } from "../util/modals.js";
import { getInputById } from "../util/dom.js";

//---------- Element references ----------//
const bookingTableBody = document.getElementById("bookingTableBody");
const bookingModal = document.getElementById("bookingModal");
const confirmBooking = document.getElementById("confirmBooking");
const cancelBooking = document.getElementById("cancelBooking");


//---------- State ----------//
let selectedEquipment = null;
let selectedBookingIndex = null;

/**
 * List of current equipment bookings.
 * @type {Array<{name: string, date: string, start: string, end: string, status: string}>}
 */
export let bookings = [
  { name: "Spectrometer", date: "2025-09-23", start: "13:00", end: "16:00", status: "Active" }
];


//---------- Utils ----------//

/**
 * Opens the booking modal for the equipment with the specified ID.
 * @param {number} id - The ID of the equipment to book.
 */
export function openBooking(id) {
  selectedEquipment = equipmentList.find(eq => eq.id === id);
  bookingModal.classList.remove("hidden");
}

/**
 * Opens the update modal with pre-filled data for an existing booking.
 * @param {number} index - Index of the booking to update.
 */
export function openUpdate(index) {
  selectedBookingIndex = index;
  const booking = bookings[index];

  getInputById("updateDate").value = booking.date;
  getInputById("updateStartTime").value = booking.start;
  getInputById("updateEndTime").value = booking.end;

  updateModal.classList.remove("hidden");
}

/**
 * Opens the delete confirmation modal for a selected booking.
 * @param {number} index - Index of the booking to delete.
 */
export function openDelete(index) {
  selectedBookingIndex = index;
  const booking = bookings[index];

  litRender(html`
    <p>Are you sure you want to delete booking?</p>
    <p><strong>Equipment: </strong>${booking.name}</p>
    <p><strong>Date: </strong>${booking.date}</p>
    <p><strong>Time: </strong>${booking.start} - ${booking.end}</p>
  `, deleteMessage);
  deleteModal.classList.remove("hidden");
}


//---------- Renderers ----------//

/**
 * Renders the list of bookings into the bookings table.
 */
export function renderBookings() {
  const tableRows = bookings.map((b, i) => html`
    <tr>
      <td>${b.name}</td>
      <td>${b.date}</td>
      <td>${b.start} - ${b.end}</td>
      <td>${b.status}</td>
      <td>
        <button class="action-book" @click=${() => openUpdate(i)}>Update</button>
        <button class="action-delete" title="Delete booking" @click=${() => openDelete(i)}>Delete</button>
      </td>
    </tr>
  `);
  litRender(html`${tableRows}`, bookingTableBody);
}


//---------- Event handlers ----------//

//confirmation of booking, adds booking to bookings list
confirmBooking.addEventListener("click", () => {
  let date = getInputById("bookingDate").value;
  let start = getInputById("startTime").value;
  let end = getInputById("endTime").value;

  if (selectedEquipment && date && start && end) {
    //add new booking
    bookings.push({
      name: selectedEquipment.name,
      date,
      start,
      end,
      status: "Active"
    });
    renderBookings();
    bookingModal.classList.add("hidden");
  } else {
    alert("Please fill in all fields.");
  }
});

cancelBooking.addEventListener("click", () => {
  bookingModal.classList.add("hidden");
});

//confirm booking update
document.getElementById("confirmUpdate").addEventListener("click", () => {
  let date = getInputById("updateDate").value;
  let start = getInputById("updateStartTime").value;
  let end = getInputById("updateEndTime").value;

  if (date && start && end) {
    bookings[selectedBookingIndex].date = date;
    bookings[selectedBookingIndex].start = start;
    bookings[selectedBookingIndex].end = end;
    renderBookings();
    updateModal.classList.add("hidden");
  } else {
    alert("Please fill in all fields.");
  }
});

//cancel booking
document.getElementById("cancelUpdate").addEventListener("click", () => {
  updateModal.classList.add("hidden");
});

//confirm the deletion of the booking and update the booking list
document.getElementById("confirmDelete").addEventListener("click", () => {
  bookings.splice(selectedBookingIndex, 1);
  renderBookings();
  deleteModal.classList.add("hidden");
});

//cancel the delete of booking
document.getElementById("cancelDelete").addEventListener("click", () => {
  deleteModal.classList.add("hidden");
});
