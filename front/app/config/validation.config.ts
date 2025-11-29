/**
 * DIAN Validation Configuration
 * Configurable parameters for invoice validation
 */

export interface ValidationConfig {
  // Incoterms válidos
  validIncoterms: string[];

  // Monedas válidas
  validCurrencies: string[];

  // Umbrales de validación
  thresholds: {
    minDescriptionLength: number; // Longitud mínima para descripción
    priceTolerancePercent: number; // Tolerancia para cálculos (%)
  };

  // Requisitos habilitados (1-11)
  enabledRequirements: {
    req1_invoiceNumber: boolean;
    req2_issueDate: boolean;
    req3_issuePlace: boolean;
    req4_supplierInfo: boolean;
    req5_customerInfo: boolean;
    req6_itemDescription: boolean;
    req7_quantities: boolean;
    req8_prices: boolean;
    req9_currency: boolean;
    req10_incoterm: boolean;
    req11_paymentMethod: boolean;
  };

  // Términos genéricos a detectar en descripciones
  genericTerms: string[];

  // Modo estricto
  strictMode: boolean; // Si es true, advertencias se convierten en errores
}

// Configuración por defecto
const DEFAULT_CONFIG: ValidationConfig = {
  validIncoterms: [
    "FOB", "CIF", "EXW", "FCA", "CPT", "CIP",
    "DAP", "DPU", "DDP", "FAS", "CFR"
  ],

  validCurrencies: [
    "USD", "EUR", "COP", "GBP", "JPY",
    "CNY", "CAD", "AUD", "CHF", "MXN"
  ],

  thresholds: {
    minDescriptionLength: 10,
    priceTolerancePercent: 1.0,
  },

  enabledRequirements: {
    req1_invoiceNumber: true,
    req2_issueDate: true,
    req3_issuePlace: true,
    req4_supplierInfo: true,
    req5_customerInfo: true,
    req6_itemDescription: true,
    req7_quantities: true,
    req8_prices: true,
    req9_currency: true,
    req10_incoterm: true,
    req11_paymentMethod: true,
  },

  genericTerms: [
    "producto", "product", "item", "mercancía", "merchandise",
    "goods", "artículo", "article", "material", "componente", "component"
  ],

  strictMode: false,
};

// Storage key
const CONFIG_STORAGE_KEY = "kila_validation_config";

/**
 * Get current validation configuration
 */
export function getValidationConfig(): ValidationConfig {
  if (typeof window === "undefined") {
    return DEFAULT_CONFIG;
  }

  try {
    const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!stored) return DEFAULT_CONFIG;

    const config = JSON.parse(stored);
    // Merge with defaults to ensure all fields exist
    return { ...DEFAULT_CONFIG, ...config };
  } catch (error) {
    console.error("Error loading validation config:", error);
    return DEFAULT_CONFIG;
  }
}

/**
 * Save validation configuration
 */
export function saveValidationConfig(config: ValidationConfig): void {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error("Error saving validation config:", error);
  }
}

/**
 * Reset configuration to defaults
 */
export function resetValidationConfig(): void {
  try {
    localStorage.removeItem(CONFIG_STORAGE_KEY);
  } catch (error) {
    console.error("Error resetting validation config:", error);
  }
}

/**
 * Export configuration as JSON
 */
export function exportConfig(config: ValidationConfig): string {
  return JSON.stringify(config, null, 2);
}

/**
 * Import configuration from JSON
 */
export function importConfig(jsonString: string): ValidationConfig | null {
  try {
    const config = JSON.parse(jsonString);
    // Validate structure
    if (!config.validIncoterms || !config.validCurrencies) {
      throw new Error("Invalid configuration format");
    }
    return config;
  } catch (error) {
    console.error("Error importing config:", error);
    return null;
  }
}
