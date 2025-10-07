// Basic dashboard renderer
import { html, render } from "lit";
import { renderAdminDashboard as adminDash } from "./admin_dashboard.js";

export async function renderDashboard() {
  const dashboardSection = document.getElementById("dashboard");
  if (!dashboardSection) return;
  const role = localStorage.getItem('role');
  if (role === 'admin') {
    adminDash();
    return;
  }
 //fetch and flatten bookings to remove circular refs
  const userId = localStorage.getItem('userID');
  const bookings = await fetch(`/api/Booking?userId=${userId}`)
    .then(res=> res.json())
    .catch(() => []);
  console.log('Fetched bookings:', bookings);
  
  const flattenedBookings = bookings.map(b => ({
    bookingId: b.bookingId,
    fromDate: b.fromDate,
    toDate: b.toDate,
    notes: b.notes,
    equipmentName: b.equipment?.name || 'Unknown Equipment',
    userName: b.user?.displayName || 'Unknown User',
    bookingStatus: b.bookingStatus?.name || 'Unknown Status'
  }));

  console.log('Flattened bookings:', flattenedBookings);

  //get booking status for dot colors
  const bookingDates = flattenedBookings.map(b => {
    const start = new Date(b.fromDate);
    if (isNaN(start.getTime())) return null;
    return { 
      date: start.toLocaleDateString('en-CA'), // 'YYYY-MM-DD' in local timezone
      status: b.bookingStatus 
    };
  }).filter(Boolean);

  // Calendar logic
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); 
  const day = today.getDate();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonth = monthNames[month];
  const firstDay = new Date(year, month, 1);
  let startDay = firstDay.getDay();
  startDay = startDay === 0 ? 6 : startDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  let rows = [];
  let week = [];

  for (let i = 0; i < startDay; i++) {
    week.push(html`<td style="color:#bbb">${prevMonthDays - startDay + i + 1}</td>`);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const currentDate = new Date(year, month, d).toLocaleDateString('en-CA');
    const isToday = d === day;
    const bookingForDay = bookingDates.find(b => b.date === currentDate);

    // show dot color based on status
    let dotColor = bookingForDay ? 'red' : '';
    if (bookingForDay) {
      if (bookingForDay.status === 'Approved') dotColor = 'green';
      else if (bookingForDay.status === 'Pending') dotColor = 'orange';
      else if (bookingForDay.status === 'Cancelled') dotColor = 'gray';
    }

    week.push(html`
      <td style=${isToday ? 'background:#c6f3c6;border-radius:6px;font-weight:bold;position:relative;' : 'position:relative;'}>
        ${d}
        ${dotColor ? html`<span style="position:absolute;bottom:2px;left:50%;transform:translateX(-50%);width:6px;height:6px;background:${dotColor};border-radius:50%;display:inline-block;"></span>` : ''}
      </td>
    `);

    if ((week.length) % 7 === 0) {
      rows.push(html`<tr>${week}</tr>`);
      week = [];
    }
  }

  let trailing = 1;
  while (week.length < 7) {
    week.push(html`<td style="color:#bbb">${trailing++}</td>`);
  }
  rows.push(html`<tr>${week}</tr>`);

  //Map bookings to HTML list items
  const bookingItems = flattenedBookings.map(b => {
  const start = new Date(b.fromDate);
  const end = new Date(b.toDate);

  //Only proceed if start and end are valid
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

  const date = start.toISOString().split('T')[0];
  const startTime = start.toTimeString().substring(0,5);
  const endTime = end.toTimeString().substring(0,5);

  // Determine dot color for booking list
  let dotColor = 'red';
  if (b.bookingStatus === 'Approved') dotColor = 'green';
  else if (b.bookingStatus === 'Pending') dotColor = 'orange';
  else if (b.bookingStatus === 'Cancelled') dotColor = 'gray';

  return html`
    <li style="margin-bottom:2.2rem;">
      <span class="dashboard-booking-dot" style="width:14px;height:14px;background:${dotColor};border-radius:50%;display:inline-block;margin-right:8px;"></span>
      <span class="dashboard-booking-equip" style="font-size:1.18rem;">
        ${b.equipmentName || 'Unknown Equipment'}
      </span><br>
      <span class="dashboard-booking-time" style="font-size:1.08rem;">
        ${date}<br>${startTime} to ${endTime}
      </span>
      <br>
    </li>
  `;
}).filter(Boolean); // remove nulls

  render(html`
    <div class="dashboard-flex" style="gap:3.5rem;">
      <div class="dashboard-calendar-card" style="min-width:420px;max-width:520px;padding:2.5rem 2.5rem 2.5rem 2.5rem;">
        <div class="dashboard-calendar-title" style="font-size:1.6rem;margin-bottom:1.2rem;"> ${currentMonth} ${year}</div>
        <table class="dashboard-calendar-table" style="font-size:1.25rem;">
          <thead>
            <tr>
              <th style="font-size:1.1rem;padding:0.7rem 0.5rem;">MON</th><th style="font-size:1.1rem;padding:0.7rem 0.5rem;">TUE</th><th style="font-size:1.1rem;padding:0.7rem 0.5rem;">WED</th><th style="font-size:1.1rem;padding:0.7rem 0.5rem;">THU</th><th style="font-size:1.1rem;padding:0.7rem 0.5rem;">FRI</th><th style="font-size:1.1rem;padding:0.7rem 0.5rem;">SAT</th><th style="font-size:1.1rem;padding:0.7rem 0.5rem;">SUN</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
      <div class="dashboard-bookings-card" style="min-width:340px;max-width:420px;padding:2.5rem 2.5rem 2.5rem 2.5rem;">
        <div class="dashboard-bookings-title" style="font-size:1.6rem;margin-bottom:1.2rem;">Upcoming Bookings</div>
        <ul class="dashboard-bookings-list" style="font-size:1.18rem;">
          ${bookingItems.length > 0
            ? bookingItems
            : html`<li>No bookings found</li>`}
        </ul>
      </div>
    </div>
  `, dashboardSection);
}
