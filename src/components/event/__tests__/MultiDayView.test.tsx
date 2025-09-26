import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MultiDayView from '../../event/MultiDayView';
import { CalendarEvent } from '../../../features/events';
import * as dateUtils from '../../../utils/dates';

// Mock DayColumn component
jest.mock('../../event/DayColumn', () => {
  return function MockDayColumn({ date, events, onEventClick }: any) {
    return (
      <div data-testid={`day-column-${date.toISOString()}`}>
        <div data-testid={`date-${date.getDate()}`}>{date.toISOString()}</div>
        <div data-testid={`events-count-${date.getDate()}`}>{events.length} events</div>
        {events.map((event: any) => (
          <button
            key={event.id}
            data-testid={`event-${event.id}-day-${date.getDate()}`}
            onClick={() => onEventClick(event)}
          >
            {event.title}
          </button>
        ))}
      </div>
    );
  };
});

// Mock addDays utility
jest.mock('../../../utils/dates', () => ({
  addDays: jest.fn((date: Date, days: number) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
  }),
}));

describe('MultiDayView', () => {
  const mockOnEventClick = jest.fn();
  const testDate = new Date('2024-01-15T00:00:00');
  const nextDay = new Date('2024-01-16T00:00:00');

  const mockEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Day 1 Morning Meeting',
      startDateTime: new Date('2024-01-15T09:00:00'),
      endDateTime: new Date('2024-01-15T10:00:00'),
      eventType: 'Meeting',
      description: 'Team standup',
    },
    {
      id: '2',
      title: 'Day 1 Lunch',
      startDateTime: new Date('2024-01-15T12:00:00'),
      endDateTime: new Date('2024-01-15T13:00:00'),
      eventType: 'Break',
      description: 'Lunch time',
    },
    {
      id: '3',
      title: 'Day 2 Workshop',
      startDateTime: new Date('2024-01-16T10:00:00'),
      endDateTime: new Date('2024-01-16T12:00:00'),
      eventType: 'Meeting',
      description: 'Team workshop',
    },
    {
      id: '4',
      title: 'Day 2 Review',
      startDateTime: new Date('2024-01-16T14:00:00'),
      endDateTime: new Date('2024-01-16T15:00:00'),
      eventType: 'Meeting',
      description: 'Project review',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (dateUtils.addDays as jest.Mock).mockImplementation((date: Date, days: number) => {
      const newDate = new Date(date);
      newDate.setDate(date.getDate() + days);
      return newDate;
    });
  });

  describe('Rendering', () => {
    it('should render the multi-day-view container', () => {
      const { container } = render(
        <MultiDayView 
          startDate={testDate} 
          events={[]} 
          onEventClick={mockOnEventClick} 
        />
      );

      const multiDayView = container.querySelector('.multi-day-view');
      expect(multiDayView).toBeInTheDocument();
    });

    it('should render two DayColumn components', () => {
      render(
        <MultiDayView 
          startDate={testDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByTestId(`day-column-${testDate.toISOString()}`)).toBeInTheDocument();
      expect(screen.getByTestId(`day-column-${nextDay.toISOString()}`)).toBeInTheDocument();
    });

    it('should pass correct dates to DayColumns', () => {
      render(
        <MultiDayView 
          startDate={testDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByTestId('date-15').textContent).toBe(testDate.toISOString());
      expect(screen.getByTestId('date-16').textContent).toBe(nextDay.toISOString());
    });

    it('should pass all events to both DayColumns', () => {
      render(
        <MultiDayView 
          startDate={testDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      // Both columns receive all events (DayColumn will filter them)
      expect(screen.getByTestId('events-count-15').textContent).toBe('4 events');
      expect(screen.getByTestId('events-count-16').textContent).toBe('4 events');
    });

    it('should render with empty events array', () => {
      render(
        <MultiDayView 
          startDate={testDate} 
          events={[]} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByTestId('events-count-15').textContent).toBe('0 events');
      expect(screen.getByTestId('events-count-16').textContent).toBe('0 events');
    });
  });

  describe('Date Calculation', () => {
    it('should call addDays utility with correct parameters', () => {
      render(
        <MultiDayView 
          startDate={testDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(dateUtils.addDays).toHaveBeenCalledWith(testDate, 1);
    });

    it('should handle different start dates', () => {
      const differentDate = new Date('2024-02-20T00:00:00');
      
      render(
        <MultiDayView 
          startDate={differentDate} 
          events={[]} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(dateUtils.addDays).toHaveBeenCalledWith(differentDate, 1);
      expect(screen.getByTestId('date-20')).toBeInTheDocument();
      expect(screen.getByTestId('date-21')).toBeInTheDocument();
    });

    it('should handle month boundaries', () => {
      const monthEndDate = new Date('2024-01-31T00:00:00');
      
      render(
        <MultiDayView 
          startDate={monthEndDate} 
          events={[]} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByTestId('date-31')).toBeInTheDocument();
      expect(screen.getByTestId('date-1')).toBeInTheDocument(); // February 1st
    });

    it('should handle year boundaries', () => {
      const yearEndDate = new Date('2023-12-31T00:00:00');
      
      render(
        <MultiDayView 
          startDate={yearEndDate} 
          events={[]} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByTestId('date-31')).toBeInTheDocument();
      expect(screen.getByTestId('date-1')).toBeInTheDocument(); // January 1st
    });
  });

  describe('Event Handling', () => {
    it('should pass onEventClick handler to both DayColumns', () => {
      render(
        <MultiDayView 
          startDate={testDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      // Click event in first day column
      const firstDayEvent = screen.getByTestId('event-1-day-15');
      fireEvent.click(firstDayEvent);

      expect(mockOnEventClick).toHaveBeenCalledTimes(1);
      expect(mockOnEventClick).toHaveBeenCalledWith(mockEvents[0]);

      // Click event in second day column
      const secondDayEvent = screen.getByTestId('event-3-day-16');
      fireEvent.click(secondDayEvent);

      expect(mockOnEventClick).toHaveBeenCalledTimes(2);
      expect(mockOnEventClick).toHaveBeenCalledWith(mockEvents[2]);
    });

    it('should handle multiple clicks across both days', () => {
      render(
        <MultiDayView 
          startDate={testDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      fireEvent.click(screen.getByTestId('event-1-day-15'));
      fireEvent.click(screen.getByTestId('event-2-day-15'));
      fireEvent.click(screen.getByTestId('event-3-day-16'));
      fireEvent.click(screen.getByTestId('event-4-day-16'));

      expect(mockOnEventClick).toHaveBeenCalledTimes(4);
      expect(mockOnEventClick).toHaveBeenNthCalledWith(1, mockEvents[0]);
      expect(mockOnEventClick).toHaveBeenNthCalledWith(2, mockEvents[1]);
      expect(mockOnEventClick).toHaveBeenNthCalledWith(3, mockEvents[2]);
      expect(mockOnEventClick).toHaveBeenNthCalledWith(4, mockEvents[3]);
    });
  });

  describe('Props Updates', () => {
    it('should update when startDate changes', () => {
      const { rerender } = render(
        <MultiDayView 
          startDate={testDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByTestId('date-15')).toBeInTheDocument();
      expect(screen.getByTestId('date-16')).toBeInTheDocument();

      const newDate = new Date('2024-01-20T00:00:00');
      rerender(
        <MultiDayView 
          startDate={newDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.queryByTestId('date-15')).not.toBeInTheDocument();
      expect(screen.queryByTestId('date-16')).not.toBeInTheDocument();
      expect(screen.getByTestId('date-20')).toBeInTheDocument();
      expect(screen.getByTestId('date-21')).toBeInTheDocument();
    });

    it('should update when events change', () => {
      const { rerender } = render(
        <MultiDayView 
          startDate={testDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByTestId('events-count-15').textContent).toBe('4 events');

      const newEvents = mockEvents.slice(0, 2);
      rerender(
        <MultiDayView 
          startDate={testDate} 
          events={newEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByTestId('events-count-15').textContent).toBe('2 events');
      expect(screen.getByTestId('events-count-16').textContent).toBe('2 events');
    });

    it('should update when onEventClick handler changes', () => {
      const newMockOnEventClick = jest.fn();
      
      const { rerender } = render(
        <MultiDayView 
          startDate={testDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      fireEvent.click(screen.getByTestId('event-1-day-15'));
      expect(mockOnEventClick).toHaveBeenCalledTimes(1);

      rerender(
        <MultiDayView 
          startDate={testDate} 
          events={mockEvents} 
          onEventClick={newMockOnEventClick} 
        />
      );

      fireEvent.click(screen.getByTestId('event-2-day-15'));
      expect(newMockOnEventClick).toHaveBeenCalledTimes(1);
      expect(mockOnEventClick).toHaveBeenCalledTimes(1); // Should not increase
    });
  });

  describe('Edge Cases', () => {
    it('should handle events spanning multiple days', () => {
      const spanningEvent: CalendarEvent = {
        id: '5',
        title: 'Multi-day Event',
        startDateTime: new Date('2024-01-15T22:00:00'),
        endDateTime: new Date('2024-01-16T02:00:00'),
        eventType: 'Meeting',
      };

      render(
        <MultiDayView 
          startDate={testDate} 
          events={[spanningEvent]} 
          onEventClick={mockOnEventClick} 
        />
      );

      // Event should be passed to both columns
      expect(screen.getByTestId('event-5-day-15')).toBeInTheDocument();
      expect(screen.getByTestId('event-5-day-16')).toBeInTheDocument();
    });

    it('should handle weekend dates', () => {
      const saturdayDate = new Date('2024-01-13T00:00:00'); // Saturday
      
      render(
        <MultiDayView 
          startDate={saturdayDate} 
          events={[]} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByTestId('date-13')).toBeInTheDocument(); // Saturday
      expect(screen.getByTestId('date-14')).toBeInTheDocument(); // Sunday
    });

    it('should handle leap year dates', () => {
      const leapYearDate = new Date('2024-02-28T00:00:00');
      
      render(
        <MultiDayView 
          startDate={leapYearDate} 
          events={[]} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByTestId('date-28')).toBeInTheDocument(); // Feb 28
      expect(screen.getByTestId('date-29')).toBeInTheDocument(); // Feb 29 (leap year)
    });

    it('should handle daylight saving time transitions', () => {
      // Assuming DST transition (this date would vary by timezone)
      const dstDate = new Date('2024-03-10T00:00:00');
      
      render(
        <MultiDayView 
          startDate={dstDate} 
          events={[]} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByTestId('date-10')).toBeInTheDocument();
      expect(screen.getByTestId('date-11')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should handle large number of events', () => {
      const manyEvents: CalendarEvent[] = Array.from({ length: 100 }, (_, i) => ({
        id: `event-${i}`,
        title: `Event ${i}`,
        startDateTime: new Date(`2024-01-${15 + (i % 2)}T${String(i % 24).padStart(2, '0')}:00:00`),
        endDateTime: new Date(`2024-01-${15 + (i % 2)}T${String((i % 24) + 1).padStart(2, '0')}:00:00`),
        eventType: 'Meeting',
      }));

      render(
        <MultiDayView 
          startDate={testDate} 
          events={manyEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByTestId('events-count-15').textContent).toBe('100 events');
      expect(screen.getByTestId('events-count-16').textContent).toBe('100 events');
    });

    it('should handle rapid prop updates', () => {
      const { rerender } = render(
        <MultiDayView 
          startDate={testDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      // Rapidly update props
      for (let i = 0; i < 10; i++) {
        const newDate = new Date(`2024-01-${15 + i}T00:00:00`);
        rerender(
          <MultiDayView 
            startDate={newDate} 
            events={mockEvents.slice(0, i % 4 + 1)} 
            onEventClick={mockOnEventClick} 
          />
        );
      }

      // Should render the last update
      expect(screen.getByTestId('date-24')).toBeInTheDocument();
      expect(screen.getByTestId('date-25')).toBeInTheDocument();
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
            <button onClick={() => setEvents(mockEvents.slice(0, 2))}>
              Reduce Events
            </button>
            <MultiDayView 
              startDate={date} 
              events={events} 
              onEventClick={mockOnEventClick} 
            />
          </>
        );
      };

      render(<Component />);

      expect(screen.getByTestId('date-15')).toBeInTheDocument();
      expect(screen.getByTestId('events-count-15').textContent).toBe('4 events');

      fireEvent.click(screen.getByText('Change Date'));
      expect(screen.queryByTestId('date-15')).not.toBeInTheDocument();
      expect(screen.getByTestId('date-20')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Reduce Events'));
      expect(screen.getByTestId('events-count-20').textContent).toBe('2 events');
    });

    it('should maintain consistency between two day columns', () => {
      render(
        <MultiDayView 
          startDate={testDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      // Both columns should receive the same events array
      const day1Events = screen.getByTestId('events-count-15').textContent;
      const day2Events = screen.getByTestId('events-count-16').textContent;
      
      expect(day1Events).toBe('4 events');
      expect(day2Events).toBe('4 events');

      // Both columns should use the same onEventClick handler
      fireEvent.click(screen.getByTestId('event-1-day-15'));
      fireEvent.click(screen.getByTestId('event-3-day-16'));
      
      expect(mockOnEventClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Accessibility', () => {
    it('should maintain keyboard navigation across both days', () => {
      render(
        <MultiDayView 
          startDate={testDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      const firstDayEvent = screen.getByTestId('event-1-day-15');
      const secondDayEvent = screen.getByTestId('event-3-day-16');

      firstDayEvent.focus();
      expect(firstDayEvent).toHaveFocus();

      // Should be able to tab to next day's events
      secondDayEvent.focus();
      expect(secondDayEvent).toHaveFocus();
    });

    it('should handle focus when switching between days', () => {
      const { rerender } = render(
        <MultiDayView 
          startDate={testDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      const firstEvent = screen.getByTestId('event-1-day-15');
      firstEvent.focus();
      expect(firstEvent).toHaveFocus();

      // Change date
      const newDate = new Date('2024-01-20T00:00:00');
      rerender(
        <MultiDayView 
          startDate={newDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      // Focus should be manageable on new elements
      const newEvent = screen.getByTestId('event-1-day-20');
      newEvent.focus();
      expect(newEvent).toHaveFocus();
    });
  });
});
