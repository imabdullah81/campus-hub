// ─── Domain Types ─────────────────────────────────────────────────────────────

export type UserRole = "student" | "admin";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole;
  profileImage: string | null;
  bio: string | null;
  university: string | null;
  phoneNumber: string | null;
  isVerified: boolean;
  isActive: boolean;
  googleId?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── API Request Payloads ─────────────────────────────────────────────────────

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface GoogleAuthPayload {
  credential: string;
}

// ─── API Response Shapes ──────────────────────────────────────────────────────

export interface AuthResponse {
  success: boolean;
  user: User;
}

export interface MessageResponse {
  success: boolean;
  message: string;
}

// ─── Auth Context State ───────────────────────────────────────────────────────

export interface AuthContextState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  googleAuth: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (token: string, password: string) => Promise<void>;
}
