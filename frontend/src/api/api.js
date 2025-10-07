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

/**
 * Get current user info
 * @returns {Promise<{ userId: string, email: string, role: string }|null>}
*/
export async function getCurrentUser() {
  try {
    const res = await fetch('http://localhost:8000/api/Auth/me', { credentials: 'include' });
    if (res.ok) { return await res.json(); }
    return null;
  }
  catch (err) {
    console.error('Error getting current user:', err);
    return null;
  }
}

/**
 * Log out & redirect to login
 * @returns {Promise<void>}
 */
export async function logout() {
  try {
    await fetch('http://localhost:8000/api/Auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    window.location.href = 'login.html';
  } catch (err) {
    console.error('Logout error:', err);
    window.location.href = 'login.html';
  }
}


