import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/services/http";
import { EnrollmentsResponse, Enrollment } from "@/types/enrollment.types";

export const useAdminEnrollments = (
  page: number = 1,
  size: number = 10,
  search?: string,
  courseId?: string
) => {
  return useQuery({
    queryKey: ["admin-enrollments", page, size, search, courseId],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });

      if (search) params.append("search", search);
      if (courseId) params.append("courseId", courseId);

      const response = await httpClient.get<EnrollmentsResponse>(
        `/admin/enrollments?${params.toString()}`
      );
      return response.data;
    },
  });
};

export const useAdminEnrollUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { userId: string; courseId: string }) => {
      const response = await httpClient.post("/admin/enrollments", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-enrollments"] });
    },
  });
};

export const useAdminRemoveEnrollment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await httpClient.delete(`/admin/enrollments/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-enrollments"] });
    },
  });
};

export const useUserProgress = (userId: string, courseId: string) => {
  return useQuery({
    queryKey: ["user-progress", userId, courseId],
    queryFn: async () => {
      const response = await httpClient.get<Enrollment>(
        `/admin/enrollments/progress?userId=${userId}&courseId=${courseId}`
      );
      return response.data;
    },
    enabled: !!userId && !!courseId,
  });
};

export const useAdminUpdateEnrollment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string; data: Partial<Enrollment> }) => {
      const response = await httpClient.put(`/admin/enrollments/${vars.id}`, vars.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-enrollments"] });
    },
  });
};
