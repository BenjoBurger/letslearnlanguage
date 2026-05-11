/**
 * API services and business logic layer.
 * 
 * This folder contains:
 * - API client setup and configuration
 * - API endpoint calls
 * - Data fetching logic
 * - External service integrations
 */

// Example: API base configuration
export const API_BASE_URL = 'https://api.example.com';

/**
 * Example API service for user operations
 */
export const userService = {
  async getUser(id: string) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    return response.json();
  },

  async updateUser(id: string, data: unknown) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
