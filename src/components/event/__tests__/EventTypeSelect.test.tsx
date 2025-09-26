import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SelectEventType from '../../event/EventTypeSelect';
import { EVENT_TYPE_META, EventType } from '../../../utils/constants';

// Mock EVENT_TYPE_META
jest.mock('../../../utils/constants', () => ({
  EventType: {
    MEETING: 'Meeting',
    TASK: 'Task',
    REMINDER: 'Reminder',
    OTHER: 'Other',
  },
  EVENT_TYPE_META: {
    Meeting: {
      label: 'Meeting',
      icon: 'meeting-icon',
      color: '#0000FF',
    },
    Task: {
      label: 'Task',
      icon: 'task-icon',
      color: '#00FF00',
    },
    Reminder: {
      label: 'Reminder',
      icon: 'reminder-icon',
      color: '#FF0000',
    },
    Other: {
      label: 'Other',
      icon: 'other-icon',
      color: '#808080',
    },
  },
}));

describe('SelectEventType', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render a select element', () => {
      render(
        <SelectEventType 
          value="Meeting" 
          onChange={mockOnChange} 
        />
      );

      const selectElement = screen.getByRole('combobox');
      expect(selectElement).toBeInTheDocument();
    });

    it('should render all event type options', () => {
      render(
        <SelectEventType 
          value="Meeting" 
          onChange={mockOnChange} 
        />
      );

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(Object.keys(EVENT_TYPE_META).length);
      
      expect(screen.getByRole('option', { name: 'Meeting' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Task' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Reminder' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Other' })).toBeInTheDocument();
    });

    it('should display the selected value', () => {
      render(
        <SelectEventType 
          value="Task" 
          onChange={mockOnChange} 
        />
      );

      const selectElement = screen.getByRole('combobox') as HTMLSelectElement;
      expect(selectElement.value).toBe('Task');
    });

    it('should have correct option values', () => {
      render(
        <SelectEventType 
          value="Meeting" 
          onChange={mockOnChange} 
        />
      );

      const meetingOption = screen.getByRole('option', { name: 'Meeting' }) as HTMLOptionElement;
      const taskOption = screen.getByRole('option', { name: 'Task' }) as HTMLOptionElement;
      const reminderOption = screen.getByRole('option', { name: 'Reminder' }) as HTMLOptionElement;
      const otherOption = screen.getByRole('option', { name: 'Other' }) as HTMLOptionElement;

      expect(meetingOption.value).toBe('Meeting');
      expect(taskOption.value).toBe('Task');
      expect(reminderOption.value).toBe('Reminder');
      expect(otherOption.value).toBe('Other');
    });
  });

  describe('User Interactions', () => {
    it('should call onChange when a new option is selected', () => {
      render(
        <SelectEventType 
          value="Meeting" 
          onChange={mockOnChange} 
        />
      );

      const selectElement = screen.getByRole('combobox');
      fireEvent.change(selectElement, { target: { value: 'Task' } });

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith('Task');
    });

    it('should handle multiple selection changes', () => {
      render(
        <SelectEventType 
          value="Meeting" 
          onChange={mockOnChange} 
        />
      );

      const selectElement = screen.getByRole('combobox');
      
      fireEvent.change(selectElement, { target: { value: 'Task' } });
      fireEvent.change(selectElement, { target: { value: 'Reminder' } });
      fireEvent.change(selectElement, { target: { value: 'Other' } });

      expect(mockOnChange).toHaveBeenCalledTimes(3);
      expect(mockOnChange).toHaveBeenNthCalledWith(1, 'Task');
      expect(mockOnChange).toHaveBeenNthCalledWith(2, 'Reminder');
      expect(mockOnChange).toHaveBeenNthCalledWith(3, 'Other');
    });

    it('should call onChange even when selecting the same value', () => {
      render(
        <SelectEventType 
          value="Meeting" 
          onChange={mockOnChange} 
        />
      );

      const selectElement = screen.getByRole('combobox');
      fireEvent.change(selectElement, { target: { value: 'Meeting' } });

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith('Meeting');
    });
  });

  describe('Props Updates', () => {
    it('should update selected value when prop changes', () => {
      const { rerender } = render(
        <SelectEventType 
          value="Meeting" 
          onChange={mockOnChange} 
        />
      );

      let selectElement = screen.getByRole('combobox') as HTMLSelectElement;
      expect(selectElement.value).toBe('Meeting');

      rerender(
        <SelectEventType 
          value="Task" 
          onChange={mockOnChange} 
        />
      );

      selectElement = screen.getByRole('combobox') as HTMLSelectElement;
      expect(selectElement.value).toBe('Task');

      rerender(
        <SelectEventType 
          value="Reminder" 
          onChange={mockOnChange} 
        />
      );

      selectElement = screen.getByRole('combobox') as HTMLSelectElement;
      expect(selectElement.value).toBe('Reminder');
    });

    it('should handle onChange prop update', () => {
      const newMockOnChange = jest.fn();
      
      const { rerender } = render(
        <SelectEventType 
          value="Meeting" 
          onChange={mockOnChange} 
        />
      );

      const selectElement = screen.getByRole('combobox');
      fireEvent.change(selectElement, { target: { value: 'Task' } });
      expect(mockOnChange).toHaveBeenCalledWith('Task');

      rerender(
        <SelectEventType 
          value="Meeting" 
          onChange={newMockOnChange} 
        />
      );

      fireEvent.change(selectElement, { target: { value: 'Reminder' } });
      expect(newMockOnChange).toHaveBeenCalledWith('Reminder');
      expect(mockOnChange).toHaveBeenCalledTimes(1); // Should not be called again
    });
  });

  describe('Edge Cases', () => {
    it('should default to first option when empty string value is provided', () => {
      render(
        <SelectEventType 
          value="" 
          onChange={mockOnChange} 
        />
      );

      const selectElement = screen.getByRole('combobox') as HTMLSelectElement;
      // When value is empty, browser defaults to first option
      const firstOptionValue = Object.keys(EVENT_TYPE_META)[0];
      expect(selectElement.value).toBe(firstOptionValue);
    });

    it('should default to first option when value not in options', () => {
      render(
        <SelectEventType 
          value="NonExistentType" 
          onChange={mockOnChange} 
        />
      );

      const selectElement = screen.getByRole('combobox') as HTMLSelectElement;
      // When value doesn't match any option, browser defaults to first option
      const firstOptionValue = Object.keys(EVENT_TYPE_META)[0];
      expect(selectElement.value).toBe(firstOptionValue);
    });

    it('should maintain option order from EVENT_TYPE_META', () => {
      render(
        <SelectEventType 
          value="Meeting" 
          onChange={mockOnChange} 
        />
      );

      const options = screen.getAllByRole('option') as HTMLOptionElement[];
      const expectedOrder = Object.keys(EVENT_TYPE_META);
      
      options.forEach((option, index) => {
        expect(option.value).toBe(expectedOrder[index]);
      });
    });
  });

  describe('Integration with EVENT_TYPE_META', () => {
    it('should generate options from EVENT_TYPE_META keys', () => {
      render(
        <SelectEventType 
          value="Meeting" 
          onChange={mockOnChange} 
        />
      );

      const eventTypes = Object.keys(EVENT_TYPE_META) as EventType[];
      
      eventTypes.forEach(eventType => {
        const option = screen.getByRole('option', { name: EVENT_TYPE_META[eventType].label });
        expect(option).toBeInTheDocument();
      });
    });

    it('should use labels from EVENT_TYPE_META', () => {
      render(
        <SelectEventType 
          value="Meeting" 
          onChange={mockOnChange} 
        />
      );

      Object.entries(EVENT_TYPE_META).forEach(([key, meta]) => {
        const option = screen.getByRole('option', { name: meta.label });
        expect(option).toBeInTheDocument();
        expect((option as HTMLOptionElement).value).toBe(key);
      });
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard accessible', () => {
      render(
        <SelectEventType 
          value="Meeting" 
          onChange={mockOnChange} 
        />
      );

      const selectElement = screen.getByRole('combobox');
      
      // Should be focusable
      selectElement.focus();
      expect(selectElement).toHaveFocus();
    });

    it('should support keyboard navigation', () => {
      render(
        <SelectEventType 
          value="Meeting" 
          onChange={mockOnChange} 
        />
      );

      const selectElement = screen.getByRole('combobox');
      
      // Simulate keyboard events
      fireEvent.keyDown(selectElement, { key: 'ArrowDown' });
      fireEvent.keyDown(selectElement, { key: 'Enter' });
      
      // The select should still be in the document and functional
      expect(selectElement).toBeInTheDocument();
    });

    it('should have proper role attributes', () => {
      render(
        <SelectEventType 
          value="Meeting" 
          onChange={mockOnChange} 
        />
      );

      const selectElement = screen.getByRole('combobox');
      expect(selectElement).toBeInTheDocument();
      
      const options = screen.getAllByRole('option');
      expect(options.length).toBeGreaterThan(0);
    });
  });

  describe('Performance', () => {
    it('should handle rapid value changes', () => {
      const { rerender } = render(
        <SelectEventType 
          value="Meeting" 
          onChange={mockOnChange} 
        />
      );

      const values = ['Task', 'Reminder', 'Other', 'Meeting'];
      
      values.forEach(value => {
        rerender(
          <SelectEventType 
            value={value} 
            onChange={mockOnChange} 
          />
        );
        
        const selectElement = screen.getByRole('combobox') as HTMLSelectElement;
        expect(selectElement.value).toBe(value);
      });
    });

    it('should handle rapid onChange calls', () => {
      render(
        <SelectEventType 
          value="Meeting" 
          onChange={mockOnChange} 
        />
      );

      const selectElement = screen.getByRole('combobox');
      const eventTypes = Object.keys(EVENT_TYPE_META);
      
      // Rapidly change selection
      eventTypes.forEach(eventType => {
        fireEvent.change(selectElement, { target: { value: eventType } });
      });

      expect(mockOnChange).toHaveBeenCalledTimes(eventTypes.length);
    });
  });
});
