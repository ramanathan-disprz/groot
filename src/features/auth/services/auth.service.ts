import { ApiService } from "../../../api";
import { URLConstants } from "../../../utils/constants";
import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse
} from "../";

import { AuthCookie } from "../../../utils/AuthCookie";

export const AuthService = {

    login: (payload: LoginRequest) => {
        return ApiService.post<LoginResponse, LoginRequest>(`${URLConstants.LOGIN}`, payload);
    },

    register: (payload: RegisterRequest) => {
        return ApiService.post<RegisterResponse, RegisterRequest>(`${URLConstants.REGISTER}`, payload);
    },

    logout: async (): Promise<void> => {
        AuthCookie.clearToken();
        // wipe cached API data
        // queryClient.clear();
    }

};


export default AuthService;