import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userCourseService } from "@/services/user-course.service";
import { toast } from "@/hooks/use-toast";
import { CreateReviewData, CreateLessonCommentData } from "@/types/course.types";

// User Course hooks
export const useUserCourses = (page = 1, size = 10) => {
  return useQuery({
    queryKey: ["user-courses", page, size],
    queryFn: () => userCourseService.getAllCourses(page, size),
  });
};

export const useUserCourse = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["user-course", id],
    queryFn: () => userCourseService.getCourseById(id),
    enabled: options?.enabled !== undefined ? options.enabled : !!id,
  });
};

// Search
export const useUserSearchCourses = (query: string, page = 1, size = 10) => {
    return useQuery({
        queryKey: ["user-search", query, page, size],
        queryFn: () => userCourseService.searchCourses(query, page, size),
        enabled: !!query,
    });
};

// Dashboard hooks
export const useUserRecommendedCourses = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["recommended-courses"],
    queryFn: () => userCourseService.getRecommendedCourses(),
    enabled: options?.enabled,
  });
};

export const useUserPopularCourses = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["popular-courses"],
    queryFn: () => userCourseService.getPopularCourses(),
    enabled: options?.enabled,
  });
};

export const useUserHistory = () => {
  return useQuery({
    queryKey: ["user-history"],
    queryFn: () => userCourseService.getUserHistory(),
  });
};

// Cart hooks
export const useUserCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: () => userCourseService.getCart(),
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => userCourseService.addToCart(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({
        title: "Success",
        description: "Course added to cart",
      });
    },
    onError: (error: any) => {
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
    mutationFn: (courseId: string) => userCourseService.removeFromCart(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({
        title: "Success",
        description: "Course removed from cart",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to remove from cart",
        variant: "destructive",
      });
    },
  });
};

// Saved courses hooks
export const useUserSavedCourses = () => {
  return useQuery({
    queryKey: ["saved-courses"],
    queryFn: () => userCourseService.getSavedCourses(),
  });
};

export const useAddToSaved = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => userCourseService.addToSaved(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-courses"] });
      toast({
        title: "Success",
        description: "Course saved",
      });
    },
    onError: (error: any) => {
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
    mutationFn: (courseId: string) => userCourseService.removeFromSaved(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-courses"] });
      toast({
        title: "Success",
        description: "Course removed from saved",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to remove from saved",
        variant: "destructive",
      });
    },
  });
};

// Lessons & Reviews
export const useUserWatchLesson = (courseId: string, lessonId: string) => {
  return useQuery({
    queryKey: ["lesson", courseId, lessonId],
    queryFn: () => userCourseService.watchLesson(courseId, lessonId),
    enabled: !!(courseId && lessonId),
  });
};

export const useUserCourseReviews = (courseId: string) => {
  return useQuery({
    queryKey: ["course-reviews", courseId],
    queryFn: () => userCourseService.getCourseReviews(courseId),
    enabled: !!courseId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, reviewData }: { courseId: string; reviewData: CreateReviewData }) => 
        userCourseService.createCourseReview(courseId, reviewData),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ["course-reviews", courseId] });
      toast({
        title: "Success",
        description: "Review submitted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to submit review",
        variant: "destructive",
      });
    },
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
    }) => userCourseService.addLessonComment(courseId, lessonId, commentData),
    onSuccess: (_, { courseId, lessonId }) => {
      queryClient.invalidateQueries({
        queryKey: ["lesson", courseId, lessonId],
      });
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to add comment",
        variant: "destructive",
      });
    },
  });
};
  // Payment
export const useCheckout = () => {
  return useMutation({
    mutationFn: () => userCourseService.checkout(),
    // We don't automatically invalidate queries here because the success flow 
    // depends on the Paystack callback which happens separately.
    // Error handling/Toasts can be managed in the component to allow for custom alerts.
     onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Checkout failed",
        variant: "destructive",
      });
    },
  });
};

export const usePaymentHistory = () => {
  return useQuery({
    queryKey: ["payment-history"],
    queryFn: () => userCourseService.getPaymentHistory(),
  });
};
