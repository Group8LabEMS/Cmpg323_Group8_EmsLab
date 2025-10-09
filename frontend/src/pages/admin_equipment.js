import { html, render as litRender } from "lit";

// --- API Integration --- //
async function fetchEquipment() {
	console.log('Fetching equipment...');
	const res = await fetch('/api/Equipment');
	const data = await res.json();
	equipmentList = data.map(eq => ({
		...eq,
		name: eq.name,
		equipmentId: eq.equipmentId,
		equipmentType: eq.equipmentType,
		equipmentStatus: eq.equipmentStatus,
		type: eq.equipmentType?.name || '',
		status: eq.equipmentStatus?.name || '',
		location: eq.location || eq.availability || '',
		availability: eq.availability,
		createdDate: eq.createdDate,
	}));
}

async function fetchEquipmentTypesAndStatuses() {
	await Promise.all([
		fetch('/api/EquipmentType').then(res => res.json()),
		fetch('/api/EquipmentStatus').then(res => res.json())
	]).then(([types, statuses]) => {
		equipmentTypes = types;
		equipmentStatuses = statuses;
	});
}

let equipmentList = [];
let equipmentTypes = [];
let equipmentStatuses = [];
let searchTerm = "";
let sortKey = "name";
let sortAsc = true;
let statusFilter = "";


let showAddModal = false;
let showEditModal = false;
let showDeleteModal = false;
let deleteEquipmentObj = null;
let editEquipment = null;


async function openAddModal() {
	// fetch latest types and statuses before showing modal
	await fetchEquipmentTypesAndStatuses();
	showAddModal = true;
	renderEquipmentManagement();
}
function closeAddModal() {
	showAddModal = false;
	renderEquipmentManagement();
}
async function openEditModal(eq) {
	await fetchEquipmentTypesAndStatuses();
	editEquipment = { ...eq };
	showEditModal = true;
	renderEquipmentManagement();
}
function closeEditModal() {
	showEditModal = false;
	editEquipment = null;
	renderEquipmentManagement();
}

function handleInput(e, field) {
	if (showAddModal) addEquipmentForm[field] = e.target.value;
	if (showEditModal && editEquipment) editEquipment[field] = e.target.value;
}

let addEquipmentForm = { name: "", type: "", status: "", location: "" };
function resetAddForm() {
	addEquipmentForm = { name: "", type: "", status: "", location: "" };
}

async function addEquipment() {
	const typeObj = equipmentTypes.find(t => t.name === addEquipmentForm.type) || equipmentTypes[0];
	const statusObj = equipmentStatuses.find(s => s.name === addEquipmentForm.status) || equipmentStatuses[0];
	const payload = {
		name: addEquipmentForm.name,
		equipmentTypeId: typeObj?.equipmentTypeId || 1,
		equipmentStatusId: statusObj?.equipmentStatusId || 1,
		availability: addEquipmentForm.location || statusObj?.name || 'Available',
		createdDate: new Date().toISOString(),
	};
	try {
		const res = await fetch('/api/Equipment', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});
		const result = await res.json().catch(() => ({}));
		console.log('Add Equipment response:', res.status, result);
		if (!res.ok) {
			let msg = 'Failed to add equipment: ' + (result?.message || res.status);
			if (result?.errors) msg += '\n' + JSON.stringify(result.errors);
			alert(msg);
			return;
		}
		await fetchEquipment();
		resetAddForm();
		closeAddModal();
	} catch (err) {
		console.error('Add Equipment error:', err);
		alert('Error adding equipment: ' + err.message);
	}
}

async function updateEquipment() {
	const type = equipmentTypes.find(t => t.name === editEquipment.type);
	const status = equipmentStatuses.find(s => s.name === editEquipment.status);
	const payload = {
		equipmentId: editEquipment.equipmentId,
		name: editEquipment.name,
		equipmentTypeId: type ? type.equipmentTypeId : 1,
		equipmentStatusId: status ? status.equipmentStatusId : 1,
		availability: editEquipment.status,
		createdDate: editEquipment.createdDate || new Date().toISOString(),
	};
	await fetch(`/api/Equipment/${editEquipment.equipmentId}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	});
	await fetchEquipment();
	closeEditModal();
}


function openDeleteModal(eq) {
	deleteEquipmentObj = eq;
	showDeleteModal = true;
	renderEquipmentManagement();
}
function closeDeleteModal() {
	showDeleteModal = false;
	deleteEquipmentObj = null;
	renderEquipmentManagement();
}
async function confirmDeleteEquipment() {
	if (deleteEquipmentObj) {
		await fetch(`/api/Equipment/${deleteEquipmentObj.equipmentId}`, { method: 'DELETE' });
		await fetchEquipment();
	}
	closeDeleteModal();
}

function handleSearch(e) {
	searchTerm = e.target.value;
	renderEquipmentManagement();
}
function handleSort(e) {
	sortKey = e.target.value;
	renderEquipmentManagement();
}

function handleSortOrder(e) {
	sortAsc = !sortAsc;
	renderEquipmentManagement();
}

function handleStatusFilter(e) {
	statusFilter = e.target.value;
	renderEquipmentManagement();
}
function toggleSortDir() {
	sortAsc = !sortAsc;
	renderEquipmentManagement();
}
function getFilteredSortedList() {
	let list = [...equipmentList];
	if (searchTerm)
		list = list.filter(eq => (eq.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (eq.equipmentType?.name || '').toLowerCase().includes(searchTerm.toLowerCase()));
	if (statusFilter)
		list = list.filter(eq => (eq.equipmentStatus?.name || '').toLowerCase() === statusFilter.toLowerCase());
	list.sort((a, b) => {
		let v1 = a[sortKey]?.toLowerCase?.() || a[sortKey];
		let v2 = b[sortKey]?.toLowerCase?.() || b[sortKey];
		if (v1 < v2) return sortAsc ? -1 : 1;
		if (v1 > v2) return sortAsc ? 1 : -1;
		return 0;
	});
	return list;
}

export async function renderEquipmentManagement() {
	const section = document.getElementById("equipment");
	if (!section) return;
	litRender(html`<div>Loading equipment management...</div>`, section);
	await fetchEquipment();
	console.log('Rendering equipment management UI...');

	section.classList.remove('hidden');
	litRender(html`
				<h2 class="content-heading">Equipment Management</h2>
				<div class="content-description">View, add, update and delete equipment.</div>
				<div class="mainContentButtons-Wrapper">
					<button @click=${openAddModal} class="mainContentPrimaryButtons">New Equipment</button>
				</div>
				<div class="controllers-container">
					<div class="sort-Wrapper">
					<select class="sortDropDown" @change=${handleSort}>
						<option value="name">Sort by</option>
						<option value="name">Name</option>
						<option value="type">Equipment</option>
						<option value="location">Location</option>
					</select>
					<button class="sortAscDescButton" @click=${toggleSortDir}>
						<span style="font-size:1.2rem;">${sortAsc ?
						html`<img src='../Assets/SortZA.svg' alt='Sort' style='width:25px;height:25px;' />` :
						html`<img src='../Assets/SortAZ.svg' alt='Sort' style='width:25px;height:25px;' />`}</span>
					</button>
					</div>
					<div class="searchfilter-Wrapper">
					<div class="search-Wrapper">
						<input class="search-Input" type="text" placeholder="Search ..." @input=${handleSearch}
						value=${searchTerm} />
						<button class="search-Button">
						<img src="../Assets/Search.svg" alt="Search" style="width:25px;height:25px;" />
						</button>
					</div>
					<button class="filter-Button">
						<img src="../Assets/Filter.svg" alt="Search" style="width:25px;height:25px;" /> FILTER
					</button>
					</div>
				</div>

				<table>
					<thead>
					<tr>
						<th style="padding:1rem 0.5rem;">NAME</th>
						<th>EQUIPMENT</th>
						<th>LOCATION</th>
						<th>STATUS</th>
						<th>ACTION</th>
					</tr>
					</thead>
					<tbody>
					${getFilteredSortedList().map((eq, i) => eq.name ? html`
					<tr style="background:${i % 2 === 1 ? '#f7f6fb' : '#fff'};">
						<td><span style="font-weight:bold;color:#6d4eb0;">${eq.name || ''}</span></td>
						<td>${eq.type || ''}</td>
						<td>${eq.location || ''}</td>
						<td>
						<span
							style="background:${eq.equipmentStatus?.name === 'Available' ? '#d9f2d9' : '#6c757d'};color:${eq.equipmentStatus?.name === 'Available' ? '#2d7a2d' : '#fff'};padding:4px 12px;border-radius:6px;font-weight:bold;">${eq.equipmentStatus?.name
							|| ''}</span>
						</td>
						<td>
						<a href="#" style="color:#8d5fc5;font-weight:bold;cursor:pointer;" @click=${e=> { e.preventDefault();
							openEditModal(eq); }}>Update</a>
						${eq.status === 'Available' ? html` | <a href="#" style="color:#8d5fc5;font-weight:bold;cursor:pointer;"
							@click=${e=> { e.preventDefault(); openDeleteModal(eq); }}>Delete</a>` : ''}
						${showDeleteModal && deleteEquipmentObj && deleteEquipmentObj.equipmentId === eq.equipmentId ? html`
						<div class="modal" style="display:flex;">
							<div class="modal-content" style="width:430px;max-width:95vw;">
							<h2 style="color:#8d5fc5;font-size:2.2rem;margin-bottom:0.2rem;font-weight:bold;">Delete Equipment
							</h2>
							<div style="color:#555;font-size:1.15rem;margin-bottom:1.2rem;">Are sure you want to delete equipment
								information?</div>
							<div style="margin-bottom:1.2rem;font-size:1.15rem;">
								Equipment ID : <span
								style="color:#6d4eb0;font-weight:bold;">${deleteEquipmentObj.equipmentId}</span><br />
								Equipment Name : <span style="color:#6d4eb0;font-weight:bold;">${deleteEquipmentObj.name}</span>
							</div>
							<div style="display:flex;gap:1.5rem;justify-content:center;">
								<button
								style="background:#8d5fc5;color:#fff;font-size:1.1rem;padding:0.7rem 2.5rem;border-radius:8px;border:none;font-weight:bold;"
								@click=${confirmDeleteEquipment}>Confirm</button>
								<button
								style="background:#fff;color:#8d5fc5;font-size:1.1rem;padding:0.7rem 2.5rem;border-radius:8px;border:2px solid #8d5fc5;font-weight:bold;"
								@click=${closeDeleteModal}>Cancel</button>
							</div>
							</div>
						</div>
						` : ""}
						</td>
					</tr>
					` : html`<tr>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>`)}
					</tbody>
				</table>
			</div>

			${showAddModal ? html`
			<div class="modal" style="display:flex;">
				<div class="modal-content" style="width:500px;max-width:95vw;">
				<h2 style="color:#8d5fc5;font-size:2.2rem;margin-bottom:0.2rem;">Add Equipment</h2>
				<div style="color:#8d5fc5;margin-bottom:1.2rem;">Add new equipment to the system</div>
				<input type="text" placeholder="Equipment Name" value="${addEquipmentForm.name}" @input=${e=> handleInput(e,
				'name')} style="margin-bottom:1rem;" />
				<input type="text" placeholder="Location" value="${addEquipmentForm.location}" @input=${e=> handleInput(e,
				'location')} style="margin-bottom:1rem;" />
				<select @change=${e=> handleInput(e, 'type')} style="margin-bottom:1rem;width:100%;"
					.value=${addEquipmentForm.type}>
					<option value="">Select Type</option>
					${equipmentTypes.map(t => html`<option value="${t.name}">${t.name}</option>`)}
				</select>
				<select @change=${e=> handleInput(e, 'status')} style="margin-bottom:1rem;width:100%;"
					.value=${addEquipmentForm.status}>
					<option value="">Select Status</option>
					${equipmentStatuses.map(s => html`<option value="${s.name}">${s.name}</option>`)}
				</select>
				<div style="display:flex;gap:1.5rem;justify-content:center;">
					<button class="action-book" @click=${addEquipment}>Save</button>
					<button class="action-delete" @click=${closeAddModal}>Cancel</button>
				</div>
				</div>
			</div>
			` : ""}

			${showEditModal && editEquipment ? html`
			<div class="modal" style="display:flex;">
				<div class="modal-content" style="width:500px;max-width:95vw;">
				<h2 style="color:#8d5fc5;font-size:2.2rem;margin-bottom:0.2rem;">Update Equipment</h2>
				<div style="color:#8d5fc5;margin-bottom:1.2rem;">Update equipment information</div>
				<input type="text" placeholder="Equipment Name" value="${editEquipment.name}" @input=${e=> handleInput(e, 'name')}
				style="margin-bottom:1rem;" />
				<select @change=${e=> handleInput(e, 'type')} style="margin-bottom:1rem;width:100%;" .value=${editEquipment.type}>
					<option value="">Select Type</option>
					${equipmentTypes.map(t => html`<option value="${t.name}">${t.name}</option>`)}
				</select>
				<select @change=${e=> handleInput(e, 'status')} style="margin-bottom:1rem;width:100%;"
					.value=${editEquipment.status}>
					<option value="">Select Status</option>
					${equipmentStatuses.map(s => html`<option value="${s.name}">${s.name}</option>`)}
				</select>
				<div style="display:flex;gap:1.5rem;justify-content:center;">
					<button class="action-book" @click=${updateEquipment}>Update</button>
					<button class="action-delete" @click=${closeEditModal}>Cancel</button>
				</div>
				</div>
			</div>
	       ` : ""}
       `, section);
}
