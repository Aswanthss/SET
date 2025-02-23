export interface Expense {
  id?: string;  // Optional because it will be auto-generated
  amount: number;
  category: string;
  description: string;
  date: string;
  synced?: boolean;  // For tracking sync status
  userId?: string;   // To associate with user
  createdAt?: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  is_admin: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export type Category = {
  id: number;
  name: string;
  createdAt: string;
}