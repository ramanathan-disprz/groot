import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import LoginForm from "../components/LoginForm";
import { LoginRequest, APIErrorResponse, LoginResponse } from "../features/auth/dtos";
import "../styles/AuthScreen.scss";
import { AuthService } from "../features/auth";
import { AuthCookie } from "../utils/AuthCookie";

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: AuthService.login,
    onError: (error: any) => {
      const apiError: APIErrorResponse = error.response?.data;
      toast.error(apiError.Message || "Login Failed");
    },
    onSuccess: (data) => {
      AuthCookie.setToken(data)
      toast.success("Login successful!");
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
