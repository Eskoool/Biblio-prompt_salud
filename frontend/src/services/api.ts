import axios from 'axios';
import type { Prompt, Tag, AIPlatform, CreatePromptData, VoteData, FilterOptions } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Prompts API
export const promptsAPI = {
  getAll: async (filters?: FilterOptions) => {
    const response = await api.get<Prompt[]>('/prompts', { params: filters });
    return response.data;
  },

  getTopVoted: async (limit: number = 6) => {
    const response = await api.get<Prompt[]>(`/prompts/top-voted?limit=${limit}`);
    return response.data;
  },

  getRecommended: async (limit: number = 6) => {
    const response = await api.get<Prompt[]>(`/prompts/recommended?limit=${limit}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Prompt>(`/prompts/${id}`);
    return response.data;
  },

  create: async (data: CreatePromptData) => {
    const response = await api.post<Prompt>('/prompts', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreatePromptData>) => {
    const response = await api.put<Prompt>(`/prompts/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/prompts/${id}`);
  },

  vote: async (data: VoteData) => {
    const response = await api.post<Prompt>('/prompts/vote', data);
    return response.data;
  },
};

// Tags API
export const tagsAPI = {
  getAll: async () => {
    const response = await api.get<Tag[]>('/tags');
    return response.data;
  },

  create: async (data: Omit<Tag, '_id'>) => {
    const response = await api.post<Tag>('/tags', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Omit<Tag, '_id'>>) => {
    const response = await api.put<Tag>(`/tags/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/tags/${id}`);
  },
};

// AI Platforms API
export const aiPlatformsAPI = {
  getAll: async () => {
    const response = await api.get<AIPlatform[]>('/ai-platforms');
    return response.data;
  },

  create: async (data: Omit<AIPlatform, '_id'>) => {
    const response = await api.post<AIPlatform>('/ai-platforms', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Omit<AIPlatform, '_id'>>) => {
    const response = await api.put<AIPlatform>(`/ai-platforms/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/ai-platforms/${id}`);
  },
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post<{ token: string; user: any }>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  isAdmin: () => {
    const user = authAPI.getCurrentUser();
    return user?.role === 'admin';
  },
};

export default api;
