import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { BASE_URL } from "@/api/endpoints";

import { useAuthStore } from "@/store/auth.store";

// HTTP client configuration
const createHttpClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    withCredentials: true, // Enable cookies for httpOnly tokens
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Add Authorization header from store if available
      const token = useAuthStore.getState().token;
      console.log("[http] Request interceptor - Token available:", !!token, "URL:", config.url);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Check for action in success response
      if (response.data && response.data.action?.toLowerCase() === "onboard") {
         if (typeof window !== "undefined") {
            const userType = sessionStorage.getItem("userType");
            // Only redirect to onboarding if userType is explicitly 'user'
            if (userType === 'user') {
                 window.location.href = "/onboarding";
            }
         }
      }
      return response;
    },
    async (error: AxiosError) => {
      // @ts-ignore
      if (error.response?.data?.action === "onboard" || error.response?.data?.action?.toLowerCase() === "onboard") {
          if (typeof window !== "undefined") {
            const userType = sessionStorage.getItem("userType");
            // Only redirect to onboarding if userType is explicitly 'user'
            if (userType === 'user') {
                window.location.href = "/onboarding";
                return Promise.reject(error);
            }
          }
      }

      if (error.response?.status === 401) {
        // Special case: If history endpoint returns 401, it means user is not onboarded
        if (error.config?.url?.includes("/user/dashboard/history")) {
             if (typeof window !== "undefined") {
                 const userType = sessionStorage.getItem("userType");
                 // Only redirect to onboarding if userType is explicitly 'user'
                 if (userType === 'user') {
                    window.location.href = "/onboarding";
                    return Promise.reject(error);
                 }
                 // If not user (e.g. admin), do not redirect to onboarding, just reject
                 return Promise.reject(error);
             }
        }
        
        // Handle unauthorized - redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }

      if (error.response?.status === 403) {
        // Handle forbidden - show error message
        console.error("Access forbidden");
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const httpClient = createHttpClient();
console.log("[httpClient] baseURL:", httpClient.defaults.baseURL);

// API response types based on Postman documentation
export interface ApiResponse<T = any> {
  success: boolean;
  status: string;
  error?: string;
  body?: T;
  token?: string;
  action?: Record<string, any>;
}

// Helper function to handle API responses
export const handleApiResponse = <T>(
  response: AxiosResponse<ApiResponse<T>>
): T => {
  const { data } = response;

  if (!data.success) {
    throw new Error(data.error || "API request failed");
  }

  return (data.body || data) as T;
};
