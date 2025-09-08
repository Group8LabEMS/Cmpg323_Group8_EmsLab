

//static equipment and booking data example, removed after backend and database integration
let equipmentList = [
  { id: 1, name: "Microscope", desc: "MSC-132", loc: "Lab A", status: "Available" },
  { id: 2, name: "Spectrometer", desc: "SPM-2004", loc: "Lab A", status: "Available" },
];

let bookings = [
  { name: "Spectrometer", date: "2025-09-23", start: "13:00", end: "16:00", status: "Active" }
]

//refernces to the DOM Elements
const equipmentTableBody = document.getElementById("equipmentTableBody");
const bookingTableBody = document.getElementById("bookingTableBody");
const bookingModal = document.getElementById("bookingModal");
const confirmBooking = document.getElementById("confirmBooking");
const cancelBooking = document.getElementById("cancelBooking");

//modals for the updateing and delteing of bookings
const updateModal = document.getElementById("updateModal");
const deleteModal = document.getElementById("deleteModal");
const deleteMessage = document.getElementById("deleteMessage");

let selectedEquipment = null;
let selectedBookingIndex = null;


/* -------- render equipment table -------- */
function renderEquipment() {
  // innerhtml version - removed
  /*
  equipmentTableBody.innerHTML = "";
  equipmentList.forEach(eq => {
    let row = `
      <tr>
        <td>${eq.name}</td>
        <td>${eq.desc}</td>
        <td>${eq.loc}</td>
        <td>
          ${eq.status === "Available" 
            ? `<span class="status-available">${eq.status}</span>` 
            : `<span class="status-maintenance">${eq.status}</span>`}
        </td>
        <td>
          ${eq.status === "Available" 
            ? `<button class="action-book" onclick="openBooking(${eq.id})">Book</button>` 
            : `<button class="action-disabled" disabled>N/A</button>`}
        </td>
      </tr>
    `;
    equipmentTableBody.innerHTML += row;
  });
  */

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

/* -------- render bookings table -------- */
function renderBookings() {
  bookingTableBody.replaceChildren();

  bookings.forEach((b, i) => {
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

  // innerHTML version - removed
  /*
  bookingTableBody.innerHTML = "";
  bookings.forEach((b, i) => {
    let row = `
      <tr>
        <td>${b.name}</td>
        <td>${b.date}</td>
        <td>${b.start} - ${b.end}</td>
        <td>${b.status}</td>
        <td>
          <button class="action-book" onclick="openUpdate(${i})">Update</button>
          <button class="action-delete" onclick="openDelete(${i})">Delete</button>
        </td>
      </tr>
    `;
    bookingTableBody.innerHTML += row;
  });
  */
}

/* -------- Functions for bookings -------- */
//Clicking book on equpment opens bookingModal
function openBooking(id) {
  selectedEquipment = equipmentList.find(eq => eq.id === id);
  bookingModal.classList.remove("hidden");
}

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

/* -------- functions for updating bookings -------- */
//opens the update modal with existing booking info
function openUpdate(index) {
  selectedBookingIndex = index;
  const booking = bookings[index];

  document.getElementById("updateDate").value = booking.date;
  document.getElementById("updateStartTime").value = booking.start;
  document.getElementById("updateEndTime").value = booking.end;

  updateModal.classList.remove("hidden");
}


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

/* -------- function for deleteing booking -------- */
//opens the delete modal
function openDelete(index) {
  selectedBookingIndex = index;
  const booking = bookings[index];

  // innerHTML version -removed
  /*
  deleteMessage.innerHTML = `
    Are you sure you want to delete booking?<br>
    <b>Equipment:</b> ${booking.name}<br>
    <b>Date:</b> ${booking.date}<br>
    <b>Time:</b> ${booking.start} - ${booking.end}
  `;
  */

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

/* -------- function for tab switching -------- */
document.querySelectorAll(".sidebar-btn[data-target]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(tab => tab.classList.add("hidden"));
    document.querySelectorAll(".sidebar-btn").forEach(b => b.classList.remove("active"));
    let target = btn.dataset.target;
    document.getElementById(target).classList.remove("hidden");
    btn.classList.add("active");
  });
});

// Book Now button in topbar redirects user to the equipment section
const bookNowBtn = document.getElementById("bookNowBtn");
if (bookNowBtn) {
  bookNowBtn.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelectorAll(".tab").forEach(tab => tab.classList.add("hidden"));
    document.querySelectorAll(".sidebar-btn").forEach(b => b.classList.remove("active"));
    document.getElementById("equipment").classList.remove("hidden");
    document.querySelector('.sidebar-btn[data-target="equipment"]').classList.add("active");
  });
}

/* -------- initial page load -------- */
renderEquipment();
renderBookings();