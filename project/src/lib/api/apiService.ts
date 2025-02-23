import axios from 'axios';
import { Expense } from '../../types';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
  permissions: string[];
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const setToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Auth endpoints
export const auth = {
  login: (email: string, password: string) => 
    api.post<LoginResponse>('/users/login', { email, password }),
  
  register: (email: string, password: string, name: string) =>
    api.post<LoginResponse>('/users/register', { email, password, name }),
  
  getProfile: () => 
    api.get<User>('/users/profile'),
};

// Chat endpoints
export const chat = {
  getMessages: () => 
    api.get('/chat/messages'),
  
  getAdminSessions: () => 
    api.get('/admin/chat/sessions'),
  
  getSessionMessages: (sessionId: number) =>
    api.get(`/admin/chat/messages/${sessionId}`),
  
  closeSession: (sessionId: number) =>
    api.post(`/admin/chat/sessions/${sessionId}/close`),
};

// Expense endpoints
export const expenses = {
  sync: (expenses: any[]) =>
    api.post('/expenses/sync', { expenses }),
  
  getAll: () =>
    api.get('/expenses'),
};

export const syncExpenses = async (expenses: Expense[]) => {
  try {
    const response = await api.post('/expenses/sync', { expenses });
    return response.data;
  } catch (error) {
    console.error('Error syncing expenses:', error);
    throw error;
  }
};

export { api };
