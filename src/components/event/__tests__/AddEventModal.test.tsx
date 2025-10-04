import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import AddEventModal from '../AddEventModal';
import EventService from '../../../features/events/services/event.service';
import { EventRequest, EventResponse } from '../../../features/events/dtos/event';

// Mock dependencies
jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
}));

jest.mock('../../../features/events/services/event.service');

jest.mock('../../common', () => ({
    Modal: ({ open, onClose, children }: any) => {
        if (!open) return null;
        return (
            <div data-testid="modal" onClick={onClose}>
                <div onClick={(e) => e.stopPropagation()}>
                    {children}
                </div>
            </div>
        );
    },
}));

jest.mock('../AddEventForm', () => {
    return function MockAddEventForm({ onSubmit, onClose }: any) {
        const handleSubmit = () => {
            const eventRequest: EventRequest = {
                title: 'Test Event',
                description: 'Test Description',
                startDate: '2024-01-15',
                endDate: '2024-01-15',
                startTime: '10:00',
                endTime: '11:00',
                eventType: 'Meeting'
            };
            onSubmit(eventRequest);
        };

        return (
            <div data-testid="add-event-form">
                <button data-testid="submit-button" onClick={handleSubmit}>
                    Submit
                </button>
                <button data-testid="close-button" onClick={onClose}>
                    Close
                </button>
            </div>
        );
    };
});

describe('AddEventModal', () => {
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
                <AddEventModal open={open} onClose={mockOnClose} />
            </QueryClientProvider>
        );
    };

    describe('Rendering', () => {
        it('should render modal when open is true', () => {
            renderComponent(true);

            expect(screen.getByTestId('modal')).toBeInTheDocument();
            expect(screen.getByTestId('add-event-form')).toBeInTheDocument();
        });

        it('should not render modal when open is false', () => {
            renderComponent(false);

            expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
        });
    });

    describe('Form Submission', () => {
        it('should call EventService.addEvent and show success message', async () => {
            const mockResponse: EventResponse = {
                id: 123,
                title: 'Test Event',
                description: 'Test Description',
                eventType: 'Meeting',
                startDateTime: '2024-01-15T10:00:00',
                endDateTime: '2024-01-15T11:00:00',
            };

            mockAddEvent.mockResolvedValueOnce(mockResponse);
            renderComponent(true);

            fireEvent.click(screen.getByTestId('submit-button'));

            await waitFor(() => {
                expect(mockAddEvent).toHaveBeenCalledWith({
                    title: 'Test Event',
                    description: 'Test Description',
                    startDate: '2024-01-15',
                    endDate: '2024-01-15',
                    startTime: '10:00',
                    endTime: '11:00',
                    eventType: 'Meeting',
                }, expect.anything());
                expect(toast.success).toHaveBeenCalledWith('Event added successfully');
                expect(mockOnClose).toHaveBeenCalled();
            });
        });

        it('should invalidate events query on success', async () => {
            const mockResponse: EventResponse = {
                id: 123,
                title: 'Test Event',
                description: '',
                eventType: 'Meeting',
                startDateTime: '2024-01-15T10:00:00',
                endDateTime: '2024-01-15T11:00:00',
            };

            mockAddEvent.mockResolvedValueOnce(mockResponse);
            const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

            renderComponent(true);
            fireEvent.click(screen.getByTestId('submit-button'));

            await waitFor(() => {
                expect(invalidateQueriesSpy).toHaveBeenCalledWith({
                    queryKey: ['events'],
                    exact: false,
                });
            });
        });

        it('should show error message on failure', async () => {
            mockAddEvent.mockRejectedValueOnce({
                response: {
                    data: {
                        message: 'Event conflicts with existing event'
                    }
                },
            });

            renderComponent(true);
            fireEvent.click(screen.getByTestId('submit-button'));

            await waitFor(() => {
                expect(toast.error).toHaveBeenCalledWith('Event conflicts with existing event');
                expect(mockOnClose).not.toHaveBeenCalled();
            });
        });

        it('should show default error when no message provided', async () => {
            mockAddEvent.mockRejectedValueOnce({
                response: { data: {} },
            });

            renderComponent(true);
            fireEvent.click(screen.getByTestId('submit-button'));

            await waitFor(() => {
                expect(toast.error).toHaveBeenCalledWith('Failed to add event');
            });
        });
    });

    describe('Modal Interactions', () => {
        it('should close when close button is clicked', () => {
            renderComponent(true);

            fireEvent.click(screen.getByTestId('close-button'));

            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });

        it('should close when backdrop is clicked', () => {
            renderComponent(true);

            fireEvent.click(screen.getByTestId('modal'));

            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });

        it('should not close when modal content is clicked', () => {
            renderComponent(true);

            fireEvent.click(screen.getByTestId('add-event-form'));

            expect(mockOnClose).not.toHaveBeenCalled();
        });
    });

    describe('Multiple Operations', () => {
        it('should handle multiple submissions', async () => {
            const mockResponse: EventResponse = {
                id: 123,
                title: 'Test Event',
                description: '',
                eventType: 'Meeting',
                startDateTime: '2024-01-15T10:00:00',
                endDateTime: '2024-01-15T11:00:00',
            };

            mockAddEvent.mockResolvedValue(mockResponse);
            const { rerender } = renderComponent(true);

            // First submission
            fireEvent.click(screen.getByTestId('submit-button'));
            await waitFor(() => {
                expect(mockOnClose).toHaveBeenCalledTimes(1);
            });

            // Reset and open again
            mockOnClose.mockClear();
            rerender(
                <QueryClientProvider client={queryClient}>
                    <AddEventModal open={true} onClose={mockOnClose} />
                </QueryClientProvider>
            );

            // Second submission
            fireEvent.click(screen.getByTestId('submit-button'));
            await waitFor(() => {
                expect(mockAddEvent).toHaveBeenCalledTimes(2);
                expect(mockOnClose).toHaveBeenCalledTimes(1);
            });
        });

        it('should handle rapid open/close transitions', () => {
            const { rerender } = renderComponent(true);

            expect(screen.getByTestId('modal')).toBeInTheDocument();

            rerender(
                <QueryClientProvider client={queryClient}>
                    <AddEventModal open={false} onClose={mockOnClose} />
                </QueryClientProvider>
            );
            expect(screen.queryByTestId('modal')).not.toBeInTheDocument();

            rerender(
                <QueryClientProvider client={queryClient}>
                    <AddEventModal open={true} onClose={mockOnClose} />
                </QueryClientProvider>
            );
            expect(screen.getByTestId('modal')).toBeInTheDocument();
        });
    });
});
