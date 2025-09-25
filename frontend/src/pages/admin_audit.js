import { html, render as litRender } from "lit";

/**
 * Render the admin audit log page to match the wireframe.
 */

// --- UI State ---
let searchTerm = "";
let sortKey = "timestamp";
let sortAsc = true;

const auditLogs = [
	{ timestamp: "2025-09-01 10:12:58", user: "Cosmo Kramer", action: "Update Booking", object: "BookingID: 5979", summary: "Updated booking details for booking ID 5979." },
	{ timestamp: "2025-09-02 09:34:58", user: "Jerry Seinfeld", action: "Update Equipment", object: "EquipmentID: 213", summary: "Updated details for equipment ID 213." },
	{ timestamp: "2025-09-12 11:45:08", user: "George Costanza", action: "Update Profile", object: "UserID : 152", summary: "Updated user profile for user ID 152." },
	{ timestamp: "2025-09-21 15:28:41", user: "Cosmo Kramer", action: "Add Booking", object: "BookingID: 6243", summary: "Created new booking with ID 6243." },
	{ timestamp: "2025-09-24 17:09:49", user: "Jerry Seinfeld", action: "Add Equipment", object: "EquipmentID: 234", summary: "Added new equipment with ID 234." },
];

function handleSearch(e) {
	searchTerm = e.target.value;
	renderAdminDashboard();
}
function handleSort(e) {
	sortKey = e.target.value;
	renderAdminDashboard();
}
function toggleSortDir() {
	sortAsc = !sortAsc;
	renderAdminDashboard();
}

function getFilteredSortedList() {
	let list = [...auditLogs];
	if (searchTerm)
		list = list.filter(row =>
			row.timestamp.toLowerCase().includes(searchTerm.toLowerCase()) ||
			row.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
			row.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
			row.object.toLowerCase().includes(searchTerm.toLowerCase()) ||
			row.summary.toLowerCase().includes(searchTerm.toLowerCase())
		);
	list.sort((a, b) => {
		let v1 = a[sortKey]?.toLowerCase?.() || a[sortKey];
		let v2 = b[sortKey]?.toLowerCase?.() || b[sortKey];
		if (v1 < v2) return sortAsc ? -1 : 1;
		if (v1 > v2) return sortAsc ? 1 : -1;
		return 0;
	});
	return list;
}

export function renderAdminDashboard() {
	const section = document.getElementById("adminDashboard");
	if (!section) return;
	litRender(html`
		<h2 style="color:#8d5fc5;font-size:2.2rem;margin-bottom:0.2rem;">System Audit</h2>
		<div style="color:#8d5fc5;font-size:1.1rem;margin-bottom:0.7rem;">View and search for system logs for all user actions</div>
		<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.2rem;">
			<div style="display:flex;align-items:center;gap:0.5rem;">
				<select @change=${handleSort} style="font-size:1.1rem;padding:0.4rem 2.2rem 0.4rem 1.2rem;border-radius:8px;border:2px solid #8d5fc5;background:#fff;color:#8d5fc5;font-weight:bold;">
					<option value="timestamp">Sort by</option>
					<option value="timestamp">Timestamp</option>
					<option value="user">User</option>
					<option value="action">Action</option>
				</select>
				<button style="background:#8d5fc5;color:#fff;padding:0.5rem 1.2rem;border-radius:8px;border:none;font-size:1.1rem;margin-left:0.5rem;display:flex;align-items:center;gap:0.3rem;" @click=${toggleSortDir}>
					<span style="font-size:1.2rem;">${sortAsc ? "\u25B2" : "\u25BC"}</span>
				</button>
			</div>
			<div style="display:flex;align-items:center;gap:0.5rem;">
				<input type="text" placeholder="Search ..." @input=${handleSearch} value=${searchTerm} style="font-size:1.1rem;padding:0.4rem 1.2rem;border-radius:8px;border:2px solid #8d5fc5;" />
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
					<th style="padding:1rem 0.5rem;">TIMESTAMP</th>
					<th>USER</th>
					<th>ACTION</th>
					<th>AFFECTED OBJECT</th>
					<th>SUMMARY</th>
				</tr>
			</thead>
			<tbody>
				${getFilteredSortedList().map((row, i) => html`
					<tr style="background:${i%2===1?'#f7f6fb':'#fff'};">
						<td>${row.timestamp}</td>
						<td>${row.user}</td>
						<td>${row.action}</td>
						<td>${row.object}</td>
						<td>${row.summary}</td>
					</tr>
				`)}
			</tbody>
		</table>
	`, section);
}
