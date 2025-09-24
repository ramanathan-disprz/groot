import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
    AuthService,
    RegisterRequest,
} from "../../features/auth";
import {
    Footer,
    Header
} from "../../components/home";
import RegisterCard from "../../components/auth/RegisterCard";
import { APIErrorResponse } from "../../api";


const Register: React.FC = () => {
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: AuthService.register,
        onError: (error: any) => {
            const apiError: APIErrorResponse = error.response?.data;
            toast.error(apiError.message || "Registration Failed");
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
        <>
            <Header />
            <div className="app">
                <main className="app__main">
                    <RegisterCard onSubmit={handleRegister} onLoginClick={handleLoginClick} />
                </main>
            </div>
            <Footer />
        </>
    );
};

export default Register;