"use client";

import { useRouter } from "next/navigation";
import StatCard from "../components/molecules/StatCard";
import InvoicesTable, { Invoice } from "../components/organism/InvoicesTable";

// Sample data
const invoicesData: Invoice[] = [
  {
    id: "1",
    filename: "factura_importacion_2024_001.json",
    supplier: "Tech Supplies China Ltd.",
    importer: "DWP Corporation",
    status: "rejected",
    errors: 8,
    warnings: 3,
    amount: "$62,000",
    currency: "USD",
    items: 152,
    date: "Hace 2 horas",
  },
  {
    id: "2",
    filename: "factura_exportador_china_003.json",
    supplier: "Electronics Corp",
    importer: "ImportCo S.A.S.",
    status: "approved",
    errors: 0,
    warnings: 0,
    amount: "$145,000",
    currency: "USD",
    items: 320,
    date: "Ayer a las 14:32",
  },
  {
    id: "3",
    filename: "factura_usa_electronics_012.json",
    supplier: "USA Tech Inc.",
    importer: "Comercializadora Del Sur",
    status: "warning",
    errors: 0,
    warnings: 2,
    amount: "$89,500",
    currency: "USD",
    items: 215,
    date: "Hace 3 días",
  },
  {
    id: "4",
    filename: "factura_germany_machinery_008.json",
    supplier: "German Machinery GmbH",
    importer: "Industrial Solutions",
    status: "approved",
    errors: 0,
    warnings: 0,
    amount: "$320,000",
    currency: "EUR",
    items: 85,
    date: "Hace 5 días",
  },
  {
    id: "5",
    filename: "factura_japan_auto_parts_015.json",
    supplier: "Tokyo Auto Parts Ltd.",
    importer: "Autopartes Colombia",
    status: "rejected",
    errors: 12,
    warnings: 5,
    amount: "$198,000",
    currency: "JPY",
    items: 450,
    date: "Hace 1 semana",
  },
  {
    id: "6",
    filename: "factura_brazil_textiles_022.json",
    supplier: "Textiles do Brasil",
    importer: "Moda Internacional",
    status: "approved",
    errors: 0,
    warnings: 0,
    amount: "$54,000",
    currency: "USD",
    items: 680,
    date: "Hace 1 semana",
  },
];

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="main-content">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Dashboard de Validaciones
        </h1>
        <p className="text-secondary-400">
          Monitoreo y gestión de facturas de importación - Normativa DIAN
        </p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid fade-in mb-8">
        <StatCard
          label="Total Validaciones"
          value={127}
          valueColor="var(--primary-500)"
          trend={{
            direction: "up",
            value: "+12% vs mes anterior",
            isPositive: true,
          }}
        />
        <StatCard
          label="Tasa de Aprobación"
          value="68%"
          valueColor="var(--success)"
          trend={{
            direction: "up",
            value: "+5% mejora",
            isPositive: true,
          }}
        />
        <StatCard
          label="Errores Críticos"
          value={41}
          valueColor="var(--error)"
          trend={{
            direction: "down",
            value: "-8% vs mes anterior",
            isPositive: true,
          }}
        />
        <StatCard
          label="Advertencias"
          value={89}
          valueColor="var(--warning)"
          trend={{
            direction: "neutral",
            value: "Sin cambios",
          }}
        />
      </div>

      {/* Charts Section */}
      <div className="charts-grid fade-in mb-8">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📊 Validaciones por Día</h3>
            <div className="flex gap-2">
              <button className="btn btn-ghost">7D</button>
              <button className="btn btn-ghost">30D</button>
              <button className="btn btn-ghost">90D</button>
            </div>
          </div>
          <div className="card-body">
            <div className="chart-placeholder">
              <div className="text-5xl">📈</div>
              <div>Gráfico de líneas - Validaciones en el tiempo</div>
              <div className="text-xs text-secondary-500 mt-2">
                Integración con Chart.js o similar
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🎯 Por Estado</h3>
          </div>
          <div className="card-body">
            <div className="chart-placeholder" style={{ minHeight: "200px" }}>
              <div className="text-5xl">🍩</div>
              <div>Gráfico de dona</div>
              <div className="mt-4 w-full">
                <div className="flex justify-between mb-2">
                  <span className="text-success">✓ Cumple</span>
                  <span className="text-success font-bold">86</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-error">✕ No Cumple</span>
                  <span className="text-error font-bold">41</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="card fade-in">
        <div className="card-header">
          <h3 className="card-title">📋 Historial de Validaciones</h3>
          <div className="flex gap-2">
            <button className="btn btn-outline">
              <span>↓</span> Exportar CSV
            </button>
            <button className="btn btn-ghost">
              <span>⚙️</span> Filtros
            </button>
          </div>
        </div>

        <InvoicesTable
          data={invoicesData}
          onRowClick={(invoice) => router.push("/validation/results")}
        />
      </div>
    </div>
  );
}
