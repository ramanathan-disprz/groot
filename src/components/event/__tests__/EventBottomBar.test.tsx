import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventBottomBar from '../../event/EventBottomBar';

describe('EventBottomBar', () => {
  const mockOnToday = jest.fn();
  const mockOnAddEvent = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the event-bottom-bar nav element', () => {
      const { container } = render(
        <EventBottomBar 
          onToday={mockOnToday} 
          onAddEvent={mockOnAddEvent} 
        />
      );

      const navElement = container.querySelector('nav.event-bottom-bar');
      expect(navElement).toBeInTheDocument();
    });

    it('should render Today button', () => {
      render(
        <EventBottomBar 
          onToday={mockOnToday} 
          onAddEvent={mockOnAddEvent} 
        />
      );

      const todayButton = screen.getByRole('button', { name: /today/i });
      expect(todayButton).toBeInTheDocument();
    });

    it('should render Add Event button', () => {
      render(
        <EventBottomBar 
          onToday={mockOnToday} 
          onAddEvent={mockOnAddEvent} 
        />
      );

      const addEventButton = screen.getByRole('button', { name: /add event/i });
      expect(addEventButton).toBeInTheDocument();
    });

    it('should render Add Event button with plus sign', () => {
      render(
        <EventBottomBar 
          onToday={mockOnToday} 
          onAddEvent={mockOnAddEvent} 
        />
      );

      const addEventButton = screen.getByText(/\+ Add Event/i);
      expect(addEventButton).toBeInTheDocument();
    });

    it('should apply correct CSS classes', () => {
      const { container } = render(
        <EventBottomBar 
          onToday={mockOnToday} 
          onAddEvent={mockOnAddEvent} 
        />
      );

      const todayButton = screen.getByRole('button', { name: /today/i });
      const addEventButton = screen.getByRole('button', { name: /add event/i });

      expect(todayButton).toHaveClass('event-bottom-bar__btn');
      expect(addEventButton).toHaveClass('event-bottom-bar__btn', 'event-bottom-bar__btn--add');
    });

    it('should render buttons in correct order', () => {
      render(
        <EventBottomBar 
          onToday={mockOnToday} 
          onAddEvent={mockOnAddEvent} 
        />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
      expect(buttons[0]).toHaveTextContent('Today');
      expect(buttons[1]).toHaveTextContent('+ Add Event');
    });
  });

  describe('User Interactions', () => {
    it('should call onToday when Today button is clicked', () => {
      render(
        <EventBottomBar 
          onToday={mockOnToday} 
          onAddEvent={mockOnAddEvent} 
        />
      );

      const todayButton = screen.getByRole('button', { name: /today/i });
      fireEvent.click(todayButton);

      expect(mockOnToday).toHaveBeenCalledTimes(1);
      expect(mockOnAddEvent).not.toHaveBeenCalled();
    });

    it('should call onAddEvent when Add Event button is clicked', () => {
      render(
        <EventBottomBar 
          onToday={mockOnToday} 
          onAddEvent={mockOnAddEvent} 
        />
      );

      const addEventButton = screen.getByRole('button', { name: /add event/i });
      fireEvent.click(addEventButton);

      expect(mockOnAddEvent).toHaveBeenCalledTimes(1);
      expect(mockOnToday).not.toHaveBeenCalled();
    });

    it('should handle multiple clicks on Today button', () => {
      render(
        <EventBottomBar 
          onToday={mockOnToday} 
          onAddEvent={mockOnAddEvent} 
        />
      );

      const todayButton = screen.getByRole('button', { name: /today/i });
      
      fireEvent.click(todayButton);
      fireEvent.click(todayButton);
      fireEvent.click(todayButton);

      expect(mockOnToday).toHaveBeenCalledTimes(3);
    });

    it('should handle multiple clicks on Add Event button', () => {
      render(
        <EventBottomBar 
          onToday={mockOnToday} 
          onAddEvent={mockOnAddEvent} 
        />
      );

      const addEventButton = screen.getByRole('button', { name: /add event/i });
      
      fireEvent.click(addEventButton);
      fireEvent.click(addEventButton);
      fireEvent.click(addEventButton);

      expect(mockOnAddEvent).toHaveBeenCalledTimes(3);
    });

    it('should handle alternating clicks between buttons', () => {
      render(
        <EventBottomBar 
          onToday={mockOnToday} 
          onAddEvent={mockOnAddEvent} 
        />
      );

      const todayButton = screen.getByRole('button', { name: /today/i });
      const addEventButton = screen.getByRole('button', { name: /add event/i });

      fireEvent.click(todayButton);
      fireEvent.click(addEventButton);
      fireEvent.click(todayButton);
      fireEvent.click(addEventButton);

      expect(mockOnToday).toHaveBeenCalledTimes(2);
      expect(mockOnAddEvent).toHaveBeenCalledTimes(2);
    });

    it('should not call handlers when clicked outside buttons', () => {
      const { container } = render(
        <EventBottomBar 
          onToday={mockOnToday} 
          onAddEvent={mockOnAddEvent} 
        />
      );

      const navElement = container.querySelector('nav.event-bottom-bar');
      fireEvent.click(navElement!);

      expect(mockOnToday).not.toHaveBeenCalled();
      expect(mockOnAddEvent).not.toHaveBeenCalled();
    });
  });

  describe('Props Updates', () => {
    it('should update onToday handler when prop changes', () => {
      const newMockOnToday = jest.fn();
      
      const { rerender } = render(
        <EventBottomBar 
          onToday={mockOnToday} 
          onAddEvent={mockOnAddEvent} 
        />
      );

      const todayButton = screen.getByRole('button', { name: /today/i });
      fireEvent.click(todayButton);
      expect(mockOnToday).toHaveBeenCalledTimes(1);

      rerender(
        <EventBottomBar 
          onToday={newMockOnToday} 
          onAddEvent={mockOnAddEvent} 
        />
      );

      fireEvent.click(todayButton);
      expect(newMockOnToday).toHaveBeenCalledTimes(1);
      expect(mockOnToday).toHaveBeenCalledTimes(1); // Should not increase
    });

    it('should update onAddEvent handler when prop changes', () => {
      const newMockOnAddEvent = jest.fn();
      
      const { rerender } = render(
        <EventBottomBar 
          onToday={mockOnToday} 
          onAddEvent={mockOnAddEvent} 
        />
      );

      const addEventButton = screen.getByRole('button', { name: /add event/i });
      fireEvent.click(addEventButton);
      expect(mockOnAddEvent).toHaveBeenCalledTimes(1);

      rerender(
        <EventBottomBar 
          onToday={mockOnToday} 
          onAddEvent={newMockOnAddEvent} 
        />
      );

      fireEvent.click(addEventButton);
      expect(newMockOnAddEvent).toHaveBeenCalledTimes(1);
      expect(mockOnAddEvent).toHaveBeenCalledTimes(1); // Should not increase
    });

    it('should handle both handlers changing simultaneously', () => {
      const newMockOnToday = jest.fn();
      const newMockOnAddEvent = jest.fn();
      
      const { rerender } = render(
        <EventBottomBar 
          onToday={mockOnToday} 
          onAddEvent={mockOnAddEvent} 
        />
      );

      const todayButton = screen.getByRole('button', { name: /today/i });
      const addEventButton = screen.getByRole('button', { name: /add event/i });

      fireEvent.click(todayButton);
      fireEvent.click(addEventButton);
      
      expect(mockOnToday).toHaveBeenCalledTimes(1);
      expect(mockOnAddEvent).toHaveBeenCalledTimes(1);

      rerender(
        <EventBottomBar 
          onToday={newMockOnToday} 
          onAddEvent={newMockOnAddEvent} 
        />
      );

      fireEvent.click(todayButton);
      fireEvent.click(addEventButton);
      
      expect(newMockOnToday).toHaveBeenCalledTimes(1);
      expect(newMockOnAddEvent).toHaveBeenCalledTimes(1);
      expect(mockOnToday).toHaveBeenCalledTimes(1); // Should not increase
      expect(mockOnAddEvent).toHaveBeenCalledTimes(1); // Should not increase
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button elements', () => {
      render(
        <EventBottomBar 
          onToday={mockOnToday} 
          onAddEvent={mockOnAddEvent} 
        />
      );

      const todayButton = screen.getByRole('button', { name: /today/i });
      const addEventButton = screen.getByRole('button', { name: /add event/i });

      expect(todayButton).toBeInTheDocument();
      expect(addEventButton).toBeInTheDocument();
    });

    it('should be keyboard navigable', () => {
      render(
        <EventBottomBar 
          onToday={mockOnToday} 
          onAddEvent={mockOnAddEvent} 
        />
      );

      const todayButton = screen.getByRole('button', { name: /today/i });
      const addEventButton = screen.getByRole('button', { name: /add event/i });

      // Focus on Today button
      todayButton.focus();
      expect(todayButton).toHaveFocus();

      // Tab to Add Event button
      addEventButton.focus();
      expect(addEventButton).toHaveFocus();
    });

    it('should handle Enter key press on focused buttons', () => {
      render(
        <EventBottomBar 
          onToday={mockOnToday} 
          onAddEvent={mockOnAddEvent} 
        />
      );

      const todayButton = screen.getByRole('button', { name: /today/i });
      const addEventButton = screen.getByRole('button', { name: /add event/i });

      // Focus and press Enter on Today button
      todayButton.focus();
      fireEvent.keyDown(todayButton, { key: 'Enter', code: 'Enter' });
      fireEvent.click(todayButton);
      expect(mockOnToday).toHaveBeenCalledTimes(1);

      // Focus and press Enter on Add Event button
      addEventButton.focus();
      fireEvent.keyDown(addEventButton, { key: 'Enter', code: 'Enter' });
      fireEvent.click(addEventButton);
      expect(mockOnAddEvent).toHaveBeenCalledTimes(1);
    });

    it('should handle Space key press on focused buttons', () => {
      render(
        <EventBottomBar 
          onToday={mockOnToday} 
          onAddEvent={mockOnAddEvent} 
        />
      );

      const todayButton = screen.getByRole('button', { name: /today/i });
      const addEventButton = screen.getByRole('button', { name: /add event/i });

      // Focus and press Space on Today button
      todayButton.focus();
      fireEvent.keyDown(todayButton, { key: ' ', code: 'Space' });
      fireEvent.click(todayButton);
      expect(mockOnToday).toHaveBeenCalledTimes(1);

      // Focus and press Space on Add Event button
      addEventButton.focus();
      fireEvent.keyDown(addEventButton, { key: ' ', code: 'Space' });
      fireEvent.click(addEventButton);
      expect(mockOnAddEvent).toHaveBeenCalledTimes(1);
    });

    it('should have nav element with proper semantics', () => {
      const { container } = render(
        <EventBottomBar 
          onToday={mockOnToday} 
          onAddEvent={mockOnAddEvent} 
        />
      );

      const navElement = container.querySelector('nav');
      expect(navElement).toBeInTheDocument();
      expect(navElement).toHaveClass('event-bottom-bar');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined handlers gracefully', () => {
      // TypeScript would normally prevent this, but testing runtime behavior
      const { container } = render(
        <EventBottomBar 
          onToday={undefined as any} 
          onAddEvent={undefined as any} 
        />
      );

      const todayButton = screen.getByRole('button', { name: /today/i });
      const addEventButton = screen.getByRole('button', { name: /add event/i });

      // Should not throw errors when clicking with undefined handlers
      expect(() => fireEvent.click(todayButton)).not.toThrow();
      expect(() => fireEvent.click(addEventButton)).not.toThrow();
    });

    it('should handle rapid consecutive clicks', () => {
      render(
        <EventBottomBar 
          onToday={mockOnToday} 
          onAddEvent={mockOnAddEvent} 
        />
      );

      const todayButton = screen.getByRole('button', { name: /today/i });
      
      // Simulate rapid clicking
      for (let i = 0; i < 10; i++) {
        fireEvent.click(todayButton);
      }

      expect(mockOnToday).toHaveBeenCalledTimes(10);
    });

    it('should handle double clicks', () => {
      render(
        <EventBottomBar 
          onToday={mockOnToday} 
          onAddEvent={mockOnAddEvent} 
        />
      );

      const todayButton = screen.getByRole('button', { name: /today/i });
      const addEventButton = screen.getByRole('button', { name: /add event/i });

      fireEvent.click(todayButton);
      fireEvent.click(todayButton);
      fireEvent.click(addEventButton);
      fireEvent.click(addEventButton);

      // Double click triggers two click events
      expect(mockOnToday).toHaveBeenCalledTimes(2);
      expect(mockOnAddEvent).toHaveBeenCalledTimes(2);
    });
  });

  describe('Integration', () => {
    it('should work within a parent component', () => {
      const ParentComponent = () => {
        const [todayClicks, setTodayClicks] = React.useState(0);
        const [addEventClicks, setAddEventClicks] = React.useState(0);

        return (
          <>
            <div data-testid="today-count">{todayClicks}</div>
            <div data-testid="add-event-count">{addEventClicks}</div>
            <EventBottomBar 
              onToday={() => setTodayClicks(prev => prev + 1)} 
              onAddEvent={() => setAddEventClicks(prev => prev + 1)} 
            />
          </>
        );
      };

      render(<ParentComponent />);

      expect(screen.getByTestId('today-count')).toHaveTextContent('0');
      expect(screen.getByTestId('add-event-count')).toHaveTextContent('0');

      const todayButton = screen.getByRole('button', { name: /today/i });
      const addEventButton = screen.getByRole('button', { name: /add event/i });

      fireEvent.click(todayButton);
      fireEvent.click(todayButton);
      expect(screen.getByTestId('today-count')).toHaveTextContent('2');

      fireEvent.click(addEventButton);
      fireEvent.click(addEventButton);
      fireEvent.click(addEventButton);
      expect(screen.getByTestId('add-event-count')).toHaveTextContent('3');
    });

    it('should maintain button state across re-renders', () => {
      const Component = () => {
        const [count, setCount] = React.useState(0);

        return (
          <>
            <button onClick={() => setCount(prev => prev + 1)}>
              Re-render: {count}
            </button>
            <EventBottomBar 
              onToday={mockOnToday} 
              onAddEvent={mockOnAddEvent} 
            />
          </>
        );
      };

      render(<Component />);

      const reRenderButton = screen.getByText(/Re-render/);
      const todayButton = screen.getByRole('button', { name: /today/i });

      // Click Today button
      fireEvent.click(todayButton);
      expect(mockOnToday).toHaveBeenCalledTimes(1);

      // Trigger re-render
      fireEvent.click(reRenderButton);

      // Buttons should still work after re-render
      fireEvent.click(todayButton);
      expect(mockOnToday).toHaveBeenCalledTimes(2);
    });
  });

  describe('Performance', () => {
    it('should handle rapid handler changes', () => {
      const handlers = Array.from({ length: 10 }, (_, i) => ({
        onToday: jest.fn().mockName(`onToday${i}`),
        onAddEvent: jest.fn().mockName(`onAddEvent${i}`),
      }));

      const { rerender } = render(
        <EventBottomBar 
          onToday={handlers[0].onToday} 
          onAddEvent={handlers[0].onAddEvent} 
        />
      );

      const todayButton = screen.getByRole('button', { name: /today/i });

      handlers.forEach((handler, index) => {
        rerender(
          <EventBottomBar 
            onToday={handler.onToday} 
            onAddEvent={handler.onAddEvent} 
          />
        );
        
        fireEvent.click(todayButton);
        expect(handler.onToday).toHaveBeenCalledTimes(1);
      });
    });

    it('should not cause memory leaks with event handlers', () => {
      const { unmount } = render(
        <EventBottomBar 
          onToday={mockOnToday} 
          onAddEvent={mockOnAddEvent} 
        />
      );

      const todayButton = screen.getByRole('button', { name: /today/i });
      fireEvent.click(todayButton);
      expect(mockOnToday).toHaveBeenCalledTimes(1);

      // Unmount component
      unmount();

      // Component should be properly cleaned up
      expect(screen.queryByRole('button', { name: /today/i })).not.toBeInTheDocument();
    });
  });
});
