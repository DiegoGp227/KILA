"use client";
import { useRef, useState } from "react";

export default function UploadSistem() {
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

  return (
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
  );
}
