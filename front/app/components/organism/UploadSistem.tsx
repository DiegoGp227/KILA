"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { validateInvoiceWithAPI } from "@/app/services/validation.service";
import { saveValidation, extractInvoiceInfo } from "@/app/services/localStorage.service";
import { REQUEST_CONFIG } from "@/app/config/urls";

export default function UploadSistem() {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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
    setError(null);

    // Validate file type
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      setError("Por favor, selecciona un archivo JSON válido");
      return;
    }

    // Validate file size
    if (file.size > REQUEST_CONFIG.maxFileSize) {
      setError(`El archivo es demasiado grande. Máximo ${REQUEST_CONFIG.maxFileSize / 1024 / 1024}MB`);
      return;
    }

    setUploading(true);

    try {
      // Call external validation API
      const response = await validateInvoiceWithAPI(file);

      if (response.success && response.validation_id) {
        // Extract invoice info
        const invoiceInfo = extractInvoiceInfo(response.invoice_data);

        // Save to localStorage
        saveValidation({
          id: response.validation_id,
          filename: file.name,
          timestamp: new Date().toISOString(),
          invoice_data: response.invoice_data,
          errors: response.errors || [],
          warnings: response.warnings || [],
          status: response.status || "approved",
          invoice_info: invoiceInfo,
        });

        // Navigate to processing page
        router.push(`/validation/processing?id=${response.validation_id}&filename=${encodeURIComponent(file.name)}`);
      } else {
        setError(response.message || "Error al validar el archivo");
      }
    } catch (err: any) {
      setError(err.message || "Error al procesar el archivo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`upload-zone ${dragActive ? "dragover" : ""} ${uploading ? "opacity-50" : ""}`}
        id="uploadZone"
      >
        <div className="upload-icon">{uploading ? "⏳" : "📄"}</div>
        <h3 style={{ color: "white", marginBottom: "0.5rem" }}>
          {uploading ? "Procesando archivo..." : "Arrastra tu archivo JSON aquí"}
        </h3>
        <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
          {uploading ? "Validando con DIAN..." : "o haz clic para seleccionar un archivo"}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleChange}
          style={{ display: "none" }}
          disabled={uploading}
        />
        <button
          className="btn btn-primary"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          disabled={uploading}
        >
          {uploading ? "Procesando..." : "Seleccionar Archivo"}
        </button>
        <p
          className="text-muted"
          style={{ fontSize: "0.75rem", marginTop: "1rem" }}
        >
          Formatos aceptados: JSON • Tamaño máximo: {REQUEST_CONFIG.maxFileSize / 1024 / 1024}MB
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "var(--border-radius)",
            color: "var(--error)",
          }}
        >
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}
    </>
  );
}
