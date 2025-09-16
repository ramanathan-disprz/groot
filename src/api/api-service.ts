import axiosInstance from "./axios-instance";

export const ApiService = {

    get: async <T>(url: string): Promise<T> => {
        const response = await axiosInstance.get<T>(url);
        return response.data;
    },

    post: async <T, U>(url: string, data: U): Promise<T> => {
        const response = await axiosInstance.post<T>(url, data);
        return response.data;
    },

    put: async <T, U>(url: string, data: U): Promise<T> => {
        const response = await axiosInstance.put<T>(url, data);
        return response.data;
    },

    delete: async (url: string): Promise<void> => {
        await axiosInstance.delete(url);
    },
};
