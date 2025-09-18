import { useState } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import { LoginRequest } from "../features/auth";
import "../styles/AuthForm.scss";

interface LoginFormProps {
    onSubmit: (formData: LoginRequest) => void;
    onRegisterClick?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onRegisterClick }) => {
    const [formData, setFormData] = useState<LoginRequest>({ email: "", password: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error("Enter all the details");
            return;
        }
        onSubmit(formData);
    };

    const handleRegisterClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onRegisterClick) {
            onRegisterClick();
        }
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="login-form__title">
                <FontAwesomeIcon icon={faUser} className="login-form__icon" /> Login
            </h2>
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
            <div className="login-form__register-link">
                <p>Don't have an account? <a href="#" onClick={handleRegisterClick}
                    className="login-form__register-link-text">Register here</a></p>
            </div>
            <button type="submit" className="login-form__submit">
                Submit
            </button>
        </form>
    );
};

export default LoginForm;
