import { useState } from "react";
import toast from "react-hot-toast";

import { LoginRequest, RegisterRequest } from "../../features/auth";

import Logo from "./Logo";

import "./LoginCard.scss";

interface LoginFormProps {
    onSubmit: (formData: RegisterRequest) => void;
    onLoginClick?: () => void;
}

const RegisterCard: React.FC<LoginFormProps> = ({ onSubmit, onLoginClick }) => {
    const [formData, setFormData] = useState<RegisterRequest>({ name: "", email: "", password: "", confirmPassword: "" });

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
        <section className="login-card">
            <Logo />
            <h2 className="login-card__title">Create an Account with Disprz</h2>
            <form className="login-card__form" onSubmit={handleSubmit}>

                <div className="login-card__input-group">
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter Name..."
                        value={formData.name}
                        onChange={handleChange}
                        aria-label="Name"
                    />
                </div>

                <div className="login-card__input-group">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter Email..."
                        value={formData.email}
                        onChange={handleChange}
                        aria-label="Email"
                    />
                </div>

                <div className="login-card__input-group">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter Password..."
                        value={formData.password}
                        onChange={handleChange}
                        aria-label="Password"
                    />
                </div>

                <div className="login-card__input-group">
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm Password..."
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        aria-label="Confirm Password"
                    />
                    <button type="submit" aria-label="Submit" className="login-card__submit">
                        ➔
                    </button>
                </div>

                <div className="login-card__links">
                   Do you already have an account?
                   <a onClick={handleLoginClick} href="#">Sign In with Disprz Account</a>
                </div>
            </form>
        </section>
    );
};

export default RegisterCard;
