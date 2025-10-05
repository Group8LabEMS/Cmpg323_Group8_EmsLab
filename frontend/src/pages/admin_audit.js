// pages/admin_reports.js
// API-integrated logic for the Admin Reports section.

// --- Global State ---
let currentAuditLogData = [];
let currentAuditType = 'user'; 

// Only keep role filter for user audit type
let currentFilters = {
    user: { role: '' }
};

// --- Report Data & Configuration ---

// Only keep roles in unique options
let UNIQUE_OPTIONS = {
    roles: []
};

const AUDIT_CONFIG = {
    user: {
        apiEndpoint: '/api/AuditLog',
        headers: ["TimeStamp", "User", "Action", "Affected Object", "Summary"],
        keys: ["timeStamp", "userDisplayName", "action", "entityType", "detailsMessage"],
        sortOptions: ["User ID Ascending", "Name A to Z", "Name Z to A"],
        sortMap: {
            "User ID Ascending": { key: "userId", order: "asc" },
            "Name A to Z": { key: "userDisplayName", order: "asc" },
            "Name Z to A": { key: "userDisplayName", order: "desc" },
        },
        filterFields: [
            { key: "role", label: "Role", type: "select", optionsKey: "roles" }
        ],
    },
};

// --- API Fetching Functions ---

async function fetchAuditLogData(endpoint) {
    try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`Failed to fetch auditlog data from ${endpoint}`);
        const data = await res.json();
        // Normalize data keys for table display
        return data.map(item => {
            if (currentAuditType === 'user') {
                let detailsMessage = '';
                try {
                    const parsed = JSON.parse(item.details);
                    detailsMessage = parsed.message || item.details;
                } catch {
                    detailsMessage = item.details;
                }
                return {
                    timeStamp: item.timeStamp,
                    userDisplayName: item.user?.displayName || item.userId,
                    userId: item.userId,
                    action: item.action,
                    entityType: item.entityType,
                    detailsMessage: detailsMessage
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
        const roles = await fetch('/api/Role').then(res => res.json()).catch(() => []);
        UNIQUE_OPTIONS.roles = roles.map(r => r.name).filter(Boolean);
    } catch (e) {
        console.warn("Could not fetch unique role options for filters:", e);
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
    const sortByConfig = AUDIT_CONFIG[type].sortMap[sortBy];
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

function renderAuditTable(data, config) {
    const tbody = document.getElementById('auditTableBody');
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
    const select = document.getElementById('auditSortSelect');
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
    const headerRow = document.getElementById('auditTableHeader');
    if (!headerRow) return;

    headerRow.innerHTML = '';
    config.headers.forEach((header, index) => {
        const th = document.createElement('th');
        th.textContent = header;
        th.dataset.key = config.keys[index];
        headerRow.appendChild(th);
    });
}

function refreshAuditView() {
    const searchInputEl = document.getElementById('auditSearchInput');
    const sortSelectEl = document.getElementById('auditSortSelect');
    const searchInput = searchInputEl ? /** @type {HTMLInputElement} */(searchInputEl).value : '';
    const sortSelect = sortSelectEl ? /** @type {HTMLSelectElement} */(sortSelectEl).value : '';
    const config = AUDIT_CONFIG[currentAuditType];
    
    const finalData = applyFiltersAndSort(currentAuditLogData, config, searchInput, sortSelect, currentAuditType);
    
    renderAuditTable(finalData, config);

    const filterActiveIndicator = document.getElementById('filterActiveIndicator');
    const filters = currentFilters[currentAuditType];
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
    const config = AUDIT_CONFIG[currentAuditType];
    
    if (UNIQUE_OPTIONS.roles.length === 0) {
        await fetchUniqueOptions();
    }
    
    // Show loading state here if needed
    
    const rawData = await fetchAuditLogData(config.apiEndpoint);
    currentAuditLogData = rawData;
    
    renderTableHeader(config);
    populateSortOptions(config);
    refreshAuditView();
}

// --- Modal Functions ---

function showFilterModal() {
    const modal = document.getElementById('filterModal');
    const formContent = document.getElementById('filterFormContent');
    const modalTitle = document.getElementById('filterModalTitle');
    const config = AUDIT_CONFIG[currentAuditType];
    const filters = currentFilters[currentAuditType] || {};

    if (!modal || !formContent) return;

    modalTitle.textContent = `Filter ${config.headers[0].split(' ')[0]} Audit`;
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
    const config = AUDIT_CONFIG[currentAuditType];
    let newFilters = currentFilters[currentAuditType] || {};

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

    currentFilters[currentAuditType] = newFilters;
    hideFilterModal();
    refreshAuditView();
}

function clearFiltersFromModal() {
    const config = AUDIT_CONFIG[currentAuditType];
    let newFilters = currentFilters[currentAuditType] || {};

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

    currentFilters[currentAuditType] = newFilters;
    refreshAuditView();
}

function clearAllControls() {
    const searchInput = document.getElementById('auditSearchInput');
    if (searchInput) /** @type {HTMLInputElement} */(searchInput).value = '';

    const sortSelect = document.getElementById('auditSortSelect');
    if (sortSelect) /** @type {HTMLSelectElement} */(sortSelect).value = '';

    // Reset filters to empty state
    currentFilters[currentAuditType] = {
        role: '', faculty: '', department: '',
        status: '', type: '',
        dateRange: { from: '', to: '' }
    };

    refreshAuditView();
}

function setupEventListeners() {
    const typeSelect = document.getElementById('auditTypeSelect');
    if (typeSelect && !typeSelect.hasAttribute('data-initialized')) {
        typeSelect.addEventListener('change', (e) => {
            const target = e.target;
            if (target instanceof HTMLSelectElement) {
                currentAuditType = target.value;
            } else {
                currentAuditType = 'user';
            }
            loadAndRefreshData();
            });
        typeSelect.setAttribute('data-initialized', 'true');
    }
    
    const searchInput = document.getElementById('auditSearchInput');
    if (searchInput && !searchInput.hasAttribute('data-initialized')) {
        let timeout = null;
        searchInput.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(refreshAuditView, 300); 
        });
        searchInput.setAttribute('data-initialized', 'true');
    }
    
    const sortSelect = document.getElementById('auditSortSelect');
    if (sortSelect && !sortSelect.hasAttribute('data-initialized')) {
        sortSelect.addEventListener('change', refreshAuditView);
        sortSelect.setAttribute('data-initialized', 'true');
    }

    const filterBtn = document.getElementById('auditFilterBtn');
    if (filterBtn && !filterBtn.hasAttribute('data-initialized')) {
        filterBtn.addEventListener('click', showFilterModal);
        filterBtn.setAttribute('data-initialized', 'true');
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

export function renderAdminAudit() {
const auditSection = document.getElementById('adminAudit');
    if (!auditSection) return;
    
    setupEventListeners();
    loadAndRefreshData();
}