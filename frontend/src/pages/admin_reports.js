import { html, render as litRender } from "lit";
// Demo data for frontend-only usage
let reportLogs = [
	{
		user_id: 1,
		display_name: 'Ewald',
		sso_id: "123",
		email: "Ewald@gmail.com",
		cellno: "0123",
		
	},
	{
		user_id: 2,
		display_name: 'Johan',
		sso_id: "456",
		email: "Johan@gmail.com",
		cellno: "0456",
		
	},
	{
		user_id: 3,
		display_name: 'Tracy',
		sso_id: "789",
		email: "Tracy@gmail.com",
		cellno: "0789",
		
	}
];
let searchTerm = "";
let sortKey = "reportId";
let sortAsc = true;
// 2nd drop down

let entityTypeFilter = "";

function getFilteredSortedLogs() {
	let list = [...reportLogs];
	if (searchTerm)
		list = list.filter(log =>
			Object.values(log).some(val =>
				(val + "").toLowerCase().includes(searchTerm.toLowerCase())
			)
		);
        ///2ndddrop down
	if (entityTypeFilter)
		list = list.filter(log => log.entityType === entityTypeFilter);
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
	renderAdminReports();
}
function handleSort(e) {
	sortKey = e.target.value;
	renderAdminReports();
}
//2nd drop down
function handleEntityTypeFilter(e) {
	entityTypeFilter = e.target.value;
	renderAdminReports();
}
export function renderAdminReports() {
	const section = document.getElementById("reports");
	if (!section) return;
	section.classList.remove("hidden");
	litRender(html`
		<h2 style="color:#7A4EB0;font-size:2rem;margin-bottom:1.5rem;">Reports</h2>
	<div style="background:#fff;border-radius:20px;box-shadow:0 4px 15px #e0d3f3;padding:2rem 1.5rem 1.5rem 1.5rem;">
	<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
	<div style="display:flex;align-items:center;gap:0.5rem;">
            <!-- 1st drop down -->
		  <select @change=${handleSort} style="font-size:1.1rem;padding:0.4rem 2.2rem 0.4rem 1.2rem;border-radius:8px;border:2px solid #8d5fc5;background:#fff;color:#8d5fc5;font-weight:bold;">
			<option value="reportId">Report Type</option>
		  </select>
            <!-- 2nd drop down -->
		  <select @change=${e => handleEntityTypeFilter(e)} style="font-size:1.1rem;padding:0.4rem 2.2rem 0.4rem 1.2rem;border-radius:8px;border:2px solid #8d5fc5;background:#fff;color:#8d5fc5;font-weight:bold;">
			<option value="">Sort by</option>
			<!--can add options for example<option value="Equipment">Equipment</option>-->
		  </select>
	</div>
    
	<div style="display:flex;align-items:center;gap:0.5rem;">
		  <input type="text" placeholder="Search ..." @input=${handleSearch} style="font-size:1.1rem;padding:0.4rem 1.2rem;border-radius:8px;border:2px solid #8d5fc5;" />
	</div>
	</div>
	<table style="width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px #e0d3f3;">
	<thead>
		  <tr style="background:#8d5fc5;color:#fff;">
			<th>USER</th>
			<th>NAME</th>
			<th>UNIVERSITY NO</th>
			<th>EMAIL</th>
			<th>CELLPHONE</th>
		  </tr>
	</thead>
    
	<tbody>
        
		  ${getFilteredSortedLogs().length === 0 ? html`
			<tr><td colspan="7" class="no-report-message">No reports found.</td></tr>
		  ` : getFilteredSortedLogs().map(log => html`
			<tr>
			  <td>${log.user_id}</td>
			  <td>${log.display_name}</td>
			  <td>${log.sso_id}</td>
			  <td>${log.email}</td>
			  <td>${log.cellno}</td>
			  
			</tr>
		  `)}
	</tbody>
    
	</table>

    
    <!--buttons functionality to be added-->
    <div style="display: flex; justify-content: center; gap: 1.5rem; margin-top: 2rem;">
      <button style="padding: 0.8rem 2.2rem; border-radius: 8px; background: #8d5fc5; color: #fff; font-size: 1.1rem; border: none; font-weight: bold; cursor: pointer;">Download</button>
      <button style="padding: 0.8rem 2.2rem; border-radius: 8px; background: #7A4EB0; color: #fff; font-size: 1.1rem; border: none; font-weight: bold; cursor: pointer;">Clear All</button>
    </div>
	</div>
	`, section);

}
// Initial fetch on tab open
/*window.addEventListener('hashchange', () => {
	if (window.location.hash.replace('#', '') === 'reports') {
	renderAdminReports();
	}
});
window.addEventListener('DOMContentLoaded', () => {
	if (window.location.hash.replace('#', '') === 'reports') {
	renderAdminReports();
	}
});*/