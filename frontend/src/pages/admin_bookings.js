let bookings = [];

// -------------------------
// Status helper function
// -------------------------
function getStatusClass(status) {
    switch (status?.toLowerCase()) {
        case 'available': return 'status-available';
        case 'maintenance': return 'status-maintenance';
        case 'confirmed': return 'status-confirmed';
        case 'approved': return 'status-confirmed';
        case 'rejected': return 'status-cancelled';
        case 'cancelled': return 'status-cancelled';
        case 'completed': return 'status-completed';
        case 'in-progress': return 'status-in-progress';
        case 'pending': return 'status-pending';
        default: return 'status-pending';
    }
}

// -------------------------
// Fetch bookings from backend API
// -------------------------
export async function fetchBookings() {
    try {
        const res = await fetch('/api/Booking'); // <-- your API endpoint
        if (!res.ok) throw new Error('Failed to fetch bookings');
        const data = await res.json();
        console.log('Raw bookings response:', data);
        bookings = data;
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


    // --- Heading style to match user management ---
    section.classList.remove('hidden');
    // Remove any existing heading
    let heading = section.querySelector('.admin-bookings-heading');
    if (heading) heading.remove();
    // Insert new heading at the top
    const headingDiv = document.createElement('div');
    headingDiv.className = 'admin-bookings-heading';
    headingDiv.innerHTML = `
        <h2 style=\"color:#8d5fc5;font-size:2.5rem;margin-bottom:0.2rem;font-weight:bold;margin: 1rem -7%\">Bookings Management</h2>
        <div style=\"color:#8d5fc5;font-size:1.3rem;margin-bottom:0.5rem;margin: 1rem -7%\">View, approve, reject, and manage bookings.</div>
        <div style=\"clear:both\"></div>
    `;
    section.insertBefore(headingDiv, section.firstChild);

    // --- No background container: render directly in section ---

    // --- Filter/Search UI ---
    let filterBar = document.getElementById('adminBookingsFilterBar');
    if (filterBar) filterBar.remove();
    filterBar = document.createElement('div');
    filterBar.id = 'adminBookingsFilterBar';
    filterBar.className = 'report-controls';
    filterBar.innerHTML = `
        <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1.2rem;">
            <input id="adminBookingsSearch" type="text" placeholder="Search by user or equipment..." style="font-size:1.1rem;padding:0.4rem 1.2rem;border-radius:8px;border:2px solid #8d5fc5;min-width:180px;" />
            <select id="adminBookingsStatusFilter" style="font-size:1.1rem;padding:0.4rem 1.2rem;border-radius:8px;border:2px solid #8d5fc5;min-width:150px;">
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
                <option value="In-Progress">In-Progress</option>
            </select>
            <span style="color:#8d5fc5;font-size:1.3rem;margin-bottom:0.5rem;margin-left:8px;">Start date:</span>
            <input id="adminBookingsFromDateFrom" type="date" title="Booking Start Date From" style="font-size:1.1rem;padding:0.4rem 1.2rem;border-radius:8px;border:2px solid #8d5fc5;min-width:120px;" />
            <span style="margin:0 6px 0 6px;">to</span>
            <input id="adminBookingsFromDateTo" type="date" title="Booking Start Date To" style="font-size:1.1rem;padding:0.4rem 1.2rem;border-radius:8px;border:2px solid #8d5fc5;min-width:120px;" />
            <span style="color:#8d5fc5;font-size:1.3rem;margin-bottom:0.5rem;margin-left:16px;">End date:</span>
            <input id="adminBookingsToDateFrom" type="date" title="Booking End Date From" style="font-size:1.1rem;padding:0.4rem 1.2rem;border-radius:8px;border:2px solid #8d5fc5;min-width:120px;" />
            <span style="margin:0 6px 0 6px;">to</span>
            <input id="adminBookingsToDateTo" type="date" title="Booking End Date To" style="font-size:1.1rem;padding:0.4rem 1.2rem;border-radius:8px;border:2px solid #8d5fc5;min-width:120px;" />
        </div>
    `;
    // Add event listeners to trigger re-render
    filterBar.querySelector('#adminBookingsSearch').addEventListener('input', renderAdminBookings);
    filterBar.querySelector('#adminBookingsStatusFilter').addEventListener('change', renderAdminBookings);
    filterBar.querySelector('#adminBookingsFromDateFrom').addEventListener('change', renderAdminBookings);
    filterBar.querySelector('#adminBookingsFromDateTo').addEventListener('change', renderAdminBookings);
    filterBar.querySelector('#adminBookingsToDateFrom').addEventListener('change', renderAdminBookings);
    filterBar.querySelector('#adminBookingsToDateTo').addEventListener('change', renderAdminBookings);

    // --- Table ---
    tbody.innerHTML = '';
    const table = tbody.closest('table');
    // Remove table from DOM if present
    if (table && table.parentNode) table.parentNode.removeChild(table);

    // Append filterBar and table directly to section
    section.insertBefore(filterBar, headingDiv.nextSibling);
    if (table) {
        table.style.width = '100%';
        section.insertBefore(table, filterBar.nextSibling);
    }

    // Get filter values
    const searchInput = document.getElementById('adminBookingsSearch');
    const statusSelect = document.getElementById('adminBookingsStatusFilter');
    const fromDateFrom = document.getElementById('adminBookingsFromDateFrom');
    const fromDateTo = document.getElementById('adminBookingsFromDateTo');
    const toDateFrom = document.getElementById('adminBookingsToDateFrom');
    const toDateTo = document.getElementById('adminBookingsToDateTo');

    const searchVal = (searchInput && 'value' in searchInput ? String(searchInput.value) : '').toLowerCase();
    const statusVal = (statusSelect && 'value' in statusSelect ? String(statusSelect.value) : '').toLowerCase();
    // Helper to get date part only (YYYY-MM-DD as number)
    function dateOnlyNum(d) {
        if (!d) return null;
        return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    }
    const fromDateFromVal = fromDateFrom && (fromDateFrom instanceof HTMLInputElement) && fromDateFrom.value ? new Date(fromDateFrom.value) : null;
    const fromDateToVal = fromDateTo && (fromDateTo instanceof HTMLInputElement) && fromDateTo.value ? new Date(fromDateTo.value) : null;
    const toDateFromVal = toDateFrom && (toDateFrom instanceof HTMLInputElement) && toDateFrom.value ? new Date(toDateFrom.value) : null;
    const toDateToVal = toDateTo && (toDateTo instanceof HTMLInputElement) && toDateTo.value ? new Date(toDateTo.value) : null;

    // Debug: log filter values
    console.log('Filter values:', {
        fromDateFromVal,
        fromDateToVal,
        toDateFromVal,
        toDateToVal
    });

    // Filter bookings
    let filtered = bookings.filter(b => {
        const user = (b.user?.displayName || b.user?.name || b.user?.username || b.userId || '').toString().toLowerCase();
        const equip = (b.equipment?.name || b.equipmentId || '').toString().toLowerCase();
        const status = (b.bookingStatus?.name || b.bookingStatusId || 'Pending').toString().toLowerCase();
        const fromDate = b.fromDate ? new Date(b.fromDate) : null;
        const toDate = b.toDate ? new Date(b.toDate) : null;
        // Compare only date part (ignore time)
        const fromDateNum = dateOnlyNum(fromDate);
        const fromDateFromNum = dateOnlyNum(fromDateFromVal);
        const fromDateToNum = dateOnlyNum(fromDateToVal);
        const toDateNum = dateOnlyNum(toDate);
        const toDateFromNum = dateOnlyNum(toDateFromVal);
        const toDateToNum = dateOnlyNum(toDateToVal);
        const matchesSearch = !searchVal || user.includes(searchVal) || equip.includes(searchVal);
        const matchesStatus = !statusVal || status === statusVal;
        const matchesFromDateFrom = !fromDateFromNum || (fromDateNum && fromDateNum >= fromDateFromNum);
        const matchesFromDateTo = !fromDateToNum || (fromDateNum && fromDateNum <= fromDateToNum);
        const matchesToDateFrom = !toDateFromNum || (toDateNum && toDateNum >= toDateFromNum);
        const matchesToDateTo = !toDateToNum || (toDateNum && toDateNum <= toDateToNum);
        return matchesSearch && matchesStatus && matchesFromDateFrom && matchesFromDateTo && matchesToDateFrom && matchesToDateTo;
    });

    // Debug: log bookings array
    console.log('Admin bookings to render:', filtered);

    if (filtered.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 8;
        cell.className = 'no-bookings-message';
        cell.textContent = 'No bookings found.';
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }

    filtered.forEach((b, i) => {
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
                <button class="action-btn approve-btn" data-idx="${bookings.indexOf(b)}" style="background:#4CAF50;color:#fff;padding:0.5rem 1.2rem;border-radius:8px;border:none;font-size:1.1rem;margin-right:0.3rem;">Approve</button>
                <button class="action-btn reject-btn" data-idx="${bookings.indexOf(b)}" style="background:#e57373;color:#fff;padding:0.5rem 1.2rem;border-radius:8px;border:none;font-size:1.1rem;margin-right:0.3rem;">Reject</button>
                <button class="action-btn delete-btn" data-idx="${bookings.indexOf(b)}" style="background:#8d5fc5;color:#fff;padding:0.5rem 1.2rem;border-radius:8px;border:none;font-size:1.1rem;">Delete</button>
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

// Helper to cache status name -> id mapping
let bookingStatusMap = null;

async function getBookingStatusMap() {
    if (bookingStatusMap) return bookingStatusMap;
    try {
        const res = await fetch('/api/BookingStatus');
        if (!res.ok) throw new Error('Failed to fetch booking statuses');
        const statuses = await res.json();
        bookingStatusMap = {};
        statuses.forEach(s => {
            bookingStatusMap[s.name.toLowerCase()] = s.bookingStatusId;
        });
        return bookingStatusMap;
    } catch (e) {
        alert('Failed to fetch booking statuses.');
        return {};
    }
}

async function updateBookingStatus(idx, statusName) {
    const booking = bookings[idx];
    const statusMap = await getBookingStatusMap();
    const statusId = statusMap[statusName.toLowerCase()];
    if (!statusId) {
        alert('Unknown status: ' + statusName);
        return;
    }
    // Build updated booking object (clone and update status)
    const updatedBooking = {
        ...booking,
        bookingStatusId: statusId,
        bookingStatus: undefined // let backend resolve
    };
    try {
        const res = await fetch(`/api/Booking/${booking.bookingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedBooking)
        });
        if (!res.ok) throw new Error('Failed to update booking');
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
