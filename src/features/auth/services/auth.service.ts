import { ApiService } from "../../../api";
import { URLConstants } from "../../../utils/URLConstants";
import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse
} from "../"; // points to the auth folder
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
        // queryClient.clear(); // wipe cached API data
    }

};


export default AuthService;