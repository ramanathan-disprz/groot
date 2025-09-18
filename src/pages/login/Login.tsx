import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
    AuthService,
    LoginRequest,
    APIErrorResponse,
    LoginResponse
} from "../../features/auth";

import { AuthCookie } from "../../utils/AuthCookie";
import { Footer, Header } from "../../components/home";
import LoginCard from "../../components/auth/LoginCard";

import "./Login.scss";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") || "/events";

    const mutation = useMutation({
        mutationFn: AuthService.login,
        onError: (error: any) => {
            const apiError: APIErrorResponse = error.response?.data;
            toast.error(apiError.Message || "Login Failed");
        },
        onSuccess: (data: LoginResponse) => {
            AuthCookie.setToken(data)
            toast.success("Login successful!");
            navigate(redirectTo, { replace: true });
        },
    });
    const handleLogin = (formData: LoginRequest) => {
        console.log("Form submitted:", formData);
        mutation.mutate(formData);
    };

    const handleRegisterClick = () => {
        console.log("Navigate to register page");
        navigate("/register");
    };
    return (
        <>
            <Header />
            <div className="app">
                <main className="app__main">
                    <LoginCard onSubmit={handleLogin} onRegisterClick={handleRegisterClick} />
                </main>
            </div>
            <Footer />
        </>
    );
};
export default Login;
