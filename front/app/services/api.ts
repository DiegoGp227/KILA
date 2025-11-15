/**
 * API Service - Handles all backend communication
 */

import { API_ENDPOINTS, REQUEST_CONFIG } from "../config/urls";

export interface ValidationResponse {
  success: boolean;
  data?: {
    validation_id: number;
    filename: string;
    invoice_info: {
      invoice_number?: string;
      supplier?: string;
      importer?: string;
      amount?: string;
      currency?: string;
      items?: number;
      date?: string;
    };
    validation_summary: {
      status: "approved" | "rejected" | "warning";
      total_errors: number;
      total_warnings: number;
    };
    errors: any[];
    warnings: any[];
  };
  error?: string;
}

export interface Validation {
  id: number;
  filename: string;
  invoice_number?: string;
  supplier?: string;
  importer?: string;
  amount?: string;
  currency?: string;
  items?: number;
  date?: string;
  status: "approved" | "rejected" | "warning";
  errors: number;
  warnings: number;
  created_at: string;
}

export interface Stats {
  total: number;
  approved: number;
  rejected: number;
  warning: number;
  approval_rate: number;
}

/**
 * Upload and validate invoice JSON file
 */
export async function uploadInvoice(file: File): Promise<ValidationResponse> {
  // Validate file size
  if (file.size > REQUEST_CONFIG.maxFileSize) {
    return {
      success: false,
      error: `El archivo es demasiado grande. Máximo ${REQUEST_CONFIG.maxFileSize / 1024 / 1024}MB`,
    };
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(API_ENDPOINTS.upload, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: error.message || "Error al subir el archivo",
    };
  }
}

/**
 * Get all validations
 */
export async function getAllValidations(): Promise<Validation[]> {
  try {
    const response = await fetch(API_ENDPOINTS.validations.list);
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching validations:", error);
    return [];
  }
}

/**
 * Get validation by ID
 */
export async function getValidationById(id: number): Promise<Validation | null> {
  try {
    const response = await fetch(API_ENDPOINTS.validations.getById(id));
    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error("Error fetching validation:", error);
    return null;
  }
}

/**
 * Get dashboard statistics
 */
export async function getStats(): Promise<Stats> {
  try {
    const response = await fetch(API_ENDPOINTS.stats);
    const result = await response.json();
    return result.data || { total: 0, approved: 0, rejected: 0, warning: 0, approval_rate: 0 };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { total: 0, approved: 0, rejected: 0, warning: 0, approval_rate: 0 };
  }
}

/**
 * Delete validation
 */
export async function deleteValidation(id: number): Promise<boolean> {
  try {
    const response = await fetch(API_ENDPOINTS.validations.delete(id), {
      method: "DELETE",
    });
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error("Error deleting validation:", error);
    return false;
  }
}
