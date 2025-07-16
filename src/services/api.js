/**
 * API service module for user creation
 * Handles communication with the backend API
 */

/**
 * Creates a new user by sending a POST request to the API
 * @param {Object} userData - User data containing firstName, lastName, and email
 * @returns {Promise<Object>} - Promise that resolves with the API response
 * @throws {Error} - Throws error for network issues or API errors
 */
export async function createUser(userData) {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/users';
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    // Check if the response is ok (status 200-299)
    if (!response.ok) {
      // For 4xx and 5xx errors, throw an error
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'An error occurred while creating the user. Please try again later.');
    }

    // Parse and return the successful response
    return await response.json();
  } catch (error) {
    // Handle network errors or other fetch failures
    if (error.name === 'TypeError' || error.message.includes('fetch')) {
      throw new Error('An error occurred while creating the user. Please try again later.');
    }
    // Re-throw API errors
    throw error;
  }
}