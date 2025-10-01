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
  //{ name: "Spectrometer", date: "2025-09-23", start: "13:00", end: "16:00", status: "Active" }
];


//---------- Utils ----------//

/**
 * Opens the booking modal for the equipment with the specified ID.
 * @param {number} id 
 */
export function openBooking(id) {
  selectedEquipment = equipmentList.find(eq => eq.id === id);
  bookingModal.classList.remove("hidden");
}

/**
 * Opens the update modal with pre-filled data for an existing booking.
 * @param {number} index 
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
 * @param {number} index 
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

//confirmation of booking, adds booking to backend and refreshes bookings list
confirmBooking.addEventListener("click", async () => {
  let date = getInputById("bookingDate").value;
  let start = getInputById("startTime").value;
  let end = getInputById("endTime").value;

  if (selectedEquipment && date && start && end) {
    // Get logged-in user
    // Use static user and equipment values for backend validation
    const staticUser = {
      userId: 1,
      displayName: "Static User",
      email: "user@example.com",
      ssoId: "user",
      password: "user",
      createdAt: new Date().toISOString(),
      userRoles: [],
      bookings: [],
      auditLogs: []
    };
    const staticBookingStatus = {
      bookingStatusId: 1,
      name: "Active",
      description: "Active booking",
      bookings: []
    };
    const staticEquipment = {
      equipmentId: selectedEquipment.id,
      name: selectedEquipment.name,
      equipmentTypeId: selectedEquipment.equipmentTypeId || 1,
      equipmentType: null,
      equipmentStatusId: selectedEquipment.equipmentStatusId || 1,
      equipmentStatus: null,
      availability: String(selectedEquipment.availability ?? "true"),
      createdDate: new Date().toISOString(),
      bookings: [],
      maintenances: []
    };

    // Build booking object for backend
    const booking = {
      userId: staticUser.userId,
      equipmentId: staticEquipment.equipmentId,
      bookingStatusId: staticBookingStatus.bookingStatusId,
      fromDate: `${date}T${start}:00`,
      toDate: `${date}T${end}:00`,
      notes: "",
      createdDate: new Date().toISOString()
    };

    // Send to backend
    const response = await fetch("/api/Booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking)
    });

    if (response.ok) {
      bookingModal.classList.add("hidden");
      await fetchAndRenderBookings();
    } else {
      alert("Booking failed: " + await response.text());
    }
  } else {
    alert("Please fill in all fields.");
  }
});

// Fetch bookings from backend and render
async function fetchAndRenderBookings() {
  const response = await fetch("/api/Booking");
  if (response.ok) {
    const data = await response.json();
    bookings = data.map(b => ({
      name: b.equipment?.name || "",
      date: b.fromDate?.split("T")[0] || "",
      start: b.fromDate?.split("T")[1]?.slice(0,5) || "",
      end: b.toDate?.split("T")[1]?.slice(0,5) || "",
      status: b.bookingStatus?.name || ""
    }));
    renderBookings();
  }
}

// Initial fetch on page load
fetchAndRenderBookings();

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
