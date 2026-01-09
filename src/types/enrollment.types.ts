import { Course } from "./course.types";

export interface Enrollment {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  course: Course | string; // Can be populated or just ID
  status: "active" | "completed" | "dropped";
  progress: number; // 0-100
  lastAccessedLesson?: string;
  enrolledAt: string;
  completedAt?: string;
  updatedAt: string;
}

export interface EnrollmentFilter {
  courseId?: string;
  userId?: string;
  status?: "active" | "completed" | "dropped";
  search?: string; // Search by user name or email
}

export interface EnrollmentsResponse {
  success: boolean;
  status: string;
  data: Enrollment[];
  page: number;
  size: number;
  total: number;
}
