import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/services/http";
import { API_ENDPOINTS } from "@/api/endpoints";
import { UserResponse, SingleUserResponse } from "@/types/user.types";

export const useAdminUsers = (
  page: number = 1,
  size: number = 10,
  search?: string,
  sortBy?: string
) => {
  return useQuery({
    queryKey: ["admin-users", page, size, search, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });

      if (search) {
        params.append("keyword", search);
      }
      
      if (sortBy) {
        params.append("sortBy", sortBy);
        params.append("sortOrder", "asc"); // Defaulting to asc for now, can be made dynamic
      }

      // Assuming the API endpoint is /admin/users based on the request
      // But using the one defined in endpoints.ts for proxy/consistency
      const response = await httpClient.get<UserResponse>(
        `${API_ENDPOINTS.ADMIN_USERS}?${params.toString()}`
      );
      return response.data;
    },
  });
};

export const useAdminUser = (id: string) => {
  return useQuery({
    queryKey: ["admin-user", id],
    queryFn: async () => {
      const response = await httpClient.get<SingleUserResponse>(
        `${API_ENDPOINTS.ADMIN_USER}/${id}`
      );
      return response.data;
    },
    enabled: !!id,
  });
};
