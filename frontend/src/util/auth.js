import { apiFetch } from '../api/api.js';

/**
 * Get current user info
 * @returns {Promise<{ userId: string, email: string, role: string }|null>}
*/
export async function getCurrentUser() {
  try {
    return await apiFetch('GET', '/api/Auth/me');
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
    await apiFetch('POST', '/api/Auth/logout', { responseType: 'void' });
    window.location.href = 'login.html';
  } catch (err) {
    console.error('Logout error:', err);
    window.location.href = 'login.html';
  }
}

/**
 * Check if we're currently logged in & authenticated
 * If not, redirect to login
 * @returns {Promise<{ userId: string, email: string, role: string }|null>} User object or null if redirected
 */
export async function checkAuth() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  return user;
}

/**
 * Redirect if user does not have a role
 * @param {string} requiredRole
 * @returns {Promise<boolean>} true => user has required role; false otherwise
 */
export async function requireRole(requiredRole) {
  const user = await checkAuth();
  if (!user || user.role !== requiredRole) {
    alert('Access denied. Insufficient permissions.');
    window.location.href = 'index.html';
    return false;
  }
  return true;
}