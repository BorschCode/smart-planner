import axios from 'axios';

// Helper to get XSRF token from cookies
function getXsrfToken() {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

const api = axios.create({
  baseURL: 'http://localhost:8041', // New backend port
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Request interceptor to add XSRF token to headers
api.interceptors.request.use(config => {
  const token = getXsrfToken();
  if (token) {
    config.headers['X-XSRF-TOKEN'] = token;
  }
  return config;
});

export async function initCsrf() {
  await api.get('/sanctum/csrf-cookie');
}

export default api;
