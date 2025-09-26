import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import toast from 'react-hot-toast';
import UpdateEventForm from '../UpdateEventForm';
import { CalendarEvent } from '../../../features/events/dtos';

// Mock dependencies
jest.mock('react-hot-toast', () => ({
    error: jest.fn(),
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: () => <span>Icon</span>,
}));

jest.mock('../EventTypeToggle', () => {
    return function MockEventTypeToggle({ type }: any) {
        return <div>Event Type: {type}</div>;
    };
});

jest.mock('../EventTypeSelect', () => {
    return function MockEventTypeSelect({ value, onChange }: any) {
        return (
            <select value={value} onChange={(e) => onChange(e.target.value)} data-testid="event-type-select">
                <option value="Work">Work</option>
                <option value="Meeting">Meeting</option>
            </select>
        );
    };
});

describe('UpdateEventForm', () => {
    const mockOnSubmit = jest.fn();
    const mockOnClose = jest.fn();
    const mockOnDelete = jest.fn();

    const mockEvent: CalendarEvent = {
        id: '123',
        title: 'Team Meeting',
        description: 'Weekly sync',
        eventType: 'Work',
        startDateTime: new Date('2024-01-15T10:00:00'),
        endDateTime: new Date('2024-01-15T11:00:00'),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render form with event data', () => {
        render(
            <UpdateEventForm
                currentEvent={mockEvent}
                onSubmit={mockOnSubmit}
                onClose={mockOnClose}
                onDelete={mockOnDelete}
            />
        );

        expect(screen.getByText('Update Event')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Team Meeting')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Weekly sync')).toBeInTheDocument();
    });

    it('should update title when changed', () => {
        render(
            <UpdateEventForm
                currentEvent={mockEvent}
                onSubmit={mockOnSubmit}
                onClose={mockOnClose}
                onDelete={mockOnDelete}
            />
        );

        const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
        fireEvent.change(titleInput, { target: { value: 'New Title' } });

        expect(titleInput.value).toBe('New Title');
    });

    it('should show error when submitting without title', async () => {
        render(
            <UpdateEventForm
                currentEvent={mockEvent}
                onSubmit={mockOnSubmit}
                onClose={mockOnClose}
                onDelete={mockOnDelete}
            />
        );

        const titleInput = screen.getByLabelText('Title');
        fireEvent.change(titleInput, { target: { value: '' } });

        const updateButton = screen.getByText('Update');
        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Enter all the details');
            expect(mockOnSubmit).not.toHaveBeenCalled();
        });
    });

    it('should submit form with updated data', async () => {
        render(
            <UpdateEventForm
                currentEvent={mockEvent}
                onSubmit={mockOnSubmit}
                onClose={mockOnClose}
                onDelete={mockOnDelete}
            />
        );

        const titleInput = screen.getByLabelText('Title');
        fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

        const updateButton = screen.getByText('Update');
        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Updated Title',
                    startDate: '2024-01-15',
                    endDate: '2024-01-15',
                })
            );
        });
    });

    it('should call onClose when close button is clicked', () => {
        const { container } = render(
            <UpdateEventForm
                currentEvent={mockEvent}
                onSubmit={mockOnSubmit}
                onClose={mockOnClose}
                onDelete={mockOnDelete}
            />
        );

        const closeButton = container.querySelector('.cancel');
        fireEvent.click(closeButton!);

        expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onDelete when delete button is clicked', () => {
        const { container } = render(
            <UpdateEventForm
                currentEvent={mockEvent}
                onSubmit={mockOnSubmit}
                onClose={mockOnClose}
                onDelete={mockOnDelete}
            />
        );

        const deleteButtons = container.querySelectorAll('.cancel');
        fireEvent.click(deleteButtons[1]); // Second cancel button is delete

        expect(mockOnDelete).toHaveBeenCalled();
    });
});
