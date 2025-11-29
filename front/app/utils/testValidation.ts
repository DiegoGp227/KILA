/**
 * Test script to verify DIAN validations
 */

import { validateDIANInvoice } from "../services/dian.validation.service";

// Sample invoice data (from FACTURA 58846.json)
const sampleInvoice = {
  "Fields": [
    { "Fields": "Supplier", "Value": "Andes Global International LLC" },
    { "Fields": "Customer", "Value": "C.I. IBLU S.A.S." },
    { "Fields": "SupplierAddress", "Value": "1011 Sunnybrook Road.\nPH Floor Suite 1110\nMiami, FL 33136\nPh: 305-290-3720" },
    { "Fields": "CustomerAddress", "Value": "CALLE 31 ΝΟ 44-1458\nMEDELLIN\nCOLOMBIA" },
    { "Fields": "InvoiceNumber", "Value": "58846" },
    { "Fields": "InvoiceDate", "Value": "12/23/2024" },
    { "Fields": "PaymentTerms", "Value": "45 Days BL" },
    { "Fields": "Incoterm", "Value": "CIP" },
    { "Fields": "Currency", "Value": "USD" },
    { "Fields": "TotalInvoiceValue", "Value": "78356.90" },
    { "Fields": "OriginCountryAddress", "Value": "Miami, FL USA" }
  ],
  "Table": [
    {
      "Description": "FROZEN PORK SIRLOINS FZ BNLS / PUNTA DE LOMO DE CERDO SIN HUESO CONGELADO",
      "Quantity": "24,486.53",
      "UnitPrice": "3.20",
      "NetValuePerItem": "78,356.90",
      "Currency": "USD"
    }
  ]
};

export function testValidation() {
  console.log("🧪 Testing DIAN Validation...\n");

  const result = validateDIANInvoice(sampleInvoice);

  console.log("📊 Validation Result:");
  console.log("  ✓ Is Valid:", result.isValid);
  console.log("  ✓ Source:", result.source);
  console.log("  ✓ Errors:", result.errors.length);
  console.log("  ✓ Warnings:", result.warnings.length);

  if (result.errors.length > 0) {
    console.log("\n❌ Errors:");
    result.errors.forEach((error, i) => {
      console.log(`  ${i + 1}. [Req #${error.requirementNumber}] ${error.field}: ${error.message}`);
    });
  }

  if (result.warnings.length > 0) {
    console.log("\n⚠️ Warnings:");
    result.warnings.forEach((warning, i) => {
      console.log(`  ${i + 1}. [Req #${warning.requirementNumber}] ${warning.field}: ${warning.message}`);
    });
  }

  if (result.isValid && result.warnings.length === 0) {
    console.log("\n✅ Invoice passes all validations!");
  }

  return result;
}
