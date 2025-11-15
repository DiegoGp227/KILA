/**
 * Simple Frontend Invoice Validations
 * Complex validations (AI-based) are handled in the backend
 */

import { SystemInvoice } from "./invoiceAdapter";

export type ValidationSeverity = "error" | "warning";

export interface ValidationResult {
  field: string;
  message: string;
  severity: ValidationSeverity;
  section: string;
}

/**
 * Validates if a required field is empty
 */
function validateRequired(
  value: string | undefined,
  fieldName: string,
  section: string
): ValidationResult | null {
  if (!value || value.trim() === "") {
    return {
      field: fieldName,
      message: `${fieldName} es un campo requerido`,
      severity: "error",
      section,
    };
  }
  return null;
}

/**
 * Validates date format (YYYY-MM-DD or DD/MM/YYYY)
 */
function validateDate(
  value: string | undefined,
  fieldName: string,
  section: string
): ValidationResult | null {
  if (!value) return null;

  const isoFormat = /^\d{4}-\d{2}-\d{2}$/;
  const commonFormat = /^\d{2}\/\d{2}\/\d{4}$/;

  if (!isoFormat.test(value) && !commonFormat.test(value)) {
    return {
      field: fieldName,
      message: `${fieldName} tiene un formato de fecha inválido (use YYYY-MM-DD o DD/MM/YYYY)`,
      severity: "error",
      section,
    };
  }
  return null;
}

/**
 * Validates numeric value
 */
function validateNumeric(
  value: string | undefined,
  fieldName: string,
  section: string
): ValidationResult | null {
  if (!value) return null;

  // Remove common formatting (commas, spaces)
  const cleanValue = value.replace(/[,\s]/g, "");

  if (isNaN(Number(cleanValue))) {
    return {
      field: fieldName,
      message: `${fieldName} debe ser un valor numérico válido`,
      severity: "error",
      section,
    };
  }

  if (Number(cleanValue) <= 0) {
    return {
      field: fieldName,
      message: `${fieldName} debe ser mayor que cero`,
      severity: "warning",
      section,
    };
  }

  return null;
}

/**
 * Validates currency code (3-letter ISO code)
 */
function validateCurrency(
  value: string | undefined,
  fieldName: string,
  section: string
): ValidationResult | null {
  if (!value) return null;

  const validCurrencies = ["USD", "EUR", "COP", "CNY", "JPY", "GBP", "CAD"];

  if (!validCurrencies.includes(value.toUpperCase())) {
    return {
      field: fieldName,
      message: `${fieldName} debe ser un código de moneda válido (USD, EUR, COP, etc.)`,
      severity: "warning",
      section,
    };
  }

  return null;
}

/**
 * Validates tax ID format (basic check)
 */
function validateTaxId(
  value: string | undefined,
  fieldName: string,
  section: string
): ValidationResult | null {
  if (!value) return null;

  // Basic check: at least 5 characters, alphanumeric
  if (value.length < 5 || !/^[a-zA-Z0-9-]+$/.test(value)) {
    return {
      field: fieldName,
      message: `${fieldName} tiene un formato inválido (mínimo 5 caracteres alfanuméricos)`,
      severity: "error",
      section,
    };
  }

  return null;
}

/**
 * Main validation function for invoice
 */
export function validateInvoice(invoice: SystemInvoice): ValidationResult[] {
  const validations: ValidationResult[] = [];

  // Supplier validations
  const supplierValidations = [
    validateRequired(invoice.supplier.name, "Nombre del Proveedor", "Proveedor"),
    validateRequired(invoice.supplier.taxId, "NIT/Tax ID del Proveedor", "Proveedor"),
    validateTaxId(invoice.supplier.taxId, "NIT/Tax ID del Proveedor", "Proveedor"),
    validateRequired(invoice.supplier.country, "País del Proveedor", "Proveedor"),
    validateRequired(invoice.supplier.address, "Dirección del Proveedor", "Proveedor"),
  ];

  // Customer validations
  const customerValidations = [
    validateRequired(invoice.customer.name, "Nombre del Cliente", "Cliente"),
    validateRequired(invoice.customer.taxId, "NIT del Cliente", "Cliente"),
    validateTaxId(invoice.customer.taxId, "NIT del Cliente", "Cliente"),
    validateRequired(invoice.customer.country, "País del Cliente", "Cliente"),
    validateRequired(invoice.customer.address, "Dirección del Cliente", "Cliente"),
  ];

  // Invoice validations
  const invoiceValidations = [
    validateRequired(invoice.invoice.number, "Número de Factura", "Factura"),
    validateRequired(invoice.invoice.date, "Fecha de Factura", "Factura"),
    validateDate(invoice.invoice.date, "Fecha de Factura", "Factura"),
    validateRequired(invoice.invoice.currency, "Moneda", "Factura"),
    validateCurrency(invoice.invoice.currency, "Moneda", "Factura"),
    validateRequired(invoice.invoice.totalAmount, "Valor Total", "Factura"),
    validateNumeric(invoice.invoice.totalAmount, "Valor Total", "Factura"),
  ];

  // Transport validations
  const transportValidations = [
    validateRequired(invoice.transport.method, "Modo de Transporte", "Transporte"),
  ];

  // Items validations
  const itemsValidations: ValidationResult[] = [];
  if (!invoice.items || invoice.items.length === 0) {
    itemsValidations.push({
      field: "Items",
      message: "La factura debe contener al menos un item",
      severity: "error",
      section: "Items",
    });
  } else {
    invoice.items.forEach((item, index) => {
      const itemSection = `Item ${index + 1}`;

      const itemValidation = [
        validateRequired(item.description, `Descripción`, itemSection),
        validateRequired(item.quantity, `Cantidad`, itemSection),
        validateNumeric(item.quantity, `Cantidad`, itemSection),
      ];

      itemValidation.forEach((v) => {
        if (v) itemsValidations.push(v);
      });

      // Optional but recommended fields
      if (item.unitPrice) {
        const priceValidation = validateNumeric(item.unitPrice, `Precio Unitario`, itemSection);
        if (priceValidation) itemsValidations.push(priceValidation);
      }
    });
  }

  // Combine all validations
  [
    ...supplierValidations,
    ...customerValidations,
    ...invoiceValidations,
    ...transportValidations,
    ...itemsValidations,
  ].forEach((v) => {
    if (v) validations.push(v);
  });

  return validations;
}

/**
 * Groups validation results by section
 */
export function groupValidationsBySection(
  validations: ValidationResult[]
): Record<string, ValidationResult[]> {
  return validations.reduce((acc, validation) => {
    if (!acc[validation.section]) {
      acc[validation.section] = [];
    }
    acc[validation.section].push(validation);
    return acc;
  }, {} as Record<string, ValidationResult[]>);
}

/**
 * Counts errors and warnings
 */
export function getValidationStats(validations: ValidationResult[]): {
  errors: number;
  warnings: number;
  total: number;
} {
  const errors = validations.filter((v) => v.severity === "error").length;
  const warnings = validations.filter((v) => v.severity === "warning").length;

  return {
    errors,
    warnings,
    total: validations.length,
  };
}
