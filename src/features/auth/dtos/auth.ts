export interface LoginRequest {
    email: string; password: string;
}

export interface LoginResponse {
    token: string;
    expiresAt: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterResponse {

    name: string;
    email: string;
}

export interface APIErrorResponse {
    StatusCode: number;
    Message: string;
}

