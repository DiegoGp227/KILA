/**
 * Invoice Adapter - Converts real invoice JSON format to system format
 */

export interface RealInvoiceField {
  Fields: string;
  Value: string;
}

export interface RealInvoiceTableItem {
  SKU?: string;
  Description: string;
  Quantity: string;
  UnitPrice?: string;
  TotalAmount?: string;
  HSCode?: string;
  NetWeight?: string;
  GrossWeight?: string;
  CountryOfOrigin?: string;
}

export interface RealInvoice {
  Fields: RealInvoiceField[];
  Table: RealInvoiceTableItem[];
}

export interface SystemInvoice {
  supplier: {
    name: string;
    taxId: string;
    country: string;
    address: string;
    contact?: string;
  };
  customer: {
    name: string;
    taxId: string;
    country: string;
    address: string;
  };
  invoice: {
    number: string;
    date: string;
    currency: string;
    totalAmount: string;
    paymentTerms?: string;
  };
  transport: {
    method: string;
    vesselName?: string;
    billOfLading?: string;
    portOfLoading?: string;
    portOfDischarge?: string;
  };
  items: Array<{
    sku?: string;
    description: string;
    quantity: string;
    unitPrice?: string;
    totalAmount?: string;
    hsCode?: string;
    netWeight?: string;
    grossWeight?: string;
    countryOfOrigin?: string;
  }>;
}

/**
 * Converts real invoice format (Fields array) to system format
 */
export function adaptRealInvoice(realInvoice: RealInvoice): SystemInvoice {
  const fields = realInvoice.Fields.reduce((acc, field) => {
    acc[field.Fields] = field.Value;
    return acc;
  }, {} as Record<string, string>);

  return {
    supplier: {
      name: fields["Supplier"] || "",
      taxId: fields["SupplierTaxID"] || "",
      country: fields["SupplierCountry"] || "",
      address: fields["SupplierAddress"] || "",
      contact: fields["ExporterContact"],
    },
    customer: {
      name: fields["Customer"] || "",
      taxId: fields["CustomerTaxID"] || "",
      country: fields["CustomerCountry"] || "",
      address: fields["CustomerAddress"] || "",
    },
    invoice: {
      number: fields["InvoiceNumber"] || "",
      date: fields["InvoiceDate"] || "",
      currency: fields["Currency"] || "",
      totalAmount: fields["TotalInvoiceValue"] || "",
      paymentTerms: fields["PaymentTerms"],
    },
    transport: {
      method: fields["TransportMode"] || "",
      vesselName: fields["VesselName"],
      billOfLading: fields["BillOfLadingNumber"],
      portOfLoading: fields["PortOfLoading"],
      portOfDischarge: fields["PortOfDischarge"],
    },
    items: realInvoice.Table.map((item) => ({
      sku: item.SKU,
      description: item.Description || "",
      quantity: item.Quantity || "",
      unitPrice: item.UnitPrice,
      totalAmount: item.TotalAmount,
      hsCode: item.HSCode,
      netWeight: item.NetWeight,
      grossWeight: item.GrossWeight,
      countryOfOrigin: item.CountryOfOrigin,
    })),
  };
}
