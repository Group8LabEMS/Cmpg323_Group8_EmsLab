import { renderBookings } from "./pages/bookings.js";
import { renderEquipment } from "./pages/equipent.js";


//---------- Tab switching ----------//
document.querySelectorAll(".sidebar-btn[data-target]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(tab => tab.classList.add("hidden"));
    document.querySelectorAll(".sidebar-btn").forEach(b => b.classList.remove("active"));
    let target = btn.dataset.target;
    document.getElementById(target).classList.remove("hidden");
    btn.classList.add("active");
  });
});

//---------- Book now ----------//
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

//---------- Initial page setup ----------//
renderEquipment();
renderBookings();