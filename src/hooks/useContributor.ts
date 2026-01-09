import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/services/http";
import { API_ENDPOINTS } from "@/api/endpoints";
import {
  ContributorResponse,
  SingleContributorResponse,
  CreateContributorDTO,
  UpdateContributorDTO,
} from "@/types/contributor.types";

export const useAdminContributors = (
  page: number = 1,
  size: number = 10,
  search?: string,
  sortBy?: string
) => {
  return useQuery({
    queryKey: ["admin-contributors", page, size, search, sortBy],
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
        params.append("sortOrder", "asc");
      }

      const response = await httpClient.get<ContributorResponse>(
        `${API_ENDPOINTS.CONTRIBUTORS}?${params.toString()}`
      );
      return response.data;
    },
  });
};

export const useAdminContributor = (id: string) => {
  return useQuery({
    queryKey: ["admin-contributor", id],
    queryFn: async () => {
      // The proxy endpoint handles mapping /api/contributors/[id] to /contributor/detail/[id]
      const response = await httpClient.get<SingleContributorResponse>(
        `${API_ENDPOINTS.CONTRIBUTORS}/${id}`
      );
      return response.data;
    },
    enabled: !!id,
  });
};

export const useAdminCreateContributor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateContributorDTO) => {
      const response = await httpClient.post(API_ENDPOINTS.CONTRIBUTORS, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contributors"] });
    },
  });
};

export const useAdminUpdateContributor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateContributorDTO }) => {
      const response = await httpClient.put(`${API_ENDPOINTS.CONTRIBUTORS}/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contributors"] });
      queryClient.invalidateQueries({ queryKey: ["admin-contributor"] });
    },
  });
};

export const useAdminDeleteContributor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await httpClient.delete(`${API_ENDPOINTS.CONTRIBUTORS}/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contributors"] });
    },
  });
};

