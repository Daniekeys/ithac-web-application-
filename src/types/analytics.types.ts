export interface CourseAnalytics {
  courseId: string;
  title: string;
  enrolledCount: number;
  activeLearners: number;
  completionRate: number; // Percentage
  averageRating: number;
  totalReviews: number;
  lessonEngagement: {
    lessonId: string;
    title: string;
    views: number;
    completions: number;
  }[];
}

export interface SystemAnalytics {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  activeUsersLast30Days: number;
  revenue?: number; // If applicable
}

export interface UserProgressResult {
  userId: string;
  courseId: string;
  progress: number;
  completedLessons: string[];
  lastAccessed: string;
}
