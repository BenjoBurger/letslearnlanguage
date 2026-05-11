/**
 * Utility and helper functions used across the application.
 * 
 * Examples:
 * - String formatters
 * - Date utilities
 * - Validation helpers
 * - Math/calculation helpers
 */

/**
 * Format a string to title case
 */
export const toTitleCase = (str: string): string => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Check if a string is a valid email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
