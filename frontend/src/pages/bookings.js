import { html, render as litRender } from "lit";
import { deleteMessage } from "../util/modals.js";
import { equipmentList } from "./equipent.js";
import { updateModal, deleteModal } from "../util/modals.js";
import { getInputById } from "../util/dom.js";
import { apiFetch } from "../api/api.js";
import { addToast } from "../util/toast.js";

//---------- Element references ----------//
const bookingTableBody = document.getElementById("bookingTableBody");
const bookingModal = document.getElementById("bookingModal");
const confirmBooking = document.getElementById("confirmBooking");
const cancelBooking = document.getElementById("cancelBooking");

//---------- State ----------//
let selectedEquipment = null;
let selectedBookingIndex = null;

/**
 * Map booking status to CSS class
 */
function getStatusClass(status) {
  switch ((status || '').toLowerCase()) {
    case 'pending': return 'pending';
    case 'approved': return 'approved';
    case 'rejected': return 'rejected';
    case 'cancelled': return 'cancelled';
    case 'completed': return 'completed';
    default: return '';
  }
}

/**
 * List of current equipment bookings.
 */
export let bookings = [];

//---------- Utils ----------//
export function openBooking(id) {
  selectedEquipment = equipmentList.find(eq => eq.id === id);
  bookingModal.classList.remove("hidden");
}

export function openUpdate(index) {
  selectedBookingIndex = index;
  const booking = bookings[index];

  getInputById("updateDate").value = booking.date;
  getInputById("updateStartTime").value = booking.start;
  getInputById("updateEndTime").value = booking.end;

  updateModal.classList.remove("hidden");
}

export function openDelete(index) {
  selectedBookingIndex = index;
  const booking = bookings[index];

  litRender(html`
    <p><strong>Equipment: </strong>${booking.name}</p>
    <p><strong>Date: </strong>${booking.date}</p>
    <p><strong>Time: </strong>${booking.start} - ${booking.end}</p>
  `, deleteMessage);
  deleteModal.classList.remove("hidden");
}

//---------- Renderers ----------//
export function renderBookings() {
  const tableRows = bookings.map((b, i) => html`
    <tr>
      <td>${b.name}</td>
      <td>${b.date}</td>
      <td>${b.start} - ${b.end}</td>
      <td><span class="status ${getStatusClass(b.status)}">${b.status}</span></td>
      <td>
        <button class="btn btn-primary" @click=${() => openUpdate(i)}>Update</button>
        <button class="btn btn-danger" title="Delete booking" @click=${() => openDelete(i)}>Delete</button>
      </td>
    </tr>
  `);
  litRender(html`${tableRows}`, bookingTableBody);
}

//---------- Event handlers ----------//
confirmBooking.addEventListener("click", async () => {
  let date = getInputById("bookingDate").value;
  let start = getInputById("startTime").value;
  let end = getInputById("endTime").value;

  if (selectedEquipment && date && start && end) {
    const booking = {
      userId: window.currentUser?.userId || 1, // Use logged-in user ID
      equipmentId: selectedEquipment.id,
      bookingStatusId: 1, // Pending
      fromDate: `${date}T${start}:00`,
      toDate: `${date}T${end}:00`,
      notes: "",
      createdDate: new Date().toISOString()
    };

    try {
      await apiFetch('POST', '/api/Booking', { body: booking });
      bookingModal.classList.add("hidden");
      await fetchAndRenderBookings();
      addToast('Success', 'Booking created successfully');
    } catch (err) {
      console.error('Booking error:', err);
      addToast('Booking Error', err.message);
    }
  } else {
    addToast('Validation Error', 'Please fill in all fields.');
  }
});

async function fetchAndRenderBookings() {
  try {
    const data = await apiFetch('GET', '/api/Booking');
    bookings = data.map(b => ({
      id: b.bookingId,
      name: b.equipment?.name || "",
      date: b.fromDate?.split("T")[0] || "",
      start: b.fromDate?.split("T")[1]?.slice(0,5) || "",
      end: b.toDate?.split("T")[1]?.slice(0,5) || "",
      status: b.bookingStatus?.name || "Pending"
    }));
    renderBookings();
  } catch (err) {
    console.error("Error fetching bookings:", err);
    bookings = [];
    renderBookings();
  }
}

// Initial fetch on page load
fetchAndRenderBookings();

cancelBooking.addEventListener("click", () => {
  bookingModal.classList.add("hidden");
});

document.getElementById("confirmUpdate").addEventListener("click", async () => {
  let date = getInputById("updateDate").value;
  let start = getInputById("updateStartTime").value;
  let end = getInputById("updateEndTime").value;

  if (date && start && end) {
    const booking = bookings[selectedBookingIndex];
    const updateData = {
      fromDate: `${date}T${start}:00`,
      toDate: `${date}T${end}:00`
    };

    try {
      await apiFetch('PUT', `/api/Booking/${booking.id}`, { body: updateData });
      updateModal.classList.add("hidden");
      await fetchAndRenderBookings();
      addToast('Success', 'Booking updated successfully');
    } catch (err) {
      console.error('Update error:', err);
      addToast('Update Error', err.message);
    }
  } else {
    addToast('Validation Error', 'Please fill in all fields.');
  }
});

document.getElementById("cancelUpdate").addEventListener("click", () => {
  updateModal.classList.add("hidden");
});

document.getElementById("confirmDelete").addEventListener("click", async () => {
  const booking = bookings[selectedBookingIndex];
  
  try {
    await apiFetch('DELETE', `/api/Booking/${booking.id}`);
    deleteModal.classList.add("hidden");
    await fetchAndRenderBookings();
    addToast('Success', 'Booking deleted successfully');
  } catch (err) {
    console.error('Delete error:', err);
    addToast('Delete Error', err.message);
  }
});

document.getElementById("cancelDelete").addEventListener("click", () => {
  deleteModal.classList.add("hidden");
});
