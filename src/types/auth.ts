export interface User {
  _id: string;
  email: string;
  name?: string; // Kept for compatibility if used elsewhere
  firstname?: string;
  lastname?: string;
  nickname?: string;
  image?: string | null;
  profession?: string;
  skill?: string;
  gender?: string | null;
  role?: "user" | "admin";
  disable?: boolean;
  _email?: boolean;
  _phone?: boolean;
  area?: any[];
  packages?: any | null;
  cart?: string[];
  history?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PasswordUpdateSettings {
  old_password: string;
  new_password: string;
}

export interface UserProfileUpdate {
  name?: string;
  nickname?: string;
  profession?: string;
  image?: string;
}
