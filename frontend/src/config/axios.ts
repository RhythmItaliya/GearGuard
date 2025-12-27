import axios from 'axios';
import { env } from './env';

const axiosInstance = axios.create({
  baseURL: env.API_URL,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;
