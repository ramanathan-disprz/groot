import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DateIcon from '../DateIcon';

describe('DateIcon', () => {
    it('should render current day and weekday', () => {
        const mockDate = new Date('2024-01-15'); // Monday
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

        render(<DateIcon />);

        expect(screen.getByText('MON')).toBeInTheDocument();
        expect(screen.getByText('15')).toBeInTheDocument();

        jest.restoreAllMocks();
    });

    it('should display correct format for different dates', () => {
        const mockDate = new Date('2024-12-25'); // Wednesday
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

        render(<DateIcon />);

        expect(screen.getByText('WED')).toBeInTheDocument();
        expect(screen.getByText('25')).toBeInTheDocument();

        jest.restoreAllMocks();
    });
});
