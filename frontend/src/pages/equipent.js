import { html, render as litRender } from "lit";
import { openBooking } from "./bookings.js";

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
    const res = await fetch('/api/Equipment');
    if (!res.ok) throw new Error('Failed to fetch equipment');
    const data = await res.json();
    // Map backend fields to table columns
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
    <h2 style="color:#8d5fc5;font-size:2.2rem;margin-bottom:0.2rem;">Equipment</h2>
    <div style="color:#8d5fc5;font-size:1.1rem;margin-bottom:0.7rem;">View, add and update equipment</div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.2rem;">
      <div style="display:flex;align-items:center;gap:0.5rem;">
        <select @change=${handleSort} style="font-size:1.1rem;padding:0.4rem 2.2rem 0.4rem 1.2rem;border-radius:8px;border:2px solid #8d5fc5;background:#fff;color:#8d5fc5;font-weight:bold;">
          <option value="name">Sort by</option>
          <option value="name">Name</option>
          <option value="status">Status</option>
          <option value="loc">Location</option>
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
          <th style="padding:1rem 0.5rem;">Name</th>
          <th>Description</th>
          <th>Location</th>
          <th>Status</th>
          <th>Action</th>
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
              ${eq.status==='Available'?html`<a href="#" style="color:#8d5fc5;font-weight:bold;cursor:pointer;" @click=${e => { e.preventDefault(); openBooking(eq.id); }}>Book</a>`:''}
            </td>
          </tr>
        `)}
      </tbody>
    </table>
  `, section);
}

