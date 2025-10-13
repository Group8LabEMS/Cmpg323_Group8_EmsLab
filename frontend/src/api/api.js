/**
 * API fetch wrapper
 * @param {'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'} method
 * @param {`${'http'|'/'}${string}`} endpoint
 * @param {{ creds?: boolean, body?: object, responseType?: 'json'|'text'|'void', headers?: object }} options
 * @returns {Promise<any>}
 */
export async function apiFetch(method, endpoint, options = {}) {
  const { creds = true, body, responseType = 'json', headers = {} } = options;
  
  const url = endpoint.startsWith('http') ? endpoint : `${window.origin}${endpoint}`;
  
  /** @type {RequestInit} */
  const fetchOptions = {
    method,
    ...(creds ? { credentials: 'include' } : {}),
    headers: { ...headers }
  };
  
  if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
    fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    if (!headers['Content-Type']) {
      fetchOptions.headers['Content-Type'] = 'application/json';
    }
  }

  console.log("API FETCHING:", url);
  
  const res = await fetch(url, fetchOptions);
  if (!res.ok) { throw new Error(`HTTP error! status: ${res.status}`); }
  
  if (responseType === 'void') return;
  if (responseType === 'text') return await res.text();
  
  try { return await res.json(); }
  catch (err) { console.error("Failed to parse response data:", err); }
}

/** @returns {Promise<void>} */
export async function getData() {
  try {
    const data = await apiFetch('GET', '/api/equipment');
    console.log("Equipment:", data);
  }
  catch (err) { console.error("Error fetching EQUIPMENT data:", err); }
}

/** @returns {Promise<{ totalUsers: number, activeBookings: number, maintenanceEquipment: number }>} */
export async function getAdminAggregateStats() {
  return await apiFetch('GET', '/api/stats/aggregates');
}

/** @returns {Promise<Array<{ month: number, year: number, count: number }>>} */
export async function getBookingsPerMonth() {
  return await apiFetch('GET', '/api/stats/bookings-per-month');
}

/** @returns {Promise<Array<{ name: string, count: number }>>} */
export async function getEquipmentUsage() {
  return await apiFetch('GET', '/api/stats/equipment-usage');
}

/** @returns {Promise<Array<{ Date: string, IsPast: boolean }>>} */
export async function getUserBookingDates(userId) {
  return await apiFetch('GET', `/api/Booking/user/${userId}/calendar`);
}

/** @returns {Promise<Array<{ BookingId: number, EquipmentName: string, FromDate: string, ToDate: string }>>} */
export async function getUserUpcomingBookings(userId) {
  return await apiFetch('GET', `/api/Booking/user/${userId}/upcoming`);
}