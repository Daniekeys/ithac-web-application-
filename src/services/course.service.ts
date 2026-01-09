import { httpClient } from "./http";
import { API_ENDPOINTS } from "@/api/endpoints";
import {
  Course,
  CreateCourseData,
  UpdateCourseData,
  CreateLessonData,
  UpdateLessonData,
  CoursesResponse,
  CourseDetailResponse,
  PopularCoursesResponse,
  UserDashboardResponse,
  CartResponse,
  ReviewResponse,
  SavedCoursesResponse,
  LessonWatchResponse,
  CreateReviewData,
  CreateLessonCommentData,
  ApiResponse,
  Lesson,
} from "@/types/course.types";

export const courseService = {
  // User Course operations (Based on Users section in Postman)
  getAllCourses: async (page = 1, size = 10): Promise<CoursesResponse> => {
    const response = await httpClient.get(
      `${API_ENDPOINTS.COURSES}?page=${page}&size=${size}`
    );
    console.log(`${API_ENDPOINTS.COURSES}?page=${page}&size=${size}`);
    return response.data;
  },

  getCourseById: async (id: string): Promise<CourseDetailResponse> => {
    const response = await httpClient.get(
      `${API_ENDPOINTS.COURSE_DETAIL}/${id}`
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

  // Cart operations
  addToCart: async (courseId: string): Promise<ApiResponse> => {
    const response = await httpClient.post("/api/user/cart", {
      id: courseId,
    });
    return response.data;
  },

  getCart: async (): Promise<CartResponse> => {
    const response = await httpClient.get("/api/user/cart");
    return response.data;
  },

  removeFromCart: async (courseId: string): Promise<ApiResponse> => {
    const response = await httpClient.delete(`/api/user/cart/${courseId}`);
    return response.data;
  },

  // Saved courses operations
  addToSaved: async (courseId: string): Promise<ApiResponse> => {
    const response = await httpClient.post("/api/user/save", {
      id: courseId,
    });
    return response.data;
  },

  removeFromSaved: async (courseId: string): Promise<ApiResponse> => {
    const response = await httpClient.put("/api/user/save", {
      id: courseId,
    });
    return response.data;
  },

  getSavedCourses: async (): Promise<SavedCoursesResponse> => {
    const response = await httpClient.get("/api/user/save");
    return response.data;
  },

  // Review operations
  getCourseReviews: async (courseId: string): Promise<ReviewResponse> => {
    const response = await httpClient.get(`/api/review/${courseId}`);
    return response.data;
  },

  createCourseReview: async (
    courseId: string,
    reviewData: CreateReviewData
  ): Promise<ApiResponse> => {
    const response = await httpClient.post(`/api/user/review/${courseId}`, reviewData);
    return response.data;
  },

  // Lesson operations
  watchLesson: async (
    courseId: string,
    lessonId: string
  ): Promise<LessonWatchResponse> => {
    const response = await httpClient.get(
      `/api/user/lesson/${courseId}/${lessonId}`
    );
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

  // Admin Course Management operations (Based on Admin section in Postman)
  // Admin - Create Course
  adminCreateCourse: async (
    courseData: CreateCourseData
  ): Promise<ApiResponse<Course>> => {
    const response = await httpClient.post("/api/admin/courses", courseData);
    return response.data;
  },

  // Admin - Get all courses
  adminGetAllCourses: async (page = 1, size = 10): Promise<CoursesResponse> => {
    const response = await httpClient.get(
      `/api/admin/courses?page=${page}&size=${size}`
    );
    return response.data;
  },

  // Admin - Get single course
  adminGetCourseById: async (id: string): Promise<CourseDetailResponse> => {
    const response = await httpClient.get(`/api/courses/${id}`);
    return response.data;
  },

  // Admin - Update Course
  adminUpdateCourse: async (
    id: string,
    courseData: UpdateCourseData
  ): Promise<ApiResponse<Course>> => {
    const response = await httpClient.put(`/api/admin/courses/${id}`, courseData);
    return response.data;
  },

  // Admin - Delete Course
  adminDeleteCourse: async (id: string): Promise<ApiResponse> => {
    const response = await httpClient.delete(`/api/admin/courses/${id}`);
    return response.data;
  },

  // Admin Lesson Management
  // Admin - Create Lesson
  adminCreateLesson: async (
    courseId: string,
    lessonData: CreateLessonData
  ): Promise<ApiResponse<Lesson>> => {
    const response = await httpClient.post(
      `/api/admin/courses/${courseId}/lessons`,
      lessonData
    );
    return response.data;
  },

  // Admin - Get course lessons
  adminGetCourseLessons: async (courseId: string): Promise<ApiResponse<Lesson[]>> => {
    const response = await httpClient.get(`/api/admin/courses/${courseId}/lessons`);
    return response.data;
  },

  // Admin - Get single lesson
  adminGetLessonById: async (
    courseId: string,
    lessonId: string
  ): Promise<ApiResponse<Lesson>> => {
    const response = await httpClient.get(
      `/api/admin/courses/${courseId}/lessons/${lessonId}`
    );
    return response.data;
  },

  // Admin - Update Lesson
  adminUpdateLesson: async (
    courseId: string,
    lessonId: string,
    lessonData: UpdateLessonData
  ): Promise<ApiResponse<Lesson>> => {
    const response = await httpClient.put(
      `/api/admin/courses/${courseId}/lessons/${lessonId}`,
      lessonData
    );
    return response.data;
  },

  // Admin - Delete Lesson
  adminDeleteLesson: async (
    courseId: string,
    lessonId: string
  ): Promise<ApiResponse> => {
    const response = await httpClient.delete(
      `/api/admin/courses/${courseId}/lessons/${lessonId}`
    );
    return response.data;
  },
   

  // Admin - Reorder Lessons
  reorderLessons: async (
    courseId: string,
    lessons: Lesson[]
  ): Promise<void> => {
    // Process updates in sequence or parallel
    // Using parallel for better performance, but backend might have rate limits
    const updatePromises = lessons.map((lesson, index) => {
      const newPosition = index + 1;
      // Only update if position has changed
      if (lesson.position !== newPosition) {
        return courseService.adminUpdateLesson(courseId, lesson._id, {
          position: newPosition,
        });
      }
      return Promise.resolve();
    });

    await Promise.all(updatePromises);
  },

  deleteCourse: async (id: string): Promise<ApiResponse> => {
    const response = await httpClient.delete(
      `${API_ENDPOINTS.COURSE_DETAIL}/${id}`
    );
    return response.data;
  },

  // Lesson CRUD operations
  getCourseLessons: async (
    courseId: string
  ): Promise<ApiResponse<any>> => {
    const response = await httpClient.get(
      `${API_ENDPOINTS.COURSE_LESSONS}/${courseId}/lessons`
    );
    return response.data;
  },

  createLesson: async (
    courseId: string,
    lessonData: CreateLessonData
  ): Promise<ApiResponse<Lesson>> => {
    const response = await httpClient.post(
      `${API_ENDPOINTS.COURSE_LESSONS}/${courseId}/lessons`,
      lessonData
    );
    return response.data;
  },

  updateLesson: async (
    courseId: string,
    lessonId: string,
    lessonData: UpdateLessonData
  ): Promise<ApiResponse<Lesson>> => {
    const response = await httpClient.put(
      `${API_ENDPOINTS.COURSE_LESSONS}/${courseId}/lessons/${lessonId}`,
      lessonData
    );
    return response.data;
  },

  deleteLesson: async (
    courseId: string,
    lessonId: string
  ): Promise<ApiResponse> => {
    const response = await httpClient.delete(
      `${API_ENDPOINTS.COURSE_LESSONS}/${courseId}/lessons/${lessonId}`
    );
    return response.data;
  },

  // Additional endpoints
  searchCourses: async (
    query: string,
    page = 1,
    size = 10
  ): Promise<CoursesResponse> => {
    const response = await httpClient.get(
      `${API_ENDPOINTS.COURSES}/search?q=${encodeURIComponent(
        query
      )}&page=${page}&size=${size}`
    );
    return response.data;
  },
};
