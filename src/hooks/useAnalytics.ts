import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/services/http";
import { CourseAnalytics, SystemAnalytics } from "@/types/analytics.types";

export const useAdminAnalytics = () => {
  return useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const response = await httpClient.get<{
        success: boolean;
        data: SystemAnalytics;
      }>("/admin/analytics");
      return response.data.data;
    },
  });
};

export const useCourseAnalytics = (courseId: string) => {
  return useQuery({
    queryKey: ["course-analytics", courseId],
    queryFn: async () => {
      const response = await httpClient.get<{
        success: boolean;
        data: CourseAnalytics;
      }>(`/admin/analytics?courseId=${courseId}`);
      return response.data.data;
    },
    enabled: !!courseId,
  });
};
