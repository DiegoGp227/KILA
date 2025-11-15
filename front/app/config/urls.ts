/**
 * API URLs Configuration
 * Centraliza todas las URLs del sistema para fácil modificación
 */

// Backend API URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";

// API Endpoints
export const API_ENDPOINTS = {
  // Upload and validation
  upload: `${API_BASE_URL}/api/upload`,

  // Validations CRUD
  validations: {
    list: `${API_BASE_URL}/api/validations`,
    getById: (id: number) => `${API_BASE_URL}/api/validations/${id}`,
    delete: (id: number) => `${API_BASE_URL}/api/validations/${id}`,
  },

  // Statistics
  stats: `${API_BASE_URL}/api/stats`,

  // External validation service - using Next.js proxy to avoid CORS issues
  externalValidation: process.env.NEXT_PUBLIC_VALIDATION_URL || "/api/validate",
};

// Request configuration
export const REQUEST_CONFIG = {
  timeout: 30000, // 30 seconds
  maxFileSize: 10 * 1024 * 1024, // 10MB
  acceptedFormats: [".json"],
};
