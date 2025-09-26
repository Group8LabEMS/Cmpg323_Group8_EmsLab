import { html, render as litRender } from "lit";

let bookings = [];

async function fetchBookings() {
    try {
        const res = await fetch('/api/Booking');
        if (!res.ok) throw new Error('Failed to fetch bookings');
        bookings = await res.json();
        renderBookings();
    } catch (err) {
        console.error('Error fetching bookings:', err);
        bookings = [];
        renderBookings();
    }
}

function renderBookings() {
    const section = document.getElementById("admin-bookings");
    if (!section) return;
    section.classList.remove('hidden');
    litRender(html`
        <h2 class="tab-title" style="color:#8d5fc5;font-size:2.5rem;margin-bottom:0.2rem;">All Bookings</h2>
        <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px #e0d3f3;">
            <thead>
                <tr style="background:#8d5fc5;color:#fff;">
                    <th>Booking ID</th>
                    <th>User</th>
                    <th>Equipment</th>
                    <th>Status</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Notes</th>
                    <th>Created</th>
                </tr>
            </thead>
            <tbody>
                ${bookings.length === 0 ? html`<tr><td colspan="8" style="text-align:center;">No bookings found.</td></tr>` :
                    bookings.map(b => html`
                        <tr>
                            <td>${b.bookingId}</td>
                            <td>${b.user?.name || b.user?.username || b.userId}</td>
                            <td>${b.equipment?.name || b.equipmentId}</td>
                            <td>${b.bookingStatus?.name || b.bookingStatusId}</td>
                            <td>${b.fromDate ? new Date(b.fromDate).toLocaleString() : ''}</td>
                            <td>${b.toDate ? new Date(b.toDate).toLocaleString() : ''}</td>
                            <td>${b.notes || ''}</td>
                            <td>${b.createdDate ? new Date(b.createdDate).toLocaleString() : ''}</td>
                        </tr>
                    `)
                }
            </tbody>
        </table>
        </div>
    `, section);
}

window.addEventListener('DOMContentLoaded', fetchBookings);
