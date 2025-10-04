import {ApiService} from "../../../api";
import {LoginRequest, LoginResponse, RegisterRequest, RegisterResponse} from "../";

import {URLConstants} from "../../../utils/constants";
import {AuthCookie} from "../../../utils/AuthCookie";

export const AuthService = {


    login: (payload: LoginRequest) => {
        return ApiService.post<LoginResponse, LoginRequest>(`${URLConstants.LOGIN}`, payload);
    },

    register: (payload: RegisterRequest) => {
        return ApiService.post<RegisterResponse, RegisterRequest>(`${URLConstants.REGISTER}`, payload);
    },

    logout: async (): Promise<void> => {
        AuthCookie.clearToken();
    }

};


export default AuthService;