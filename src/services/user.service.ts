import { httpClient, handleApiResponse, ApiResponse } from "./http";
import { API_ENDPOINTS } from "@/api/endpoints";
import { User, PasswordUpdateSettings, UserProfileUpdate } from "@/types/auth";
import { useAuthStore } from "@/store/auth.store";

export class UserService {
  // Get current user profile
  async getProfile(): Promise<User> {
    const response = await httpClient.get<ApiResponse<User>>(
      API_ENDPOINTS.USER_PROFILE
    );
    return handleApiResponse(response);
  }

  // Update user profile
  async updateProfile(data: UserProfileUpdate): Promise<User> {
    const response = await httpClient.put<ApiResponse<User>>(
      API_ENDPOINTS.USER_PROFILE,
      data
    );
    const updatedUser = handleApiResponse(response);
    
    // Update local store with new data
    const currentUser = useAuthStore.getState().user;
    const token = useAuthStore.getState().token;
    
    if (currentUser && token) {
      useAuthStore.getState().setUser(updatedUser, token);
    }
    
    return updatedUser;
  }

  // Update password
  async updatePassword(data: PasswordUpdateSettings): Promise<void> {
    const response = await httpClient.post<ApiResponse<void>>(
      API_ENDPOINTS.USER_PASSWORD,
      data
    );
    return handleApiResponse(response);
  }
}

export const userService = new UserService();
