/**
 * Invoice Adapter - Transforms invoice JSON formats
 * Converts the Fields/Table format to a normalized format for DIAN validation
 */

export interface InvoiceField {
  Fields: string;
  Value: string;
}

export interface InvoiceTableItem {
  SKU?: string;
  Description: string;
  Quantity: string;
  UnitOfMeasurement?: string;
  UnitPrice: string;
  NetValuePerItem: string;
  Currency?: string;
  HSCode?: string;
  Weight?: string;
  BatchOrLotNumber?: string;
  NumberOfPackagesBoxes?: string;
}

export interface OriginalInvoiceFormat {
  Fields: InvoiceField[];
  Table: InvoiceTableItem[];
}

export interface NormalizedInvoice {
  invoice_number: string;
  issue_date: string;
  issue_city: string;
  issue_country: string;
  supplier: {
    name: string;
    address: string;
    city: string;
    country: string;
  };
  customer: {
    name: string;
    address: string;
    city: string;
    country: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    unit_of_measurement?: string;
  }>;
  currency: string;
  total_amount: number;
  incoterm: string;
  payment_method: string;
  original_data: any;
}

/**
 * Get field value from Fields array
 */
function getFieldValue(fields: InvoiceField[], fieldName: string): string {
  const field = fields.find(f => f.Fields === fieldName);
  return field?.Value || "";
}

/**
 * Parse address to extract city and country
 */
function parseAddress(address: string): { city: string; country: string; fullAddress: string } {
  const lines = address.split("\n").map(l => l.trim()).filter(l => l);

  // Last line often contains country or city/country
  const lastLine = lines[lines.length - 1] || "";
  const secondLastLine = lines[lines.length - 2] || "";

  let city = "";
  let country = "";

  // Check if last line is a known country
  const knownCountries = ["USA", "COLOMBIA", "MEXICO", "CANADA", "CHINA", "JAPAN"];
  if (knownCountries.some(c => lastLine.toUpperCase().includes(c))) {
    country = lastLine;
    city = secondLastLine;
  } else {
    // Try to extract city and country from last line (e.g., "Miami, FL USA")
    const parts = lastLine.split(",").map(p => p.trim());
    if (parts.length >= 2) {
      city = parts[0];
      country = parts[parts.length - 1];
    } else {
      city = lastLine;
    }
  }

  return {
    city: city || lines[0] || "",
    country: country || "",
    fullAddress: address
  };
}

/**
 * Parse numeric value (removes commas, handles decimals)
 */
function parseNumericValue(value: string): number {
  if (!value) return 0;

  // Remove commas and parse
  const cleaned = value.replace(/,/g, "");
  const parsed = parseFloat(cleaned);

  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Convert date from MM/DD/YYYY to YYYY-MM-DD
 */
function normalizeDateFormat(dateStr: string): string {
  if (!dateStr) return "";

  // Try parsing MM/DD/YYYY format
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const [month, day, year] = parts;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  // If already in YYYY-MM-DD format, return as is
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateStr;
  }

  return dateStr;
}

/**
 * Main adapter function - converts original format to normalized format
 */
export function adaptInvoiceToNormalizedFormat(original: OriginalInvoiceFormat): NormalizedInvoice {
  const fields = original.Fields;
  const table = original.Table;

  // Extract supplier information
  const supplierName = getFieldValue(fields, "Supplier");
  const supplierAddress = getFieldValue(fields, "SupplierAddress");
  const supplierParsed = parseAddress(supplierAddress);

  // Extract customer information
  const customerName = getFieldValue(fields, "Customer");
  const customerAddress = getFieldValue(fields, "CustomerAddress");
  const customerParsed = parseAddress(customerAddress);

  // Extract invoice date and normalize
  const invoiceDate = getFieldValue(fields, "InvoiceDate");
  const normalizedDate = normalizeDateFormat(invoiceDate);

  // Extract issue location (from OriginCountryAddress or SupplierAddress)
  const originAddress = getFieldValue(fields, "OriginCountryAddress") || supplierAddress;
  const issueParsed = parseAddress(originAddress);

  // Convert table items
  const items = table.map(item => ({
    description: item.Description || "",
    quantity: parseNumericValue(item.Quantity),
    unit_price: parseNumericValue(item.UnitPrice),
    total_price: parseNumericValue(item.NetValuePerItem),
    unit_of_measurement: item.UnitOfMeasurement || "",
  }));

  // Extract currency (from Fields or first Table item)
  const currencyField = getFieldValue(fields, "Currency");
  const currencyTable = table[0]?.Currency || "";
  const currency = currencyField || currencyTable;

  // Extract totals
  const totalAmount = parseNumericValue(getFieldValue(fields, "TotalInvoiceValue"));

  // Extract Incoterm
  const incoterm = getFieldValue(fields, "Incoterm");

  // Extract payment terms
  const paymentTerms = getFieldValue(fields, "PaymentTerms");

  return {
    invoice_number: getFieldValue(fields, "InvoiceNumber"),
    issue_date: normalizedDate,
    issue_city: issueParsed.city,
    issue_country: issueParsed.country,
    supplier: {
      name: supplierName,
      address: supplierParsed.fullAddress,
      city: supplierParsed.city,
      country: supplierParsed.country,
    },
    customer: {
      name: customerName,
      address: customerParsed.fullAddress,
      city: customerParsed.city,
      country: customerParsed.country,
    },
    items,
    currency,
    total_amount: totalAmount,
    incoterm,
    payment_method: paymentTerms,
    original_data: original,
  };
}
