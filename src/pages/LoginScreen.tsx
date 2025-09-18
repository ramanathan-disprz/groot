import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  AuthService,
  LoginRequest,
  APIErrorResponse, 
  LoginResponse
} from "../features/auth";

import { AuthCookie } from "../utils/AuthCookie";
import LoginForm from "../components/LoginForm";

import "../styles/AuthScreen.scss";

const LoginScreen: React.FC = () => {
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
    <div className="login-screen">
      <LoginForm onSubmit={handleLogin} onRegisterClick={handleRegisterClick} />
    </div>
  );
};

export default LoginScreen;
