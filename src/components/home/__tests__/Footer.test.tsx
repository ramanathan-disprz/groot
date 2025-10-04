import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../Footer';

describe('Footer', () => {
    it('should render all footer links', () => {
        render(<Footer />);

        expect(screen.getByText('Privacy')).toBeInTheDocument();
        expect(screen.getByText('Terms')).toBeInTheDocument();
        expect(screen.getByText('Support')).toBeInTheDocument();
    });

    it('should display current year in copyright', () => {
        const currentYear = new Date().getFullYear();
        render(<Footer />);

        expect(screen.getByText(`© ${currentYear} Disprz. All rights reserved.`)).toBeInTheDocument();
    });

    it('should render links as anchor tags', () => {
        render(<Footer />);

        const privacyLink = screen.getByText('Privacy');
        const termsLink = screen.getByText('Terms');
        const supportLink = screen.getByText('Support');

        expect(privacyLink.tagName).toBe('A');
        expect(termsLink.tagName).toBe('A');
        expect(supportLink.tagName).toBe('A');
    });
});
