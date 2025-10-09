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
    <h2 class="content-heading">Equipment</h2>
    <div class="content-description">View and book available equipment</div>
    <div class="controllers-container">
      <div class="sort-Wrapper">
        <select class="sortDropDown" @change=${handleSort} >
          <option value="name">Sort by</option>
          <option value="name">Name</option>
          <option value="status">Status</option>
          <option value="loc">Location</option>
        </select>
        <button class="sortAscDescButton" @click=${toggleSortDir}>
          <span style="font-size:1.2rem;">${sortAsc ? 
            html`<img src='../Assets/SortZA.svg' alt='Sort' style='width:25px;height:25px;' />` : 
            html`<img src='../Assets/SortAZ.svg' alt='Sort' style='width:25px;height:25px;' />`}</span>
        </button>
      </div>
      <div class="searchfilter-Wrapper">
        <div class="search-Wrapper">
          <input class="search-Input" type="text" placeholder="Search ..." @input=${handleSearch} value=${searchTerm}  />
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
        <tr >
          <th>Name</th>
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

