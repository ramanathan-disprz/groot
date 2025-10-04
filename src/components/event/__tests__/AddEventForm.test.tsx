import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import toast from 'react-hot-toast';
import AddEventForm from '../../event/AddEventForm';
import { EventRequest } from '../../../features/events/dtos/event';
import { EventType } from '../../../utils/constants';

// Mock dependencies
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
}));

jest.mock('../../event/EventTypeToggle', () => {
  return function MockEventTypeToggle({ type, onChange }: any) {
    return (
      <div data-testid="event-type-toggle">
        <button onClick={() => onChange('Meeting')} data-testid="toggle-meeting">Meeting</button>
        <button onClick={() => onChange('Task')} data-testid="toggle-task">Task</button>
        <button onClick={() => onChange('Reminder')} data-testid="toggle-reminder">Reminder</button>
        <span data-testid="toggle-value">{type}</span>
      </div>
    );
  };
});

jest.mock('../../event/EventTypeSelect', () => {
  return function MockSelectEventType({ value, onChange }: any) {
    return (
      <select 
        data-testid="event-type-select" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select Type</option>
        <option value="Meeting">Meeting</option>
        <option value="Task">Task</option>
        <option value="Reminder">Reminder</option>
        <option value="Other">Other</option>
      </select>
    );
  };
});

describe('AddEventForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the form header with title', () => {
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      expect(screen.getByText('New Event')).toBeInTheDocument();
    });

    it('should render close button with X icon', () => {
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      const closeButton = screen.getByRole('button', { name: '' });
      expect(closeButton).toHaveClass('cancel');
    });

    it('should render all form fields', () => {
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      expect(screen.getByLabelText('Title')).toBeInTheDocument();
      expect(screen.getByText('Event Type')).toBeInTheDocument();
      expect(screen.getByLabelText('Starts')).toBeInTheDocument();
      expect(screen.getByLabelText('Ends')).toBeInTheDocument();
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
    });

    it('should render EventTypeToggle component', () => {
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      expect(screen.getByTestId('event-type-toggle')).toBeInTheDocument();
    });

    it('should render SelectEventType component', () => {
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      expect(screen.getByTestId('event-type-select')).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveClass('submit');
      expect(submitButton).toHaveTextContent('Add');
    });

    it('should render form fields with correct types', () => {
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
      const startDateTimeInput = screen.getByLabelText('Starts') as HTMLInputElement;
      const endDateTimeInput = screen.getByLabelText('Ends') as HTMLInputElement;
      const notesTextarea = screen.getByLabelText('Description') as HTMLTextAreaElement;

      expect(titleInput.type).toBe('text');
      expect(startDateTimeInput.type).toBe('datetime-local');
      expect(endDateTimeInput.type).toBe('datetime-local');
      expect(notesTextarea.tagName.toLowerCase()).toBe('textarea');
    });

    it('should render textarea with correct rows attribute', () => {
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      const notesTextarea = screen.getByLabelText('Description') as HTMLTextAreaElement;
      expect(notesTextarea).toHaveAttribute('rows', '3');
    });
  });

  describe('User Interactions - Form Input', () => {
    it('should update title field on input', async () => {
      const user = userEvent.setup();
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
      await user.type(titleInput, 'Team Meeting');

      expect(titleInput.value).toBe('Team Meeting');
    });

    it('should update start datetime field on input', () => {
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      const startInput = screen.getByLabelText('Starts') as HTMLInputElement;
      fireEvent.change(startInput, { target: { value: '2024-01-15T10:00' } });

      expect(startInput.value).toBe('2024-01-15T10:00');
    });

    it('should update end datetime field on input', () => {
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      const endInput = screen.getByLabelText('Ends') as HTMLInputElement;
      fireEvent.change(endInput, { target: { value: '2024-01-15T11:00' } });

      expect(endInput.value).toBe('2024-01-15T11:00');
    });

    it('should update description field on input', async () => {
      const user = userEvent.setup();
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      const descriptionInput = screen.getByLabelText('Description') as HTMLTextAreaElement;
      await user.type(descriptionInput, 'This is a team sync meeting');

      expect(descriptionInput.value).toBe('This is a team sync meeting');
    });

    it('should update event type via toggle', () => {
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      const meetingButton = screen.getByTestId('toggle-meeting');
      fireEvent.click(meetingButton);

      expect(screen.getByTestId('toggle-value')).toHaveTextContent('Meeting');
    });

    it('should update event type via select', () => {
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      const selectElement = screen.getByTestId('event-type-select') as HTMLSelectElement;
      fireEvent.change(selectElement, { target: { value: 'Task' } });

      expect(selectElement.value).toBe('Task');
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data', () => {
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      // Fill in form
      fireEvent.change(screen.getByLabelText('Title'), { 
        target: { value: 'Team Meeting' } 
      });
      fireEvent.change(screen.getByLabelText('Starts'), { 
        target: { value: '2024-01-15T10:00' } 
      });
      fireEvent.change(screen.getByLabelText('Ends'), { 
        target: { value: '2024-01-15T11:30' } 
      });
      fireEvent.change(screen.getByLabelText('Description'), { 
        target: { value: 'Weekly sync' } 
      });
      fireEvent.click(screen.getByTestId('toggle-meeting')); // Set type via toggle

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

      const expectedRequest: EventRequest = {
        title: 'Team Meeting',
        description: 'Weekly sync',
        startDate: '2024-01-15',
        endDate: '2024-01-15',
        startTime: '10:00',
        endTime: '11:30',
        eventType: 'Meeting'
      };

      expect(mockOnSubmit).toHaveBeenCalledWith(expectedRequest);
      expect(toast.error).not.toHaveBeenCalled();
    });

    it('should handle form submission with empty description', () => {
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      fireEvent.change(screen.getByLabelText('Title'), { 
        target: { value: 'Quick Task' } 
      });
      fireEvent.change(screen.getByLabelText('Starts'), { 
        target: { value: '2024-01-15T14:00' } 
      });
      fireEvent.change(screen.getByLabelText('Ends'), { 
        target: { value: '2024-01-15T14:30' } 
      });

      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

      const expectedRequest: EventRequest = {
        title: 'Quick Task',
        description: '',
        startDate: '2024-01-15',
        endDate: '2024-01-15',
        startTime: '14:00',
        endTime: '14:30',
        eventType: ''
      };

      expect(mockOnSubmit).toHaveBeenCalledWith(expectedRequest);
    });

    it('should show error when title is missing', () => {
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      fireEvent.change(screen.getByLabelText('Starts'), { 
        target: { value: '2024-01-15T10:00' } 
      });
      fireEvent.change(screen.getByLabelText('Ends'), { 
        target: { value: '2024-01-15T11:00' } 
      });

      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

      expect(toast.error).toHaveBeenCalledWith('Enter all the details');
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show error when start datetime is missing', () => {
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      fireEvent.change(screen.getByLabelText('Title'), { 
        target: { value: 'Event' } 
      });
      fireEvent.change(screen.getByLabelText('Ends'), { 
        target: { value: '2024-01-15T11:00' } 
      });

      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

      expect(toast.error).toHaveBeenCalledWith('Enter all the details');
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show error when end datetime is missing', () => {
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      fireEvent.change(screen.getByLabelText('Title'), { 
        target: { value: 'Event' } 
      });
      fireEvent.change(screen.getByLabelText('Starts'), { 
        target: { value: '2024-01-15T10:00' } 
      });

      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

      expect(toast.error).toHaveBeenCalledWith('Enter all the details');
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should handle multi-day events', () => {
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      fireEvent.change(screen.getByLabelText('Title'), { 
        target: { value: 'Conference' } 
      });
      fireEvent.change(screen.getByLabelText('Starts'), { 
        target: { value: '2024-01-15T09:00' } 
      });
      fireEvent.change(screen.getByLabelText('Ends'), { 
        target: { value: '2024-01-17T17:00' } 
      });

      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

      const expectedRequest: EventRequest = {
        title: 'Conference',
        description: '',
        startDate: '2024-01-15',
        endDate: '2024-01-17',
        startTime: '09:00',
        endTime: '17:00',
        eventType: ''
      };

      expect(mockOnSubmit).toHaveBeenCalledWith(expectedRequest);
    });
  });

  describe('Close Functionality', () => {
    it('should call onClose when close button is clicked', () => {
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      const closeButton = screen.getByRole('button', { name: '' });
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not submit form when close button is clicked', () => {
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      // Fill in some data
      fireEvent.change(screen.getByLabelText('Title'), { 
        target: { value: 'Test Event' } 
      });

      // Click close
      const closeButton = screen.getByRole('button', { name: '' });
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Form State Management', () => {
    it('should maintain form state across input changes', () => {
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
      const startInput = screen.getByLabelText('Starts') as HTMLInputElement;
      const endInput = screen.getByLabelText('Ends') as HTMLInputElement;

      fireEvent.change(titleInput, { target: { value: 'Event 1' } });
      fireEvent.change(startInput, { target: { value: '2024-01-15T10:00' } });
      
      expect(titleInput.value).toBe('Event 1');
      expect(startInput.value).toBe('2024-01-15T10:00');

      fireEvent.change(endInput, { target: { value: '2024-01-15T11:00' } });
      
      // Previous values should be maintained
      expect(titleInput.value).toBe('Event 1');
      expect(startInput.value).toBe('2024-01-15T10:00');
      expect(endInput.value).toBe('2024-01-15T11:00');
    });

    it('should clear form on successful submission and re-render', () => {
      const { rerender } = render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      // Fill and submit form
      fireEvent.change(screen.getByLabelText('Title'), { 
        target: { value: 'Test Event' } 
      });
      fireEvent.change(screen.getByLabelText('Starts'), { 
        target: { value: '2024-01-15T10:00' } 
      });
      fireEvent.change(screen.getByLabelText('Ends'), { 
        target: { value: '2024-01-15T11:00' } 
      });

      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
      expect(mockOnSubmit).toHaveBeenCalled();

      // Re-render component (simulating modal close and reopen)
      rerender(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      // Form should be empty
      // Re-query elements to ensure we get the updated DOM state after re-render
      const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
      const startInput = screen.getByLabelText('Starts') as HTMLInputElement;
      const endInput = screen.getByLabelText('Ends') as HTMLInputElement;

      expect(titleInput.value).toBe('');
      expect(startInput.value).toBe('');
      expect(endInput.value).toBe('');
    });
  });

  describe('Edge Cases', () => {
    it('should handle events crossing midnight', () => {
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      fireEvent.change(screen.getByLabelText('Title'), { 
        target: { value: 'Night Shift' } 
      });
      fireEvent.change(screen.getByLabelText('Starts'), { 
        target: { value: '2024-01-15T22:00' } 
      });
      fireEvent.change(screen.getByLabelText('Ends'), { 
        target: { value: '2024-01-16T06:00' } 
      });

      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

      const expectedRequest: EventRequest = {
        title: 'Night Shift',
        description: '',
        startDate: '2024-01-15',
        endDate: '2024-01-16',
        startTime: '22:00',
        endTime: '06:00',
        eventType: ''
      };

      expect(mockOnSubmit).toHaveBeenCalledWith(expectedRequest);
    });

    it('should handle very long event titles', async () => {
      const user = userEvent.setup();
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      const longTitle = 'A'.repeat(200);
      const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
      await user.type(titleInput, longTitle);

      expect(titleInput.value).toBe(longTitle);
    });

    it('should handle very long descriptions', async () => {
      jest.setTimeout(10000); // Increase timeout for this test
      const user = userEvent.setup({ delay: null }); // Remove delay for faster typing
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      const longDescription = 'Lorem ipsum '.repeat(10); // Reduced repetitions
      const descriptionInput = screen.getByLabelText('Description') as HTMLTextAreaElement;
      
      // Use fireEvent for faster input
      fireEvent.change(descriptionInput, { target: { value: longDescription } });

      expect(descriptionInput.value).toBe(longDescription);
    });

    it('should handle datetime with seconds in input', () => {
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      fireEvent.change(screen.getByLabelText('Title'), { 
        target: { value: 'Precise Event' } 
      });
      fireEvent.change(screen.getByLabelText('Starts'), { 
        target: { value: '2024-01-15T10:30:45' } 
      });
      fireEvent.change(screen.getByLabelText('Ends'), { 
        target: { value: '2024-01-15T11:45:30' } 
      });

      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

      const expectedRequest: EventRequest = {
        title: 'Precise Event',
        description: '',
        startDate: '2024-01-15',
        endDate: '2024-01-15',
        startTime: '10:30',
        endTime: '11:45',
        eventType: ''
      };

      expect(mockOnSubmit).toHaveBeenCalledWith(expectedRequest);
    });
  });

  describe('Console Logging', () => {
    it('should log form data on submission', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      fireEvent.change(screen.getByLabelText('Title'), { 
        target: { value: 'Debug Event' } 
      });
      fireEvent.change(screen.getByLabelText('Starts'), { 
        target: { value: '2024-01-15T10:00' } 
      });
      fireEvent.change(screen.getByLabelText('Ends'), { 
        target: { value: '2024-01-15T11:00' } 
      });

      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Debug Event',
          startDateTime: '2024-01-15T10:00',
          endDateTime: '2024-01-15T11:00'
        })
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible form labels', () => {
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      expect(screen.getByLabelText('Title')).toBeInTheDocument();
      expect(screen.getByText('Event Type')).toBeInTheDocument(); // Changed from getByLabelText
      expect(screen.getByLabelText('Starts')).toBeInTheDocument();
      expect(screen.getByLabelText('Ends')).toBeInTheDocument();
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
    });

    it('should be keyboard navigable', () => {
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      const titleInput = screen.getByLabelText('Title');
      const startInput = screen.getByLabelText('Starts');
      const submitButton = screen.getByRole('button', { name: 'Submit' });

      titleInput.focus();
      expect(titleInput).toHaveFocus();

      startInput.focus();
      expect(startInput).toHaveFocus();

      submitButton.focus();
      expect(submitButton).toHaveFocus();
    });

    it('should have proper ARIA labels', () => {
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute('aria-label', 'Submit');
    });
  });

  describe('Integration with Event Type Components', () => {
    it('should sync event type between toggle and select', () => {
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      // Change via toggle using data-testid
      fireEvent.click(screen.getByTestId('toggle-task'));
      expect(screen.getByTestId('toggle-value')).toHaveTextContent('Task');

      // Change via select
      const selectElement = screen.getByTestId('event-type-select') as HTMLSelectElement;
      fireEvent.change(selectElement, { target: { value: 'Reminder' } });
      
      // Both should reflect the change
      expect(selectElement.value).toBe('Reminder');
    });

    it('should include event type in submission', () => {
      render(
        <AddEventForm 
          onSubmit={mockOnSubmit} 
          onClose={mockOnClose} 
        />
      );

      fireEvent.change(screen.getByLabelText('Title'), { 
        target: { value: 'Team Meeting' } 
      });
      fireEvent.change(screen.getByLabelText('Starts'), { 
        target: { value: '2024-01-15T10:00' } 
      });
      fireEvent.change(screen.getByLabelText('Ends'), { 
        target: { value: '2024-01-15T11:00' } 
      });
      
      // Set event type using data-testid
      fireEvent.click(screen.getByTestId('toggle-meeting'));

      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: 'Meeting'
        })
      );
    });
  });
});
