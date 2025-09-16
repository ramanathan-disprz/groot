import { ApiService } from "../../../api";
import { URLConstants } from "../../../utils/URLConstants";
import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse
} from "../"; // points to the auth folder

export const AuthService = {

    login: (payload: LoginRequest) => {
        return ApiService.post<LoginResponse, LoginRequest>(`${URLConstants.LOGIN}`, payload);
    },

    register: (payload: RegisterRequest) => {
        return ApiService.post<RegisterResponse, RegisterRequest>(`${URLConstants.REGISTER}`, payload);
    }

};


export default AuthService;