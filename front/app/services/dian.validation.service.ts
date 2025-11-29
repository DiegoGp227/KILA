/**
 * DIAN Invoice Validation Service
 * Validates import invoices according to DIAN regulations (CT-COA-0124)
 */

import { adaptInvoiceToNormalizedFormat, OriginalInvoiceFormat } from "./invoice.adapter";

export interface ValidationError {
  field: string;
  message: string;
  section: string;
  severity: "error" | "warning";
  requirementNumber?: number; // 1-11 según las reglas DIAN
  allowsPartialCompliance?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  source: "frontend" | "backend" | "merged";
}

// Valid Incoterms according to ICC
const VALID_INCOTERMS = ["FOB", "CIF", "EXW", "FCA", "CPT", "CIP", "DAP", "DPU", "DDP", "FAS", "CFR"];

// Valid currencies (common ones)
const VALID_CURRENCIES = ["USD", "EUR", "COP", "GBP", "JPY", "CNY", "CAD", "AUD", "CHF", "MXN"];

/**
 * Main validation function for DIAN invoice requirements
 * Automatically detects and adapts the invoice format
 */
export function validateDIANInvoice(invoiceData: any): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Auto-detect format and normalize
  let normalizedData = invoiceData;

  // Check if it's the Fields/Table format
  if (invoiceData.Fields && Array.isArray(invoiceData.Fields) && invoiceData.Table) {
    normalizedData = adaptInvoiceToNormalizedFormat(invoiceData as OriginalInvoiceFormat);
  }

  // 1. Número de factura (OBLIGATORIO - No permite cumplimiento parcial)
  validateInvoiceNumber(normalizedData, errors);

  // 2. Fecha de expedición (OBLIGATORIO - Permite cumplimiento parcial)
  validateIssueDate(normalizedData, errors, warnings);

  // 3. Lugar de expedición (OBLIGATORIO - Permite cumplimiento parcial)
  validateIssuePlace(normalizedData, errors, warnings);

  // 4. Nombre y dirección del vendedor (OBLIGATORIO - Permite cumplimiento parcial)
  validateSupplierInfo(normalizedData, errors, warnings);

  // 5. Nombre y dirección del comprador (OBLIGATORIO - Permite cumplimiento parcial)
  validateCustomerInfo(normalizedData, errors, warnings);

  // 6. Descripción detallada de la mercancía (OBLIGATORIO - Permite cumplimiento parcial)
  validateItemDescriptions(normalizedData, errors, warnings);

  // 7. Cantidad de unidades (OBLIGATORIO - Permite cumplimiento parcial)
  validateQuantities(normalizedData, errors, warnings);

  // 8. Precio unitario y total (OBLIGATORIO - Permite cumplimiento parcial)
  validatePrices(normalizedData, errors, warnings);

  // 9. Moneda de la transacción (OBLIGATORIO - No permite cumplimiento parcial)
  validateCurrency(normalizedData, errors);

  // 10. Condiciones de entrega - Incoterm (OBLIGATORIO - No permite cumplimiento parcial)
  validateIncoterm(normalizedData, errors);

  // 11. Forma de pago (OBLIGATORIO - Permite cumplimiento parcial)
  validatePaymentMethod(normalizedData, errors, warnings);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    source: "frontend",
  };
}

/**
 * 1. Validate invoice number (unique and present)
 * ❌ No permite cumplimiento parcial
 */
function validateInvoiceNumber(data: any, errors: ValidationError[]) {
  const invoiceNumber = data?.invoice_number || data?.invoiceNumber;

  if (!invoiceNumber || invoiceNumber.trim() === "") {
    errors.push({
      field: "InvoiceNumber",
      message: "El número de factura es obligatorio y debe estar presente",
      section: "Información de Factura",
      severity: "error",
      requirementNumber: 1,
      allowsPartialCompliance: false,
    });
  }
}

/**
 * 2. Validate issue date
 * ✅ Permite cumplimiento parcial (sin día exacto o formato incorrecto)
 */
function validateIssueDate(data: any, errors: ValidationError[], warnings: ValidationError[]) {
  const issueDate = data?.issue_date || data?.issueDate || data?.date;

  if (!issueDate) {
    errors.push({
      field: "InvoiceDate",
      message: "La fecha de expedición es obligatoria",
      section: "Información de Factura",
      severity: "error",
      requirementNumber: 2,
      allowsPartialCompliance: true,
    });
    return;
  }

  // Check if date is valid format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(issueDate)) {
    warnings.push({
      field: "InvoiceDate",
      message: "La fecha de expedición no tiene un formato válido (esperado: YYYY-MM-DD)",
      section: "Información de Factura",
      severity: "warning",
      requirementNumber: 2,
      allowsPartialCompliance: true,
    });
  } else {
    // Validate it's a real date
    const date = new Date(issueDate);
    if (isNaN(date.getTime())) {
      warnings.push({
        field: "InvoiceDate",
        message: "La fecha de expedición no es una fecha válida",
        section: "Información de Factura",
        severity: "warning",
        requirementNumber: 2,
        allowsPartialCompliance: true,
      });
    }
  }
}

/**
 * 3. Validate issue place (city and country)
 * ✅ Permite cumplimiento parcial (si falta uno de los dos)
 */
function validateIssuePlace(data: any, errors: ValidationError[], warnings: ValidationError[]) {
  const issueCity = data?.issue_city || data?.issueCity;
  const issueCountry = data?.issue_country || data?.issueCountry;

  if (!issueCity && !issueCountry) {
    errors.push({
      field: "OriginCountryAddress",
      message: "El lugar de expedición (ciudad y país) es obligatorio",
      section: "Información de Factura",
      severity: "error",
      requirementNumber: 3,
      allowsPartialCompliance: true,
    });
  } else if (!issueCity) {
    warnings.push({
      field: "OriginCountryAddress",
      message: "Falta la ciudad de expedición",
      section: "Información de Factura",
      severity: "warning",
      requirementNumber: 3,
      allowsPartialCompliance: true,
    });
  } else if (!issueCountry) {
    warnings.push({
      field: "OriginCountryAddress",
      message: "Falta el país de expedición",
      section: "Información de Factura",
      severity: "warning",
      requirementNumber: 3,
      allowsPartialCompliance: true,
    });
  }
}

/**
 * 4. Validate supplier information
 * ✅ Permite cumplimiento parcial (nombre sin dirección o viceversa)
 */
function validateSupplierInfo(data: any, errors: ValidationError[], warnings: ValidationError[]) {
  const supplier = data?.supplier || data?.seller || data?.vendor;

  if (!supplier) {
    errors.push({
      field: "Supplier",
      message: "La información del vendedor es obligatoria",
      section: "Datos del Proveedor",
      severity: "error",
      requirementNumber: 4,
      allowsPartialCompliance: true,
    });
    return;
  }

  const name = supplier.name || supplier.business_name || supplier.businessName;
  const address = supplier.address;
  const city = supplier.city;
  const country = supplier.country;

  if (!name || name.trim() === "") {
    errors.push({
      field: "Supplier",
      message: "El nombre del vendedor es obligatorio",
      section: "Datos del Proveedor",
      severity: "error",
      requirementNumber: 4,
      allowsPartialCompliance: true,
    });
  }

  if (!address || address.trim() === "") {
    warnings.push({
      field: "SupplierAddress",
      message: "Falta la dirección del vendedor",
      section: "Datos del Proveedor",
      severity: "warning",
      requirementNumber: 4,
      allowsPartialCompliance: true,
    });
  }

  if (!city || city.trim() === "") {
    warnings.push({
      field: "SupplierAddress",
      message: "Falta la ciudad del vendedor",
      section: "Datos del Proveedor",
      severity: "warning",
      requirementNumber: 4,
      allowsPartialCompliance: true,
    });
  }

  if (!country || country.trim() === "") {
    warnings.push({
      field: "SupplierAddress",
      message: "Falta el país del vendedor",
      section: "Datos del Proveedor",
      severity: "warning",
      requirementNumber: 4,
      allowsPartialCompliance: true,
    });
  }
}

/**
 * 5. Validate customer information
 * ✅ Permite cumplimiento parcial (falta ciudad o país, pero existe el resto)
 */
function validateCustomerInfo(data: any, errors: ValidationError[], warnings: ValidationError[]) {
  const customer = data?.customer || data?.buyer || data?.importer;

  if (!customer) {
    errors.push({
      field: "Customer",
      message: "La información del comprador es obligatoria",
      section: "Datos del Importador",
      severity: "error",
      requirementNumber: 5,
      allowsPartialCompliance: true,
    });
    return;
  }

  const name = customer.name || customer.business_name || customer.businessName;
  const address = customer.address;
  const city = customer.city;
  const country = customer.country;

  if (!name || name.trim() === "") {
    errors.push({
      field: "Customer",
      message: "El nombre del comprador es obligatorio",
      section: "Datos del Importador",
      severity: "error",
      requirementNumber: 5,
      allowsPartialCompliance: true,
    });
  }

  if (!address || address.trim() === "") {
    warnings.push({
      field: "CustomerAddress",
      message: "Falta la dirección del comprador",
      section: "Datos del Importador",
      severity: "warning",
      requirementNumber: 5,
      allowsPartialCompliance: true,
    });
  }

  if (!city || city.trim() === "") {
    warnings.push({
      field: "CustomerAddress",
      message: "Falta la ciudad del comprador",
      section: "Datos del Importador",
      severity: "warning",
      requirementNumber: 5,
      allowsPartialCompliance: true,
    });
  }

  if (!country || country.trim() === "") {
    warnings.push({
      field: "CustomerAddress",
      message: "Falta el país del comprador",
      section: "Datos del Importador",
      severity: "warning",
      requirementNumber: 5,
      allowsPartialCompliance: true,
    });
  }
}

/**
 * 6. Validate item descriptions
 * ✅ Permite cumplimiento parcial (si hay texto, pero es muy genérico)
 */
function validateItemDescriptions(data: any, errors: ValidationError[], warnings: ValidationError[]) {
  const items = data?.items || data?.line_items || data?.products || [];

  if (!Array.isArray(items) || items.length === 0) {
    errors.push({
      field: "Table.Description",
      message: "Debe haber al menos un item en la factura",
      section: "Detalle de Items",
      severity: "error",
      requirementNumber: 6,
      allowsPartialCompliance: true,
    });
    return;
  }

  items.forEach((item: any, index: number) => {
    const description = item?.description || item?.name || item?.product_description;

    if (!description || description.trim() === "") {
      errors.push({
        field: "Table.Description",
        message: `El item #${index + 1} no tiene descripción`,
        section: "Detalle de Items",
        severity: "error",
        requirementNumber: 6,
        allowsPartialCompliance: true,
      });
    } else if (description.length < 10) {
      warnings.push({
        field: "Table.Description",
        message: `La descripción del item #${index + 1} es muy genérica o ambigua (menos de 10 caracteres)`,
        section: "Detalle de Items",
        severity: "warning",
        requirementNumber: 6,
        allowsPartialCompliance: true,
      });
    } else if (isGenericDescription(description)) {
      warnings.push({
        field: "Table.Description",
        message: `La descripción del item #${index + 1} parece ser genérica: "${description}"`,
        section: "Detalle de Items",
        severity: "warning",
        requirementNumber: 6,
        allowsPartialCompliance: true,
      });
    }
  });
}

/**
 * 7. Validate quantities
 * ✅ Permite cumplimiento parcial (si hay cantidad pero no cuadra con total)
 */
function validateQuantities(data: any, errors: ValidationError[], warnings: ValidationError[]) {
  const items = data?.items || data?.line_items || data?.products || [];

  if (!Array.isArray(items) || items.length === 0) {
    return; // Already validated in item descriptions
  }

  items.forEach((item: any, index: number) => {
    const quantity = item?.quantity || item?.qty;

    if (!quantity || quantity <= 0) {
      errors.push({
        field: "Table.Quantity",
        message: `El item #${index + 1} no tiene una cantidad válida`,
        section: "Detalle de Items",
        severity: "error",
        requirementNumber: 7,
        allowsPartialCompliance: true,
      });
    } else {
      // Check if quantity matches with total
      const unitPrice = item?.unit_price || item?.price || 0;
      const totalPrice = item?.total_price || item?.total || 0;
      const expectedTotal = quantity * unitPrice;

      // Allow 1% tolerance for rounding
      const tolerance = totalPrice * 0.01;
      if (totalPrice > 0 && Math.abs(expectedTotal - totalPrice) > Math.max(tolerance, 0.01)) {
        warnings.push({
          field: "Table.Quantity",
          message: `El item #${index + 1}: la cantidad (${quantity}) × precio unitario (${unitPrice}) no coincide con el total (${totalPrice})`,
          section: "Detalle de Items",
          severity: "warning",
          requirementNumber: 7,
          allowsPartialCompliance: true,
        });
      }
    }
  });
}

/**
 * 8. Validate prices (unit and total)
 * ✅ Permite cumplimiento parcial (si solo uno está presente)
 */
function validatePrices(data: any, errors: ValidationError[], warnings: ValidationError[]) {
  const items = data?.items || data?.line_items || data?.products || [];

  if (!Array.isArray(items) || items.length === 0) {
    return; // Already validated
  }

  items.forEach((item: any, index: number) => {
    const unitPrice = item?.unit_price || item?.price;
    const totalPrice = item?.total_price || item?.total;

    if (unitPrice === undefined || unitPrice === null) {
      warnings.push({
        field: "Table.UnitPrice",
        message: `El item #${index + 1} no tiene precio unitario especificado`,
        section: "Detalle de Items",
        severity: "warning",
        requirementNumber: 8,
        allowsPartialCompliance: true,
      });
    }

    if (totalPrice === undefined || totalPrice === null) {
      warnings.push({
        field: "Table.NetValuePerItem",
        message: `El item #${index + 1} no tiene precio total especificado`,
        section: "Detalle de Items",
        severity: "warning",
        requirementNumber: 8,
        allowsPartialCompliance: true,
      });
    }

    if ((unitPrice === undefined || unitPrice === null) && (totalPrice === undefined || totalPrice === null)) {
      errors.push({
        field: "Table.UnitPrice",
        message: `El item #${index + 1} no tiene información de precios`,
        section: "Detalle de Items",
        severity: "error",
        requirementNumber: 8,
        allowsPartialCompliance: true,
      });
    }
  });

  // Validate total invoice amount
  const totalAmount = data?.total_amount || data?.totalAmount || data?.grand_total;
  if (!totalAmount || totalAmount <= 0) {
    errors.push({
      field: "TotalInvoiceValue",
      message: "El monto total de la factura es obligatorio y debe ser mayor a 0",
      section: "Información de Factura",
      severity: "error",
      requirementNumber: 8,
      allowsPartialCompliance: true,
    });
  }
}

/**
 * 9. Validate currency
 * ❌ No permite cumplimiento parcial
 */
function validateCurrency(data: any, errors: ValidationError[]) {
  const currency = data?.currency || data?.currency_code;

  if (!currency || currency.trim() === "") {
    errors.push({
      field: "Currency",
      message: "La moneda de la transacción es obligatoria",
      section: "Información de Factura",
      severity: "error",
      requirementNumber: 9,
      allowsPartialCompliance: false,
    });
  } else if (!VALID_CURRENCIES.includes(currency.toUpperCase())) {
    errors.push({
      field: "Currency",
      message: `La moneda "${currency}" no es válida. Monedas permitidas: ${VALID_CURRENCIES.join(", ")}`,
      section: "Información de Factura",
      severity: "error",
      requirementNumber: 9,
      allowsPartialCompliance: false,
    });
  }
}

/**
 * 10. Validate Incoterm
 * ❌ No permite cumplimiento parcial
 */
function validateIncoterm(data: any, errors: ValidationError[]) {
  const incoterm = data?.incoterm || data?.delivery_terms || data?.deliveryTerms;

  if (!incoterm || incoterm.trim() === "") {
    errors.push({
      field: "Incoterm",
      message: "El Incoterm (condiciones de entrega) es obligatorio",
      section: "Información de Transporte",
      severity: "error",
      requirementNumber: 10,
      allowsPartialCompliance: false,
    });
  } else if (!VALID_INCOTERMS.includes(incoterm.toUpperCase())) {
    errors.push({
      field: "Incoterm",
      message: `El Incoterm "${incoterm}" no es válido. Incoterms permitidos: ${VALID_INCOTERMS.join(", ")}`,
      section: "Información de Transporte",
      severity: "error",
      requirementNumber: 10,
      allowsPartialCompliance: false,
    });
  }
}

/**
 * 11. Validate payment method
 * ✅ Permite cumplimiento parcial (si hay indicios, aunque no explícito)
 */
function validatePaymentMethod(data: any, errors: ValidationError[], warnings: ValidationError[]) {
  const paymentMethod = data?.payment_method || data?.paymentMethod || data?.payment_terms;

  if (!paymentMethod || paymentMethod.trim() === "") {
    warnings.push({
      field: "PaymentTerms",
      message: "No se especifica forma de pago (directa o indirecta)",
      section: "Información de Factura",
      severity: "warning",
      requirementNumber: 11,
      allowsPartialCompliance: true,
    });
  } else {
    // Check if it's clear whether it's direct or indirect
    const methodLower = paymentMethod.toLowerCase();
    const isDirectOrIndirect =
      methodLower.includes("direct") ||
      methodLower.includes("indirect") ||
      methodLower.includes("carta de crédito") ||
      methodLower.includes("letter of credit") ||
      methodLower.includes("transferencia") ||
      methodLower.includes("wire transfer") ||
      methodLower.includes("contado") ||
      methodLower.includes("cash") ||
      methodLower.includes("days") ||
      methodLower.includes("net") ||
      methodLower.includes("bl"); // Bill of lading

    if (!isDirectOrIndirect) {
      warnings.push({
        field: "PaymentTerms",
        message: `La forma de pago "${paymentMethod}" no especifica claramente si es directa o indirecta`,
        section: "Información de Factura",
        severity: "warning",
        requirementNumber: 11,
        allowsPartialCompliance: true,
      });
    }
  }
}

/**
 * Helper: Check if description is generic
 */
function isGenericDescription(description: string): boolean {
  const genericTerms = [
    "producto",
    "product",
    "item",
    "mercancía",
    "merchandise",
    "goods",
    "artículo",
    "article",
    "material",
    "componente",
    "component",
  ];

  const descLower = description.toLowerCase().trim();

  // If description is just one of these words
  return genericTerms.some(term => descLower === term || descLower === term + "s");
}
