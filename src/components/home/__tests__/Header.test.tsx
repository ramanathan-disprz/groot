import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../Header';

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: () => <span>Icon</span>,
}));

test('Header renders', () => {
    render(<Header />);
    expect(screen.getByText('Disprz')).toBeInTheDocument();
});
