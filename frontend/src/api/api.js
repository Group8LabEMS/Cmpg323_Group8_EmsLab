/** @returns {Promise<void>} */
export async function getData() {
  try {
    const res = await fetch("http://localhost:8000/api/equipment", {
      credentials: 'include'
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    console.log("Equipment:", data);
  }
  catch (err) { console.error("Error fetching EQUIPMENT data:", err); }
}

/** @returns {Promise<{ totalUsers: number, activeBookings: number, maintenanceEquipment: number }>} */
export async function getAdminAggregateStats() {
  const res = await fetch("http://localhost:8000/api/stats/aggregates", { credentials: 'include' });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const text = await res.text();
  console.log("RESPONSE:", text)
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
  }
}

/** @returns {Promise<Array<{ month: number, year: number, count: number }>>} */
export async function getBookingsPerMonth() {
  const res = await fetch("http://localhost:8000/api/stats/bookings-per-month", {
    credentials: 'include'
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
  }
}

/** @returns {Promise<Array<{ name: string, count: number }>>} */
export async function getEquipmentUsage() {
  const res = await fetch("http://localhost:8000/api/stats/equipment-usage", {
    credentials: 'include'
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
  }
}