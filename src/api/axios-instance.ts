import axios, { AxiosRequestConfig } from "axios";
import { URLConstants } from "../utils/constants";
import { AuthCookie } from "../utils/AuthCookie";

const axiosInstance = axios.create({
    baseURL: URLConstants.API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const excludedEndpoints = ['/login', '/register'];
        const isExcluded = excludedEndpoints.some(endpoint => config.url?.includes(endpoint));

        if (!isExcluded) {
            const token = AuthCookie.getToken();
            if (token) {
                config.headers = config.headers || {}; 
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default axiosInstance;
