/**
 * LocalStorage Service - Manages validation history and data
 */

export interface StoredValidation {
  id: string;
  filename: string;
  timestamp: string;
  invoice_data: any;
  errors: Array<{
    field: string;
    message: string;
    section: string;
    severity: "error" | "warning";
    requirementNumber?: number;
    allowsPartialCompliance?: boolean;
  }>;
  warnings: Array<{
    field: string;
    message: string;
    section: string;
    severity: "error" | "warning";
    requirementNumber?: number;
    allowsPartialCompliance?: boolean;
  }>;
  status: "approved" | "rejected" | "warning";
  invoice_info: {
    invoice_number?: string;
    supplier?: string;
    customer?: string;
    total_amount?: string;
    currency?: string;
    date?: string;
    items_count?: number;
  };
  validation_source?: "frontend" | "backend" | "merged";
  frontend_validation?: any;
  backend_validation?: any;
  conflict_resolution?: {
    fronted_prioritized: boolean;
    conflicts_found: number;
  };
}

const STORAGE_KEY = "kila_validations";
const MAX_VALIDATIONS = 50; // Keep last 50 validations

/**
 * Save validation to localStorage
 */
export function saveValidation(validation: StoredValidation): void {
  try {
    const validations = getAllValidations();

    // Add new validation at the beginning
    validations.unshift(validation);

    // Keep only the most recent validations
    const trimmedValidations = validations.slice(0, MAX_VALIDATIONS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedValidations));
  } catch (error) {
    console.error("Error saving validation to localStorage:", error);
  }
}

/**
 * Get all validations from localStorage
 */
export function getAllValidations(): StoredValidation[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading validations from localStorage:", error);
    return [];
  }
}

/**
 * Get validation by ID
 */
export function getValidationById(id: string): StoredValidation | null {
  try {
    const validations = getAllValidations();
    return validations.find(v => v.id === id) || null;
  } catch (error) {
    console.error("Error getting validation by ID:", error);
    return null;
  }
}

/**
 * Delete validation by ID
 */
export function deleteValidation(id: string): boolean {
  try {
    const validations = getAllValidations();
    const filtered = validations.filter(v => v.id !== id);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Error deleting validation:", error);
    return false;
  }
}

/**
 * Clear all validations
 */
export function clearAllValidations(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing validations:", error);
  }
}

/**
 * Get validation statistics
 */
export function getValidationStats() {
  const validations = getAllValidations();

  const total = validations.length;
  const approved = validations.filter(v => v.status === "approved").length;
  const rejected = validations.filter(v => v.status === "rejected").length;
  const warning = validations.filter(v => v.status === "warning").length;
  const approval_rate = total > 0 ? Math.round((approved / total) * 100) : 0;

  return {
    total,
    approved,
    rejected,
    warning,
    approval_rate,
  };
}

/**
 * Get recent validations (last N)
 */
export function getRecentValidations(limit: number = 5): StoredValidation[] {
  const validations = getAllValidations();
  return validations.slice(0, limit);
}

/**
 * Extract invoice info from raw invoice data
 */
export function extractInvoiceInfo(invoiceData: any): StoredValidation["invoice_info"] {
  // Handle different invoice formats
  if (invoiceData.Fields && Array.isArray(invoiceData.Fields)) {
    // Format with Fields array
    const fields = invoiceData.Fields;
    const getFieldValue = (fieldName: string) => {
      const field = fields.find((f: any) => f.Fields === fieldName);
      return field?.Value || "";
    };

    return {
      invoice_number: getFieldValue("InvoiceNumber"),
      supplier: getFieldValue("Supplier"),
      customer: getFieldValue("Customer"),
      total_amount: getFieldValue("TotalInvoiceValue"),
      currency: getFieldValue("Currency"),
      date: getFieldValue("InvoiceDate"),
      items_count: invoiceData.Table?.length || 0,
    };
  }

  // Default format
  return {
    invoice_number: invoiceData.invoice_number || invoiceData.InvoiceNumber || "",
    supplier: invoiceData.supplier || invoiceData.Supplier || "",
    customer: invoiceData.customer || invoiceData.Customer || "",
    total_amount: invoiceData.total_amount || invoiceData.TotalInvoiceValue || "",
    currency: invoiceData.currency || invoiceData.Currency || "",
    date: invoiceData.date || invoiceData.InvoiceDate || "",
    items_count: invoiceData.items?.length || invoiceData.Table?.length || 0,
  };
}
