import { httpClient } from "./http";
import { API_ENDPOINTS } from "@/api/endpoints";
import {
  CoursesResponse,
  CourseDetailResponse,
  LessonWatchResponse,
  UserDashboardResponse,
  PopularCoursesResponse,
  SavedCoursesResponse,
  CartResponse,
  ReviewResponse,
  ApiResponse,
  CreateReviewData,
  CreateLessonCommentData
} from "@/types/course.types";

export const userCourseService = {
  // Get all courses (User view)
  getAllCourses: async (page = 1, size = 10): Promise<CoursesResponse> => {
    const response = await httpClient.get(
      `/api/user/courses?page=${page}&size=${size}`
    );
    return response.data;
  },

  // Get single course (User view)
  getCourseById: async (id: string): Promise<CourseDetailResponse> => {
    const response = await httpClient.get(
      `/api/user/courses/${id}`
    );
    return response.data;
  },

  // Dashboard endpoints
  getRecommendedCourses: async (): Promise<UserDashboardResponse> => {
    const response = await httpClient.get("/api/user/dashboard/recommend");
    return response.data;
  },

  getPopularCourses: async (): Promise<PopularCoursesResponse> => {
    const response = await httpClient.get("/api/user/dashboard/popular");
    return response.data;
  },

  getUserHistory: async (): Promise<CoursesResponse> => {
    const response = await httpClient.get("/api/user/dashboard/history");
    return response.data;
  },

  // Search
  searchCourses: async (
    query: string,
    page = 1,
    size = 10
  ): Promise<CoursesResponse> => {
    const response = await httpClient.get(
      `/api/user/courses?search=${encodeURIComponent(
        query
      )}&page=${page}&size=${size}`
    );
    return response.data;
  },

  // Enrolled/Saved/Cart/Reviews would go here too if we fully separate.
  // Including some key ones mentioned in previous context:
  
  // Cart
   getCart: async (): Promise<CartResponse> => {
    const response = await httpClient.get("/api/user/cart");
    return response.data;
  },

  addToCart: async (courseId: string): Promise<ApiResponse> => {
    const response = await httpClient.post("/api/user/cart", { id: courseId });
    return response.data;
  },

  removeFromCart: async (courseId: string): Promise<ApiResponse> => {
    const response = await httpClient.delete(`/api/user/cart/${courseId}`);
    return response.data;
  },

  // Saved
  getSavedCourses: async (): Promise<SavedCoursesResponse> => {
    const response = await httpClient.get("/api/user/save");
    return response.data;
  },
  
  addToSaved: async (courseId: string): Promise<ApiResponse> => {
     const response = await httpClient.post("/api/user/save", { id: courseId });
     return response.data;
  },

  removeFromSaved: async (courseId: string): Promise<ApiResponse> => {
      const response = await httpClient.put("/api/user/save", { id: courseId });
      return response.data;
  },

  // Lessons & Reviews
  watchLesson: async (courseId: string, lessonId: string): Promise<LessonWatchResponse> => {
    const response = await httpClient.get(`/api/user/lesson/${courseId}/${lessonId}`);
    return response.data;
  },

  getCourseReviews: async (courseId: string): Promise<ReviewResponse> => {
      const response = await httpClient.get(`/api/review/${courseId}`);
      return response.data;
  },

  createCourseReview: async (courseId: string, reviewData: CreateReviewData): Promise<ApiResponse> => {
      const response = await httpClient.post(`/api/user/review/${courseId}`, reviewData);
      return response.data;
  },
  
  addLessonComment: async (
    courseId: string,
    lessonId: string,
    commentData: CreateLessonCommentData
  ): Promise<ApiResponse> => {
    const response = await httpClient.post(
      `/api/user/lesson/${courseId}/${lessonId}/comment`,
      commentData
    );
    return response.data;
  },

  // Payment
  checkout: async (): Promise<any> => {
     const response = await httpClient.get("/api/user/checkout");
     return response.data;
  },

  getPaymentHistory: async (): Promise<any> => {
      const response = await httpClient.get("/api/user/payment");
      return response.data;
  }
};
