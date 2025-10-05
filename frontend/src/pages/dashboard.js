// Basic dashboard renderer
import { html, render } from "lit";
import { renderAdminDashboard as adminDash } from "./admin_dashboard.js";

export function renderDashboard() {
  const dashboardSection = document.getElementById("dashboard");
  if (!dashboardSection) return;
  const role = localStorage.getItem('role');
  if (role === 'admin') {
    adminDash();
    return;
  }
 
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
    const isToday = d === day;
    week.push(html`<td style=${isToday ? 'background:#c6f3c6;border-radius:6px;font-weight:bold;' : ''}>${d}</td>`);
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
          <li style="margin-bottom:2.2rem;">
            <span class="dashboard-booking-dot" style="width:14px;height:14px;"></span>
            <span class="dashboard-booking-equip" style="font-size:1.18rem;">Spectrometer</span><br>
            <span class="dashboard-booking-time" style="font-size:1.08rem;">2025-09-23<br>13:00 to 16:00</span>
          </li>
          <li style="margin-bottom:2.2rem;">
            <span class="dashboard-booking-dot" style="width:14px;height:14px;"></span>
            <span class="dashboard-booking-equip" style="font-size:1.18rem;">Centrifuge</span><br>
            <span class="dashboard-booking-time" style="font-size:1.08rem;">2025-10-30<br>15:30 to 17:30</span>
          </li>
          <li>
            <span class="dashboard-booking-dot" style="width:14px;height:14px;"></span>
            <span class="dashboard-booking-equip" style="font-size:1.18rem;">Workstation A01</span><br>
            <span class="dashboard-booking-time" style="font-size:1.08rem;">2025-10-20<br>10:00 to 12:00</span>
          </li>
        </ul>
      </div>
    </div>
  `, dashboardSection);
}
