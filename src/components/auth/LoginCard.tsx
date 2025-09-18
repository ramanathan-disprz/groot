import { useState } from "react";
import toast from "react-hot-toast";

import { LoginRequest } from "../../features/auth";

import Logo from "./Logo";

import "./LoginCard.scss";

interface LoginFormProps {
    onSubmit: (formData: LoginRequest) => void;
    onRegisterClick?: () => void;
}

const LoginCard: React.FC<LoginFormProps> = ({ onSubmit, onRegisterClick }) => {
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
        <section className="login-card">
            <Logo />
            <h2 className="login-card__title">Sign in with Disprz Account</h2>
            <form className="login-card__form" onSubmit={handleSubmit}>
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
                    <button type="submit" aria-label="Submit" className="login-card__submit">
                        ➔
                    </button>
                </div>

                <div className="login-card__links">
                    <a href="#">Forgot password?</a>
                    <a onClick={onRegisterClick} href="#">Create Disprz Account</a>
                </div>
            </form>
        </section>
    );
};

export default LoginCard;
