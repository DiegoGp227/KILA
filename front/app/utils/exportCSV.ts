import { StoredValidation } from "../services/localStorage.service";

/**
 * Convert validations to CSV format and download
 */
export function exportValidationsToCSV(validations: StoredValidation[]): void {
  if (validations.length === 0) {
    alert("No hay validaciones para exportar");
    return;
  }

  // Define CSV headers
  const headers = [
    "ID",
    "Archivo",
    "Fecha",
    "Estado",
    "Proveedor",
    "Cliente",
    "Número de Factura",
    "Moneda",
    "Monto Total",
    "Items",
    "Errores",
    "Advertencias",
    "Incoterm",
    "Puerto de Carga",
    "Puerto de Descarga",
  ];

  // Convert validations to CSV rows
  const rows = validations.map((validation) => {
    const info = validation.invoice_info;
    const date = new Date(validation.timestamp).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Map status to Spanish
    const statusMap: Record<string, string> = {
      approved: "Aprobada",
      rejected: "Rechazada",
      warning: "Con Advertencias",
    };

    // Extract Incoterm from invoice data
    let incoterm = "";
    if (validation.invoice_data?.Fields) {
      const incotermField = validation.invoice_data.Fields.find(
        (f: any) => f.Fields === "Incoterm"
      );
      incoterm = incotermField?.Value || "";
    }

    // Extract ports
    let portOfLoading = "";
    let portOfDischarge = "";
    if (validation.invoice_data?.Fields) {
      const loadingField = validation.invoice_data.Fields.find(
        (f: any) => f.Fields === "PortOfLoading"
      );
      const dischargeField = validation.invoice_data.Fields.find(
        (f: any) => f.Fields === "PortOfDischarge"
      );
      portOfLoading = loadingField?.Value || "";
      portOfDischarge = dischargeField?.Value || "";
    }

    return [
      validation.id,
      validation.filename,
      date,
      statusMap[validation.status] || validation.status,
      info.supplier || "",
      info.customer || "",
      info.invoice_number || "",
      info.currency || "",
      info.total_amount || "",
      info.items_count?.toString() || "0",
      validation.errors.length.toString(),
      validation.warnings.length.toString(),
      incoterm,
      portOfLoading,
      portOfDischarge,
    ];
  });

  // Escape CSV fields (handle commas, quotes, newlines)
  const escapeCSVField = (field: string): string => {
    if (field.includes(",") || field.includes('"') || field.includes("\n")) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  };

  // Build CSV content
  const csvContent = [
    headers.map(escapeCSVField).join(","),
    ...rows.map((row) => row.map(escapeCSVField).join(",")),
  ].join("\n");

  // Add BOM for Excel UTF-8 compatibility
  const BOM = "\ufeff";
  const csvWithBOM = BOM + csvContent;

  // Create blob and download
  const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  // Generate filename with current date
  const now = new Date();
  const filename = `validaciones_dian_${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}.csv`;

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(url);
}

/**
 * Export detailed validation report including errors and warnings
 */
export function exportDetailedValidationsToCSV(
  validations: StoredValidation[]
): void {
  if (validations.length === 0) {
    alert("No hay validaciones para exportar");
    return;
  }

  // Define CSV headers for detailed report
  const headers = [
    "ID Validación",
    "Archivo",
    "Fecha",
    "Estado",
    "Tipo de Problema",
    "Severidad",
    "Campo",
    "Mensaje",
    "Sección",
  ];

  const rows: string[][] = [];

  // For each validation, create rows for each error/warning
  validations.forEach((validation) => {
    const baseInfo = [
      validation.id,
      validation.filename,
      new Date(validation.timestamp).toLocaleString("es-ES"),
      validation.status,
    ];

    // Add errors
    validation.errors.forEach((error) => {
      rows.push([
        ...baseInfo,
        "Error",
        error.severity,
        error.field,
        error.message,
        error.section,
      ]);
    });

    // Add warnings
    validation.warnings.forEach((warning) => {
      rows.push([
        ...baseInfo,
        "Advertencia",
        warning.severity,
        warning.field,
        warning.message,
        warning.section,
      ]);
    });

    // If no errors or warnings, add a success row
    if (validation.errors.length === 0 && validation.warnings.length === 0) {
      rows.push([...baseInfo, "Éxito", "info", "-", "Validación exitosa", "-"]);
    }
  });

  // Escape CSV fields
  const escapeCSVField = (field: string): string => {
    if (field.includes(",") || field.includes('"') || field.includes("\n")) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  };

  // Build CSV content
  const csvContent = [
    headers.map(escapeCSVField).join(","),
    ...rows.map((row) => row.map(escapeCSVField).join(",")),
  ].join("\n");

  // Add BOM for Excel UTF-8 compatibility
  const BOM = "\ufeff";
  const csvWithBOM = BOM + csvContent;

  // Create blob and download
  const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  // Generate filename with current date
  const now = new Date();
  const filename = `validaciones_dian_detallado_${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}.csv`;

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(url);
}
