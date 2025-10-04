import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import EventModal from '../EventModal';
import { EventService } from '../../../features/events/services';

// Mock dependencies
jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
}));

jest.mock('../../../features/events/services');

describe('EventModal', () => {
    let queryClient: QueryClient;
    const mockOnClose = jest.fn();
    const mockAddEvent = EventService.addEvent as jest.Mock;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        });
        jest.clearAllMocks();
    });

    const renderComponent = (open = true) => {
        return render(
            <QueryClientProvider client={queryClient}>
                <EventModal open={open} onClose={mockOnClose} />
            </QueryClientProvider>
        );
    };

    it('should render modal when open is true', () => {
        renderComponent(true);
        
        expect(screen.getByText('New')).toBeInTheDocument();
        expect(screen.getByLabelText('Title')).toBeInTheDocument();
    });

    it('should close when Cancel button is clicked', () => {
        renderComponent(true);
        
        fireEvent.click(screen.getByText('Cancel'));
        
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should show error when required fields are missing', async () => {
        renderComponent(true);
        
        // Submit without filling any fields
        fireEvent.click(screen.getByText('Add'));
        
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Enter all the details');
        });
    });

    it('should submit form with valid data', async () => {
        mockAddEvent.mockResolvedValueOnce({ id: 123 });
        
        renderComponent(true);
        
        // Fill all required fields
        fireEvent.change(screen.getByLabelText('Title'), {
            target: { value: 'Team Meeting' }
        });
        fireEvent.change(screen.getByLabelText('Starts'), {
            target: { value: '2024-01-15T10:00' }
        });
        fireEvent.change(screen.getByLabelText('Ends'), {
            target: { value: '2024-01-15T11:00' }
        });
        
        // Submit
        fireEvent.click(screen.getByText('Add'));
        
        await waitFor(() => {
            expect(mockAddEvent).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalledWith('Event added successfully');
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('should show error message on API failure', async () => {
        mockAddEvent.mockRejectedValueOnce({
            response: {
                data: {
                    message: 'Event conflicts with existing event'
                }
            }
        });
        
        renderComponent(true);
        
        // Fill and submit form
        fireEvent.change(screen.getByLabelText('Title'), {
            target: { value: 'Team Meeting' }
        });
        fireEvent.change(screen.getByLabelText('Starts'), {
            target: { value: '2024-01-15T10:00' }
        });
        fireEvent.change(screen.getByLabelText('Ends'), {
            target: { value: '2024-01-15T11:00' }
        });
        
        fireEvent.click(screen.getByText('Add'));
        
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Event conflicts with existing event');
        });
    });
});
