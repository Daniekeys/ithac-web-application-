export interface Course {
  _id: string;
  title: string;
  tagline: string;
  image: string;
  thumbnail?: string;
  introductory_video: string;
  description: string;
  main_contributor: Contributor;
  other_contributor: Contributor[];
  amount: number;
  level: "beginner" | "intermediate" | "advanced";
  language: string;
  tags: string[];
  rating?: number;
  duration: number;
  lessons: string[] | Lesson[];
  status?: "active" | "inactive" | "draft" | "published" | "archived";
  visibility?: "public" | "private";
  estimated_duration?: number;
  completion_rule?: string;
  enrolled_count?: number;
  save_count?: number;
  review_count?: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface Contributor {
  _id: string;
  name: string;
  nickname: string;
  image: string;
  bio?: string;
  email?: string;
  social_links?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  expertise?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCourseData {
  title: string;
  tagline?: string;
  image: string;
  thumbnail?: string;
  introductory_video: string;
  description: string;
  amount: number;
  main_contributor: string;
  other_contributor: string[];
  language: string;
  tags: string[];
  level: "beginner" | "intermediate" | "advanced";
  status?: "draft" | "published" | "archived";
  visibility?: "public" | "private";
  estimated_duration?: number;
  completion_rule?: string;
}

export interface UpdateCourseData extends Partial<CreateCourseData> {}

export interface Lesson {
  _id: string;
  _course: string;
  title: string;
  url: string;
  public_id: string;
  asset_id: string;
  thumbnail: string;
  duration: number;
  free: boolean;
  transcript?: string;
  description: string;
  resources?: Resource[];
  group?: string;
  position: number;
  views: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  filename: string;
  path: string;
}

export interface CreateLessonData {
  title: string;
  url: string;
  public_id: string;
  asset_id: string;
  thumbnail: string;
  duration: number;
  free: boolean;
  transcript?: string;
  description: string;
  resources?: Resource[];
  group?: string;
  position?: number;
}

export interface UpdateLessonData extends Partial<CreateLessonData> {}

export interface CoursesResponse {
  success: boolean;
  status: string;
  data: Course[];
  page: number;
  size: number;
  sortOptions: Record<string, number>;
  total: number;
}

export interface CourseDetailResponse {
  success: boolean;
  status: string;
  data: Course;
  lessons?: Lesson[];
}

export interface PopularCoursesResponse {
  success: boolean;
  status: string;
  data: Course[];
}

export interface UserDashboardResponse {
  success: boolean;
  status: string;
  data: Course[];
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  status: string;
  data?: T;
  error?: string;
  message?: string;
  action?: string;
}

// Cart related types
export interface CartItem {
  _id: string;
  course: Course;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  success: boolean;
  status: string;
  data: CartItem[];
  length: number;
}

// Review related types
export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  course: string;
  rating: number;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewResponse {
  success: boolean;
  status: string;
  data: Review[];
  mood: number;
  total: number;
  query: {
    _id: string;
  };
}

// Saved courses types
export interface SavedCoursesResponse {
  success: boolean;
  status: string;
  data: Course[];
}

// Lesson watching and comment types
export interface LessonComment {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  lesson: string;
  comment: string;
  replies?: LessonComment[];
  createdAt: string;
  updatedAt: string;
}

export interface LessonWatchResponse {
  success: boolean;
  status: string;
  data: Lesson;
  comments?: LessonComment[];
}

export interface CreateReviewData {
  rating: number;
  body: string;
}

export interface CreateLessonCommentData {
  comment: string;
  parent?: string; // for replies
}
