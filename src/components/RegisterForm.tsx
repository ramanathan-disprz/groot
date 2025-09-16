// src/components/LoginForm.tsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import "../styles/AuthForm.scss";
import { RegisterRequest } from "../features/auth";

interface LoginFormProps {
    onSubmit: (formData: RegisterRequest) => void;
    onLoginClick?: () => void;
}

export const RegisterForm: React.FC<LoginFormProps> = ({ onSubmit, onLoginClick }) => {
    const [formData, setFormData] = useState<RegisterRequest>({
        name: "", email: "", password: "", confirmPassword: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email ||
            !formData.password || !formData.confirmPassword
        ) {
            toast.error("Enter all the details");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }
        onSubmit(formData);
    };

    const handleLoginClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onLoginClick) {
            onLoginClick();
        }
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="login-form__title">
                <FontAwesomeIcon icon={faUser} className="login-form__icon" /> Register
            </h2>

            <div className="login-form__field">
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter Name..."
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>

            <div className="login-form__field">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter Email..."
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>
            <div className="login-form__field">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter Password..."
                    value={formData.password}
                    onChange={handleChange}
                />
            </div>
            <div className="login-form__field">
                <label htmlFor="confirmPassword">Password</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password..."
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />
            </div>
            <div className="login-form__register-link">
                <p>Already have an account? <a href="#" onClick={handleLoginClick}
                    className="login-form__register-link-text">Login here</a></p>
            </div>
            <button type="submit" className="login-form__submit">
                Create Account
            </button>
        </form>
    );
};

export default RegisterForm;
