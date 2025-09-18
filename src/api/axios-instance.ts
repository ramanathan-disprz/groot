import axios from "axios";
import { URLConstants } from "../utils/constants";

const axiosInstance = axios.create({
    baseURL: URLConstants.API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);
export default axiosInstance;   