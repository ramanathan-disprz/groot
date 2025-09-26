import React from 'react';

// Store for tracking navigation calls
export const navigationHistory: Array<{ to: string; replace?: boolean }> = [];

// Mock implementations
export const Navigate = ({ to, replace }: { to: string; replace?: boolean }) => {
    navigationHistory.push({ to, replace });
    return <div data-testid="mock-navigate">Redirecting to {to}</div>;
};

export const useLocation = jest.fn(() => ({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    key: 'default',
}));

export const useNavigate = jest.fn(() => jest.fn());

export const useParams = jest.fn(() => ({}));

export const useSearchParams = jest.fn(() => [new URLSearchParams(), jest.fn()]);

export const Link = ({ to, children, ...props }: any) => (
    <a href={to} data-testid="mock-link" {...props}>
        {children}
    </a>
);

export const NavLink = ({ to, children, ...props }: any) => (
    <a href={to} data-testid="mock-navlink" {...props}>
        {children}
    </a>
);

export const BrowserRouter = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const MemoryRouter = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const Routes = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const Route = ({ element }: { element: React.ReactNode; path?: string }) => <>{element}</>;

export const Outlet = () => <div data-testid="mock-outlet" />;

// Helper function to reset navigation history
export const resetNavigationHistory = () => {
    navigationHistory.length = 0;
};

// Helper function to set mock location
export const setMockLocation = (location: Partial<Location>) => {
    (useLocation as jest.Mock).mockReturnValue({
        pathname: '/',
        search: '',
        hash: '',
        state: null,
        key: 'default',
        ...location,
    });
};
