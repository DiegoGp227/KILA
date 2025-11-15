"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StepsSistem from "@/app/components/organism/StepsSistem";
import ProcessingSpinner from "@/app/components/atoms/ProcessingSpinner";
import ProgressBar from "@/app/components/atoms/ProgressBar";
import ValidationStep from "@/app/components/molecules/ValidationStep";

const validationSteps = [
  { id: 1, title: "Estructura del archivo JSON", duration: 800, validates: "JSON format" },
  { id: 2, title: "Datos del proveedor", duration: 1200, validates: "supplier fields" },
  { id: 3, title: "Datos del importador", duration: 1200, validates: "customer fields" },
  { id: 4, title: "Información de factura", duration: 1000, validates: "invoice fields" },
  { id: 5, title: "Detalle de items", duration: 1500, validates: "items validation" },
  { id: 6, title: "Información de transporte", duration: 800, validates: "transport fields" },
  { id: 7, title: "Validaciones numéricas", duration: 1000, validates: "numeric validations" },
];

export default function ProcessingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const validationId = searchParams.get("id");
  const filename = searchParams.get("filename") || "factura.json";

  useEffect(() => {
    // Redirect if no validation ID
    if (!validationId) {
      router.push("/validation/home");
      return;
    }

    if (currentStep >= validationSteps.length) {
      // All steps completed
      setProgress(100);
      setTimeout(() => {
        router.push(`/validation/results?id=${validationId}`);
      }, 1000);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
      setProgress(Math.min(100, ((currentStep + 1) / validationSteps.length) * 100));
    }, validationSteps[currentStep].duration);

    return () => clearTimeout(timer);
  }, [currentStep, router, validationId]);

  const getStepStatus = (index: number) => {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "active";
    return "pending";
  };

  return (
    <div className="main-content">
      {/* Breadcrumbs */}
      <div className="flex gap-2 mb-8 justify-center items-center text-secondary-400">
        <span className="breadcrumb-item">Validación DIAN</span>
        <span>/</span>
        <span className="breadcrumb-item active text-primary-500 font-semibold">
          Procesando
        </span>
      </div>

      {/* Timeline Steps */}
      <StepsSistem StepActive={2} />

      {/* Main Content */}
      <div className="max-w-3xl mx-auto">
        <div className="card fade-in">
          <div className="card-header text-center">
            <h1 className="card-title text-2xl">Validando Factura</h1>
            <p className="text-secondary-400 text-sm mt-2">
              factura_importacion_2024_001.json
            </p>
          </div>

          <div className="card-body">
            {/* Processing Animation */}
            <ProcessingSpinner icon="🔍" size="lg" />

            {/* Progress Bar */}
            <ProgressBar progress={progress} animated />

            {/* Validation Steps */}
            <div className="mt-8">
              <h3 className="text-white text-base font-semibold mb-4">
                Validaciones en Proceso
              </h3>

              <div className="space-y-2">
                {validationSteps.map((step, index) => (
                  <ValidationStep
                    key={step.id}
                    title={step.title}
                    status={getStepStatus(index)}
                    statusMessage={
                      index === currentStep
                        ? `Validando ${step.title.toLowerCase()}...`
                        : undefined
                    }
                  />
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="mt-8 p-4 bg-info/10 border border-info/20 rounded-lg text-center">
              <p className="text-secondary-400 text-sm">
                ⚡ Este proceso puede tomar entre 10 a 30 segundos
              </p>
            </div>
          </div>
        </div>

        {/* Cancel Button */}
        <div className="mt-6 text-center">
          <button
            className="btn btn-ghost"
            onClick={() => router.push("/validation")}
          >
            Cancelar Validación
          </button>
        </div>
      </div>
    </div>
  );
}
