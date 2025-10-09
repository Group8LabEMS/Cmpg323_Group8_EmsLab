
import { html, render } from "lit";
import { apiFetch } from "../api/api.js";

let auditLogs = [];
let searchTerm = "";
let sortKey = "auditLogId";
let sortAsc = true;

async function fetchAuditLogs() {
	try {
		auditLogs = await apiFetch('GET', '/api/AuditLog');
		renderAdminAudit();
	} catch (err) {
		auditLogs = [];
		renderAdminAudit();
	}
}

function getFilteredSortedLogs() {
	let list = [...auditLogs];
	if (searchTerm)
		list = list.filter(log =>
			Object.values(log).some(val =>
				(val + "").toLowerCase().includes(searchTerm.toLowerCase())
			)
		);
	list.sort((a, b) => {
		let v1 = a[sortKey];
		let v2 = b[sortKey];
		if (typeof v1 === 'string') v1 = v1.toLowerCase();
		if (typeof v2 === 'string') v2 = v2.toLowerCase();
		if (v1 < v2) return sortAsc ? -1 : 1;
		if (v1 > v2) return sortAsc ? 1 : -1;
		return 0;
	});
	return list;
}

function handleSearch(e) {
	searchTerm = e.target.value;
	renderAdminAudit();
}
function handleSort(e) {
	sortKey = e.target.value;
	renderAdminAudit();
}

export function renderAdminAudit() {
	const section = document.getElementById("adminAudit");
	if (!section) return;
	section.classList.remove("hidden");
	
	// Update table header and body only
	const headerRow = document.getElementById('auditTableHeader');
	const tableBody = document.getElementById('auditTableBody');
	
	if (headerRow) {
		render(html`
			<th>ID</th>
			<th>Timestamp</th>
			<th>User</th>
			<th>Action</th>
			<th>Entity Type</th>
			<th>Entity ID</th>
			<th>Details</th>
		`, headerRow);
	}
	
	if (tableBody) {
		if (getFilteredSortedLogs().length === 0) {
			render(html`<tr><td colspan="7" style="text-align:center;">No audit logs found.</td></tr>`, tableBody);
		} else {
			render(html`${getFilteredSortedLogs().map(log => html`
				<tr>
					<td>${log.auditLogId}</td>
					<td>${log.timeStamp ? new Date(log.timeStamp).toLocaleString() : ''}</td>
					<td>${log.user || log.userId || ''}</td>
					<td>${log.action}</td>
					<td>${log.entityType}</td>
					<td>${log.entityId}</td>
					<td>${log.details || ''}</td>
				</tr>
			`)}`, tableBody);
		}
	}
	
	// Setup event listeners for controls
	const searchInput = document.getElementById('auditSearchInput');
	const sortSelect = document.getElementById('auditSortSelect');
	
	if (searchInput && !searchInput.hasAttribute('data-initialized')) {
		searchInput.addEventListener('input', handleSearch);
		searchInput.setAttribute('data-initialized', 'true');
	}
	
	if (sortSelect && !sortSelect.hasAttribute('data-initialized')) {
		sortSelect.addEventListener('change', handleSort);
		sortSelect.setAttribute('data-initialized', 'true');
	}
}

// Initial fetch on tab open
window.addEventListener('hashchange', () => {
	if (window.location.hash.replace('#', '') === 'adminAudit') {
		fetchAuditLogs();
	}
});

// For direct navigation
window.addEventListener('DOMContentLoaded', () => {
	if (window.location.hash.replace('#', '') === 'adminAudit') {
		fetchAuditLogs();
	}
});
