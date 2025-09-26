import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from '../register/RegisterPage';

jest.mock('../../components/home', () => ({
    Header: () => <div>Header</div>,
    Footer: () => <div>Footer</div>,
}));

jest.mock('../../components/auth/RegisterCard', () => {
    return function MockRegisterCard() {
        return <div>Register Card</div>;
    };
});

describe('Register', () => {
    it('should render register page', () => {
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RegisterPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByText('Header')).toBeInTheDocument();
        expect(screen.getByText('Footer')).toBeInTheDocument();
        expect(screen.getByText('Register Card')).toBeInTheDocument();
    });
});
