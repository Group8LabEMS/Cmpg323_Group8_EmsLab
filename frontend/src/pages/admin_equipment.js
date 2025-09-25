import { html, render as litRender } from "lit";

// Equipment state
let equipmentList = [
	{ id: 1, name: "Microscope", desc: "MSC-132", loc: "Lab A", status: "Available" },
	{ id: 2, name: "Spectrometer", desc: "SPM-2004", loc: "Lab A", status: "Available" },
	{ id: 3, name: "Centrifuge", desc: "CTF-234", loc: "Lab B", status: "Maintenance" },
	{ id: 4, name: "Laser Cutter", desc: "LCR-1234", loc: "Lab C", status: "Maintenance" },
	{ id: 5, name: "Workstation A02", desc: "Lab-A Station-02", loc: "Lab A", status: "Available" },
];
let searchTerm = "";
let sortKey = "name";
let sortAsc = true;

let showAddModal = false;
let showEditModal = false;
let showDeleteModal = false;
let deleteEquipmentObj = null;
let editEquipment = null;

function openAddModal() {
	showAddModal = true;
	renderEquipmentManagement();
}
function closeAddModal() {
	showAddModal = false;
	renderEquipmentManagement();
}
function openEditModal(eq) {
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
	renderEquipmentManagement();
}

let addEquipmentForm = { name: "", desc: "", loc: "", status: "" };
function resetAddForm() {
	addEquipmentForm = { name: "", desc: "", loc: "", status: "" };
}

function addEquipment() {
	equipmentList.push({
		id: Date.now(),
		...addEquipmentForm,
	});
	resetAddForm();
	closeAddModal();
}

function updateEquipment() {
	const idx = equipmentList.findIndex(eq => eq.id === editEquipment.id);
	if (idx !== -1) equipmentList[idx] = { ...editEquipment };
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
function confirmDeleteEquipment() {
	if (deleteEquipmentObj) {
		equipmentList = equipmentList.filter(eq => eq.id !== deleteEquipmentObj.id);
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

function getFilteredSortedList() {
	let list = [...equipmentList];
	if (searchTerm)
		list = list.filter(eq => eq.name.toLowerCase().includes(searchTerm.toLowerCase()) || eq.desc.toLowerCase().includes(searchTerm.toLowerCase()));
	list.sort((a, b) => {
		let v1 = a[sortKey]?.toLowerCase?.() || a[sortKey];
		let v2 = b[sortKey]?.toLowerCase?.() || b[sortKey];
		if (v1 < v2) return sortAsc ? -1 : 1;
		if (v1 > v2) return sortAsc ? 1 : -1;
		return 0;
	});
	return list;
}

export function renderEquipmentManagement() {
	const section = document.getElementById("equipment");
	if (!section) return;
	litRender(html`
		<h2 class="tab-title" style="color:#8d5fc5;font-size:2.5rem;margin-bottom:0.2rem;">Equipment</h2>
		<div style="color:#8d5fc5;font-size:1.3rem;margin-bottom:0.5rem;">View, add, update and delete equipment</div>
		<button style="float:right;margin-bottom:1.5rem;background:#8d5fc5;color:#fff;font-size:1.2rem;padding:0.7rem 2.5rem;border-radius:8px;border:none;box-shadow:0 2px 8px #bdbdbd;" @click=${openAddModal}>Add Equipment</button>
		<div style="clear:both"></div>
		<div style="background:#fff;border-radius:20px;box-shadow:0 4px 15px #e0d3f3;padding:2rem 1.5rem 1.5rem 1.5rem;">
			<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
				<div style="display:flex;align-items:center;gap:0.5rem;">
					<label style="font-size:1.1rem;margin-right:0.5rem;">Sort by</label>
					<select @change=${handleSort} style="font-size:1.1rem;padding:0.4rem 2.2rem 0.4rem 1.2rem;border-radius:8px;border:2px solid #8d5fc5;background:#fff;color:#8d5fc5;font-weight:bold;">
						<option value="name">Name</option>
						<option value="status">Status</option>
						<option value="loc">Location</option>
					</select>
					<button style="background:#8d5fc5;color:#fff;padding:0.5rem 1.2rem;border-radius:8px;border:none;font-size:1.1rem;margin-left:0.5rem;display:flex;align-items:center;gap:0.3rem;">
						<span style="font-size:1.2rem;">&#x25BC;</span>
					</button>
				</div>
				<div style="display:flex;align-items:center;gap:0.5rem;">
					<input type="text" placeholder="Search ..." @input=${handleSearch} style="font-size:1.1rem;padding:0.4rem 1.2rem;border-radius:8px;border:2px solid #8d5fc5;" />
					<button style="background:#8d5fc5;color:#fff;padding:0.5rem 1.2rem;border-radius:8px;border:none;font-size:1.1rem;display:flex;align-items:center;gap:0.3rem;">
						<span style="font-size:1.2rem;">&#128269;</span>
					</button>
					<button style="background:#8d5fc5;color:#fff;padding:0.5rem 1.2rem;border-radius:8px;border:none;font-size:1.1rem;display:flex;align-items:center;gap:0.3rem;">
						<span style="font-size:1.2rem;">&#128465;</span> FILTER
					</button>
				</div>
			</div>
			<table style="width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px #e0d3f3;">
				<thead>
					<tr style="background:#8d5fc5;color:#fff;">
						<th style="padding:1rem 0.5rem;">NAME</th>
						<th>DESCRIPTION</th>
						<th>LOCATION</th>
						<th>STATUS</th>
						<th>ACTION</th>
					</tr>
				</thead>
				<tbody>
					${getFilteredSortedList().map(eq => html`
						<tr style="background:${eq.id%2===0?'#f7f6fb':'#fff'};">
							<td>${eq.name}</td>
							<td>${eq.desc}</td>
							<td>${eq.loc}</td>
							<td>
								<span style="background:${eq.status==='Available'?'#d9f2d9':'#6c757d'};color:${eq.status==='Available'?'#2d7a2d':'#fff'};padding:4px 12px;border-radius:6px;font-weight:bold;">${eq.status}</span>
							</td>
							<td>
								<a href="#" style="color:#8d5fc5;font-weight:bold;cursor:pointer;" @click=${e => { e.preventDefault(); openEditModal(eq); }}>Update</a>
								${eq.status==='Available'?html` | <a href="#" style="color:#8d5fc5;font-weight:bold;cursor:pointer;" @click=${e => { e.preventDefault(); openDeleteModal(eq); }}>Delete</a>`:''}

			${showDeleteModal && deleteEquipmentObj ? html`
				<div class="modal" style="display:flex;">
					<div class="modal-content" style="width:430px;max-width:95vw;">
					<h2 style="color:#8d5fc5;font-size:2.2rem;margin-bottom:0.2rem;font-weight:bold;">Delete Equipment</h2>
					<div style="color:#555;font-size:1.15rem;margin-bottom:1.2rem;">Are sure you want to delete equipment information?</div>
					<div style="margin-bottom:1.2rem;font-size:1.15rem;">
						Equipment ID : <span style="color:#6d4eb0;font-weight:bold;">${deleteEquipmentObj.id}</span><br/>
						Equipment Name : <span style="color:#6d4eb0;font-weight:bold;">${deleteEquipmentObj.name}</span>
					</div>
					<div style="display:flex;gap:1.5rem;justify-content:center;">
						<button style="background:#8d5fc5;color:#fff;font-size:1.1rem;padding:0.7rem 2.5rem;border-radius:8px;border:none;font-weight:bold;" @click=${confirmDeleteEquipment}>Confirm</button>
						<button style="background:#fff;color:#8d5fc5;font-size:1.1rem;padding:0.7rem 2.5rem;border-radius:8px;border:2px solid #8d5fc5;font-weight:bold;" @click=${closeDeleteModal}>Cancel</button>
					</div>
				</div>
			</div>
		` : ""}
							</td>
							<td style="text-align:right;">
								<span style="display:inline-block;width:2rem;text-align:center;cursor:pointer;font-size:1.5rem;color:#8d5fc5;">&#9776;</span>
							</td>
						</tr>
					`)}
				</tbody>
			</table>
		</div>

		${showAddModal ? html`
			<div class="modal" style="display:flex;">
				<div class="modal-content" style="width:500px;max-width:95vw;">
					<h2 style="color:#8d5fc5;font-size:2.2rem;margin-bottom:0.2rem;">Add Equipment</h2>
					<div style="color:#8d5fc5;margin-bottom:1.2rem;">Add new equipment to the system</div>
					<input type="text" placeholder="Equipment Name" value="${addEquipmentForm.name}" @input=${e => handleInput(e, 'name')} style="margin-bottom:1rem;" />
					<textarea placeholder="Equipment Description" .value=${addEquipmentForm.desc} @input=${e => handleInput(e, 'desc')} style="margin-bottom:1rem;width:100%;height:60px;border-radius:8px;border:2px solid #8d5fc5;padding:0.7rem;"></textarea>
					<div style="display:flex;gap:1rem;margin-bottom:1rem;">
						<input type="text" placeholder="Location" value="${addEquipmentForm.loc}" @input=${e => handleInput(e, 'loc')} style="flex:1;" />
						<input type="text" placeholder="Status" value="${addEquipmentForm.status}" @input=${e => handleInput(e, 'status')} style="flex:1;" />
					</div>
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
					<input type="text" placeholder="Equipment Name" value="${editEquipment.name}" @input=${e => handleInput(e, 'name')} style="margin-bottom:1rem;" />
					<textarea placeholder="Equipment Description" .value=${editEquipment.desc} @input=${e => handleInput(e, 'desc')} style="margin-bottom:1rem;width:100%;height:60px;border-radius:8px;border:2px solid #8d5fc5;padding:0.7rem;"></textarea>
					<div style="display:flex;gap:1rem;margin-bottom:1rem;">
						<input type="text" placeholder="Location" value="${editEquipment.loc}" @input=${e => handleInput(e, 'loc')} style="flex:1;" />
						<input type="text" placeholder="Status" value="${editEquipment.status}" @input=${e => handleInput(e, 'status')} style="flex:1;" />
					</div>
					<div style="display:flex;gap:1.5rem;justify-content:center;">
						<button class="action-book" @click=${updateEquipment}>Update</button>
						<button class="action-delete" @click=${closeEditModal}>Cancel</button>
					</div>
				</div>
			</div>
		` : ""}
	`, section);
}
