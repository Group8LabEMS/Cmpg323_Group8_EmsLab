import { html, render as litRender } from "lit";
import { apiFetch } from "../api/api.js";
import { addToast } from "../util/toast.js";

// --- API Integration --- //
async function fetchEquipment() {
	console.log('Fetching equipment...');
	const data = await apiFetch('GET', '/api/Equipment');
       equipmentList = data.map(eq => ({
	       ...eq,
	       name: eq.name,
	       equipmentId: eq.equipmentId,
	       equipmentType: eq.equipmentType,
	       equipmentStatus: eq.equipmentStatus,
	       type: eq.equipmentType?.name || '',
	       status: eq.equipmentStatus?.name || '',
	       location: eq.location || eq.availability || '',
	       createdDate: eq.createdDate,
       }));
}

async function fetchEquipmentTypesAndStatuses() {
	await Promise.all([
		apiFetch('GET', '/api/EquipmentType'),
		apiFetch('GET', '/api/EquipmentStatus')
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
		location: addEquipmentForm.location || statusObj?.name || 'Available',
		createdDate: new Date().toISOString(),
	};
	try {
		const result = await apiFetch('POST', '/api/Equipment', { body: payload });
		console.log('Add Equipment response:', result);
		await fetchEquipment();
		renderEquipmentTable();
		resetAddForm();
		closeAddModal();
		addToast('Success', 'Equipment added successfully');
	} catch (err) {
		console.error('Add Equipment error:', err);
		addToast('Error', 'Error adding equipment: ' + err.message);
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
		location: editEquipment.location || '',
		createdDate: editEquipment.createdDate || new Date().toISOString(),
	};
	await apiFetch('PUT', `/api/Equipment/${editEquipment.equipmentId}`, { body: payload });
	await fetchEquipment();
	renderEquipmentTable();
	closeEditModal();
	addToast('Success', 'Equipment updated successfully');
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
		await apiFetch('DELETE', `/api/Equipment/${deleteEquipmentObj.equipmentId}`, { responseType: 'void' });
		await fetchEquipment();
		renderEquipmentTable();
		addToast('Success', 'Equipment deleted successfully');
	}
	closeDeleteModal();
}

function handleSearch(e) {
		searchTerm = e.target.value;
		renderEquipmentTable();
}
function handleSort(e) {
	sortKey = e.target.value;
	renderEquipmentTable();
}

function handleSortOrder(e) {
	sortAsc = !sortAsc;
	renderEquipmentTable();
}

function handleStatusFilter(e) {
	statusFilter = e.target.value;
	renderEquipmentTable();
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

function renderEquipmentTable() {
	const tbody = document.getElementById('adminEquipmentTableBody');
	if (!tbody) return;
	litRender(html`
		${getFilteredSortedList().map((eq, i) => eq.name ? html`
			<tr>
				<td><strong>${eq.name || ''}</strong></td>
				<td>${eq.type || ''}</td>
				<td>${eq.location || ''}</td>
				<td>
					<span class="badge ${eq.equipmentStatus?.name==='Available'?'badge-success':'badge-secondary'}">${eq.equipmentStatus?.name || ''}</span>
				</td>
				<td>
					<button class="btn btn-sm btn-secondary" @click=${() => openEditModal(eq)}>Update</button>
					${eq.status==='Available'?html`<button class="btn btn-sm btn-danger" @click=${() => openDeleteModal(eq)}>Delete</button>`:''}
					${showDeleteModal && deleteEquipmentObj && deleteEquipmentObj.equipmentId === eq.equipmentId ? html`
						<div class="modal" style="display:flex;">
							<div class="modal-content" style="width:430px;max-width:95vw;">
								<h2 class="modal-title">Delete Equipment</h2>
								<p>Are sure you want to delete equipment information?</p>
								<div class="mb-3">
									Equipment ID : <strong>${deleteEquipmentObj.equipmentId}</strong><br/>
									Equipment Name : <strong>${deleteEquipmentObj.name}</strong>
								</div>
								<div style="display:flex;gap:1.5rem;justify-content:center;">
									<button class="btn btn-danger" @click=${confirmDeleteEquipment}>Confirm</button>
									<button class="btn btn-secondary" @click=${closeDeleteModal}>Cancel</button>
								</div>
							</div>
						</div>
					` : ""}
				</td>
			</tr>
		` : html`<tr><td></td><td></td><td></td><td></td><td></td></tr>`)}
	`, tbody);
}

export async function renderEquipmentManagement() {
	const section = document.getElementById("equipment");
	if (!section) return;
       litRender(html`<div>Loading equipment management...</div>`, section);
       await fetchEquipment();
       console.log('Rendering equipment management UI...');

       section.classList.remove('hidden');
       litRender(html`
	       <div class="card-header">
	         <div class="card-subtitle">View, add, update and delete equipment.</div>
	       </div>
	       <div class="card">
		       <div class="controls-container">
		         <div class="controls-left">
		           <button class="btn btn-primary" @click=${openAddModal}>Add Equipment</button>
		         </div>
		         <div class="controls-right">
				       <select @change=${handleSort} class="form-select">
					       <option value="name">Sort by</option>
					       <option value="name">Name</option>
					       <option value="type">Equipment</option>
					       <option value="location">Location</option>
				       </select>
				       <button class="btn btn-primary" @click=${handleSortOrder}>
					       <span>${sortAsc ? "\u25B2" : "\u25BC"}</span>
				       </button>
				       <input type="text" placeholder="Search ..." @input=${handleSearch} .value=${searchTerm} class="form-input" />
				       <button class="btn btn-primary">
					       <span>&#128269;</span>
				       </button>
				       <button class="btn btn-primary filter-btn">
					       <span>&#128465;</span> FILTER
				       </button>
		         </div>
		       </div>
		       <div class="table-container">
		         <table class="table">
			       <thead>
				       <tr>
					       <th>NAME</th>
					       <th>EQUIPMENT</th>
					       <th>LOCATION</th>
					       <th>STATUS</th>
					       <th>ACTION</th>
				       </tr>
			       </thead>
			       <tbody id="adminEquipmentTableBody"></tbody>
		         </table>
		       </div>
	       </div>

	       ${showAddModal ? html`
		       <div class="modal" style="display:flex;">
			       <div class="modal-content" style="width:500px;max-width:95vw;">
				       <h2 class="modal-title">Add Equipment</h2>
				       <p class="card-subtitle">Add new equipment to the system</p>
				       <div class="form-group">
				         <input type="text" placeholder="Equipment Name" value="${addEquipmentForm.name}" @input=${e => handleInput(e, 'name')} class="form-input" />
				       </div>
				       <div class="form-group">
				         <input type="text" placeholder="Location" value="${addEquipmentForm.location}" @input=${e => handleInput(e, 'location')} class="form-input" />
				       </div>
				       <div class="form-group">
				         <select @change=${e => handleInput(e, 'type')} class="form-select" .value=${addEquipmentForm.type}>
					         <option value="">Select Type</option>
					         ${equipmentTypes.map(t => html`<option value="${t.name}">${t.name}</option>`) }
				         </select>
				       </div>
				       <div class="form-group">
				         <select @change=${e => handleInput(e, 'status')} class="form-select" .value=${addEquipmentForm.status}>
					         <option value="">Select Status</option>
					         ${equipmentStatuses.map(s => html`<option value="${s.name}">${s.name}</option>`) }
				         </select>
				       </div>
				       <div style="display:flex;gap:1.5rem;justify-content:center;">
					       <button class="btn btn-primary" @click=${addEquipment}>Save</button>
					       <button class="btn btn-secondary" @click=${closeAddModal}>Cancel</button>
				       </div>
			       </div>
		       </div>
	       ` : ""}

	       ${showEditModal && editEquipment ? html`
		       <div class="modal" style="display:flex;">
			       <div class="modal-content" style="width:500px;max-width:95vw;">
				       <h2 class="modal-title">Update Equipment</h2>
				       <p class="card-subtitle">Update equipment information</p>
				       <div class="form-group">
				         <input type="text" placeholder="Equipment Name" value="${editEquipment.name}" @input=${e => handleInput(e, 'name')} class="form-input" />
				       </div>
				       <div class="form-group">
				         <select @change=${e => handleInput(e, 'type')} class="form-select" .value=${editEquipment.type}>
					         <option value="">Select Type</option>
					         ${equipmentTypes.map(t => html`<option value="${t.name}">${t.name}</option>`) }
				         </select>
				       </div>
				       <div class="form-group">
				         <select @change=${e => handleInput(e, 'status')} class="form-select" .value=${editEquipment.status}>
					         <option value="">Select Status</option>
					         ${equipmentStatuses.map(s => html`<option value="${s.name}">${s.name}</option>`) }
				         </select>
				       </div>
				       <div style="display:flex;gap:1.5rem;justify-content:center;">
					       <button class="btn btn-primary" @click=${updateEquipment}>Update</button>
					       <button class="btn btn-secondary" @click=${closeEditModal}>Cancel</button>
				       </div>
			       </div>
		       </div>
	       ` : ""}
       `, section);
	setTimeout(renderEquipmentTable, 0);
}
