let bookings = [];

// -------------------------
// Status helper function
// -------------------------
function getStatusClass(status) {
    switch(status?.toLowerCase()) {
        case 'available': return 'status-available';
        case 'maintenance': return 'status-maintenance';
        case 'confirmed': return 'status-confirmed';
        case 'cancelled': return 'status-cancelled';
        case 'completed': return 'status-completed';
        case 'in-progress': return 'status-in-progress';
        default: return 'status-pending';
    }
}

// -------------------------
// Fetch bookings from backend API
// -------------------------
async function fetchBookings() {
    try {
        const res = await fetch('/api/Booking'); // <-- your API endpoint
        if (!res.ok) throw new Error('Failed to fetch bookings');
        bookings = await res.json();
    renderAdminBookings();
    } catch (err) {
        console.error('Error fetching bookings:', err);
        bookings = [];
    renderAdminBookings();
    }
}

// -------------------------
// Render bookings table
// -------------------------

export function renderAdminBookings() {
    const tbody = document.getElementById("adminBookingsTableBody");
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

    bookings.forEach((b, i) => {
        const row = document.createElement('tr');
        const statusName = b.bookingStatus?.name || b.bookingStatusId || 'Pending';
        const statusClass = getStatusClass(statusName);
        row.innerHTML = `
            <td>${b.bookingId}</td>
            <td>${b.user?.displayName || b.user?.name || b.user?.username || b.userId}</td>
            <td>${b.equipment?.name || b.equipmentId}</td>
            <td><span class="${statusClass}">${statusName}</span></td>
            <td>${b.fromDate ? new Date(b.fromDate).toLocaleString() : ''}</td>
            <td>${b.toDate ? new Date(b.toDate).toLocaleString() : ''}</td>
            <td>${b.notes || ''}</td>
            <td>${b.createdDate ? new Date(b.createdDate).toLocaleString() : ''}</td>
            <td>
                <button class="action-btn approve-btn" data-idx="${i}" style="background:#4CAF50;color:#fff;padding:0.5rem 1.2rem;border-radius:8px;border:none;font-size:1.1rem;margin-right:0.3rem;">Approve</button>
                <button class="action-btn reject-btn" data-idx="${i}" style="background:#e57373;color:#fff;padding:0.5rem 1.2rem;border-radius:8px;border:none;font-size:1.1rem;margin-right:0.3rem;">Reject</button>
                <button class="action-btn delete-btn" data-idx="${i}" style="background:#8d5fc5;color:#fff;padding:0.5rem 1.2rem;border-radius:8px;border:none;font-size:1.1rem;">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Add event listeners for action buttons
    tbody.querySelectorAll('.approve-btn').forEach(btn => {
        btn.addEventListener('click', async e => {
            const idx = (btn instanceof HTMLElement ? btn.dataset.idx : undefined);
            await updateBookingStatus(idx, 'Approved');
        });
    });
    tbody.querySelectorAll('.reject-btn').forEach(btn => {
        btn.addEventListener('click', async e => {
            const idx = (btn instanceof HTMLElement ? btn.dataset.idx : undefined);
            await updateBookingStatus(idx, 'Rejected');
        });
    });
    tbody.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async e => {
            const idx = (btn instanceof HTMLElement ? btn.dataset.idx : undefined);
            await deleteBooking(idx);
        });
    });
}

async function updateBookingStatus(idx, status) {
    const booking = bookings[idx];
    try {
        await fetch(`/api/Booking/${booking.bookingId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        await fetchBookings();
    } catch (e) {
        alert('Failed to update booking status.');
    }
}

async function deleteBooking(idx) {
    const booking = bookings[idx];
    try {
        await fetch(`/api/Booking/${booking.bookingId}`, { method: 'DELETE' });
        await fetchBookings();
    } catch (e) {
        alert('Failed to delete booking.');
    }
}
// -------------------------
// Initialize on page load (for direct navigation)
// -------------------------
window.addEventListener('DOMContentLoaded', fetchBookings);