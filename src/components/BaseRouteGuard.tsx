import { ReactNode } from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { AuthCookie } from '../utils/AuthCookie';

interface BaseRouteGuardProps {
    children: ReactNode;
}

const BaseRouteGuard: React.FC<BaseRouteGuardProps> = ({ children }) => {
    const location = useLocation();
    const path = location.pathname;

    if (!AuthCookie.isAuthenticated()) {
        const redirectTo = path;
        return <Navigate to={`/login?redirectTo=${redirectTo}`} replace />;
    }

    return <>{children}</>;
};

export default BaseRouteGuard;
