/**
 * API Configuration - URLs and Request Settings
 */

// Get API URL from environment variable or use default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/**
 * API Endpoints Configuration
 */
export const API_ENDPOINTS = {
  // Upload endpoint
  upload: `${API_BASE_URL}/api/upload`,

  // External validation endpoint
  externalValidation: `${API_BASE_URL}/api/validate`,

  // Validations endpoints
  validations: {
    list: `${API_BASE_URL}/api/validations`,
    getById: (id: number) => `${API_BASE_URL}/api/validations/${id}`,
    delete: (id: number) => `${API_BASE_URL}/api/validations/${id}`,
  },

  // Stats endpoint
  stats: `${API_BASE_URL}/api/stats`,

  // Auth endpoints
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    signup: `${API_BASE_URL}/api/auth/signup`,
    logout: `${API_BASE_URL}/api/auth/logout`,
  },
};

/**
 * Request Configuration
 */
export const REQUEST_CONFIG = {
  // Maximum file size in bytes (10MB)
  maxFileSize: 10 * 1024 * 1024,

  // Request timeout in milliseconds
  timeout: 30000,

  // Retry configuration
  maxRetries: 3,
  retryDelay: 1000,
};
