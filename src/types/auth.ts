export interface User {
  _id: string;
  email: string;
  name?: string;
  nickname?: string;
  image?: string;
  profession?: string;
  role?: "user" | "admin";
  disable?: boolean;
  _email?: boolean;
  _phone?: boolean;
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
