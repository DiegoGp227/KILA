/**
 * Validation Integration Service
 * Combines frontend and backend validation, prioritizing frontend results
 */

import { validateDIANInvoice, ValidationResult, ValidationError } from "./dian.validation.service";
import { validateInvoiceWithAPI, InvoiceValidationResponse } from "./validation.service";

export interface CombinedValidationResult {
  success: boolean;
  validation_id: string;
  invoice_data: any;
  errors: ValidationError[];
  warnings: ValidationError[];
  status: "approved" | "rejected" | "warning";
  message?: string;
  frontend_validation: ValidationResult;
  backend_validation?: InvoiceValidationResponse;
  source: "frontend" | "backend" | "merged";
  conflict_resolution?: {
    fronted_prioritized: boolean;
    conflicts_found: number;
  };
}

/**
 * Merge frontend and backend validations, prioritizing frontend
 */
export async function validateInvoiceIntegrated(file: File): Promise<CombinedValidationResult> {
  try {
    // Step 1: Read the file content
    const fileContent = await readFileAsText(file);
    let invoiceData;

    try {
      invoiceData = JSON.parse(fileContent);
    } catch (parseError) {
      return {
        success: false,
        validation_id: generateValidationId(),
        invoice_data: null,
        errors: [{
          field: "JSON",
          message: "El archivo no contiene JSON válido",
          section: "Estructura del Documento",
          severity: "error",
        }],
        warnings: [],
        status: "rejected",
        message: "El archivo no contiene JSON válido",
        frontend_validation: {
          isValid: false,
          errors: [],
          warnings: [],
          source: "frontend",
        },
        source: "frontend",
      };
    }

    // Step 2: Run FRONTEND validation FIRST (always runs)
    const frontendValidation = validateDIANInvoice(invoiceData);

    console.log("🔍 Frontend Validation Results:", {
      isValid: frontendValidation.isValid,
      errors: frontendValidation.errors.length,
      warnings: frontendValidation.warnings.length,
      errorDetails: frontendValidation.errors,
      warningDetails: frontendValidation.warnings
    });

    // Step 3: Try to run backend validation (non-blocking)
    let backendValidation: InvoiceValidationResponse | undefined;
    try {
      backendValidation = await validateInvoiceWithAPI(file);
    } catch (error) {
      console.warn("Backend validation failed, using frontend only:", error);
      // Continue with frontend-only validation
    }

    // Step 4: Merge results, PRIORITIZING FRONTEND
    const mergedResult = mergeValidations(
      frontendValidation,
      backendValidation,
      invoiceData,
      file.name
    );

    return mergedResult;

  } catch (error: any) {
    console.error("Validation integration error:", error);

    return {
      success: false,
      validation_id: generateValidationId(),
      invoice_data: null,
      errors: [{
        field: "General",
        message: error.message || "Error al validar la factura",
        section: "Validación",
        severity: "error",
      }],
      warnings: [],
      status: "rejected",
      message: error.message || "Error al validar la factura",
      frontend_validation: {
        isValid: false,
        errors: [],
        warnings: [],
        source: "frontend",
      },
      source: "frontend",
    };
  }
}

/**
 * Merge frontend and backend validations
 * FRONTEND ALWAYS WINS when there's a conflict
 */
function mergeValidations(
  frontendValidation: ValidationResult,
  backendValidation: InvoiceValidationResponse | undefined,
  invoiceData: any,
  filename: string
): CombinedValidationResult {

  // If backend validation failed or doesn't exist, use frontend only
  if (!backendValidation || !backendValidation.success) {
    return {
      success: true,
      validation_id: generateValidationId(),
      invoice_data: invoiceData,
      errors: frontendValidation.errors,
      warnings: frontendValidation.warnings,
      status: determineStatus(frontendValidation.errors, frontendValidation.warnings),
      message: "Validación completada (solo frontend)",
      frontend_validation: frontendValidation,
      backend_validation: backendValidation,
      source: "frontend",
    };
  }

  // Both validations available - MERGE with FRONTEND PRIORITY
  const { mergedErrors, mergedWarnings, conflictsFound } = mergeErrorsAndWarnings(
    frontendValidation.errors,
    frontendValidation.warnings,
    backendValidation.errors || [],
    backendValidation.warnings || []
  );

  return {
    success: true,
    validation_id: backendValidation.validation_id || generateValidationId(),
    invoice_data: invoiceData,
    errors: mergedErrors,
    warnings: mergedWarnings,
    status: determineStatus(mergedErrors, mergedWarnings),
    message: conflictsFound > 0
      ? `Validación completada. Se priorizaron ${conflictsFound} resultado(s) del frontend sobre el backend`
      : "Validación completada (frontend y backend concuerdan)",
    frontend_validation: frontendValidation,
    backend_validation: backendValidation,
    source: "merged",
    conflict_resolution: {
      fronted_prioritized: true,
      conflicts_found: conflictsFound,
    },
  };
}

/**
 * Merge errors and warnings from both sources
 * Frontend errors ALWAYS take priority over backend errors for the same field
 */
function mergeErrorsAndWarnings(
  frontendErrors: ValidationError[],
  frontendWarnings: ValidationError[],
  backendErrors: ValidationError[],
  backendWarnings: ValidationError[]
): {
  mergedErrors: ValidationError[];
  mergedWarnings: ValidationError[];
  conflictsFound: number;
} {
  const mergedErrors: ValidationError[] = [];
  const mergedWarnings: ValidationError[] = [];
  let conflictsFound = 0;

  // Create maps for quick lookup
  const frontendErrorFields = new Set(frontendErrors.map(e => normalizeFieldName(e.field)));
  const frontendWarningFields = new Set(frontendWarnings.map(w => normalizeFieldName(w.field)));

  // Add ALL frontend errors and warnings FIRST (they have priority)
  mergedErrors.push(...frontendErrors.map(e => ({ ...e, source: "frontend" as const })));
  mergedWarnings.push(...frontendWarnings.map(w => ({ ...w, source: "frontend" as const })));

  // Add backend errors ONLY if not present in frontend
  for (const backendError of backendErrors) {
    const normalizedField = normalizeFieldName(backendError.field);

    if (frontendErrorFields.has(normalizedField)) {
      // Conflict detected - frontend wins
      conflictsFound++;
      console.log(`Conflict: Frontend error for "${backendError.field}" overrides backend`);
    } else {
      // No conflict - add backend error
      mergedErrors.push({
        ...backendError,
        source: "backend" as const,
        message: `[Backend] ${backendError.message}`,
      });
    }
  }

  // Add backend warnings ONLY if not present in frontend
  for (const backendWarning of backendWarnings) {
    const normalizedField = normalizeFieldName(backendWarning.field);

    if (frontendWarningFields.has(normalizedField) || frontendErrorFields.has(normalizedField)) {
      // Conflict detected - frontend wins
      conflictsFound++;
      console.log(`Conflict: Frontend validation for "${backendWarning.field}" overrides backend warning`);
    } else {
      // No conflict - add backend warning
      mergedWarnings.push({
        ...backendWarning,
        source: "backend" as const,
        message: `[Backend] ${backendWarning.message}`,
      });
    }
  }

  return { mergedErrors, mergedWarnings, conflictsFound };
}

/**
 * Normalize field names for comparison
 * Handles variations like "InvoiceNumber" vs "invoice_number"
 */
function normalizeFieldName(field: string): string {
  return field
    .toLowerCase()
    .replace(/[_\-.]/g, "")
    .replace(/\[\d+\]/g, ""); // Remove array indices like [0]
}

/**
 * Determine overall status based on errors and warnings
 */
function determineStatus(
  errors: ValidationError[],
  warnings: ValidationError[]
): "approved" | "rejected" | "warning" {
  if (errors.length > 0) {
    return "rejected";
  }
  if (warnings.length > 0) {
    return "warning";
  }
  return "approved";
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
