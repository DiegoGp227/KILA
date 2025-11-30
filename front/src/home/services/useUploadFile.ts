import { useState, useCallback } from "react";
import { postFetcher } from "@/src/utils/utils";
import { validationJson } from "@/src/shared/constants/urls";

export default function useUploadFile() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const url = validationJson.toString();

      const formData = new FormData();
      formData.append("file", file);

      const response = await postFetcher(
        url,
        formData,
        undefined 
      );

      return response;

    } catch (err: unknown) {
      let errorMessage = "Ocurrió un error inesperado al subir el archivo.";

      if (err && typeof err === "object" && "response" in err) {
        const errorObj = err as {
          response?: { status?: number; data?: { message?: string } };
          request?: unknown;
        };

        if (errorObj.response) {
          switch (errorObj.response.status) {
            case 400:
              errorMessage = "Archivo inválido o parámetros incorrectos.";
              break;
            case 401:
              errorMessage = "No autorizado. Inicia sesión nuevamente.";
              break;
            case 500:
              errorMessage = "Error del servidor. Inténtalo más tarde.";
              break;
            default:
              errorMessage = errorObj.response.data?.message || errorMessage;
          }
        } else if (errorObj.request) {
          errorMessage = "Error de conexión. Verifica tu conexión a internet.";
        }
      }

      setError(errorMessage);
      throw new Error(errorMessage);

    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    uploadFile,
  };
}
