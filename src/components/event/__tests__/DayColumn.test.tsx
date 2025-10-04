import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DayColumn from '../../event/DayColumn';
import { CalendarEvent } from '../../../features/events';
import { EVENT_TYPE_META } from '../../../utils/constants';

// Mock FontAwesome
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }: any) => <span data-testid="icon">{icon}</span>,
}));

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

describe('DayColumn', () => {
  const mockOnEventClick = jest.fn();
  const testDate = new Date('2024-01-15T00:00:00');

  const mockEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Morning Meeting',
      startDateTime: new Date('2024-01-15T09:00:00'),
      endDateTime: new Date('2024-01-15T10:00:00'),
      eventType: 'Meeting',
    },
    {
      id: '2',
      title: 'Lunch Break',
      startDateTime: new Date('2024-01-15T12:00:00'),
      endDateTime: new Date('2024-01-15T13:00:00'),
      eventType: 'Other',
    },
    {
      id: '3',
      title: 'Task Review',
      startDateTime: new Date('2024-01-15T14:30:00'),
      endDateTime: new Date('2024-01-15T16:00:00'),
      eventType: 'Task',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock current time
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T11:00:00'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render day header with formatted date', () => {
      render(
        <DayColumn 
          date={testDate} 
          events={[]} 
          onEventClick={mockOnEventClick} 
        />
      );

      // The actual format is "Monday, 15 Jan"
      const header = screen.getByText(/Monday.*15.*Jan/i);
      expect(header).toBeInTheDocument();
    });

    it('should render 24 hour rows', () => {
      const { container } = render(
        <DayColumn 
          date={testDate} 
          events={[]} 
          onEventClick={mockOnEventClick} 
        />
      );

      const hourRows = container.querySelectorAll('.hour-row');
      expect(hourRows).toHaveLength(24);
    });

    it('should render hour labels from 00:00 to 23:00', () => {
      render(
        <DayColumn 
          date={testDate} 
          events={[]} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByText('00:00')).toBeInTheDocument();
      expect(screen.getByText('12:00')).toBeInTheDocument();
      expect(screen.getByText('23:00')).toBeInTheDocument();
    });

    it('should render events for the day', () => {
      render(
        <DayColumn 
          date={testDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByText('Morning Meeting')).toBeInTheDocument();
      expect(screen.getByText('Lunch Break')).toBeInTheDocument();
      expect(screen.getByText('Task Review')).toBeInTheDocument();
    });

    it('should not render events from different days', () => {
      const differentDayEvent: CalendarEvent = {
        id: '4',
        title: 'Different Day Event',
        startDateTime: new Date('2024-01-16T10:00:00'),
        endDateTime: new Date('2024-01-16T11:00:00'),
        eventType: 'Meeting',
      };

      render(
        <DayColumn 
          date={testDate} 
          events={[differentDayEvent]} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.queryByText('Different Day Event')).not.toBeInTheDocument();
    });

    it('should show now line for current day', () => {
      const { container } = render(
        <DayColumn 
          date={testDate} 
          events={[]} 
          onEventClick={mockOnEventClick} 
        />
      );

      const nowLine = container.querySelector('.now-line');
      expect(nowLine).toBeInTheDocument();
    });

    it('should not show now line for different day', () => {
      const differentDate = new Date('2024-01-16T00:00:00');
      const { container } = render(
        <DayColumn 
          date={differentDate} 
          events={[]} 
          onEventClick={mockOnEventClick} 
        />
      );

      const nowLine = container.querySelector('.now-line');
      expect(nowLine).not.toBeInTheDocument();
    });

    it('should display event times', () => {
      render(
        <DayColumn 
          date={testDate} 
          events={[mockEvents[0]]} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByText('09:00 - 10:00')).toBeInTheDocument();
    });
  });

  describe('Event Styling', () => {
    it('should apply event type color', () => {
      const { container } = render(
        <DayColumn 
          date={testDate} 
          events={[mockEvents[0]]} 
          onEventClick={mockOnEventClick} 
        />
      );

      const eventPill = container.querySelector('.event-pill');
      expect(eventPill).toHaveStyle({ background: '#0000FF' });
    });

    it('should display event type label and icon', () => {
      render(
        <DayColumn 
          date={testDate} 
          events={[mockEvents[0]]} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByText('Meeting')).toBeInTheDocument();
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('should handle unknown event type', () => {
      const unknownTypeEvent: CalendarEvent = {
        id: '5',
        title: 'Unknown Event',
        startDateTime: new Date('2024-01-15T10:00:00'),
        endDateTime: new Date('2024-01-15T11:00:00'),
        eventType: 'UnknownType',
      };

      render(
        <DayColumn 
          date={testDate} 
          events={[unknownTypeEvent]} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByText('Other')).toBeInTheDocument();
    });
  });

  describe('Event Positioning', () => {
    it('should position events correctly based on time', () => {
      const { container } = render(
        <DayColumn 
          date={testDate} 
          events={[mockEvents[0]]} 
          onEventClick={mockOnEventClick} 
          hourHeight={60}
        />
      );

      const eventPill = container.querySelector('.event-pill') as HTMLElement;
      // 9 hours * 60px + hour lines
      expect(eventPill.style.top).toBeTruthy();
      expect(eventPill.style.height).toBeTruthy();
    });

    it('should handle custom hour height', () => {
      const { container } = render(
        <DayColumn 
          date={testDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
          hourHeight={100}
        />
      );

      const hoursGrid = container.querySelector('.hours-grid') as HTMLElement;
      expect(hoursGrid).toHaveStyle({ height: '2400px' }); // 24 * 100
    });

    it('should set minimum height for short events', () => {
      const shortEvent: CalendarEvent = {
        id: '6',
        title: 'Short Event',
        startDateTime: new Date('2024-01-15T10:00:00'),
        endDateTime: new Date('2024-01-15T10:15:00'), // 15 minutes
        eventType: 'Meeting',
      };

      const { container } = render(
        <DayColumn 
          date={testDate} 
          events={[shortEvent]} 
          onEventClick={mockOnEventClick} 
        />
      );

      const eventPill = container.querySelector('.event-pill') as HTMLElement;
      const height = parseInt(eventPill.style.height);
      expect(height).toBeGreaterThanOrEqual(20);
    });
  });

  describe('User Interactions', () => {
    it('should call onEventClick when event is clicked', () => {
      render(
        <DayColumn 
          date={testDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      fireEvent.click(screen.getByText('Morning Meeting'));
      
      expect(mockOnEventClick).toHaveBeenCalledTimes(1);
      expect(mockOnEventClick).toHaveBeenCalledWith(mockEvents[0]);
    });

    it('should handle multiple event clicks', () => {
      render(
        <DayColumn 
          date={testDate} 
          events={mockEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      fireEvent.click(screen.getByText('Morning Meeting'));
      fireEvent.click(screen.getByText('Lunch Break'));
      fireEvent.click(screen.getByText('Task Review'));

      expect(mockOnEventClick).toHaveBeenCalledTimes(3);
      expect(mockOnEventClick).toHaveBeenNthCalledWith(1, mockEvents[0]);
      expect(mockOnEventClick).toHaveBeenNthCalledWith(2, mockEvents[1]);
      expect(mockOnEventClick).toHaveBeenNthCalledWith(3, mockEvents[2]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty events array', () => {
      const { container } = render(
        <DayColumn 
          date={testDate} 
          events={[]} 
          onEventClick={mockOnEventClick} 
        />
      );

      const eventPills = container.querySelectorAll('.event-pill');
      expect(eventPills).toHaveLength(0);
    });

    it('should handle events spanning multiple hours', () => {
      const longEvent: CalendarEvent = {
        id: '7',
        title: 'All Day Workshop',
        startDateTime: new Date('2024-01-15T08:00:00'),
        endDateTime: new Date('2024-01-15T17:00:00'),
        eventType: 'Meeting',
      };

      render(
        <DayColumn 
          date={testDate} 
          events={[longEvent]} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByText('All Day Workshop')).toBeInTheDocument();
      expect(screen.getByText('08:00 - 17:00')).toBeInTheDocument();
    });

    it('should handle overlapping events', () => {
      const overlappingEvents: CalendarEvent[] = [
        {
          id: '8',
          title: 'Event 1',
          startDateTime: new Date('2024-01-15T10:00:00'),
          endDateTime: new Date('2024-01-15T11:00:00'),
          eventType: 'Meeting',
        },
        {
          id: '9',
          title: 'Event 2',
          startDateTime: new Date('2024-01-15T10:30:00'),
          endDateTime: new Date('2024-01-15T11:30:00'),
          eventType: 'Task',
        },
      ];

      render(
        <DayColumn 
          date={testDate} 
          events={overlappingEvents} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByText('Event 1')).toBeInTheDocument();
      expect(screen.getByText('Event 2')).toBeInTheDocument();
    });

    it('should handle events at midnight', () => {
      const midnightEvent: CalendarEvent = {
        id: '10',
        title: 'Midnight Event',
        startDateTime: new Date('2024-01-15T00:00:00'),
        endDateTime: new Date('2024-01-15T01:00:00'),
        eventType: 'Reminder',
      };

      render(
        <DayColumn 
          date={testDate} 
          events={[midnightEvent]} 
          onEventClick={mockOnEventClick} 
        />
      );

      expect(screen.getByText('Midnight Event')).toBeInTheDocument();
      expect(screen.getByText('00:00 - 01:00')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label for events', () => {
      render(
        <DayColumn 
          date={testDate} 
          events={[mockEvents[0]]} 
          onEventClick={mockOnEventClick} 
        />
      );

      const eventButton = screen.getByRole('button', { 
        name: /Morning Meeting 09:00 - 10:00/i 
      });
      expect(eventButton).toBeInTheDocument();
    });

    it('should mark now line as aria-hidden', () => {
      const { container } = render(
        <DayColumn 
          date={testDate} 
          events={[]} 
          onEventClick={mockOnEventClick} 
        />
      );

      const nowLine = container.querySelector('.now-line');
      expect(nowLine).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
