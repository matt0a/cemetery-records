// src/api/axios.ts
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    const url = config.url ?? '';
    const isPublicOrAuth = url.startsWith('/api/public/') || url.startsWith('/api/auth/');
    if (token && !isPublicOrAuth) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers?.Authorization) {
        delete config.headers.Authorization;
    }
    return config;
});

api.interceptors.response.use(
    r => r,
    err => {
        if (err?.response?.status === 401) {
            localStorage.removeItem('token');
            // optional: window.location.assign('/login');
        }
        return Promise.reject(err);
    }
);

export default api;
