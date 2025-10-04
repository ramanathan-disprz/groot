import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import UpdateEventModal from '../UpdateEventModal';
import { EventService } from '../../../features/events/services';
import { CalendarEvent } from '../../../features/events/dtos';

// Mock dependencies
jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
}));

jest.mock('../../../features/events/services');

jest.mock('../UpdateEventForm', () => {
    return function MockUpdateEventForm({ onSubmit, onClose, onDelete, currentEvent }: any) {
        return (
            <div>
                <h2>Update Event Form</h2>
                <p>Event: {currentEvent?.title}</p>
                <button onClick={() => onSubmit({ title: 'Updated' })}>Submit</button>
                <button onClick={onClose}>Close</button>
                <button onClick={onDelete}>Delete</button>
            </div>
        );
    };
});

jest.mock('../../common', () => ({
    Modal: ({ children, open, onClose }: any) => (
        open ? (
            <div data-testid="modal">
                <button onClick={onClose}>Modal Close</button>
                {children}
            </div>
        ) : null
    ),
}));

describe('UpdateEventModal', () => {
    let queryClient: QueryClient;
    const mockOnClose = jest.fn();
    const mockUpdateEvent = EventService.updateEvent as jest.Mock;
    const mockDeleteEvent = EventService.deleteEvent as jest.Mock;

    const mockEvent: CalendarEvent = {
        id: '123',
        title: 'Team Meeting',
        description: 'Weekly sync',
        eventType: 'Work',
        startDateTime: new Date('2024-01-15T10:00:00'),
        endDateTime: new Date('2024-01-15T11:00:00'),
    };

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
                <UpdateEventModal
                    open={open}
                    onClose={mockOnClose}
                    currentEvent={mockEvent}
                />
            </QueryClientProvider>
        );
    };

    it('should render modal when open is true', () => {
        renderComponent(true);
        
        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByText('Update Event Form')).toBeInTheDocument();
    });

    it('should not render modal when open is false', () => {
        renderComponent(false);
        
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('should handle successful update', async () => {
        mockUpdateEvent.mockResolvedValueOnce({ id: 123, title: 'Updated' });
        
        renderComponent(true);
        
        const submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(mockUpdateEvent).toHaveBeenCalledWith('123', { title: 'Updated' });
            expect(toast.success).toHaveBeenCalledWith('Event updated successfully');
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('should handle update error', async () => {
        mockUpdateEvent.mockRejectedValueOnce({
            response: {
                data: { message: 'Update failed' }
            }
        });
        
        renderComponent(true);
        
        const submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Update failed');
        });
    });

    it('should handle successful delete', async () => {
        mockDeleteEvent.mockResolvedValueOnce(undefined);
        
        renderComponent(true);
        
        const deleteButton = screen.getByText('Delete');
        fireEvent.click(deleteButton);
        
        await waitFor(() => {
            expect(mockDeleteEvent).toHaveBeenCalledWith('123');
            expect(toast.success).toHaveBeenCalledWith('Event deleted successfully');
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('should handle delete error', async () => {
        mockDeleteEvent.mockRejectedValueOnce({
            response: {
                data: { message: 'Delete failed' }
            }
        });
        
        renderComponent(true);
        
        const deleteButton = screen.getByText('Delete');
        fireEvent.click(deleteButton);
        
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Delete failed');
        });
    });

    it('should close modal when close button is clicked', () => {
        renderComponent(true);
        
        const closeButton = screen.getByText('Close');
        fireEvent.click(closeButton);
        
        expect(mockOnClose).toHaveBeenCalled();
    });
});
