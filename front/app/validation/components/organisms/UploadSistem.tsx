"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { REQUEST_CONFIG } from "@/app/config/urls";
import useValidateDIAN from "@/src/home/services/useValidateDIAN";

export default function UploadSistem() {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { validateFile, isLoading, error } = useValidateDIAN();

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
    // Validaciones locales: tipo y tamaño
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      return alert("Por favor, selecciona un archivo JSON válido");
    }

    if (file.size > REQUEST_CONFIG.maxFileSize) {
      return alert(
        `El archivo es demasiado grande. Máximo ${
          REQUEST_CONFIG.maxFileSize / 1024 / 1024
        }MB`
      );
    }

    // Llamada al hook
    const response = await validateFile(file);

    if (response.success && response.data) {
      router.push(`/validation/processing/${response.data.savedRecord.id}`);
    }
  };

  return (
    <>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        id="uploadZone"
        className={`
          upload-zone
          ${dragActive ? "dragover" : ""}
          ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
          flex flex-col items-center justify-center text-center
          p-6 rounded-xl border border-dashed border-secondary-400
          bg-secondary-900 transition
        `}
      >
        <div className="upload-icon text-4xl mb-3">
          {isLoading ? "⏳" : "📄"}
        </div>

        <h3 className="text-white mb-2 text-lg font-semibold">
          {isLoading ? "Procesando archivo..." : "Arrastra tu archivo JSON aquí"}
        </h3>

        <p className="text-muted mb-6">
          {isLoading ? "Validando con DIAN..." : "o haz clic para seleccionar un archivo"}
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleChange}
          className="hidden"
          disabled={isLoading}
        />

        <button
          className={`btn btn-primary px-4 py-2 rounded-lg text-white transition ${
            isLoading ? "opacity-75 cursor-not-allowed" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          disabled={isLoading}
        >
          {isLoading ? "Procesando..." : "Seleccionar Archivo"}
        </button>

        <p className="text-muted text-xs mt-4">
          Formatos aceptados: JSON • Tamaño máximo:{" "}
          {REQUEST_CONFIG.maxFileSize / 1024 / 1024}MB
        </p>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-lg border border-red-400/40 bg-red-500/10 text-red-400 text-sm">
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}
    </>
  );
}
