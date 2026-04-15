// src/api/axios.ts
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const rfToken = useAuthStore.getState().refreshToken;
        const res = await axios.post('http://127.0.0.1:8000/refresh', { refresh_token: rfToken });
        
        const { access_token } = res.data;
        useAuthStore.getState().setTokens(access_token, rfToken!); // 신규 토큰 저장
        
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout(); // 갱신 실패 시 로그아웃
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;