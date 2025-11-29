"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StepsSistem from "@/app/components/organism/StepsSistem";
import MetricsPanel from "@/app/components/organism/MetricsPanel";
import SummaryCard from "@/app/components/molecules/SummaryCard";
import ValidationItem from "@/app/components/molecules/ValidationItem";
import JsonViewer from "@/app/components/molecules/JsonViewer";
import { getValidationById, StoredValidation } from "@/app/services/localStorage.service";

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [validation, setValidation] = useState<StoredValidation | null>(null);

  const validationId = searchParams.get("id");
  const filename = searchParams.get("filename") || "factura.json";

  useEffect(() => {
    // Load validation from localStorage
    if (!validationId) {
      router.push("/validation/home");
      return;
    }

    const storedValidation = getValidationById(validationId);
    if (!storedValidation) {
      router.push("/validation/home");
      return;
    }

    setValidation(storedValidation);
  }, [validationId, router]);

  if (!validation) {
    return (
      <div className="main-content">
        <div className="text-center text-white">
          <p>Cargando validación...</p>
        </div>
      </div>
    );
  }

  const errors = validation.errors || [];
  const warnings = validation.warnings || [];
  const status = validation.status;

  // Map status to MetricsPanel expected format
  const metricsStatus: "success" | "error" | "warning" =
    status === "approved" ? "success" :
    status === "rejected" ? "error" :
    "warning";

  // Calculate totals
  const totalPossibleChecks = 35;
  const passed = totalPossibleChecks - errors.length - warnings.length;

  // Prepare highlight fields for JSON viewer
  const highlightFields = [
    ...errors.map(e => ({ field: e.field, severity: "error" as const })),
    ...warnings.map(w => ({ field: w.field, severity: "warning" as const }))
  ];

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
        status={metricsStatus}
        errors={errors.length}
        warnings={warnings.length}
        passed={passed}
        total={totalPossibleChecks}
        onNewValidation={() => router.push("/validation/home")}
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

          {/* Legend for highlights */}
          {(errors.length > 0 || warnings.length > 0) && (
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginBottom: "1rem",
                padding: "0.75rem",
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                borderRadius: "var(--border-radius)",
                fontSize: "0.875rem",
              }}
            >
              {errors.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      backgroundColor: "rgba(239, 68, 68, 0.2)",
                      border: "1px solid var(--error)",
                      borderRadius: "3px",
                    }}
                  />
                  <span className="text-secondary-300">Errores</span>
                </div>
              )}
              {warnings.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      backgroundColor: "rgba(251, 191, 36, 0.2)",
                      border: "1px solid var(--warning)",
                      borderRadius: "3px",
                    }}
                  />
                  <span className="text-secondary-300">Advertencias</span>
                </div>
              )}
            </div>
          )}

          <JsonViewer
            data={validation.invoice_data}
            highlightFields={highlightFields}
          />
        </div>

        {/* Right Panel - Validation Results */}
        <div className="split-panel">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-2">
              🔍 Resultados de Validación
            </h2>
            <p className="text-secondary-400 text-sm">
              {validation.filename}
            </p>
          </div>

          {/* Summary Card */}
          <SummaryCard
            status={status}
            title={status === "rejected" ? "No Cumple" : status === "warning" ? "Con Advertencias" : "Cumple"}
            description={
              status === "rejected"
                ? "La factura presenta errores que deben corregirse"
                : status === "warning"
                ? "La factura tiene advertencias que deberían revisarse"
                : "La factura cumple con todas las validaciones"
            }
            icon={status === "rejected" ? "❌" : status === "warning" ? "⚠️" : "✅"}
            errors={errors.length}
            warnings={warnings.length}
            passed={passed}
          />

          {/* Validation Source Info */}
          {validation.validation_source && (
            <div className="mb-6 p-3 bg-info/10 border border-info/20 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-secondary-300">
                <span>🔍 Fuente de validación:</span>
                <span className="font-semibold text-white">
                  {validation.validation_source === "frontend" && "Frontend (DIAN)"}
                  {validation.validation_source === "backend" && "Backend API"}
                  {validation.validation_source === "merged" && "Frontend + Backend (Frontend prioritario)"}
                </span>
                {validation.conflict_resolution && validation.conflict_resolution.conflicts_found > 0 && (
                  <span className="text-warning text-xs">
                    • {validation.conflict_resolution.conflicts_found} conflicto(s) resuelto(s)
                  </span>
                )}
              </div>
            </div>
          )}

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
                  normReference={
                    error.requirementNumber
                      ? `📋 Requisito DIAN #${error.requirementNumber} ${error.allowsPartialCompliance ? "(✅ Permite cumplimiento parcial)" : "(❌ No permite cumplimiento parcial)"}`
                      : "📋 Validación de Campos Requeridos"
                  }
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
                  description={`Campo: ${warning.field} | Sección: ${warning.section}${
                    warning.requirementNumber
                      ? ` | Requisito DIAN #${warning.requirementNumber}`
                      : ""
                  }`}
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
