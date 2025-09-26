import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';
import Hero from '../Hero';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

// Mock DateIcon component  
jest.mock('../', () => ({
    DateIcon: () => <div>DateIcon</div>,
}));

describe('Hero', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        jest.clearAllMocks();
    });

    it('should render hero content', () => {
        render(<Hero />);
        
        expect(screen.getByText('My Calendar')).toBeInTheDocument();
        expect(screen.getByText(/Organize your time with My Calendar/)).toBeInTheDocument();
        expect(screen.getByText('DateIcon')).toBeInTheDocument();
    });

    it('should render Sign In button', () => {
        render(<Hero />);
        
        expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    it('should navigate to login when Sign In is clicked', () => {
        render(<Hero />);
        
        const signInButton = screen.getByText('Sign In');
        fireEvent.click(signInButton);
        
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('should render Learn more link', () => {
        render(<Hero />);
        
        const learnMoreLink = screen.getByText('Learn more');
        expect(learnMoreLink).toBeInTheDocument();
        expect(learnMoreLink.tagName).toBe('A');
    });

    it('should have correct text content', () => {
        render(<Hero />);
        
        const description = screen.getByText(/Always up to date on any device and on the web/);
        expect(description).toBeInTheDocument();
    });
});
