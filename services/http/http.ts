



import axios, { AxiosInstance } from 'axios';

const http: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000/api/v1',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});


let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void }> = [];

// Khi body là FormData, bỏ Content-Type để axios/browser set đúng multipart/form-data + boundary
http.interceptors.request.use((config) => {
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    // Add Accept-Language header from URL locale
    if (typeof window !== 'undefined') {
        const pathSegments = window.location.pathname.split('/');
        const locale = pathSegments[1]; // e.g., /vi/... or /en/...
        if (locale === 'vi' || locale === 'en') {
            config.headers['Accept-Language'] = locale;
        }
    }

    return config;
});

function processQueue(error: any, success = false) {
    failedQueue.forEach(({ resolve, reject }) => {
        if (success) resolve();
        else reject(error);
    });
    failedQueue = [];
}

http.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;


        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/refresh') &&
            !originalRequest.url?.includes('/auth/login')
        ) {
            if (isRefreshing) {

                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => http(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {

                const baseUrl = typeof window !== 'undefined'
                    ? window.location.origin
                    : process.env.NEXT_PUBLIC_SITE_URL || 'https://5200ai.com';

                await axios.post(`${baseUrl}/api/auth/refresh`, {}, { withCredentials: true });

                processQueue(null, true);
                isRefreshing = false;


                return http(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, false);
                isRefreshing = false;


                if (typeof window !== 'undefined') {
                    window.location.href = '/vi/login';
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default http;

