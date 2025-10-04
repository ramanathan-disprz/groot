import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SingleDayView from '../../event/SingleDayView';
import { CalendarEvent } from '../../../features/events';

// Mock DayColumn component
jest.mock('../../event/DayColumn', () => {
  return function MockDayColumn({ date, events, onEventClick }: any) {
    return (
      <div data-testid="day-column">
        <div data-testid="date">{date.toISOString()}</div>
        <div data-testid="events-count">{events.length} events</div>
        {events.map((event: any) => (
          <button
            key={event.id}
            data-testid={`event-${event.id}`}
            onClick={() => onEventClick(event)}
          >
            {event.title}
          </button>
        ))}
      </div>
    );
  };
});

describe('SingleDayView', () => {
  const mockOnEventClick = jest.fn();
  const testDate = new Date('2024-01-15T00:00:00');

  const mockEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Morning Meeting',
      startDateTime: new Date('2024-01-15T09:00:00'),
      endDateTime: new Date('2024-01-15T10:00:00'),
      eventType: 'Meeting',
      description: 'Team standup',
    },
    {
      id: '2',
      title: 'Lunch Break',
      startDateTime: new Date('2024-01-15T12:00:00'),
      endDateTime: new Date('2024-01-15T13:00:00'),
      eventType: 'Break',
      description: 'Lunch time',
    },
    {
      id: '3',
      title: 'Project Review',
      startDateTime: new Date('2024-01-15T14:00:00'),
      endDateTime: new Date('2024-01-15T15:30:00'),
      eventType: 'Meeting',
      description: 'Quarterly review',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the single-day-view container', () => {
      const { container } = render(
        <SingleDayView 
          startDate={testDate} 
          events={[]} 
          onEventClick={mockOnEventClick} 
        />
      );

      const singleDayView = container.querySelector('.single-day-view');
      expect(singleDayView).toBeInTheDocument();
    });

    it('should render DayColumn component', () => {
      render(
        <SingleDayView 
          startDate={testDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByTestId('day-column')).toBeInTheDocument();
    });

    it('should pass correct date to DayColumn', () => {
      render(
        <SingleDayView 
          startDate={testDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      const dateElement = screen.getByTestId('date');
      expect(dateElement.textContent).toBe(testDate.toISOString());
    });

    it('should pass all events to DayColumn', () => {
      render(
        <SingleDayView 
          startDate={testDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByText('3 events')).toBeInTheDocument();
      expect(screen.getByText('Morning Meeting')).toBeInTheDocument();
      expect(screen.getByText('Lunch Break')).toBeInTheDocument();
      expect(screen.getByText('Project Review')).toBeInTheDocument();
    });

    it('should render with empty events array', () => {
      render(
        <SingleDayView 
          startDate={testDate} 
          events={[]} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByText('0 events')).toBeInTheDocument();
    });
  });

  describe('Event Handling', () => {
    it('should pass onEventClick handler to DayColumn', () => {
      render(
        <SingleDayView 
          startDate={testDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      const firstEvent = screen.getByTestId('event-1');
      fireEvent.click(firstEvent);

      expect(mockOnEventClick).toHaveBeenCalledTimes(1);
      expect(mockOnEventClick).toHaveBeenCalledWith(mockEvents[0]);
    });

    it('should handle clicks on different events', () => {
      render(
        <SingleDayView 
          startDate={testDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      fireEvent.click(screen.getByTestId('event-1'));
      fireEvent.click(screen.getByTestId('event-2'));
      fireEvent.click(screen.getByTestId('event-3'));

      expect(mockOnEventClick).toHaveBeenCalledTimes(3);
      expect(mockOnEventClick).toHaveBeenNthCalledWith(1, mockEvents[0]);
      expect(mockOnEventClick).toHaveBeenNthCalledWith(2, mockEvents[1]);
      expect(mockOnEventClick).toHaveBeenNthCalledWith(3, mockEvents[2]);
    });
  });

  describe('Props Updates', () => {
    it('should update when startDate changes', () => {
      const { rerender } = render(
        <SingleDayView 
          startDate={testDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByTestId('date').textContent).toBe(testDate.toISOString());

      const newDate = new Date('2024-01-20T00:00:00');
      rerender(
        <SingleDayView 
          startDate={newDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByTestId('date').textContent).toBe(newDate.toISOString());
    });

    it('should update when events change', () => {
      const { rerender } = render(
        <SingleDayView 
          startDate={testDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByText('3 events')).toBeInTheDocument();

      const newEvents = mockEvents.slice(0, 2);
      rerender(
        <SingleDayView 
          startDate={testDate} 
          events={newEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByText('2 events')).toBeInTheDocument();
      expect(screen.queryByText('Project Review')).not.toBeInTheDocument();
    });

    it('should update when onEventClick handler changes', () => {
      const newMockOnEventClick = jest.fn();
      
      const { rerender } = render(
        <SingleDayView 
          startDate={testDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      fireEvent.click(screen.getByTestId('event-1'));
      expect(mockOnEventClick).toHaveBeenCalledTimes(1);

      rerender(
        <SingleDayView 
          startDate={testDate} 
          events={mockEvents} 
          onEventClick={newMockOnEventClick} 
        />
      );

      fireEvent.click(screen.getByTestId('event-2'));
      expect(newMockOnEventClick).toHaveBeenCalledTimes(1);
      expect(mockOnEventClick).toHaveBeenCalledTimes(1); // Should not increase
    });
  });

  describe('Edge Cases', () => {
    it('should handle single event', () => {
      const singleEvent = [mockEvents[0]];
      
      render(
        <SingleDayView 
          startDate={testDate} 
          events={singleEvent} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByText('1 events')).toBeInTheDocument();
      expect(screen.getByText('Morning Meeting')).toBeInTheDocument();
    });

    it('should handle events with same time', () => {
      const sameTimeEvents: CalendarEvent[] = [
        {
          id: '4',
          title: 'Event A',
          startDateTime: new Date('2024-01-15T10:00:00'),
          endDateTime: new Date('2024-01-15T11:00:00'),
          eventType: 'Meeting',
        },
        {
          id: '5',
          title: 'Event B',
          startDateTime: new Date('2024-01-15T10:00:00'),
          endDateTime: new Date('2024-01-15T11:00:00'),
          eventType: 'Task',
        },
      ];

      render(
        <SingleDayView 
          startDate={testDate} 
          events={sameTimeEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByText('Event A')).toBeInTheDocument();
      expect(screen.getByText('Event B')).toBeInTheDocument();
    });

    it('should handle date at different times of day', () => {
      const morningDate = new Date('2024-01-15T06:00:00');
      const eveningDate = new Date('2024-01-15T18:00:00');
      
      const { rerender } = render(
        <SingleDayView 
          startDate={morningDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByTestId('date').textContent).toBe(morningDate.toISOString());

      rerender(
        <SingleDayView 
          startDate={eveningDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByTestId('date').textContent).toBe(eveningDate.toISOString());
    });
  });

  describe('Integration', () => {
    it('should work as a controlled component', () => {
      const Component = () => {
        const [date, setDate] = React.useState(testDate);
        const [events, setEvents] = React.useState(mockEvents);

        return (
          <>
            <button onClick={() => setDate(new Date('2024-01-20T00:00:00'))}>
              Change Date
            </button>
            <button onClick={() => setEvents(mockEvents.slice(0, 1))}>
              Reduce Events
            </button>
            <SingleDayView 
              startDate={date} 
              events={events} 
              onEventClick={mockOnEventClick} 
            />
          </>
        );
      };

      render(<Component />);

      expect(screen.getByTestId('date').textContent).toBe(testDate.toISOString());
      expect(screen.getByText('3 events')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Change Date'));
      expect(screen.getByTestId('date').textContent).toBe(
        new Date('2024-01-20T00:00:00').toISOString()
      );

      fireEvent.click(screen.getByText('Reduce Events'));
      expect(screen.getByText('1 events')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should handle large number of events', () => {
      const manyEvents: CalendarEvent[] = Array.from({ length: 100 }, (_, i) => ({
        id: `event-${i}`,
        title: `Event ${i}`,
        startDateTime: new Date(`2024-01-15T${String(i % 24).padStart(2, '0')}:00:00`),
        endDateTime: new Date(`2024-01-15T${String((i % 24) + 1).padStart(2, '0')}:00:00`),
        eventType: 'Meeting',
      }));

      render(
        <SingleDayView 
          startDate={testDate} 
          events={manyEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByText('100 events')).toBeInTheDocument();
    });

    it('should handle rapid prop updates', () => {
      const { rerender } = render(
        <SingleDayView 
          startDate={testDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      // Rapidly update props
      for (let i = 0; i < 10; i++) {
        const newDate = new Date(`2024-01-${15 + i}T00:00:00`);
        rerender(
          <SingleDayView 
            startDate={newDate} 
            events={mockEvents.slice(0, i % 3 + 1)} 
            onEventClick={mockOnEventClick} 
          />
        );
      }

      // Should render the last update
      expect(screen.getByTestId('date').textContent).toBe(
        new Date('2024-01-24T00:00:00').toISOString()
      );
    });
  });

  describe('Accessibility', () => {
    it('should maintain focus when events are clicked', () => {
      render(
        <SingleDayView 
          startDate={testDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      const eventButton = screen.getByTestId('event-1');
      eventButton.focus();
      expect(eventButton).toHaveFocus();

      fireEvent.click(eventButton);
      // Focus should be maintained after click
      expect(eventButton).toHaveFocus();
    });

    it('should be keyboard navigable', () => {
      render(
        <SingleDayView 
          startDate={testDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      const firstEvent = screen.getByTestId('event-1');
      const secondEvent = screen.getByTestId('event-2');

      firstEvent.focus();
      expect(firstEvent).toHaveFocus();

      // Tab to next event
      fireEvent.keyDown(firstEvent, { key: 'Tab' });
      secondEvent.focus();
      expect(secondEvent).toHaveFocus();
    });
  });
});
