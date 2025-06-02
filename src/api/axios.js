import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: 'https://game-ex-test-be-722144796089.us-central1.run.app',
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  if (
    config.url.includes('/login') ||
    config.url.includes('/register') ||
    config.url.includes('/auth/refresh')
  ) {
    return config;
  }

  let accessToken = localStorage.getItem('accessToken');
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
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }
    } else {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  } else {
    window.location.href = '/auth/login';
    return Promise.reject(new Error('No access token'));
  }

  return config;
}, (error) => Promise.reject(error));

export default api;
