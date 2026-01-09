import { httpClient, handleApiResponse, ApiResponse } from "./http";
import { API_ENDPOINTS } from "@/api/endpoints";
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from "@/types/auth";
import { useAuthStore } from "@/store/auth.store";

// Authentication service
export class AuthService {
  // User login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await httpClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.LOGIN,
      credentials
    );
    const data = handleApiResponse(response);
    // Store user and token in session storage
    useAuthStore.getState().setUser(data.user, data.token);
    return data;
  }

  // User registration
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await httpClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.REGISTER,
      credentials
    );
    const data = handleApiResponse(response);
    // Store user and token in session storage
    useAuthStore.getState().setUser(data.user, data.token);
    return data;
  }

  // Admin login
  async adminLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await httpClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.ADMIN_LOGIN,
      credentials
    );
    const data = handleApiResponse(response);
    // Store user and token in session storage
    useAuthStore.getState().setUser(data.user, data.token);
    return data;
  }

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    const response = await httpClient.get<ApiResponse<User>>(
      API_ENDPOINTS.USER_PROFILE
    );
    return handleApiResponse(response);
  }

  // Get admin profile
  async getAdminProfile(): Promise<User> {
    console.log(
      "🔍 AuthService.getAdminProfile - Making request to:",
      API_ENDPOINTS.ADMIN_PROFILE
    );
    const response = await httpClient.get<ApiResponse<User>>(
      API_ENDPOINTS.ADMIN_PROFILE
    );
    console.log(
      "✅ AuthService.getAdminProfile - Response received:",
      response.data
    );
    return handleApiResponse(response);
  }

  // Logout (clear cookies server-side)
  async logout(): Promise<void> {
    try {
      // Call the logout endpoint to clear httpOnly cookies
      await httpClient.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local state
      useAuthStore.getState().clearUser();
      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }
}

export const authService = new AuthService();
