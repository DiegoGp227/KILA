/**
 * Validation Service - Handles external invoice validation
 */

import { API_ENDPOINTS } from "../config/urls";

export interface InvoiceValidationRequest {
  file: File;
}

export interface InvoiceValidationResponse {
  success: boolean;
  validation_id?: string;
  invoice_data?: any;
  errors?: ValidationError[];
  warnings?: ValidationWarning[];
  status?: "approved" | "rejected" | "warning";
  message?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  section: string;
  severity: "error";
}

export interface ValidationWarning {
  field: string;
  message: string;
  section: string;
  severity: "warning";
}

const VALIDATION_ENDPOINT = API_ENDPOINTS.externalValidation;

/**
 * Validate invoice by sending JSON to external endpoint
 */
export async function validateInvoiceWithAPI(file: File): Promise<InvoiceValidationResponse> {
  try {
    // Read file content as JSON
    const fileContent = await readFileAsText(file);
    let invoiceData;

    try {
      invoiceData = JSON.parse(fileContent);
    } catch (parseError) {
      return {
        success: false,
        message: "El archivo no contiene JSON válido",
      };
    }

    // Send to validation endpoint (via Next.js proxy to avoid CORS)
    const response = await fetch(VALIDATION_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(invoiceData),
    });

    const result = await response.json();

    // Check if API returned an error
    if (result.error) {
      // Parse the error message to extract structured validation errors
      const parsedErrors = parseServerError(result.error);

      // If we successfully parsed errors, save the validation with errors
      if (parsedErrors.length > 0) {
        const validation_id = generateValidationId();

        return {
          success: true,
          validation_id,
          invoice_data: invoiceData,
          errors: parsedErrors,
          warnings: [],
          status: "rejected",
          message: "La factura tiene errores de validación",
        };
      }

      // Otherwise return generic error
      return {
        success: false,
        message: result.error,
      };
    }

    // Check HTTP status
    if (!response.ok) {
      return {
        success: false,
        message: result.message || `Error del servidor: ${response.status}`,
      };
    }

    // Generate validation ID
    const validation_id = generateValidationId();

    // Return standardized response
    return {
      success: true,
      validation_id,
      invoice_data: invoiceData,
      errors: result.errors || [],
      warnings: result.warnings || [],
      status: determineStatus(result.errors || [], result.warnings || []),
      message: result.message,
    };
  } catch (error: any) {
    console.error("Validation error:", error);

    // Detect network errors
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      return {
        success: false,
        message: "Error de conexión: No se puede conectar al servidor de validación. Verifica que el endpoint esté activo y accesible.",
      };
    }

    return {
      success: false,
      message: error.message || "Error al validar la factura",
    };
  }
}

/**
 * Parse server error message into structured validation errors
 */
function parseServerError(errorMessage: string): ValidationError[] {
  const errors: ValidationError[] = [];

  try {
    // Pattern 1: "Invalid Incoterm: must be one of ['FOB', 'EXW', 'CIF', 'DAP']"
    const incotermMatch = errorMessage.match(/Invalid Incoterm: must be one of \[(.*?)\]/);
    if (incotermMatch) {
      errors.push({
        field: "Incoterm",
        message: `Incoterm inválido. Debe ser uno de: ${incotermMatch[1].replace(/'/g, "")}`,
        section: "Información de Transporte",
        severity: "error",
      });
    }

    // Pattern 2: Generic validation error patterns
    const fieldErrorMatch = errorMessage.match(/Field '([^']+)' (.+)/);
    if (fieldErrorMatch) {
      errors.push({
        field: fieldErrorMatch[1],
        message: fieldErrorMatch[2],
        section: "Datos de Factura",
        severity: "error",
      });
    }

    // Pattern 3: Missing required field
    const missingFieldMatch = errorMessage.match(/Missing required field[s]?: ([^.\n]+)/i);
    if (missingFieldMatch) {
      const fields = missingFieldMatch[1].split(",").map(f => f.trim());
      fields.forEach(field => {
        errors.push({
          field: field.replace(/['"]/g, ""),
          message: "Campo requerido faltante",
          section: "Datos de Factura",
          severity: "error",
        });
      });
    }

    // Pattern 4: Invalid format
    const formatMatch = errorMessage.match(/Invalid format for ([^:]+): (.+)/);
    if (formatMatch) {
      errors.push({
        field: formatMatch[1],
        message: `Formato inválido: ${formatMatch[2]}`,
        section: "Datos de Factura",
        severity: "error",
      });
    }

    // Pattern 5: Value error (generic Pydantic error)
    const valueErrorMatch = errorMessage.match(/Value error, (.+?)\./);
    if (valueErrorMatch && errors.length === 0) {
      // Extract field name if possible
      const fieldFromInput = errorMessage.match(/'([^']+)'/);
      errors.push({
        field: fieldFromInput?.[1] || "Desconocido",
        message: valueErrorMatch[1],
        section: "Validación General",
        severity: "error",
      });
    }

    // If no specific patterns matched but we have an error, create a generic one
    if (errors.length === 0 && errorMessage.includes("validation error")) {
      errors.push({
        field: "JSON",
        message: "Error de validación en el formato del JSON",
        section: "Estructura del Documento",
        severity: "error",
      });
    }

  } catch (parseError) {
    console.error("Error parsing server error:", parseError);
    // Return a generic error if parsing fails
    return [{
      field: "General",
      message: errorMessage,
      section: "Validación",
      severity: "error",
    }];
  }

  return errors;
}

/**
 * Read file as text
 */
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(new Error("Error al leer el archivo"));
    reader.readAsText(file);
  });
}

/**
 * Generate unique validation ID
 */
function generateValidationId(): string {
  return `val_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Determine overall status based on errors and warnings
 */
function determineStatus(
  errors: ValidationError[],
  warnings: ValidationWarning[]
): "approved" | "rejected" | "warning" {
  if (errors.length > 0) {
    return "rejected";
  }
  if (warnings.length > 0) {
    return "warning";
  }
  return "approved";
}
