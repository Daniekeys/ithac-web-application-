import { httpClient, handleApiResponse, ApiResponse } from "./http";
import { API_ENDPOINTS } from "@/api/endpoints";
import { User } from "@/types/auth";
import { Transaction } from "@/types/transaction.types";

export interface AdminService {
  getUsers: () => Promise<User[]>;
  getUserById: (id: string) => Promise<User>;
  getTransactions: () => Promise<Transaction[]>;
}

export const adminService: AdminService = {
  getUsers: async () => {
    const response = await httpClient.get<ApiResponse<User[]>>(
      API_ENDPOINTS.ADMIN_USERS
    );
    return handleApiResponse(response);
  },

  getUserById: async (id: string) => {
    const response = await httpClient.get<ApiResponse<User>>(
      `${API_ENDPOINTS.ADMIN_USER}/${id}`
    );
    return handleApiResponse(response);
  },

  getTransactions: async () => {
    const response = await httpClient.get<ApiResponse<Transaction[]>>(
      API_ENDPOINTS.ADMIN_TRANSACTIONS
    );
    return handleApiResponse(response);
  },
};
