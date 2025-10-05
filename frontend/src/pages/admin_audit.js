
import { html, render as litRender } from "lit";

let auditLogs = [];
let searchTerm = "";
let sortKey = "auditLogId";
let sortAsc = true;

async function fetchAuditLogs() {
	try {
		const res = await fetch('/api/AuditLog');
		if (!res.ok) throw new Error('Failed to fetch audit logs');
		auditLogs = await res.json();
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
	   litRender(html`
		   <div style="background:#fff;border-radius:20px;box-shadow:0 4px 15px #e0d3f3;padding:2rem 1.5rem 1.5rem 1.5rem;">
			   <h2 style="margin-top:0;margin-bottom:1.5rem;font-size:2rem;font-weight:700;color:#8d5fc5;letter-spacing:0.5px;">Audit Trails</h2>
			   <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px #e0d3f3;">
				   <thead>
					   <tr style="background:#8d5fc5;color:#fff;">
						   <th>ID</th>
						   <th>Timestamp</th>
						   <th>User</th>
						   <th>Action</th>
						   <th>Entity Type</th>
						   <th>Entity ID</th>
						   <th>Details</th>
					   </tr>
				   </thead>
				   <tbody>
					   ${getFilteredSortedLogs().length === 0 ? html`
						   <tr><td colspan="7" class="no-audit-message">No audit logs found.</td></tr>
					   ` : getFilteredSortedLogs().map(log => html`
						   <tr>
							   <td>${log.auditLogId}</td>
							   <td>${log.timeStamp ? new Date(log.timeStamp).toLocaleString() : ''}</td>
							   <td>${log.user || log.userId || ''}</td>
							   <td>${log.action}</td>
							   <td>${log.entityType}</td>
							   <td>${log.entityId}</td>
							   <td>${log.details || ''}</td>
						   </tr>
					   `)}
				   </tbody>
			   </table>
		   </div>
	   `, section);
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
