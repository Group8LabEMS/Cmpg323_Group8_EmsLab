const API_URL = import.meta.env.VITE_API_URL;

// Equipment APIs
export async function getEquipment() {
  const res = await fetch(`${API_URL}/api/equipment`);
  if (!res.ok) throw new Error("Failed to fetch equipment");
  return res.json();
}

export async function createEquipment(equipmentData) {
  const res = await fetch(`${API_URL}/api/equipment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(equipmentData),
  });
  if (!res.ok) throw new Error("Failed to create equipment");
  return res.json();
}

// Booking APIs
export async function getBookings() {
  const res = await fetch(`${API_URL}/api/bookings`);
  if (!res.ok) throw new Error("Failed to fetch bookings");
  return res.json();
}

// Add more API functions as needed...

// Example: User APIs
export async function getUsers() {
  const res = await fetch(`${API_URL}/api/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}