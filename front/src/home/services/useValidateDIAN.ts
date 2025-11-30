import { useState, useCallback } from "react";

// Interfaces basadas en la respuesta del backend
interface ValidationError {
  field: string;
  message: string;
  section: string;
  severity: "error" | "warning";
  requirementNumber?: number;
  allowsPartialCompliance?: boolean;
  source?: "frontend" | "backend" | "merged";
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  source: string;
}

interface SavedRecord {
  id: number;
  invoiceId: string;
  userId: number | null;
  validationDate: string;
  passed: boolean;
  errorCount: number;
  warningCount: number;
}

interface DIANValidationResponse {
  status: "success" | "error";
  message: string;
  data?: {
    validation: ValidationResult;
    savedRecord: SavedRecord;
  };
  code?: string;
  details?: any;
}

export default function useValidateDIAN() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      // Obtener token del localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No hay sesión activa. Por favor inicia sesión.");
      }

      // Preparar FormData
      const formData = new FormData();
      formData.append("file", file);

      // Llamar al endpoint
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api-kila.devdiego.work";
      const response = await fetch(`${baseUrl}/api/validation`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result: DIANValidationResponse = await response.json();

      // Manejar errores del backend
      if (!response.ok || result.status === "error") {
        throw new Error(result.message || "Error al validar la factura");
      }

      return {
        success: true,
        data: result.data,
        message: result.message,
      };
    } catch (err: any) {
      const errorMessage = err.message || "Error al validar la factura";
      setError(errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    validateFile,
  };
}
