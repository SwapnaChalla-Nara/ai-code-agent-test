/**
 * API Service for user creation
 * Based on the API contract defined in the spec
 */

/**
 * Creates a new user via API call
 * @param {Object} userData - User data object
 * @param {string} userData.firstName - User's first name
 * @param {string} userData.lastName - User's last name
 * @param {string} userData.email - User's email address
 * @returns {Promise<Object>} API response
 */
export async function createUser(userData) {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/users';
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create user');
  }

  return data;
}