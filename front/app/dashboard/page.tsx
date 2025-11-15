"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import StatCard from "../components/molecules/StatCard";
import InvoicesTable, { Invoice } from "../components/organism/InvoicesTable";
import LineChart from "../components/molecules/LineChart";
import DonutChart from "../components/molecules/DonutChart";
import {
  getAllValidations as getLocalValidations,
  getValidationStats,
  StoredValidation
} from "../services/localStorage.service";
import { getChartData, ChartDataPoint } from "../utils/chartData";
import { exportValidationsToCSV, exportDetailedValidationsToCSV } from "../utils/exportCSV";
import { useTranslation } from "../i18n/LanguageContext";

// Convert StoredValidation to Invoice format
function convertToInvoice(validation: StoredValidation): Invoice {
  return {
    id: validation.id,
    filename: validation.filename,
    supplier: validation.invoice_info.supplier || "N/A",
    importer: validation.invoice_info.customer || "N/A",
    status: validation.status,
    errors: validation.errors.length,
    warnings: validation.warnings.length,
    amount: validation.invoice_info.total_amount || "$0",
    currency: validation.invoice_info.currency || "USD",
    items: validation.invoice_info.items_count || 0,
    date: new Date(validation.timestamp).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `Hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
  } else if (diffHours < 24) {
    return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
  } else if (diffDays < 7) {
    return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
  } else {
    return date.toLocaleDateString("es-ES");
  }
}

// Sample data (fallback)
const invoicesDataSample: Invoice[] = [
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
  const t = useTranslation();
  const [invoicesData, setInvoicesData] = useState<Invoice[]>([]);
  const [validations, setValidations] = useState<StoredValidation[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    warning: 0,
    approval_rate: 0,
  });
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [chartPeriod, setChartPeriod] = useState<"day" | "week" | "month">("day");
  const [loading, setLoading] = useState(true);
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    function loadData() {
      try {
        // Get validations from localStorage
        const loadedValidations = getLocalValidations();
        const validationStats = getValidationStats();

        // Store validations for export
        setValidations(loadedValidations);

        // Convert to Invoice format
        if (loadedValidations.length > 0) {
          const convertedData = loadedValidations.map(convertToInvoice);
          setInvoicesData(convertedData);
        }

        setStats(validationStats);

        // Prepare chart data
        const data = getChartData(loadedValidations, chartPeriod);
        setChartData(data);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();

    // Refresh data when window gains focus (to catch new validations)
    const handleFocus = () => loadData();
    window.addEventListener("focus", handleFocus);

    return () => window.removeEventListener("focus", handleFocus);
  }, [chartPeriod]);

  const handleExportCSV = () => {
    exportValidationsToCSV(validations);
    setShowExportMenu(false);
  };

  const handleExportDetailedCSV = () => {
    exportDetailedValidationsToCSV(validations);
    setShowExportMenu(false);
  };

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showExportMenu) {
        setShowExportMenu(false);
      }
    };

    if (showExportMenu) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showExportMenu]);

  return (
    <div className="main-content">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {t.dashboard.title}
        </h1>
        <p className="text-secondary-400">
          {t.dashboard.subtitle}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid fade-in mb-8">
        <StatCard
          label={t.dashboard.stats.totalValidations}
          value={stats.total}
          valueColor="var(--primary-500)"
          trend={{
            direction: "up",
            value: "+12% vs mes anterior",
            isPositive: true,
          }}
        />
        <StatCard
          label={t.dashboard.stats.approvalRate}
          value={`${stats.approval_rate.toFixed(1)}%`}
          valueColor="var(--success)"
          trend={{
            direction: "up",
            value: "+5% mejora",
            isPositive: true,
          }}
        />
        <StatCard
          label={t.dashboard.stats.rejected}
          value={stats.rejected}
          valueColor="var(--error)"
          trend={{
            direction: "down",
            value: "-8% vs mes anterior",
            isPositive: true,
          }}
        />
        <StatCard
          label={t.dashboard.stats.withWarnings}
          value={stats.warning}
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
            <h3 className="card-title">📊 {t.dashboard.charts.validationsOverTime}</h3>
            <div className="flex gap-2">
              <button
                className={`btn ${chartPeriod === "day" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setChartPeriod("day")}
              >
                {t.dashboard.charts.days7}
              </button>
              <button
                className={`btn ${chartPeriod === "week" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setChartPeriod("week")}
              >
                {t.dashboard.charts.weeks4}
              </button>
              <button
                className={`btn ${chartPeriod === "month" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setChartPeriod("month")}
              >
                {t.dashboard.charts.months3}
              </button>
            </div>
          </div>
          <div className="card-body">
            <LineChart data={chartData} height={200} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🎯 {t.dashboard.charts.distributionByStatus}</h3>
          </div>
          <div className="card-body">
            <DonutChart
              approved={stats.approved}
              rejected={stats.rejected}
              warning={stats.warning}
              size={200}
            />
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="card fade-in">
        <div className="card-header">
          <h3 className="card-title">📋 {t.dashboard.table.title}</h3>
          <div className="flex gap-2" style={{ position: "relative" }}>
            <div style={{ position: "relative" }}>
              <button
                className="btn btn-outline"
                disabled={invoicesData.length === 0}
                onClick={() => setShowExportMenu(!showExportMenu)}
              >
                <span>↓</span> {t.dashboard.table.exportCSV}
              </button>

              {showExportMenu && invoicesData.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: "0.5rem",
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--border-radius)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                    minWidth: "200px",
                    zIndex: 1000,
                  }}
                >
                  <button
                    className="btn btn-ghost"
                    onClick={handleExportCSV}
                    style={{
                      width: "100%",
                      justifyContent: "flex-start",
                      borderRadius: 0,
                      padding: "0.75rem 1rem",
                    }}
                  >
                    📊 {t.dashboard.table.exportSummary}
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={handleExportDetailedCSV}
                    style={{
                      width: "100%",
                      justifyContent: "flex-start",
                      borderRadius: 0,
                      padding: "0.75rem 1rem",
                    }}
                  >
                    📋 {t.dashboard.table.exportDetailed}
                  </button>
                </div>
              )}
            </div>
            <button
              className="btn btn-ghost"
              disabled={invoicesData.length === 0}
            >
              <span>⚙️</span> {t.dashboard.table.filters}
            </button>
          </div>
        </div>

        {invoicesData.length === 0 ? (
          <div className="card-body text-center" style={{ padding: "4rem 2rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📋</div>
            <h3 style={{ color: "white", marginBottom: "0.5rem" }}>
              {t.dashboard.table.noValidations}
            </h3>
            <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
              {t.dashboard.table.startValidating}
            </p>
            <button
              className="btn btn-primary"
              onClick={() => router.push("/validation/home")}
            >
              {t.dashboard.table.newValidation}
            </button>
          </div>
        ) : (
          <InvoicesTable
            data={invoicesData}
            onRowClick={(invoice) => router.push(`/validation/results?id=${invoice.id}`)}
          />
        )}
      </div>
    </div>
  );
}
