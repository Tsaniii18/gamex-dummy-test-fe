import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: 'https://game-ex-test-be-722144796089.us-central1.run.app',
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  const publicPaths = [
    '/games',
    /^\/games\/\d+$/, // regex: /games/:id
    '/auth/login',
    '/auth/register',
    '/auth/refresh'
  ];

  const isPublic = publicPaths.some(path => {
    if (typeof path === 'string') return config.url.startsWith(path);
    if (path instanceof RegExp) return path.test(config.url);
    return false;
  });

  let accessToken = localStorage.getItem('accessToken');

  // Jika token ada, selalu gunakan (baik untuk endpoint publik maupun private)
  if (accessToken) {
    const decoded = jwtDecode(accessToken);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      try {
        const response = await api.post('/auth/refresh');
        const newAccessToken = response.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);
        config.headers.Authorization = `Bearer ${newAccessToken}`;
      } catch (error) {
        localStorage.removeItem('accessToken');
        if (!isPublic) {
          window.location.href = '/auth/login';
          return Promise.reject(error);
        }
      }
    } else {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  } else {
    // Jika tidak ada token, hanya izinkan endpoint publik (GET)
    if (!isPublic || config.method !== 'get') {
      window.location.href = '/auth/login';
      return Promise.reject(new Error('No access token'));
    }
  }

  return config;
}, (error) => Promise.reject(error));

export default api;
