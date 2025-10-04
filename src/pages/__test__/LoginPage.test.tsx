import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../login/LoginPage';

jest.mock('../../components/home', () => ({
    Header: () => <div>Header</div>,
    Footer: () => <div>Footer</div>,
}));

jest.mock('../../components/auth/LoginCard', () => {
    return function MockLoginCard() {
        return <div>Login Card</div>;
    };
});

describe('LoginPage', () => {
    it('should render login page', () => {
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <LoginPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByText('Header')).toBeInTheDocument();
        expect(screen.getByText('Footer')).toBeInTheDocument();
        expect(screen.getByText('Login Card')).toBeInTheDocument();
    });
});
