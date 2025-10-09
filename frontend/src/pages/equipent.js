import { html, render as litRender } from "lit";
import { openBooking } from "./bookings.js";
import { apiFetch } from "../api/api.js";

//---------- State ----------//
export let selectedEquipment = null;
export let equipmentList = [];

// --- UI State ---
let searchTerm = "";
let sortKey = "name";
let sortAsc = true;

// Fetch equipment from backend
async function fetchEquipment() {
  console.log('Fetching equipment userEquipment.js...');
  try {
    const data = await apiFetch('GET', '/api/Equipment');

    // Map the backend fields to table columns
    equipmentList = data.map(eq => ({
      id: eq.equipmentId,
      name: eq.name,
      desc: eq.equipmentType?.name || '',
      loc: eq.availability || '',
      status: eq.equipmentStatus?.name || '',
    }));
  } catch (err) {
    console.error('Error fetching equipment:', err);
    equipmentList = [];
  }
}

function handleSearch(e) {
  searchTerm = e.target.value;
  renderEquipment();
}
function handleSort(e) {
  sortKey = e.target.value;
  renderEquipment();
}
function toggleSortDir() {
  sortAsc = !sortAsc;
  renderEquipment();
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

export async function renderEquipment() {
    const section = document.getElementById("equipment");
    if (!section) return;
  litRender(html`<div>Loading equipment...</div>`, section);
  await fetchEquipment();
  
  litRender(html`
    <div class="card-header">
      <h2 class="card-title">Equipment</h2>
      <div class="card-subtitle">View, add and update equipment</div>
    </div>
    <div class="controls-container">
      <div class="controls-left"></div>
      <div class="controls-right">
        <select @change=${handleSort} class="form-select">
          <option value="name">Sort by</option>
          <option value="name">Name</option>
          <option value="status">Status</option>
          <option value="loc">Location</option>
        </select>
        <button class="btn btn-primary" @click=${toggleSortDir}>
          <span>${sortAsc ? "\u25B2" : "\u25BC"}</span>
        </button>
        <input type="text" placeholder="Search ..." @input=${handleSearch} value=${searchTerm} class="form-input" />
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
          <th>Name</th>
          <th>Description</th>
          <th>Location</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${getFilteredSortedList().map(eq => html`
          <tr>
            <td>${eq.name}</td>
            <td>${eq.desc}</td>
            <td>${eq.loc}</td>
            <td>
              <span class="badge ${eq.status==='Available'?'badge-success':'badge-secondary'}">${eq.status}</span>
            </td>
            <td>
              ${eq.status==='Available'?html`<button class="btn btn-sm btn-primary" @click=${() => openBooking(eq.id)}>Book</button>`:''}
            </td>
          </tr>
        `)}
      </tbody>
      </table>
    </div>
  `, section);
}

