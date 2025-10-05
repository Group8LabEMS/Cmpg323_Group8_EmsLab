/**
 * User Data Helper Functions
 * Manages user authentication, localStorage operations, and user data retrieval
 */

/**
 * Loads user data from localStorage and updates the UI
 * @returns {Object} User data object containing userId, userRole, userName, and userEmail
 */
export function loadUserData() {
  // Get values from localStorage
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('role');
  const userName = localStorage.getItem('name') || localStorage.getItem('displayName');
  const userEmail = localStorage.getItem('email');

  // Update the display name in sidebar
  const displayNameElement = document.getElementById('userDisplayName');
  if (displayNameElement && userName) {
    displayNameElement.textContent = userName;
  } else if (displayNameElement && userEmail) {
    // Fallback to email if no name is stored
    displayNameElement.textContent = userEmail.split('@')[0]; // Use email prefix
  }

  return { userId, userRole, userName, userEmail };
}

/**
 * Checks if the user is authenticated
 * @returns {boolean} True if user is authenticated, false otherwise
 */
export function checkAuthentication() {
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('role');

  if (!userId || !userRole) {
    // User not authenticated, redirect to login
    window.location.href = 'Login.html';
    return false;
  }
  return true;
}

/**
 * Handles user logout by clearing localStorage and redirecting to login
 */
export function handleLogout() {
  // Clear all localStorage data
  localStorage.removeItem('userId');
  localStorage.removeItem('role');
  localStorage.removeItem('userName');
  localStorage.removeItem('displayName');
  localStorage.removeItem('userEmail');
  
  // Redirect to login page
  window.location.href = 'Login.html';
}

/**
 * Helper function to get current user data anywhere in your app
 * @returns {Object} Current user data object
 */
export function getCurrentUser() {
  return {
    id: localStorage.getItem('userId'),
    role: localStorage.getItem('role'),
    name: localStorage.getItem('userName') || localStorage.getItem('displayName'),
    email: localStorage.getItem('userEmail')
  };
}

/**
 * Helper function to check if user has specific role
 * @param {string} requiredRole - The role to check against
 * @returns {boolean} True if user has the required role
 */
export function hasRole(requiredRole) {
  const userRole = localStorage.getItem('role');
  return userRole === requiredRole;
}

/**
 * Helper function to check if user is admin
 * @returns {boolean} True if user is admin
 */
export function isAdmin() {
  return hasRole('Administrator') || hasRole('Admin');
}