import axios, { AxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';
import { API_BASE_URL } from '@/config/endpoints';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(async config => {
  const session = await getSession();
  const token = (session?.user as any)?.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  response => response.data,
  error => {
    const message =
      error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export async function apiClient<T>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<T> {
  return axiosInstance.request<any, T>({
    url: endpoint,
    ...options,
  });
}
