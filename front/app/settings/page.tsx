"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getValidationConfig,
  saveValidationConfig,
  resetValidationConfig,
  exportConfig,
  importConfig,
  ValidationConfig,
} from "@/app/config/validation.config";

export default function SettingsPage() {
  const [config, setConfig] = useState<ValidationConfig | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Load current config
    setConfig(getValidationConfig());
  }, []);

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

  const handleFile = async (file: File) => {
    setMessage(null);

    // Validate file type
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      setMessage({ type: "error", text: "Por favor, selecciona un archivo JSON válido" });
      return;
    }

    try {
      const fileContent = await readFileAsText(file);
      const importedConfig = importConfig(fileContent);

      if (!importedConfig) {
        setMessage({ type: "error", text: "El archivo JSON no tiene el formato correcto" });
        return;
      }

      // Save configuration
      saveValidationConfig(importedConfig);
      setConfig(importedConfig);
      setMessage({ type: "success", text: `✅ Configuración importada exitosamente desde ${file.name}` });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Error al procesar el archivo" });
    }
  };

  const handleExport = () => {
    if (!config) return;

    const jsonString = exportConfig(config);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `validation-config-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setMessage({ type: "success", text: "✅ Configuración exportada exitosamente" });
  };

  const handleReset = () => {
    if (confirm("¿Estás seguro de que quieres restaurar la configuración por defecto?")) {
      resetValidationConfig();
      setConfig(getValidationConfig());
      setMessage({ type: "success", text: "✅ Configuración restaurada a valores por defecto" });
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(new Error("Error al leer el archivo"));
      reader.readAsText(file);
    });
  };

  if (!config) {
    return (
      <div className="main-content">
        <div className="text-center text-white">
          <p>Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* Breadcrumbs */}
      <div className="flex gap-2 mb-8 justify-center items-center text-secondary-400">
        <span className="breadcrumb-item cursor-pointer" onClick={() => router.push("/validation/home")}>
          Validación DIAN
        </span>
        <span>/</span>
        <span className="breadcrumb-item active text-primary-500 font-semibold">
          Configuración
        </span>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <div className="card fade-in">
          <div className="card-header">
            <h1 className="card-title">⚙️ Configuración de Validación DIAN</h1>
            <p className="text-secondary-400 text-sm mt-2">
              Importa o exporta la configuración de parámetros de validación
            </p>
          </div>

          <div className="card-body">
            {/* Message Banner */}
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg border ${
                  message.type === "success"
                    ? "bg-success/10 border-success/30 text-success"
                    : "bg-error/10 border-error/30 text-error"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Upload Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`upload-zone ${dragActive ? "dragover" : ""}`}
            >
              <div className="upload-icon">📤</div>
              <h3 style={{ color: "white", marginBottom: "0.5rem" }}>
                Importar Configuración
              </h3>
              <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
                Arrastra un archivo JSON de configuración aquí o haz clic para seleccionar
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleChange}
                style={{ display: "none" }}
              />
              <button className="btn btn-primary" onClick={(e) => e.stopPropagation()}>
                Seleccionar Archivo JSON
              </button>
            </div>

            {/* Current Configuration Summary */}
            <div className="mt-8">
              <h3 className="text-white text-lg font-semibold mb-4">
                📋 Configuración Actual
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Incoterms */}
                <div className="p-4 bg-secondary-800/30 rounded-lg border border-secondary-700">
                  <h4 className="text-white font-semibold mb-2">Incoterms Válidos</h4>
                  <div className="flex flex-wrap gap-2">
                    {config.validIncoterms.map((term) => (
                      <span
                        key={term}
                        className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded text-xs"
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                  <p className="text-secondary-400 text-xs mt-2">
                    Total: {config.validIncoterms.length} términos
                  </p>
                </div>

                {/* Currencies */}
                <div className="p-4 bg-secondary-800/30 rounded-lg border border-secondary-700">
                  <h4 className="text-white font-semibold mb-2">Monedas Válidas</h4>
                  <div className="flex flex-wrap gap-2">
                    {config.validCurrencies.map((currency) => (
                      <span
                        key={currency}
                        className="px-2 py-1 bg-success/20 text-success rounded text-xs"
                      >
                        {currency}
                      </span>
                    ))}
                  </div>
                  <p className="text-secondary-400 text-xs mt-2">
                    Total: {config.validCurrencies.length} monedas
                  </p>
                </div>

                {/* Thresholds */}
                <div className="p-4 bg-secondary-800/30 rounded-lg border border-secondary-700">
                  <h4 className="text-white font-semibold mb-2">Umbrales de Validación</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-secondary-300 text-sm">Min. descripción:</span>
                      <span className="text-white text-sm font-mono">
                        {config.thresholds.minDescriptionLength} chars
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-300 text-sm">Tolerancia precio:</span>
                      <span className="text-white text-sm font-mono">
                        {config.thresholds.priceTolerancePercent}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Requirements Status */}
                <div className="p-4 bg-secondary-800/30 rounded-lg border border-secondary-700">
                  <h4 className="text-white font-semibold mb-2">Estado de Requisitos</h4>
                  <div className="space-y-1">
                    {Object.entries(config.enabledRequirements).map(([key, enabled]) => {
                      const reqNum = key.match(/\d+/)?.[0];
                      return (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-secondary-300 text-xs">Requisito #{reqNum}:</span>
                          <span
                            className={`text-xs font-semibold ${
                              enabled ? "text-success" : "text-error"
                            }`}
                          >
                            {enabled ? "✅ Activo" : "❌ Inactivo"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Strict Mode */}
              <div className="mt-4 p-4 bg-warning/10 border border-warning/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-semibold">🔒 Modo Estricto</h4>
                    <p className="text-secondary-400 text-sm">
                      Convierte advertencias en errores
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded font-semibold ${
                      config.strictMode
                        ? "bg-error text-white"
                        : "bg-success/20 text-success"
                    }`}
                  >
                    {config.strictMode ? "ACTIVADO" : "DESACTIVADO"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4 flex-wrap">
              <button className="btn btn-secondary flex-1" onClick={handleExport}>
                📥 Exportar Configuración
              </button>
              <button className="btn btn-ghost flex-1" onClick={handleReset}>
                🔄 Restaurar por Defecto
              </button>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-info/10 border border-info/20 rounded-lg">
              <h4 className="text-info font-semibold mb-2">ℹ️ Formato del archivo JSON</h4>
              <p className="text-secondary-400 text-sm mb-2">
                El archivo de configuración debe contener los siguientes campos:
              </p>
              <ul className="text-secondary-400 text-sm space-y-1 ml-4">
                <li>• <code className="text-primary-400">validIncoterms</code>: Array de strings</li>
                <li>• <code className="text-primary-400">validCurrencies</code>: Array de strings</li>
                <li>• <code className="text-primary-400">thresholds</code>: Objeto con minDescriptionLength y priceTolerancePercent</li>
                <li>• <code className="text-primary-400">enabledRequirements</code>: Objeto con req1-req11 booleanos</li>
                <li>• <code className="text-primary-400">genericTerms</code>: Array de strings</li>
                <li>• <code className="text-primary-400">strictMode</code>: Boolean</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <button
            className="btn btn-ghost"
            onClick={() => router.push("/validation/home")}
          >
            ← Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
}
