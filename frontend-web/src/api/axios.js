import axios from 'axios';

// Helper to get XSRF token from cookies
function getXsrfToken() {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
}

const api = axios.create({
    baseURL: 'http://localhost:8041',  // New backend port
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

// Response interceptor to handle 419 errors
api.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 419 && !error.config._retry) {
            error.config._retry = true;
            await initCsrf();
            return api.request(error.config);
        }
        return Promise.reject(error);
    }
);

export async function initCsrf() {
    await api.get('/sanctum/csrf-cookie');
}

export default api;
