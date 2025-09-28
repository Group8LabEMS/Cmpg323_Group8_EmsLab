

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
    const tbody = document.querySelector("#admin-bookings-table tbody");
    const section = document.getElementById("admin-bookings");
    if (!tbody || !section) return;
    section.classList.remove('hidden');
    tbody.innerHTML = '';
    if (bookings.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 8;
        cell.className = 'no-bookings-message';
        cell.textContent = 'No bookings found.';
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }
    bookings.forEach(b => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${b.bookingId}</td>
            <td>${b.user?.name || b.user?.username || b.userId}</td>
            <td>${b.equipment?.name || b.equipmentId}</td>
            <td>${b.bookingStatus?.name || b.bookingStatusId}</td>
            <td>${b.fromDate ? new Date(b.fromDate).toLocaleString() : ''}</td>
            <td>${b.toDate ? new Date(b.toDate).toLocaleString() : ''}</td>
            <td>${b.notes || ''}</td>
            <td>${b.createdDate ? new Date(b.createdDate).toLocaleString() : ''}</td>
        `;
        tbody.appendChild(row);
    });
}

window.addEventListener('DOMContentLoaded', fetchBookings);
