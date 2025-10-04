import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventTypeToggle from '../../event/EventTypeToggle';
import { EventType, EVENT_TYPE_META } from '../../../utils/constants';

// Mock the ToggleGroup component
jest.mock('../../event/ToggleGroup', () => {
  return function MockToggleGroup({ options, selected, onChange, className, ariaLabel }: any) {
    return (
      <div className={className} aria-label={ariaLabel}>
        {options.map((option: any) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            aria-pressed={selected === option.value}
            data-testid={`toggle-${option.value}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  };
});

// Mock EVENT_TYPE_META for testing
jest.mock('../../../utils/constants', () => ({
  EventType: {
    MEETING: 'Work',
    TASK: 'task',
    REMINDER: 'Reminder',
  },
  EVENT_TYPE_META: {
    Work: {
      label: 'Meeting',
      icon: 'Work-icon',
      color: '#0000FF',
    },
    task: {
      label: 'Task',
      icon: 'task-icon',
      color: '#00FF00',
    },
    Reminder: {
      label: 'Reminder',
      icon: 'Reminder-icon',
      color: '#FF0000',
    },
  },
}));

describe('EventTypeToggle', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all event type options', () => {
      render(<EventTypeToggle type="Work" onChange={mockOnChange} />);
      
      expect(screen.getByText('Meeting')).toBeInTheDocument();
      expect(screen.getByText('Task')).toBeInTheDocument();
      expect(screen.getByText('Reminder')).toBeInTheDocument();
    });

    it('should have correct class name', () => {
      const { container } = render(
        <EventTypeToggle type="Work" onChange={mockOnChange} />
      );
      
      expect(container.querySelector('.view-toggle')).toBeInTheDocument();
    });

    it('should have correct aria-label', () => {
      render(<EventTypeToggle type="Work" onChange={mockOnChange} />);
      
      expect(screen.getByLabelText('Event type')).toBeInTheDocument();
    });

    it('should highlight selected type', () => {
      render(<EventTypeToggle type="Work" onChange={mockOnChange} />);
      
      const WorkButton = screen.getByText('Meeting');
      expect(WorkButton).toHaveAttribute('aria-pressed', 'true');
      
      const taskButton = screen.getByText('Task');
      expect(taskButton).toHaveAttribute('aria-pressed', 'false');
      
      const ReminderButton = screen.getByText('Reminder');
      expect(ReminderButton).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('User Interactions', () => {
    it('should call onChange when Meeting is clicked', () => {
      render(<EventTypeToggle type="Reminder" onChange={mockOnChange} />);
      
      fireEvent.click(screen.getByText('Meeting'));
      
      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith('Work');
    });

    it('should call onChange when Task is clicked', () => {
      render(<EventTypeToggle type="Work" onChange={mockOnChange} />);
      
      fireEvent.click(screen.getByText('Task'));
      
      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith('task');
    });

    it('should call onChange when Reminder is clicked', () => {
      render(<EventTypeToggle type="Work" onChange={mockOnChange} />);
      
      fireEvent.click(screen.getByText('Reminder'));
      
      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith('Reminder');
    });

    it('should handle multiple clicks', () => {
      render(<EventTypeToggle type="Work" onChange={mockOnChange} />);
      
      fireEvent.click(screen.getByText('Task'));
      fireEvent.click(screen.getByText('Reminder'));
      fireEvent.click(screen.getByText('Meeting'));
      
      expect(mockOnChange).toHaveBeenCalledTimes(3);
      expect(mockOnChange).toHaveBeenNthCalledWith(1, 'task');
      expect(mockOnChange).toHaveBeenNthCalledWith(2, 'Reminder');
      expect(mockOnChange).toHaveBeenNthCalledWith(3, 'Work');
    });
  });

  describe('Props Updates', () => {
    it('should handle onChange prop update', () => {
      const newMockOnChange = jest.fn();
      
      const { rerender } = render(
        <EventTypeToggle type="Work" onChange={mockOnChange} />
      );
      
      fireEvent.click(screen.getByText('Task'));
      expect(mockOnChange).toHaveBeenCalledWith('task');
      
      rerender(<EventTypeToggle type="Work" onChange={newMockOnChange} />);
      
      fireEvent.click(screen.getByText('Reminder'));
      expect(newMockOnChange).toHaveBeenCalledWith('Reminder');
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('EventType Integration', () => {
    it('should generate options from EVENT_TYPE_META', () => {
      render(<EventTypeToggle type="Work" onChange={mockOnChange} />);
      
      Object.keys(EVENT_TYPE_META).forEach(key => {
        const meta = EVENT_TYPE_META[key as EventType];
        expect(screen.getByText(meta.label)).toBeInTheDocument();
      });
    });

    it('should pass correct option structure to ToggleGroup', () => {
      const { container } = render(
        <EventTypeToggle type="Work" onChange={mockOnChange} />
      );
      
      const buttons = container.querySelectorAll('button');
      expect(buttons).toHaveLength(Object.keys(EVENT_TYPE_META).length);
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard accessible', () => {
      render(<EventTypeToggle type="Work" onChange={mockOnChange} />);
      
      const taskButton = screen.getByText('Task');
      
      taskButton.focus();
      expect(taskButton).toHaveFocus();
    });

    it('should have descriptive labels', () => {
      render(<EventTypeToggle type="Work" onChange={mockOnChange} />);
      
      expect(screen.getByText('Meeting')).toBeInTheDocument();
      expect(screen.getByText('Task')).toBeInTheDocument();
      expect(screen.getByText('Reminder')).toBeInTheDocument();
    });
  });
});
