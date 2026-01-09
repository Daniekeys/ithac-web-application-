// API endpoint constants for Next.js API routes (server-side proxy)
export const API_ENDPOINTS = {
  // Authentication (via Next.js API routes)
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  ADMIN_LOGIN: "/api/auth/admin-login",
  LOGOUT: "/api/auth/logout",

  // User Profile (via Next.js API routes)
  USER_PROFILE: "/api/user/profile",
  ADMIN_PROFILE: "/api/admin/profile",

  // Course Management (via Next.js API routes)
  COURSES: "/api/courses",
  COURSE_DETAIL: "/api/courses",
  COURSE_LESSONS: "/api/courses",

  // User Dashboard
  USER_DASHBOARD_RECOMMEND: "/api/user/dashboard/recommend",
  USER_DASHBOARD_POPULAR: "/api/user/dashboard/popular",
  USER_DASHBOARD_HISTORY: "/api/user/dashboard/history",

  // Cart Management
  USER_CART: "/api/user/cart",

  // Saved Courses
  USER_SAVE: "/api/user/save",

  // Reviews
  REVIEW: "/api/review",
  USER_REVIEW: "/api/user/review",

  // Lessons & Comments
  USER_LESSON: "/api/user/lesson",

  // Admin Course Management
  ADMIN_COURSES: "/api/admin/course",

  // Contributors (via Next.js API routes)
  CONTRIBUTORS: "/api/contributors",
  
  // Admin User Management
  ADMIN_USERS: "/admin/users",
  ADMIN_USER: "/admin/user",

  // Direct external endpoints (if needed)
  WAITLIST: "/waitlist",
} as const;

// Use local Next.js API for proxying requests
export const BASE_URL = "";
