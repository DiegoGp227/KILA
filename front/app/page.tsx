"use client";
import { useState, useRef } from "react";
import StepsSistem from "./components/organism/StepsSistem";

export default function HomePage() {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type === "application/json") {
      console.log("Archivo cargado:", file.name);
      // Aquí puedes navegar a la siguiente pantalla
      // router.push('/validando')
    } else {
      alert("Por favor, selecciona un archivo JSON válido");
    }
  };

  const recentValidations = [
    {
      id: 1,
      name: "factura_importacion_2024_001.json",
      time: "Hace 2 horas",
      status: "error",
      message: "8 errores encontrados",
    },
    {
      id: 2,
      name: "factura_exportador_china_003.json",
      time: "Ayer",
      status: "success",
      message: "Validación exitosa",
    },
    {
      id: 3,
      name: "factura_usa_electronics_012.json",
      time: "Hace 3 días",
      status: "warning",
      message: "2 advertencias",
    },
  ];

  return (
    <div className="main-content">
      {/* Breadcrumbs */}
      <div className="flex gap-0.5 mb-8 justify-center items-center text-var(--secondary-400)">
        <span className="breadcrumb-item active">Validación DIAN</span>
        <span>/</span>
        <span className="flex items-center gap-0.5">Nueva Validación</span>
      </div>

      {/* Timeline Steps */}
      <StepsSistem StepActive={1} />

      {/* Main Content */}
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div className="card fade-in">
          <div className="card-header">
            <div>
              <h1 className="card-title">
                Validador de Facturas de Importación
              </h1>
              <p
                className="text-muted"
                style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}
              >
                Verificación automática según normativa DIAN (CT-COA-0124)
              </p>
            </div>
          </div>

          <div className="card-body">
            {/* Upload Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`upload-zone ${dragActive ? "dragover" : ""}`}
              id="uploadZone"
            >
              <div className="upload-icon">📄</div>
              <h3 style={{ color: "white", marginBottom: "0.5rem" }}>
                Arrastra tu archivo JSON aquí
              </h3>
              <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
                o haz clic para seleccionar un archivo
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleChange}
                style={{ display: "none" }}
              />
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Seleccionar Archivo
              </button>
              <p
                className="text-muted"
                style={{ fontSize: "0.75rem", marginTop: "1rem" }}
              >
                Formatos aceptados: JSON • Tamaño máximo: 10MB
              </p>
            </div>

            {/* Recent Files */}
            <div style={{ marginTop: "2rem" }}>
              <h3
                style={{
                  color: "white",
                  fontSize: "1rem",
                  marginBottom: "1rem",
                }}
              >
                📁 Validaciones Recientes
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {recentValidations.map((validation) => (
                  <div
                    key={validation.id}
                    className="card"
                    style={{ padding: "1rem", cursor: "pointer" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <div className={`status-icon ${validation.status}`}>
                          {validation.status === "error"
                            ? "✕"
                            : validation.status === "success"
                            ? "✓"
                            : "⚠"}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: "white" }}>
                            {validation.name}
                          </div>
                          <div
                            className="text-muted"
                            style={{ fontSize: "0.75rem" }}
                          >
                            {validation.time} • {validation.message}
                          </div>
                        </div>
                      </div>
                      <button className="btn btn-ghost">
                        <span>↻</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div
              style={{
                marginTop: "2rem",
                padding: "1rem",
                background: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                borderRadius: "8px",
              }}
            >
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ fontSize: "1.5rem" }}>ℹ️</div>
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      color: "var(--info)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Requisitos de la factura
                  </div>
                  <ul
                    style={{
                      color: "var(--secondary-300)",
                      fontSize: "0.875rem",
                      lineHeight: 1.8,
                      paddingLeft: "1.5rem",
                    }}
                  >
                    <li>Datos del proveedor (nombre, dirección, país)</li>
                    <li>Datos del importador (NIT, razón social)</li>
                    <li>Detalle de mercancía (descripción, cantidad, valor)</li>
                    <li>
                      Información de transporte (incoterm, país de origen)
                    </li>
                    <li>Valores totales y moneda de transacción</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <button className="btn btn-outline">
            <span>📊</span>
            Ver Dashboard
          </button>
          <button className="btn btn-ghost">
            <span>📖</span>
            Documentación DIAN
          </button>
        </div>
      </div>
    </div>
  );
}
