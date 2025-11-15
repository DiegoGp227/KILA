"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import StepsSistem from "@/app/components/organism/StepsSistem";
import MetricsPanel from "@/app/components/organism/MetricsPanel";
import SummaryCard from "@/app/components/molecules/SummaryCard";
import ValidationItem from "@/app/components/molecules/ValidationItem";
import JsonViewer from "@/app/components/molecules/JsonViewer";
import { adaptRealInvoice, RealInvoice } from "@/app/utils/invoiceAdapter";
import {
  validateInvoice,
  groupValidationsBySection,
  getValidationStats,
  ValidationResult,
} from "@/app/utils/invoiceValidation";

// Real invoice data example (from user's provided JSON)
const realInvoiceData: RealInvoice = {
  Fields: [
    { Fields: "Supplier", Value: "Andes Global International LLC" },
    { Fields: "SupplierTaxID", Value: "" },
    { Fields: "SupplierCountry", Value: "USA" },
    { Fields: "SupplierAddress", Value: "7901 4th St N STE 300, St. Petersburg, FL 33702, USA" },
    { Fields: "Customer", Value: "C.I. IBLU S.A.S." },
    { Fields: "CustomerTaxID", Value: "830.055.831-8" },
    { Fields: "CustomerCountry", Value: "Colombia" },
    { Fields: "CustomerAddress", Value: "Bogotá" },
    { Fields: "InvoiceNumber", Value: "43855" },
    { Fields: "InvoiceDate", Value: "2024-10-25" },
    { Fields: "Currency", Value: "USD" },
    { Fields: "TotalInvoiceValue", Value: "82,453.50" },
    { Fields: "TransportMode", Value: "Maritime" },
    { Fields: "PortOfLoading", Value: "Charleston" },
    { Fields: "PortOfDischarge", Value: "Cartagena" },
  ],
  Table: [
    {
      Description: "FROZEN PORK SIRLOINS, BONE IN, SKIN ON, INDIVIDUALLY, VACUUM PACKED - SKIN PACK",
      Quantity: "24,486.53",
      UnitPrice: "3.37",
      TotalAmount: "82,453.50",
      NetWeight: "24,486.53",
      CountryOfOrigin: "USA",
    },
  ],
};

export default function ResultsPage() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  // Convert real invoice to system format and validate
  const adaptedInvoice = useMemo(() => adaptRealInvoice(realInvoiceData), []);
  const validationResults = useMemo(() => validateInvoice(adaptedInvoice), [adaptedInvoice]);
  const validationStats = useMemo(() => getValidationStats(validationResults), [validationResults]);
  const groupedValidations = useMemo(
    () => groupValidationsBySection(validationResults),
    [validationResults]
  );

  const errors = validationResults.filter((v) => v.severity === "error");
  const warnings = validationResults.filter((v) => v.severity === "warning");

  // Calculate passed validations (total possible checks - errors - warnings)
  const totalPossibleChecks = 35;
  const passed = totalPossibleChecks - validationStats.total;

  const status = errors.length > 0 ? "error" : warnings.length > 0 ? "warning" : "success";

  return (
    <div className="main-content">
      {/* Breadcrumbs */}
      <div className="flex gap-2 mb-8 justify-center items-center text-secondary-400">
        <span className="breadcrumb-item">Validación DIAN</span>
        <span>/</span>
        <span className="breadcrumb-item active text-primary-500 font-semibold">
          Resultados
        </span>
      </div>

      {/* Timeline Steps */}
      <StepsSistem StepActive={3} />

      {/* Metrics Panel (Floating) */}
      <MetricsPanel
        status={status}
        errors={validationStats.errors}
        warnings={validationStats.warnings}
        passed={passed}
        total={totalPossibleChecks}
        onNewValidation={() => router.push("/")}
      />

      {/* Split View */}
      <div className="split-view fade-in">
        {/* Left Panel - JSON Preview */}
        <div className="split-panel">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">
              📄 Factura Original
            </h2>
            <div className="flex gap-2">
              <button className="btn btn-ghost" title="Copiar JSON">
                📋
              </button>
              <button className="btn btn-ghost" title="Expandir">
                ⛶
              </button>
            </div>
          </div>

          <JsonViewer
            data={realInvoiceData}
            highlightErrors={["SupplierTaxID"]}
          />
        </div>

        {/* Right Panel - Validation Results */}
        <div className="split-panel">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-2">
              🔍 Resultados de Validación
            </h2>
            <p className="text-secondary-400 text-sm">
              factura_importacion_2024_001.json
            </p>
          </div>

          {/* Summary Card */}
          <SummaryCard
            status={status}
            title={status === "error" ? "No Cumple" : status === "warning" ? "Con Advertencias" : "Cumple"}
            description={
              status === "error"
                ? "La factura presenta errores que deben corregirse"
                : status === "warning"
                ? "La factura tiene advertencias que deberían revisarse"
                : "La factura cumple con todas las validaciones"
            }
            icon={status === "error" ? "❌" : status === "warning" ? "⚠️" : "✅"}
            errors={validationStats.errors}
            warnings={validationStats.warnings}
            passed={passed}
          />

          {/* Errors Section */}
          {errors.length > 0 && (
            <div>
              <h3 className="text-white text-base mb-4">
                ⚠️ Errores Encontrados ({errors.length})
              </h3>

              {errors.map((error, index) => (
                <ValidationItem
                  key={index}
                  type="error"
                  title={error.message}
                  description={`Campo: ${error.field} | Sección: ${error.section}`}
                  normReference="📋 Validación de Campos Requeridos"
                  onDetailClick={() => {}}
                />
              ))}
            </div>
          )}

          {/* Warnings Section */}
          {warnings.length > 0 && (
            <div className="mt-8">
              <h3 className="text-white text-base mb-4">
                ⚡ Advertencias ({warnings.length})
              </h3>

              {warnings.map((warning, index) => (
                <ValidationItem
                  key={index}
                  type="warning"
                  title={warning.message}
                  description={`Campo: ${warning.field} | Sección: ${warning.section}`}
                />
              ))}
            </div>
          )}

          {/* Success Section (Collapsible) */}
          {passed > 0 && (
            <div className="mt-8">
              <button
                className="btn btn-ghost w-full justify-between"
                onClick={() => setShowSuccess(!showSuccess)}
              >
                <span>✅ Validaciones Exitosas ({passed})</span>
                <span>{showSuccess ? "▲" : "▼"}</span>
              </button>
              {showSuccess && (
                <div className="mt-4 space-y-2">
                  <ValidationItem
                    type="success"
                    title="Formato de fecha válido"
                    description="InvoiceDate cumple con el formato requerido"
                  />
                  <ValidationItem
                    type="success"
                    title="Moneda válida"
                    description="Currency es un código válido (USD)"
                  />
                  <ValidationItem
                    type="success"
                    title="Items presentes"
                    description="La factura contiene items de mercancía"
                  />
                  <p className="text-secondary-400 text-center text-sm mt-4">
                    + {Math.max(0, passed - 3)} validaciones más...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
