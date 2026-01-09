
export interface User {
  _id: string;
  email: string;
  name?: string;
  nickname?: string;
  image?: string;
  profession?: string;
  role?: "user" | "admin";
  disable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserResponse {
  success: boolean;
  status: string;
  data: User[];
  page: number;
  size: number;
  total: number;
  sortOptions?: Record<string, number>;
}

export interface SingleUserResponse {
  success: boolean;
  status: string;
  data: User;
}

export interface UpdateUserDTO {
  name?: string;
  nickname?: string;
  profession?: string;
  image?: string;
  role?: "user" | "admin";
  disable?: boolean;
}
