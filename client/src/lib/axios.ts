import axios from 'axios';

export const getJwtPayload = (token: string): { exp?: number; id?: string; role?: string } | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  if (!token || token === 'undefined' || token === 'null' || !token.trim()) return true;
  const payload = getJwtPayload(token);
  if (!payload || !payload.exp) return true;
  return Date.now() >= payload.exp * 1000;
};

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5001/api';
    }
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && token !== 'undefined' && token !== 'null' && token.trim() !== '') {
    if (isTokenExpired(token)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('vetnova-auth-expired', { detail: { reason: 'token_expired' } }));
      }
    } else {
      config.headers.Authorization = `Bearer ${token.trim()}`;
    }
  }

  if (config.data instanceof FormData) {
    if (config.headers) {
      delete config.headers['Content-Type'];
      delete config.headers['content-type'];
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest?._retry) {
      // Avoid looping if auth endpoint itself returned 401
      const isAuthEndpoint = originalRequest?.url?.includes('/auth/login') || originalRequest?.url?.includes('/auth/refresh');
      if (!isAuthEndpoint) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('vetnova-auth-expired', {
              detail: {
                message: error.response?.data?.message || 'Session expired. Please sign in again.'
              }
            })
          );

          if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
            const redirectParam = encodeURIComponent(window.location.pathname + window.location.search);
            window.location.href = `/login?redirect=${redirectParam}&expired=1`;
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
