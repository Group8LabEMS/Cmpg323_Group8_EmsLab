import { html, render } from "lit";
import { renderAdminDashboard as adminDash } from "./admin_dashboard.js";
import { getUserBookingDates, getUserUpcomingBookings } from "../api/api.js";
import { getCurrentUser } from "../util/auth.js";

let currentCalendarDate = new Date();
let userBookingDates = [];

export async function renderDashboard() {
  const dashboardSection = document.getElementById("dashboard");
  if (!dashboardSection) return;
  const role = window.currentRole;
  if (role === 'Admin') {
    adminDash();
    return;
  }

  const user = await getCurrentUser();
  if (!user) return;

  try {
    const bookingData = await getUserBookingDates(user.userId);
    userBookingDates = Array.isArray(bookingData) ? bookingData : [];
  } catch (err) {
    console.error('Error fetching booking dates:', err);
    userBookingDates = [];
  }

  renderCalendarAndBookings(dashboardSection, user.userId);
}

async function renderCalendarAndBookings(dashboardSection, userId) {
  const calendar = generateCalendar();
  let upcomingBookings = [];
  
  try {
    const bookingsData = await getUserUpcomingBookings(userId);
    upcomingBookings = Array.isArray(bookingsData) ? bookingsData : [];
  } catch (err) {
    console.error('Error fetching upcoming bookings:', err);
    upcomingBookings = [];
  }

  render(html`
    <div class="dashboard-flex">
      <div class="dashboard-row">
        <div class="card dashboard-card dashboard-calendar-card" style="max-height: unset">
          <div class="card-title dashboard-calendar-header">
            <button @click=${() => changeMonth(-1)} class="dashboard-calendar-nav">‹</button>
            <span>${calendar.monthName} ${calendar.year}</span>
            <button @click=${() => changeMonth(1)} class="dashboard-calendar-nav">›</button>
          </div>
          <table class="dashboard-calendar-table">
            <thead><tr>
              <th>MON</th><th>TUE</th><th>WED</th><th>THU</th><th>FRI</th><th>SAT</th><th>SUN</th>
            </tr></thead>
            <tbody>
              ${calendar.rows}
            </tbody>
          </table>
        </div>
        <div class="card dashboard-card dashboard-bookings-card">
          <div class="card-title">Upcoming Bookings</div>
          <ul class="dashboard-bookings-list">
            ${upcomingBookings.length === 0 ? 
              html`<li class="dashboard-no-bookings">No upcoming bookings</li>` :
              upcomingBookings.map(booking => html`
                <li>
                  <span class="dashboard-booking-dot"></span>
                  <div class="dashboard-booking-content">
                    <span class="dashboard-booking-equip">${booking.equipmentName}</span>
                    <span class="dashboard-booking-time">
                      ${new Date(booking.fromDate).toLocaleDateString()}<br>
                      ${new Date(booking.fromDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} to ${new Date(booking.toDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </li>
              `)
            }
          </ul>
        </div>
      </div>
    </div>
  `, dashboardSection);
}

function generateCalendar() {
  const today = new Date();
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const firstDay = new Date(year, month, 1);
  let startDay = firstDay.getDay();
  startDay = startDay === 0 ? 6 : startDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  
  let rows = [];
  let week = [];
  
  for (let i = 0; i < startDay; i++) {
    week.push(html`<td class="dashboard-calendar-prev-month">${prevMonthDays - startDay + i + 1}</td>`);
  }
  
  for (let d = 1; d <= daysInMonth; d++) {
    const currentDate = new Date(year, month, d);
    const isToday = currentDate.toDateString() === today.toDateString();
    const hasBooking = userBookingDates && userBookingDates.length > 0 && userBookingDates.some(booking => {
      const bookingDate = new Date(booking.date || booking.Date);
      return bookingDate.toDateString() === currentDate.toDateString();
    });
    const bookingInfo = userBookingDates && userBookingDates.find(booking => {
      const bookingDate = new Date(booking.date || booking.Date);
      return bookingDate.toDateString() === currentDate.toDateString();
    });
    
    let cssClass = '';
    if (isToday) {
      cssClass = 'dashboard-calendar-today';
    } else if (hasBooking) {
      cssClass = (bookingInfo?.isPast || bookingInfo?.IsPast) ? 'dashboard-calendar-past-booking' : 'dashboard-calendar-future-booking';
    }
    
    week.push(html`<td class="${cssClass}">${d}</td>`);
    if ((week.length) % 7 === 0) {
      rows.push(html`<tr>${week}</tr>`);
      week = [];
    }
  }
  
  let trailing = 1;
  while (week.length < 7) {
    week.push(html`<td class="dashboard-calendar-prev-month">${trailing++}</td>`);
  }
  rows.push(html`<tr>${week}</tr>`);
  
  return {
    monthName: monthNames[month],
    year,
    rows
  };
}

async function changeMonth(direction) {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() + direction);
  const user = await getCurrentUser();
  if (user) {
    renderCalendarAndBookings(document.getElementById("dashboard"), user.userId);
  }
}
