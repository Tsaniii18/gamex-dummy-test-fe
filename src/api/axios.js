import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: 'https://game-ex-test-be-722144796089.us-central1.run.app',
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  const publicPaths = [
    '/games',
    /^\/games\/\d+$/, // regex untuk game detail
    '/auth/login',
    '/auth/register',
    '/auth/refresh'
  ];

  const isPublic = publicPaths.some(path => {
    if (typeof path === 'string') return config.url.startsWith(path);
    if (path instanceof RegExp) return path.test(config.url);
    return false;
  });

  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    try {
      const decoded = jwtDecode(accessToken);
      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired) {
        // Refresh token
        const response = await api.post('/auth/refresh');
        const newAccessToken = response.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);
        config.headers.Authorization = `Bearer ${newAccessToken}`;
      } else {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

    } catch (err) {
      // Jika refresh gagal, lempar error biar ditangani di komponen
      return Promise.reject(err);
    }
  } else {
    // Tidak ada token dan bukan endpoint publik → tolak
    if (!isPublic || config.method !== 'get') {
      return Promise.reject(new Error('Unauthorized: no access token'));
    }
  }

  return config;
}, (error) => Promise.reject(error));


export default api;
