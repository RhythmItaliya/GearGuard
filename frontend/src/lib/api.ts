// Example API service using axios and endpoints
import axiosInstance from '@/config/axios';
import { endpoints } from '@/config/endpoints';

// Example: User API calls
export const userApi = {
  // Get all users
  getAll: async () => {
    const response = await axiosInstance.get(endpoints.users.base);
    return response.data;
  },

  // Get user by ID
  getById: async (id: string) => {
    const response = await axiosInstance.get(endpoints.users.byId(id));
    return response.data;
  },

  // Create user
  create: async (data: any) => {
    const response = await axiosInstance.post(endpoints.users.base, data);
    return response.data;
  },

  // Update user
  update: async (id: string, data: any) => {
    const response = await axiosInstance.put(endpoints.users.byId(id), data);
    return response.data;
  },

  // Delete user
  delete: async (id: string) => {
    const response = await axiosInstance.delete(endpoints.users.byId(id));
    return response.data;
  },
};

// Example: Auth API calls
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post(endpoints.auth.login, {
      email,
      password,
    });
    return response.data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await axiosInstance.post(endpoints.auth.register, {
      name,
      email,
      password,
    });
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post(endpoints.auth.logout);
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  const response = await axiosInstance.get(endpoints.health);
  return response.data;
};
