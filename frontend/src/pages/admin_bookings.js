import { html, render as litRender } from "lit";
import { apiFetch } from "../api/api.js";
import { addToast } from "../util/toast.js";

let bookingsList = [];
let bookingStatuses = [];
let searchTerm = '';
let sortKey = 'bookingId';
let sortAsc = true;
let statusFilter = '';
let fromDateFilter = '';
let toDateFilter = '';

// Modal states
let showEditModal = false;
let editBooking = null;
let showDeleteModal = false;
let deleteBookingObj = null;

// Fetch data
export async function fetchBookings() {
    try {
        const data = await apiFetch('GET', '/api/Booking');
        console.log('Raw bookings response:', data);
        bookingsList = data;
    } catch (err) {
        console.error('Error fetching bookings:', err);
        bookingsList = [];
    }
}

async function fetchBookingStatuses() {
    try {
        bookingStatuses = await apiFetch('GET', '/api/BookingStatus');
    } catch (err) {
        console.error('Error fetching booking statuses:', err);
        bookingStatuses = [];
    }
}

// Modal functions
function openEditModal(booking) {
	editBooking = { ...booking };
	showEditModal = true;
	renderAdminBookings();
}

function closeEditModal() {
	showEditModal = false;
	editBooking = null;
	renderAdminBookings();
}

function openDeleteModal(booking) {
	deleteBookingObj = booking;
	showDeleteModal = true;
	renderAdminBookings();
}

function closeDeleteModal() {
	showDeleteModal = false;
	deleteBookingObj = null;
	renderAdminBookings();
}

function handleInput(e, field) {
	if (showEditModal && editBooking) {
		editBooking[field] = e.target.value;
		console.log(`Updated ${field} to:`, e.target.value);
	}
}

function handleSearch(e) {
	searchTerm = e.target.value;
	renderBookingsTable();
}

function handleSort(e) {
	sortKey = e.target.value;
	renderBookingsTable();
}

function handleSortOrder(e) {
	sortAsc = !sortAsc;
	renderBookingsTable();
}

function handleStatusFilter(e) {
	statusFilter = e.target.value;
	renderBookingsTable();
}

function handleFromDateFilter(e) {
	fromDateFilter = e.target.value;
	renderBookingsTable();
}

function handleToDateFilter(e) {
	toDateFilter = e.target.value;
	renderBookingsTable();
}

function getFilteredSortedList() {
	let list = [...bookingsList];
	if (searchTerm) {
		list = list.filter(b => 
			(b.user?.displayName || b.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
			(b.equipment?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
		);
	}
	if (statusFilter) {
		list = list.filter(b => (b.bookingStatus?.name || '').toLowerCase() === statusFilter.toLowerCase());
	}
	// Date overlap filtering
	if (fromDateFilter || toDateFilter) {
		list = list.filter(b => {
			const bookingFrom = b.fromDate ? new Date(b.fromDate) : null;
			const bookingTo = b.toDate ? new Date(b.toDate) : null;
			const filterFrom = fromDateFilter ? new Date(fromDateFilter) : null;
			const filterTo = toDateFilter ? new Date(toDateFilter) : null;
			
			if (!bookingFrom || !bookingTo) return true;
			
			// Check for overlap: booking overlaps with filter range if:
			// booking starts before filter ends AND booking ends after filter starts
			if (filterFrom && filterTo) {
				return bookingFrom <= filterTo && bookingTo >= filterFrom;
			} else if (filterFrom) {
				return bookingTo >= filterFrom;
			} else if (filterTo) {
				return bookingFrom <= filterTo;
			}
			return true;
		});
	}
	list.sort((a, b) => {
		let v1 = a[sortKey]?.toLowerCase?.() || a[sortKey];
		let v2 = b[sortKey]?.toLowerCase?.() || b[sortKey];
		if (v1 < v2) return sortAsc ? -1 : 1;
		if (v1 > v2) return sortAsc ? 1 : -1;
		return 0;
	});
	return list;
}

function renderBookingsTable() {
	const tbody = document.getElementById('adminBookingsTableBody');
	if (!tbody) return;
	litRender(html`
		${getFilteredSortedList().map((b, i) => html`
			<tr>
				<td><strong>${b.bookingId || ''}</strong></td>
				<td>${b.user?.displayName || b.user?.name || b.userId || ''}</td>
				<td>${b.equipment?.name || b.equipmentId || ''}</td>
				<td>
					<span class="badge ${(b.bookingStatus?.name || 'Pending')==='Approved'?'badge-success':'badge-secondary'}">${b.bookingStatus?.name || 'Pending'}</span>
				</td>
				<td>${b.fromDate ? new Date(b.fromDate).toLocaleDateString() : ''}</td>
				<td>${b.toDate ? new Date(b.toDate).toLocaleDateString() : ''}</td>
				<td>
					<button class="btn btn-sm btn-secondary" @click=${() => openEditModal(b)}>Update</button>
					<button class="btn btn-sm btn-danger" @click=${() => openDeleteModal(b)}>Delete</button>
					${showDeleteModal && deleteBookingObj && deleteBookingObj.bookingId === b.bookingId ? html`
						<div class="modal" style="display:flex;">
							<div class="modal-content" style="width:430px;max-width:95vw;">
								<h2 class="modal-title">Delete Booking</h2>
								<p>Are you sure you want to delete this booking?</p>
								<div class="mb-3">
									Booking ID : <strong>${deleteBookingObj.bookingId}</strong><br/>
									User : <strong>${deleteBookingObj.user?.displayName || deleteBookingObj.userId}</strong>
								</div>
								<div style="display:flex;gap:1.5rem;justify-content:center;">
									<button class="btn btn-danger" @click=${confirmDeleteBooking}>Confirm</button>
									<button class="btn btn-secondary" @click=${closeDeleteModal}>Cancel</button>
								</div>
							</div>
						</div>
					` : ""}
				</td>
			</tr>
		`)}
	`, tbody);
}

export async function renderAdminBookings() {
	const section = document.getElementById("admin-bookings");
	if (!section) return;
	litRender(html`<div>Loading bookings management...</div>`, section);
	await fetchBookings();
	await fetchBookingStatuses();
	console.log('Rendering bookings management UI...');

	section.classList.remove('hidden');
	litRender(html`
		<div class="card-header">
			<h2 class="card-title">Bookings Management</h2>
			<div class="card-subtitle">View, approve, reject, and manage bookings.</div>
		</div>
		<div class="card">
			<div class="controls-container">
				<div class="controls-left"></div>
				<div class="controls-right">
					<span>From:</span>
					<input type="date" placeholder="From Date" @input=${handleFromDateFilter} .value=${fromDateFilter} class="form-input" title="Filter from date" />
					<span>To:</span>
					<input type="date" placeholder="To Date" @input=${handleToDateFilter} .value=${toDateFilter} class="form-input" title="Filter to date" />
					<select @change=${handleSort} class="form-select">
						<option value="bookingId">Sort by</option>
						<option value="bookingId">ID</option>
						<option value="user">User</option>
						<option value="equipment">Equipment</option>
					</select>
					<button class="btn btn-primary" @click=${handleSortOrder}>
						<span>${sortAsc ? "\u25B2" : "\u25BC"}</span>
					</button>
					<input type="text" placeholder="Search ..." @input=${handleSearch} .value=${searchTerm} class="form-input" />
					<button class="btn btn-primary">
						<span>&#128269;</span>
					</button>
					<select @change=${handleStatusFilter} class="form-select">
						<option value="">All Statuses</option>
						${bookingStatuses.map(s => html`<option value="${s.name}">${s.name}</option>`)}
					</select>
				</div>
			</div>
			<div class="table-container">
				<table class="table">
					<thead>
						<tr>
							<th>ID</th>
							<th>USER</th>
							<th>EQUIPMENT</th>
							<th>STATUS</th>
							<th>FROM DATE</th>
							<th>TO DATE</th>
							<th>ACTION</th>
						</tr>
					</thead>
					<tbody id="adminBookingsTableBody"></tbody>
				</table>
			</div>
		</div>

		${showEditModal ? html`
			<div class="modal" style="display:flex;">
				<div class="modal-content" style="width:500px;max-width:95vw;">
					<h2 class="modal-title">Update Booking</h2>
					<p class="card-subtitle">Update booking status</p>
					<div class="form-group">
						<select @change=${e => handleInput(e, 'status')} class="form-select" .value=${editBooking?.status || editBooking?.bookingStatus?.name || ''}>
							<option value="">Select Status</option>
							${bookingStatuses.map(s => html`<option value="${s.name}" ?selected=${(editBooking?.status || editBooking?.bookingStatus?.name) === s.name}>${s.name}</option>`)}
						</select>
					</div>
					<div style="display:flex;gap:1.5rem;justify-content:center;">
						<button class="btn btn-primary" @click=${updateBooking}>Update</button>
						<button class="btn btn-secondary" @click=${closeEditModal}>Cancel</button>
					</div>
				</div>
			</div>
		` : ""}
	`, section);
	renderBookingsTable();
}

async function updateBooking() {
	if (!editBooking.status) {
		addToast('Validation Error', 'Please select a status');
		return;
	}
	
	const status = bookingStatuses.find(s => s.name === editBooking.status);
	if (!status) {
		addToast('Validation Error', 'Invalid status selected');
		return;
	}
	
	const payload = {
		bookingStatusId: status.bookingStatusId
	};
	
	try {
		await apiFetch('PUT', `/api/Booking/${editBooking.bookingId}`, { body: payload });
		await fetchBookings();
		renderBookingsTable();
		closeEditModal();
		addToast('Success', 'Booking status updated successfully');
	} catch (err) {
		console.error('Update booking error:', err);
		addToast('Error', 'Error updating booking: ' + err.message);
	}
}

async function confirmDeleteBooking() {
	if (deleteBookingObj) {
		try {
			await apiFetch('DELETE', `/api/Booking/${deleteBookingObj.bookingId}`, { responseType: 'void' });
			await fetchBookings();
			renderBookingsTable();
			addToast('Success', 'Booking deleted successfully');
		} catch (err) {
			console.error('Delete booking error:', err);
			addToast('Error', 'Error deleting booking: ' + err.message);
		}
	}
	closeDeleteModal();
}