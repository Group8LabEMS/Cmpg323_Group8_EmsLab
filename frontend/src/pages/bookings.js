import { deleteMessage } from "../util/modals.js";
import { equipmentList } from "./equipent.js";

//---------- Element references ----------//
const bookingTableBody = document.getElementById("bookingTableBody");
const bookingModal = document.getElementById("bookingModal");
const confirmBooking = document.getElementById("confirmBooking");
const cancelBooking = document.getElementById("cancelBooking");


//---------- State ----------//
let selectedEquipment = null;
let selectedBookingIndex = null;

export let bookings = [
  { name: "Spectrometer", date: "2025-09-23", start: "13:00", end: "16:00", status: "Active" }
];


//---------- Utils ----------//
//Clicking book on equpment opens bookingModal
export function openBooking(id) {
  selectedEquipment = equipmentList.find(eq => eq.id === id);
  bookingModal.classList.remove("hidden");
}

//opens the update modal with existing booking info
export function openUpdate(index) {
  selectedBookingIndex = index;
  const booking = bookings[index];

  document.getElementById("updateDate").value = booking.date;
  document.getElementById("updateStartTime").value = booking.start;
  document.getElementById("updateEndTime").value = booking.end;

  updateModal.classList.remove("hidden");
}

//opens the delete modal
export function openDelete(index) {
  selectedBookingIndex = index;
  const booking = bookings[index];

  // DOM safe - new
  deleteMessage.replaceChildren();

  const msg = document.createElement("p");
  msg.textContent = "Are you sure you want to delete booking?";
  deleteMessage.appendChild(msg);

  const equipmentLine = document.createElement("p");
  const eqStrong = document.createElement("strong");
  eqStrong.textContent = "Equipment: ";
  equipmentLine.appendChild(eqStrong);
  equipmentLine.append(booking.name);
  deleteMessage.appendChild(equipmentLine);

  const dateLine = document.createElement("p");
  const dateStrong = document.createElement("strong");
  dateStrong.textContent = "Date: ";
  dateLine.appendChild(dateStrong);
  dateLine.append(booking.date);
  deleteMessage.appendChild(dateLine);

  const timeLine = document.createElement("p");
  const timeStrong = document.createElement("strong");
  timeStrong.textContent = "Time: ";
  timeLine.appendChild(timeStrong);
  timeLine.append(`${booking.start} - ${booking.end}`);
  deleteMessage.appendChild(timeLine);

  deleteModal.classList.remove("hidden");
}


//---------- Renderers ----------//
export function renderBookings() {
  bookingTableBody.replaceChildren();

  bookings.forEach((b, i)=> {
    const row = document.createElement("tr");

    // Name
    const nameTd = document.createElement("td");
    nameTd.textContent = b.name;
    row.appendChild(nameTd);

    // Date
    const dateTd = document.createElement("td");
    dateTd.textContent = b.date;
    row.appendChild(dateTd);

    // Time
    const timeTd = document.createElement("td");
    timeTd.textContent = `${b.start} - ${b.end}`;
    row.appendChild(timeTd);

    // Status
    const statusTd = document.createElement("td");
    statusTd.textContent = b.status;
    row.appendChild(statusTd);

    // Actions
    const actionTd = document.createElement("td");

    const updateBtn = document.createElement("button");
    updateBtn.textContent = "Update";
    updateBtn.className = "action-book";
    updateBtn.addEventListener("click", () => openUpdate(i));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "action-delete";
    deleteBtn.addEventListener("click", () => openDelete(i));

    actionTd.appendChild(updateBtn);
    actionTd.appendChild(deleteBtn);
    row.appendChild(actionTd);

    bookingTableBody.appendChild(row);
  });
}


//---------- Event handlers ----------//

//confirmation of booking, adds booking to bookings list
confirmBooking.addEventListener("click", () => {
  let date = document.getElementById("bookingDate").value;
  let start = document.getElementById("startTime").value;
  let end = document.getElementById("endTime").value;

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
  let date = document.getElementById("updateDate").value;
  let start = document.getElementById("updateStartTime").value;
  let end = document.getElementById("updateEndTime").value;

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