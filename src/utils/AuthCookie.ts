import Cookies from "js-cookie";
import { APIErrorResponse, LoginResponse } from "../features/auth";

export class AuthCookie {
    private static TOKEN_KEY = "token";

    static setToken(data: LoginResponse) {
        const token = data.token;
        const expiresAt = Number(data.expiresAt);

        const now = Date.now();
        const expiryMs = expiresAt * 1000 - now;
        const days = expiryMs / (1000 * 60 * 60 * 24);

        Cookies.set(this.TOKEN_KEY, token, {
            expires: days,
            sameSite: "strict",
        });
    }

    static getToken(): string | undefined {
        return Cookies.get(this.TOKEN_KEY);
    }

    static clearToken() {
        Cookies.remove(this.TOKEN_KEY);
    }

    static isExpired(expiresAt: number): boolean {
        const now = Math.floor(Date.now() / 1000);
        return now >= expiresAt;
    }
}
