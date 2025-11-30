"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useValidateDIAN from "@/src/home/services/useValidateDIAN";

export default function ValidationPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const { validateFile, isLoading, error: validationError } = useValidateDIAN();

  const handleFile = (file: File) => {
    if (!file.name.endsWith(".json")) {
      setError("Por favor selecciona un archivo JSON válido");
      setFile(null);
      return;
    }
    setError("");
    setFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFile(dropped);
  };

  const handleUpload = async () => {
    if (!file) return setError("Por favor selecciona un archivo");

    try {
      setError("");
      const response = await validateFile(file);

      if (response?.success && response.data) {
        // Redirigir a la página de resultados con el ID de la validación guardada
        router.push(`/validation/results?id=${response.data.savedRecord.id}`);
      } else {
        setError(response?.error || "Error al procesar la validación");
      }
    } catch {
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div className="p-6 text-white">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Validación de Facturas DIAN</h1>
        <p className="text-gray-400">Sube tu factura en formato JSON para validar</p>
      </header>

      <div className="max-w-xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">Cargar Factura</h2>
          <p className="text-gray-400 text-sm mt-1">Selecciona un archivo JSON para validar</p>
        </div>

        {/* Upload area */}
        <label
          htmlFor="file"
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center h-56 border-2 border-dashed rounded-xl cursor-pointer transition
            ${dragActive ? "border-blue-400 bg-blue-500/20" : file ? "border-blue-500 bg-blue-500/10" : "border-gray-600 hover:border-blue-500 hover:bg-gray-700/50"}`}
        >
          <div className="flex flex-col items-center">
            <span className="text-6xl mb-3">{file ? "📄" : "📁"}</span>
            <p className="text-sm text-gray-300">
              <span className="font-semibold">{file ? file.name : "Click para seleccionar"}</span>
              {!file && " o arrastra el archivo"}
            </p>
            <p className="text-xs text-gray-500 mt-1">Solo archivos JSON (máx. 10MB)</p>
          </div>

          <input
            id="file"
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            disabled={isLoading}
          />
        </label>

        {(error || validationError) && (
          <div className="mt-4 p-3 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg text-sm">
            ⚠️ {error || validationError}
          </div>
        )}

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={!file || isLoading}
          className={`w-full mt-6 py-3 rounded-lg font-semibold transition bg-blue-600 hover:bg-blue-700
            ${isLoading || !file ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLoading ? "Procesando..." : "Iniciar Validación"}
        </button>

        <div className="mt-4 p-3 text-gray-400 bg-blue-400/10 border border-blue-400/20 rounded-lg text-sm">
          ℹ️ El archivo será enviado al servicio de validación para su análisis según la normativa DIAN CT-COA-0124
        </div>
      </div>

      {/* Back */}
      <div className="mt-6 text-center">
        <button className="text-gray-300 hover:text-white" onClick={() => router.push("/")}> ← Volver al Dashboard </button>
      </div>
    </div>
  );
}
