
import apiClient from "@/src/shared/services/apiClient";
import { AxiosError } from "axios";

export const fetcher = async <T>(url: string): Promise<T> => {
  try {
    const response = await apiClient.get<T>(url); 
    return response.data; 
  } catch (error: unknown) {
    const status = (error as AxiosError).response?.status || "unknown";
    const errorMessage = `An error occurred while fetching the data from ${url} with status ${status}`;

    const errorDetails =
      (error as AxiosError).response?.data || "No additional error information";

    const customError = new Error(errorMessage) as Error & {
      details?: unknown;
    };
    customError.details = errorDetails;
    throw customError;
  }
};

export const postFetcher = async <T>(
  url: string,
  params: Record<string, any> | FormData,
  contentType?: string
): Promise<T> => {
  try {
    const response = await apiClient.post<T>(url, params, {
      headers: {
        "Content-Type": contentType ? contentType : "application/json",
      },
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;

    console.error(`Error in postFetcher for ${url}:`, axiosError);

    throw axiosError;
  }
};

export const deleteFetcher = async (
  url: string, 
  contentType?: string 
) => {
  try {
    const response = await apiClient.delete(url, {
      headers: {
        "Content-Type": contentType ? contentType : "application/json",
      },
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;

    console.error(`Error in deleteFetcher for ${url}:`, axiosError);

    throw axiosError;
  }
};

export const putFetcher = async <T>(
  url: string, 
  params: Record<string, any> | FormData, 
  contentType?: string 
): Promise<T> => {
  try {
    const response = await apiClient.put<T>(url, params, {
      headers: {
        "Content-Type": contentType ? contentType : "application/json",
      },
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;

    console.error(`Error in putFetcher for ${url}:`, axiosError);

    throw axiosError;
  }
};
