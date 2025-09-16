import React from "react";
import { useNavigate } from "react-router-dom";
import { APIErrorResponse, RegisterRequest } from "../features/auth/dtos";
import "../styles/AuthScreen.scss";
import RegisterForm from "../components/RegisterForm";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AuthService } from "../features/auth";


const RegisterScreen: React.FC = () => {
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: AuthService.register,
        onError: (error: any) => {
            const apiError: APIErrorResponse = error.response?.data;
            toast.error(apiError.Message || "Registration Failed");
        },
        onSuccess(data) {
            toast.success("Registration successful! Please login.");
            handleLoginClick();
        },
    });

    const handleRegister = (formData: RegisterRequest) => {
        console.log("Form submitted:", formData);
        mutation.mutate(formData)
    };

    const handleLoginClick = () => {
        console.log("Navigate to login page");
        navigate("/login");
    };

    return (
        <div className="login-screen">
            <RegisterForm onSubmit={handleRegister} onLoginClick={handleLoginClick} />
        </div>
    );
};

export default RegisterScreen;
