import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8043',
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },

    // 🔥 КЛЮЧОВЕ
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
});

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
