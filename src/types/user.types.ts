
import { User } from "@/types/auth";

export type { User };

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
