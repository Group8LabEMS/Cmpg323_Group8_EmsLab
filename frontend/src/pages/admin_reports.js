// pages/admin_reports.js
// API-integrated logic for the Admin Reports section.

// --- Global State ---
let currentReportData = [];
let currentReportType = 'user'; 

// Stores the selected filter values from the modal for each report type
let currentFilters = {
    user: { role: '', faculty: '', department: '' },
    booking: { status: '', dateRange: { from: '', to: '' } },
    equipment: { type: '', status: '' }
};

// --- Report Data & Configuration ---

// This object will store options fetched from the API for the filter dropdowns
let UNIQUE_OPTIONS = {
    roles: [],
    faculties: [],
    departments: [],
    bookingStatuses: [],
    equipmentTypes: [],
    equipmentStatuses: [],
};

const REPORT_CONFIG = {
    user: {
        apiEndpoint: '/api/User',
        headers: ["User ID", "Name", "SSO/Uni No", "Email", "Role", "Created On"],
        keys: ["userId", "displayName", "ssoId", "email", "role", "createdAt"],
        sortOptions: ["User ID Ascending", "Name A to Z", "Name Z to A"],
        sortMap: {
            "User ID Ascending": { key: "userId", order: "asc" },
            "Name A to Z": { key: "displayName", order: "asc" },
            "Name Z to A": { key: "displayName", order: "desc" },
        },
        filterFields: [
            { key: "role", label: "Role", type: "select", optionsKey: "roles" }
        ],
    },
    booking: {
        apiEndpoint: '/api/Booking',
        headers: ["Booking ID", "User", "Equipment", "Status", "From Date/Time", "To Date/Time", "Notes", "Created On"],
        keys: ["bookingId", "user", "equipment", "status", "fromDate", "toDate", "notes", "createdDate"],
        sortOptions: ["Booking ID Ascending", "Equipment A to Z"],
        sortMap: {
            "Booking ID Ascending": { key: "bookingId", order: "asc" },
            "Equipment A to Z": { key: "equipment", order: "asc" },
        },
        filterFields: [
            { key: "status", label: "Status", type: "select", optionsKey: "bookingStatuses" },
            { key: "dateRange", label: "Booking Date Range", type: "dateRange" }
        ],
    },
    equipment: {
        apiEndpoint: '/api/Equipment',
        headers: ["Equipment ID", "Name", "Type", "Status", "Availability", "Created On"],
        keys: ["equipmentId", "name", "type", "status", "availability", "createdDate"],
        sortOptions: ["Equipment ID Ascending", "Name A to Z"],
        sortMap: {
            "Equipment ID Ascending": { key: "equipmentId", order: "asc" },
            "Name A to Z": { key: "name", order: "asc" },
        },
        filterFields: [
            { key: "type", label: "Type", type: "select", optionsKey: "equipmentTypes" },
            { key: "status", label: "Status", type: "select", optionsKey: "equipmentStatuses" }
        ],
    }
};

// --- API Fetching Functions ---

async function fetchReportData(endpoint) {
    try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`Failed to fetch report data from ${endpoint}`);
        const data = await res.json();
        
        // Normalize data keys (similar to admin_equipment.js)
        return data.map(item => {
            if (currentReportType === 'user') {
                return {
                    userId: item.userId,
                    displayName: item.displayName,
                    ssoId: item.ssoId,
                    email: item.email,
                    role: Array.isArray(item.userRoles) && item.userRoles.length > 0 && item.userRoles[0].role ? item.userRoles[0].role.name : '',
                    createdAt: item.createdAt
                };
            }
            if (currentReportType === 'booking') {
                return {
                    bookingId: item.bookingId,
                    user: item.user?.displayName || item.userId,
                    equipment: item.equipment?.name || item.equipmentId,
                    status: item.bookingStatus?.name || item.bookingStatusId,
                    fromDate: item.fromDate,
                    toDate: item.toDate,
                    notes: item.notes,
                    createdDate: item.createdDate
                };
            }
            if (currentReportType === 'equipment') {
                return {
                    equipmentId: item.equipmentId,
                    name: item.name,
                    type: item.equipmentType?.name || item.equipmentTypeId,
                    status: item.equipmentStatus?.name || item.equipmentStatusId,
                    availability: item.availability,
                    createdDate: item.createdDate
                };
            }
            return item;
        });

    } catch (err) {
        console.error(`Error fetching data from ${endpoint}:`, err);
        return [];
    }
}

async function fetchUniqueOptions() {
    try {
        const [roles, faculties, departments, bookingStatuses, equipmentTypes, equipmentStatuses] = await Promise.all([
            fetch('/api/Role').then(res => res.json()).catch(() => []),
            fetch('/api/Faculty').then(res => res.json()).catch(() => []),
            fetch('/api/Department').then(res => res.json()).catch(() => []),
            fetch('/api/BookingStatus').then(res => res.json()).catch(() => []),
            fetch('/api/EquipmentType').then(res => res.json()).catch(() => []),
            fetch('/api/EquipmentStatus').then(res => res.json()).catch(() => []),
        ]);

        // Map API response to simple string arrays
        UNIQUE_OPTIONS.roles = roles.map(r => r.name).filter(Boolean);
        UNIQUE_OPTIONS.faculties = faculties.map(f => f.name).filter(Boolean);
        UNIQUE_OPTIONS.departments = departments.map(d => d.name).filter(Boolean);
        UNIQUE_OPTIONS.bookingStatuses = bookingStatuses.map(s => s.name).filter(Boolean);
        UNIQUE_OPTIONS.equipmentTypes = equipmentTypes.map(t => t.name).filter(Boolean);
        UNIQUE_OPTIONS.equipmentStatuses = equipmentStatuses.map(s => s.name).filter(Boolean);

    } catch (e) {
        console.warn("Could not fetch all unique options for filters:", e);
    }
}

// --- Utility and Rendering Functions (Unchanged from previous step, except function placement) ---

function convertToCSV(headers, data) {
    const headerRow = headers.join(',') + '\n';
    const config = REPORT_CONFIG[currentReportType];

    const dataRows = data.map(row => 
        config.keys.map(key => {
            let value = row[key];
            if (key.includes('Date') || key === 'fromDate' || key === 'toDate') {
                try {
                    const date = new Date(value);
                    value = date.toLocaleString('en-ZA', { 
                        year: 'numeric', month: '2-digit', day: '2-digit', 
                        hour: '2-digit', minute: '2-digit' 
                    });
                } catch (e) { /* ignore */ }
            }
            return `"${String(value || '').replace(/"/g, '""')}"`;
        }).join(',')
    ).join('\n');

    return headerRow + dataRows;
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function applyFiltersAndSort(data, config, search, sortBy, type) {
    let filteredData = [...data];
    const searchTerm = search ? search.toLowerCase() : '';
    const filters = currentFilters[type];
    
    // 1. Global Search/Filter
    if (searchTerm) {
        filteredData = filteredData.filter(item => 
            config.keys.some(key => {
                let value = String(item[key] || '');
                if (key.includes('Date') || key === 'fromDate' || key === 'toDate') {
                    try { value = new Date(value).toLocaleString(); } catch (e) { /* ignore */ }
                }
                return value.toLowerCase().includes(searchTerm);
            })
        );
    }

    // 2. Specific Column Filters (from Modal)
    config.filterFields.forEach(field => {
        const filterValue = filters[field.key];

        if (field.type === 'select' && filterValue) {
            filteredData = filteredData.filter(item => 
                String(item[field.key]).toLowerCase() === String(filterValue).toLowerCase()
            );
        } else if (field.type === 'dateRange' && filters.dateRange && (filters.dateRange.from || filters.dateRange.to)) {
            const fromDateStr = filters.dateRange.from;
            const toDateStr = filters.dateRange.to;
            const dateKey = 'fromDate'; 

            filteredData = filteredData.filter(item => {
                const itemDate = new Date(item[dateKey]);
                if (isNaN(itemDate.getTime())) return false;

                let passesFrom = true;
                if (fromDateStr) {
                    const fromDate = new Date(fromDateStr);
                    fromDate.setHours(0, 0, 0, 0); 
                    passesFrom = itemDate.getTime() >= fromDate.getTime();
                }

                let passesTo = true;
                if (toDateStr) {
                    const toDate = new Date(toDateStr);
                    toDate.setHours(23, 59, 59, 999);
                    passesTo = itemDate.getTime() <= toDate.getTime();
                }
                return passesFrom && passesTo;
            });
        }
    });

    // 3. Sort
    const sortByConfig = REPORT_CONFIG[type].sortMap[sortBy];
    if (sortByConfig) {
        const key = sortByConfig.key;
        const order = sortByConfig.order;

        filteredData.sort((a, b) => {
            let valA = a[key];
            let valB = b[key];
            let comparison = 0;

            const isNumericKey = key.includes('Id') || key === 'ssoId';
            
            if (isNumericKey && !isNaN(Number(valA)) && !isNaN(Number(valB))) {
                comparison = Number(valA) - Number(valB);
            } else if (key.includes('Date') || key === 'fromDate' || key === 'toDate') {
                const dateA = new Date(valA).getTime();
                const dateB = new Date(valB).getTime();
                comparison = dateA - dateB;
            } else {
                valA = String(valA || '').toLowerCase();
                valB = String(valB || '').toLowerCase();
                if (valA < valB) { comparison = -1; } 
                else if (valA > valB) { comparison = 1; }
            }

            return order === 'desc' ? comparison * -1 : comparison;
        });
    }

    return filteredData;
}

function renderReportTable(data, config) {
    const tbody = document.getElementById('reportTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    
    if (data.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = config.headers.length;
        cell.style.textAlign = 'center';
        cell.textContent = 'No records match the current filters.';
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }

    data.forEach(item => {
        const row = document.createElement('tr');
        config.keys.forEach(key => {
            const cell = document.createElement('td');
            let value = item[key];
            
            if (key.includes('Date') || key === 'fromDate' || key === 'toDate') {
                try {
                    const date = new Date(value);
                    value = date.toLocaleString('en-ZA', { 
                        year: 'numeric', month: 'short', day: 'numeric', 
                        hour: '2-digit', minute: '2-digit' 
                    });
                } catch (e) {
                    value = value;
                }
            }
            
            cell.textContent = value || 'N/A';
            row.appendChild(cell);
        });
        tbody.appendChild(row);
    });
}

function populateSortOptions(config) {
    const select = document.getElementById('reportSortSelect');
    if (!select) return;

    select.innerHTML = '<option value="">Sort by</option>'; 

    config.sortOptions.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
    });
}

function renderTableHeader(config) {
    const headerRow = document.getElementById('reportTableHeader');
    if (!headerRow) return;

    headerRow.innerHTML = '';
    config.headers.forEach((header, index) => {
        const th = document.createElement('th');
        th.textContent = header;
        th.dataset.key = config.keys[index];
        headerRow.appendChild(th);
    });
}

function refreshReportView() {
    const searchInputEl = document.getElementById('reportSearchInput');
    const sortSelectEl = document.getElementById('reportSortSelect');
    const searchInput = searchInputEl ? /** @type {HTMLInputElement} */(searchInputEl).value : '';
    const sortSelect = sortSelectEl ? /** @type {HTMLSelectElement} */(sortSelectEl).value : '';
    const config = REPORT_CONFIG[currentReportType];
    
    const finalData = applyFiltersAndSort(currentReportData, config, searchInput, sortSelect, currentReportType);
    
    renderReportTable(finalData, config);

    const filterActiveIndicator = document.getElementById('filterActiveIndicator');
    const filters = currentFilters[currentReportType];
    let isActive = false;
    for (const key in filters) {
        if (key === 'dateRange') {
            if (filters.dateRange?.from || filters.dateRange?.to) {
                isActive = true;
                break;
            }
        } else if (filters[key]) {
            isActive = true;
            break;
        }
    }
    if (filterActiveIndicator) {
        filterActiveIndicator.classList.toggle('hidden', !isActive);
    }
}

async function loadAndRefreshData() {
    const config = REPORT_CONFIG[currentReportType];
    
    if (UNIQUE_OPTIONS.roles.length === 0) {
        await fetchUniqueOptions();
    }
    
    // Show loading state here if needed
    
    const rawData = await fetchReportData(config.apiEndpoint);
    currentReportData = rawData;
    
    renderTableHeader(config);
    populateSortOptions(config);
    refreshReportView();
}

// --- Modal Functions ---

function showFilterModal() {
    const modal = document.getElementById('filterModal');
    const formContent = document.getElementById('filterFormContent');
    const modalTitle = document.getElementById('filterModalTitle');
    const config = REPORT_CONFIG[currentReportType];
    const filters = currentFilters[currentReportType] || {};

    if (!modal || !formContent) return;

    modalTitle.textContent = `Filter ${config.headers[0].split(' ')[0]} Report`;
    formContent.innerHTML = '';

    config.filterFields.forEach(field => {
        const group = document.createElement('div');
        group.className = 'form-group';
        
        const label = document.createElement('label');
        label.textContent = field.label;
        group.appendChild(label);

        if (field.type === 'select') {
            const select = document.createElement('select');
            select.id = `modalFilter-${field.key}`;
            select.innerHTML = '<option value="">Any</option>';
            UNIQUE_OPTIONS[field.optionsKey].forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                select.appendChild(opt);
            });
            select.value = filters[field.key] || '';
            group.appendChild(select);
        } else if (field.type === 'dateRange') {
            group.classList.add('date-range-group');
            // From Date
            const fromDiv = document.createElement('div');
            const fromLabel = document.createElement('label');
            fromLabel.textContent = 'From Date:';
            const fromInput = document.createElement('input');
            fromInput.type = 'date';
            fromInput.id = 'modalFilter-dateRange-from';
            fromInput.value = filters.dateRange?.from || '';
            fromDiv.appendChild(fromLabel);
            fromDiv.appendChild(fromInput);
            
            // To Date
            const toDiv = document.createElement('div');
            const toLabel = document.createElement('label');
            toLabel.textContent = 'To Date:';
            const toInput = document.createElement('input');
            toInput.type = 'date';
            toInput.id = 'modalFilter-dateRange-to';
            toInput.value = filters.dateRange?.to || '';
            toDiv.appendChild(toLabel);
            toDiv.appendChild(toInput);
            
            group.appendChild(fromDiv);
            group.appendChild(toDiv);
        }

        formContent.appendChild(group);
    });

    modal.classList.remove('hidden');
}

function hideFilterModal() {
    const modal = document.getElementById('filterModal');
    if (modal) modal.classList.add('hidden');
}

function applyFiltersFromModal() {
    const config = REPORT_CONFIG[currentReportType];
    let newFilters = currentFilters[currentReportType] || {};

    config.filterFields.forEach(field => {
        if (field.type === 'select') {
            const select = document.getElementById(`modalFilter-${field.key}`);
            newFilters[field.key] = select ? /** @type {HTMLSelectElement} */(select).value : '';
        } else if (field.type === 'dateRange') {
            const fromInput = document.getElementById('modalFilter-dateRange-from');
            const toInput = document.getElementById('modalFilter-dateRange-to');
            newFilters.dateRange = {
                from: fromInput ? /** @type {HTMLInputElement} */(fromInput).value : '',
                to: toInput ? /** @type {HTMLInputElement} */(toInput).value : ''
            };
        }
    });

    currentFilters[currentReportType] = newFilters;
    hideFilterModal();
    refreshReportView();
}

function clearFiltersFromModal() {
    const config = REPORT_CONFIG[currentReportType];
    let newFilters = currentFilters[currentReportType] || {};

    config.filterFields.forEach(field => {
        if (field.type === 'select') {
            const select = document.getElementById(`modalFilter-${field.key}`);
            if (select) /** @type {HTMLSelectElement} */(select).value = '';
            newFilters[field.key] = '';
        } else if (field.type === 'dateRange') {
            const fromInput = document.getElementById('modalFilter-dateRange-from');
            const toInput = document.getElementById('modalFilter-dateRange-to');
            if (fromInput) /** @type {HTMLInputElement} */(fromInput).value = '';
            if (toInput) /** @type {HTMLInputElement} */(toInput).value = '';
            newFilters.dateRange = { from: '', to: '' };
        }
    });

    currentFilters[currentReportType] = newFilters;
    refreshReportView();
}

function clearAllControls() {
    const searchInput = document.getElementById('reportSearchInput');
    if (searchInput) /** @type {HTMLInputElement} */(searchInput).value = '';

    const sortSelect = document.getElementById('reportSortSelect');
    if (sortSelect) /** @type {HTMLSelectElement} */(sortSelect).value = '';

    // Reset filters to empty state
    currentFilters[currentReportType] = {
        role: '', faculty: '', department: '',
        status: '', type: '',
        dateRange: { from: '', to: '' }
    };

    refreshReportView();
}

function setupEventListeners() {
    const typeSelect = document.getElementById('reportTypeSelect');
    if (typeSelect && !typeSelect.hasAttribute('data-initialized')) {
        typeSelect.addEventListener('change', (e) => {
            const target = e.target;
            if (target instanceof HTMLSelectElement) {
                currentReportType = target.value;
            } else {
                currentReportType = 'user';
            }
            loadAndRefreshData();
            });
        typeSelect.setAttribute('data-initialized', 'true');
    }
    
    const searchInput = document.getElementById('reportSearchInput');
    if (searchInput && !searchInput.hasAttribute('data-initialized')) {
        let timeout = null;
        searchInput.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(refreshReportView, 300); 
        });
        searchInput.setAttribute('data-initialized', 'true');
    }
    
    const sortSelect = document.getElementById('reportSortSelect');
    if (sortSelect && !sortSelect.hasAttribute('data-initialized')) {
        sortSelect.addEventListener('change', refreshReportView);
        sortSelect.setAttribute('data-initialized', 'true');
    }

    const filterBtn = document.getElementById('reportFilterBtn');
    if (filterBtn && !filterBtn.hasAttribute('data-initialized')) {
        filterBtn.addEventListener('click', showFilterModal);
        filterBtn.setAttribute('data-initialized', 'true');
    }

    const clearFormBtn = document.getElementById('reportClearFilterBtn');
    if (clearFormBtn && !clearFormBtn.hasAttribute('data-initialized')) {
        clearFormBtn.addEventListener('click', clearAllControls);
        clearFormBtn.setAttribute('data-initialized', 'true');
    }
    
    const downloadBtn = document.getElementById('downloadReportBtn');
    if (downloadBtn && !downloadBtn.hasAttribute('data-initialized')) {
        downloadBtn.addEventListener('click', () => {
            const config = REPORT_CONFIG[currentReportType];
            const filename = `${currentReportType}_report_${new Date().toISOString().slice(0, 10)}.csv`;
            const csv = convertToCSV(config.headers, currentReportData);
            downloadCSV(csv, filename);
        });
        downloadBtn.setAttribute('data-initialized', 'true');
    }

    const modalApplyBtn = document.getElementById('modalApplyFiltersBtn');
    if (modalApplyBtn && !modalApplyBtn.hasAttribute('data-initialized')) {
        modalApplyBtn.addEventListener('click', applyFiltersFromModal);
        document.getElementById('modalClearFiltersBtn').addEventListener('click', clearFiltersFromModal);
        document.getElementById('filterModal').addEventListener('click', (e) => {
            const target = e.target;
            if (target && 'id' in target && target.id === 'filterModal') {
                hideFilterModal();
            }
        });
        modalApplyBtn.setAttribute('data-initialized', 'true');
    }
}

// --- Main Export Function ---

export function renderReports() {
    const reportSection = document.getElementById('reports');
    if (!reportSection) return;
    
    setupEventListeners();
    loadAndRefreshData();
}
