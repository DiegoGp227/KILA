"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadInvoice } from "./services/api";

export default function ValidationPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate it's a JSON file
      if (!selectedFile.name.endsWith(".json")) {
        setError("Por favor selecciona un archivo JSON válido");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Por favor selecciona un archivo");
      return;
    }

    try {
      setUploading(true);
      setError("");

      console.log("📤 Uploading file:", file.name);

      const response = await uploadInvoice(file);

      if (response.success && response.data) {
        console.log("✅ Upload successful, redirecting to results...");
        // Redirect to results page with the validation ID
        router.push(`/validation/results?id=${response.data.validation_id}`);
      } else {
        setError(response.error || "Error al procesar la validación");
      }
    } catch (err: any) {
      console.error("❌ Upload error:", err);
      setError("Error al conectar con el servidor");
    } finally {
      setUploading(false);
    }
  };

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
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith(".json")) {
        setFile(droppedFile);
        setError("");
      } else {
        setError("Por favor selecciona un archivo JSON válido");
      }
    }
  };

  return (
    <div className="main-content">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Validación de Facturas DIAN
        </h1>
        <p className="text-secondary-400">
          Sube tu factura en formato JSON para validar
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto">
        <div className="card fade-in">
          <div className="card-header text-center">
            <h1 className="card-title text-2xl">Cargar Factura</h1>
            <p className="text-secondary-400 text-sm mt-2">
              Selecciona un archivo JSON para validar
            </p>
          </div>

          <div className="card-body">
            {/* File Upload Area */}
            <div className="mb-6">
              <label
                htmlFor="file-upload"
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`
                  flex flex-col items-center justify-center
                  w-full h-64 border-2 border-dashed rounded-lg cursor-pointer
                  transition-colors
                  ${
                    dragActive
                      ? "border-primary-400 bg-primary-500/20"
                      : file
                      ? "border-primary-500 bg-primary-500/10"
                      : "border-secondary-600 hover:border-primary-500 hover:bg-secondary-800/50"
                  }
                `}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="text-6xl mb-4">{file ? "📄" : "📁"}</div>
                  <p className="mb-2 text-sm text-secondary-300">
                    <span className="font-semibold">
                      {file ? file.name : "Click para seleccionar"}
                    </span>{" "}
                    {!file && "o arrastra el archivo"}
                  </p>
                  <p className="text-xs text-secondary-500">
                    Solo archivos JSON (máx. 10MB)
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".json"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
                <p className="text-error text-sm">⚠️ {error}</p>
              </div>
            )}

            {/* Upload Button */}
            <button
              className={`btn btn-primary w-full ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleUpload}
              disabled={!file || uploading}
            >
              {uploading ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Procesando...
                </>
              ) : (
                "Iniciar Validación"
              )}
            </button>

            {/* Info */}
            <div className="mt-6 p-4 bg-info/10 border border-info/20 rounded-lg">
              <p className="text-secondary-400 text-sm">
                ℹ️ El archivo será enviado al servicio de validación para su
                análisis según la normativa DIAN CT-COA-0124
              </p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <button className="btn btn-ghost" onClick={() => router.push("/")}>
            ← Volver al Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
