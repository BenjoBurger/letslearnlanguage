/**
 * Centralized TypeScript types and interfaces for the application.
 * 
 * Example types:
 * - API response types
 * - Component prop types
 * - Domain models
 */

// Add your custom types here
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}
