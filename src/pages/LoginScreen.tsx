import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import LoginForm from "../components/LoginForm";
import { LoginRequest, APIErrorResponse, LoginResponse } from "../features/auth/dtos";
import "../styles/AuthScreen.scss";
import { AuthService } from "../features/auth";
import { AuthCookie } from "../utils/AuthCookie";

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  const mutation = useMutation({
    mutationFn: AuthService.login,
    onError: (error: any) => {
      const apiError: APIErrorResponse = error.response?.data;
      toast.error(apiError.Message || "Login Failed");
    },
    onSuccess: (data : LoginResponse) => {
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


const navigateToRedirect = (redirectTo: string, navigate: any) => {
  try {
    const url = new URL(redirectTo);
    // If same origin, navigate using react-router
    if (url.origin === window.location.origin) {
      navigate(url.pathname + url.search + url.hash, { replace: true });
    } else {
      // Different origin, fallback to full reload
      window.location.href = redirectTo;
    }
  } catch {
    // Invalid URL, fallback to home
    navigate("/ui", { replace: true });
  }
};

export default LoginScreen;
