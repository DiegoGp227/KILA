"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepsSistem from "@/app/components/organism/StepsSistem";
import MetricsPanel from "@/app/components/organism/MetricsPanel";
import SummaryCard from "@/app/components/molecules/SummaryCard";
import ValidationItem from "@/app/components/molecules/ValidationItem";
import JsonViewer from "@/app/components/molecules/JsonViewer";

// Sample data
const sampleInvoice = {
  factura: {
    numero: "INV-2024-001",
    fecha: "2024-01-15",
    moneda: "USD",
  },
  proveedor: {
    nombre: "Tech Supplies China Ltd.",
    pais: "China",
    direccion: "123 Industrial Zone, Shenzhen",
    telefono: "+86 755 1234567",
  },
  importador: {
    razonSocial: "",
    nit: "900123456",
    direccion: "Calle 100 #15-20, Bogotá",
    ciudad: "Bogotá",
    pais: "Colombia",
  },
  mercancia: [
    {
      descripcion: "Laptop Dell XPS 15",
      cantidad: 50,
      precioUnitario: 1200.0,
      total: 60000.0,
      pesoUnitario: 2.1,
    },
    {
      descripcion: "",
      cantidad: 100,
      precioUnitario: 25.0,
      total: 2500.0,
    },
  ],
  transporte: {
    incoterm: "FOB",
    puertoOrigen: "Shenzhen Port",
    puertoDestino: "Buenaventura",
  },
  totales: {
    subtotal: 62500.0,
    descuento: 0.0,
    total: 62000.0,
  },
};

export default function ResultsPage() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  const errors = [
    {
      title: "Razón Social del Importador Vacía",
      description:
        'El campo <code style="background: var(--secondary-600); padding: 0.125rem 0.375rem; border-radius: 4px;">importador.razonSocial</code> es obligatorio y no puede estar vacío según la normativa DIAN.',
      normReference: "📋 CT-COA-0124 - Sección 2.3",
    },
    {
      title: "NIT sin Dígito de Verificación",
      description:
        'El NIT <code style="background: var(--secondary-600); padding: 0.125rem 0.375rem; border-radius: 4px;">900123456</code> debe incluir el dígito de verificación (formato: 900123456-X).',
      normReference: "📋 CT-COA-0124 - Sección 2.3.2",
    },
    {
      title: "Descripción de Mercancía Vacía",
      description:
        "El ítem #2 de mercancía tiene descripción vacía. Todas las mercancías deben tener descripción detallada.",
      normReference: "📋 CT-COA-0124 - Sección 3.1",
    },
    {
      title: "Error en Cálculo de Total",
      description:
        "El total general ($62,000) no coincide con la suma de subtotales ($62,500). Diferencia: $500.",
      normReference: "📋 Validación Cruzada de Cálculos",
    },
  ];

  const warnings = [
    {
      title: "Peso No Especificado",
      description:
        "El ítem #2 no tiene peso especificado. Recomendado para cálculos de flete.",
    },
    {
      title: "Falta País de Fabricación",
      description:
        "No se especifica el país de fabricación de la mercancía.",
    },
  ];

  const successItems = [
    { title: "Datos del proveedor completos" },
    { title: "Formato de fecha válido" },
    { title: "Moneda válida (USD)" },
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
        status="error"
        errors={8}
        warnings={3}
        passed={24}
        total={35}
        onNewValidation={() => router.push("/validation")}
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
            data={sampleInvoice}
            highlightErrors={["razonSocial", "nit", "descripcion", "total"]}
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
            status="error"
            title="No Cumple"
            description="La factura presenta errores que deben corregirse"
            icon="❌"
            errors={8}
            warnings={3}
            passed={24}
          />

          {/* Errors Section */}
          <div>
            <h3 className="text-white text-base mb-4">
              ⚠️ Errores Encontrados (8)
            </h3>

            {errors.map((error, index) => (
              <ValidationItem
                key={index}
                type="error"
                title={error.title}
                description={error.description}
                normReference={error.normReference}
                onDetailClick={() => {}}
              />
            ))}
          </div>

          {/* Warnings Section */}
          <div className="mt-8">
            <h3 className="text-white text-base mb-4">
              ⚡ Advertencias (3)
            </h3>

            {warnings.map((warning, index) => (
              <ValidationItem
                key={index}
                type="warning"
                title={warning.title}
                description={warning.description}
              />
            ))}
          </div>

          {/* Success Section (Collapsible) */}
          <div className="mt-8">
            <button
              className="btn btn-ghost w-full justify-between"
              onClick={() => setShowSuccess(!showSuccess)}
            >
              <span>✅ Validaciones Exitosas (24)</span>
              <span>{showSuccess ? "▲" : "▼"}</span>
            </button>
            {showSuccess && (
              <div className="mt-4 space-y-2">
                {successItems.map((item, index) => (
                  <ValidationItem
                    key={index}
                    type="success"
                    title={item.title}
                    description=""
                  />
                ))}
                <p className="text-secondary-400 text-center text-sm mt-4">
                  + 21 validaciones más...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
