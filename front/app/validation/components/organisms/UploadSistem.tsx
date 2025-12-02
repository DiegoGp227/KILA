"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { REQUEST_CONFIG } from "@/app/config/urls";
import useValidateDIAN from "@/src/home/services/useValidateDIAN";

export default function UploadSistem() {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { validateFile, isLoading, error: validationError } = useValidateDIAN();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const handleFile = async (file: File) => {
    setError(null);

    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      setError("Por favor, selecciona un archivo JSON válido");
      return;
    }

    if (file.size > REQUEST_CONFIG.maxFileSize) {
      setError(
        `El archivo es demasiado grande. Máximo ${
          REQUEST_CONFIG.maxFileSize / 1024 / 1024
        }MB`
      );
      return;
    }

    setUploading(true);

    try {
      const response = await validateFile(file);

      if (response?.success && response.data) {
        // Redirigir a la página de procesamiento con el ID de la validación guardada
        router.push(`/validation/processing/${response.data.savedRecord.id}`);
      } else {
        setError(response?.error || "Error al procesar la validación");
      }
    } catch {
      setError("Error al conectar con el servidor");
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
        id="uploadZone"
        className={`
          upload-zone
          ${dragActive ? "dragover" : ""}
          ${uploading ? "opacity-50" : ""}
          flex flex-col items-center justify-center text-center
          p-6 rounded-xl border border-dashed border-secondary-400
          bg-secondary-900 cursor-pointer transition
        `}
      >
        <div className="upload-icon text-4xl mb-3">
          {uploading ? "⏳" : "📄"}
        </div>

        <h3 className="text-white mb-2 text-lg font-semibold">
          {uploading
            ? "Procesando archivo..."
            : "Arrastra tu archivo JSON aquí"}
        </h3>

        <p className="text-muted mb-6">
          {uploading
            ? "Validando con DIAN..."
            : "o haz clic para seleccionar un archivo"}
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleChange}
          className="hidden"
          disabled={uploading}
        />

        <button
          className={`btn btn-primary px-4 py-2 rounded-lg text-white transition ${
            uploading ? "opacity-75 cursor-not-allowed" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          disabled={uploading}
        >
          {uploading ? "Procesando..." : "Seleccionar Archivo"}
        </button>

        <p className="text-muted text-xs mt-4">
          Formatos aceptados: JSON • Tamaño máximo:{" "}
          {REQUEST_CONFIG.maxFileSize / 1024 / 1024}MB
        </p>
      </div>

      {error && (
        <div
          className="
            mt-4 p-4 rounded-lg border border-red-400/40
            bg-red-500/10 text-red-400 text-sm
          "
        >
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}
    </>
  );
}
