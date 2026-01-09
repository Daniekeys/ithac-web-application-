import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { courseService } from "@/services/course.service";
import { toast } from "@/hooks/use-toast";
import {
  CreateCourseData,
  UpdateCourseData,
  CreateLessonData,
  UpdateLessonData,
  CreateReviewData,
  CreateLessonCommentData,
  Lesson,
} from "@/types/course.types";

// User Course hooks
export const useCourses = (page = 1, size = 10) => {
  return useQuery({
    queryKey: ["courses", page, size],
    queryFn: () => courseService.getAllCourses(page, size),
  });
};

export const useCourse = (id: string) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => courseService.getCourseById(id),
    enabled: !!id,
  });
};

// Dashboard hooks
export const useRecommendedCourses = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["recommended-courses"],
    queryFn: () => courseService.getRecommendedCourses(),
    enabled: options?.enabled,
  });
};

export const usePopularCourses = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["popular-courses"],
    queryFn: () => courseService.getPopularCourses(),
    enabled: options?.enabled,
  });
};

export const useUserHistory = () => {
  return useQuery({
    queryKey: ["user-history"],
    queryFn: () => courseService.getUserHistory(),
  });
};

// Cart hooks
export const useCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: () => courseService.getCart(),
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => courseService.addToCart(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({
        title: "Success",
        description: "Course added to cart",
      });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to add to cart",
        variant: "destructive",
      });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => courseService.removeFromCart(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({
        title: "Success",
        description: "Course removed from cart",
      });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast({
        title: "Error",
        description:
          error?.response?.data?.error || "Failed to remove from cart",
        variant: "destructive",
      });
    },
  });
};

// Saved courses hooks
export const useSavedCourses = () => {
  return useQuery({
    queryKey: ["saved-courses"],
    queryFn: () => courseService.getSavedCourses(),
  });
};

export const useAddToSaved = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => courseService.addToSaved(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-courses"] });
      toast({
        title: "Success",
        description: "Course saved",
      });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to save course",
        variant: "destructive",
      });
    },
  });
};

export const useRemoveFromSaved = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => courseService.removeFromSaved(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-courses"] });
      toast({
        title: "Success",
        description: "Course removed from saved",
      });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast({
        title: "Error",
        description:
          error?.response?.data?.error || "Failed to remove from saved",
        variant: "destructive",
      });
    },
  });
};

// Review hooks
export const useCourseReviews = (courseId: string) => {
  return useQuery({
    queryKey: ["course-reviews", courseId],
    queryFn: () => courseService.getCourseReviews(courseId),
    enabled: !!courseId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      reviewData,
    }: {
      courseId: string;
      reviewData: CreateReviewData;
    }) => courseService.createCourseReview(courseId, reviewData),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ["course-reviews", courseId] });
      toast({
        title: "Success",
        description: "Review submitted successfully",
      });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to submit review",
        variant: "destructive",
      });
    },
  });
};

// Lesson hooks
export const useWatchLesson = (courseId: string, lessonId: string) => {
  return useQuery({
    queryKey: ["lesson", courseId, lessonId],
    queryFn: () => courseService.watchLesson(courseId, lessonId),
    enabled: !!(courseId && lessonId),
  });
};

export const useAddLessonComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      lessonId,
      commentData,
    }: {
      courseId: string;
      lessonId: string;
      commentData: CreateLessonCommentData;
    }) => courseService.addLessonComment(courseId, lessonId, commentData),
    onSuccess: (_, { courseId, lessonId }) => {
      queryClient.invalidateQueries({
        queryKey: ["lesson", courseId, lessonId],
      });
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to add comment",
        variant: "destructive",
      });
    },
  });
};

// Admin Course Management hooks
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseData: CreateCourseData) =>
      courseService.adminCreateCourse(courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast({
        title: "Success",
        description: "Course created successfully",
      });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to create course",
        variant: "destructive",
      });
    },
  });
};
export const useAdminCourses = (page = 1, size = 10) => {
  return useQuery({
    queryKey: ["admin-courses", page, size],
    queryFn: () => courseService.adminGetAllCourses(page, size),
  });
};

export const useAdminCourse = (id: string) => {
  return useQuery({
    queryKey: ["admin-course", id],
    queryFn: () => courseService.adminGetCourseById(id),
    enabled: !!id,
  });
};

export const useAdminCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseData: CreateCourseData) =>
      courseService.adminCreateCourse(courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast({
        title: "Success",
        description: "Course created successfully",
      });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to create course",
        variant: "destructive",
      });
    },
  });
};

export const useAdminUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      courseData,
    }: {
      id: string;
      courseData: UpdateCourseData;
    }) => courseService.adminUpdateCourse(id, courseData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      queryClient.invalidateQueries({ queryKey: ["admin-course", id] });
      toast({
        title: "Success",
        description: "Course updated successfully",
      });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to update course",
        variant: "destructive",
      });
    },
  });
};

export const useAdminDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => courseService.adminDeleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast({
        title: "Success",
        description: "Course deleted successfully",
      });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to delete course",
        variant: "destructive",
      });
    },
  });
};

// Admin Lesson Management hooks
export const useAdminCourseLessons = (courseId: string) => {
  return useQuery({
    queryKey: ["admin-course-lessons", courseId],
    queryFn: () => courseService.adminGetCourseLessons(courseId),
    enabled: !!courseId,
  });
};

export const useAdminLesson = (courseId: string, lessonId: string) => {
  return useQuery({
    queryKey: ["admin-lesson", courseId, lessonId],
    queryFn: () => courseService.adminGetLessonById(courseId, lessonId),
    enabled: !!(courseId && lessonId),
  });
};

export const useAdminCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      lessonData,
    }: {
      courseId: string;
      lessonData: CreateLessonData;
    }) => courseService.adminCreateLesson(courseId, lessonData),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-course-lessons", courseId],
      });
      toast({
        title: "Success",
        description: "Lesson created successfully",
      });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to create lesson",
        variant: "destructive",
      });
    },
  });
};

export const useAdminUpdateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      lessonId,
      lessonData,
    }: {
      courseId: string;
      lessonId: string;
      lessonData: UpdateLessonData;
    }) => courseService.adminUpdateLesson(courseId, lessonId, lessonData),
    onSuccess: (_, { courseId, lessonId }) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-course-lessons", courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-lesson", courseId, lessonId],
      });
      toast({
        title: "Success",
        description: "Lesson updated successfully",
      });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to update lesson",
        variant: "destructive",
      });
    },
  });
};

export const useAdminDeleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      lessonId,
    }: {
      courseId: string;
      lessonId: string;
    }) => courseService.adminDeleteLesson(courseId, lessonId),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-course-lessons", courseId],
      });
      toast({
        title: "Success",
        description: "Lesson deleted successfully",
      });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to delete lesson",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseData }) =>
      courseService.adminUpdateCourse(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", variables.id] });
      toast({
        title: "Success",
        description: "Course updated successfully",
      });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to update course",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => courseService.adminDeleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast({
        title: "Success",
        description: "Course deleted successfully",
      });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to delete course",
        variant: "destructive",
      });
    },
  });
};

// Lesson hooks
export const useCourseLessons = (courseId: string) => {
  return useQuery({
    queryKey: ["lessons", courseId],
    queryFn: () => courseService.getCourseLessons(courseId),
    enabled: !!courseId,
  });
};

export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      lessonData,
    }: {
      courseId: string;
      lessonData: CreateLessonData;
    }) => courseService.adminCreateLesson(courseId, lessonData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["lessons", variables.courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["course", variables.courseId],
      });
      toast({
        title: "Success",
        description: "Lesson created successfully",
      });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to create lesson",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      lessonId,
      lessonData,
    }: {
      courseId: string;
      lessonId: string;
      lessonData: UpdateLessonData;
    }) => courseService.adminUpdateLesson(courseId, lessonId, lessonData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      toast({
        title: "Success",
        description: "Lesson updated successfully",
      });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to update lesson",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      lessonId,
    }: {
      courseId: string;
      lessonId: string;
    }) => courseService.adminDeleteLesson(courseId, lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      toast({
        title: "Success",
        description: "Lesson deleted successfully",
      });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to delete lesson",
        variant: "destructive",
      });
    },
  });
};

export const useAdminReorderLessons = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      lessons,
    }: {
      courseId: string;
      lessons: Lesson[];
    }) => courseService.reorderLessons(courseId, lessons),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-course-lessons", courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["lessons", courseId],
      });
      toast({
        title: "Success",
        description: "Lessons reordered successfully",
      });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to reorder lessons",
        variant: "destructive",
      });
    },
  });
};
