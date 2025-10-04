import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import WeekSlider from '../../event/WeekSlider';

describe('WeekSlider', () => {
  const mockOnSelect = jest.fn();
  const mockOnChangeWeek = jest.fn();
  const testDate = new Date('2024-01-15'); // Monday, January 15, 2024

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render component with 7 days', () => {
      render(
        <WeekSlider 
          selectedDate={testDate} 
          onSelect={mockOnSelect} 
          onChangeWeek={mockOnChangeWeek} 
        />
      );
      
      const dayButtons = screen.getAllByRole('tab');
      expect(dayButtons).toHaveLength(7);
    });

    it('should render navigation buttons', () => {
      render(
        <WeekSlider 
          selectedDate={testDate} 
          onSelect={mockOnSelect} 
          onChangeWeek={mockOnChangeWeek} 
        />
      );
      
      expect(screen.getByLabelText('previous days')).toBeInTheDocument();
      expect(screen.getByLabelText('next days')).toBeInTheDocument();
    });

    it('should highlight selected date', () => {
      const { container } = render(
        <WeekSlider 
          selectedDate={testDate} 
          onSelect={mockOnSelect} 
          onChangeWeek={mockOnChangeWeek} 
        />
      );
      
      const selectedDay = container.querySelector('.day.selected');
      expect(selectedDay).toBeInTheDocument();
      expect(selectedDay).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('User Interactions', () => {
    it('should call onSelect when day is clicked', () => {
      render(
        <WeekSlider 
          selectedDate={testDate} 
          onSelect={mockOnSelect} 
          onChangeWeek={mockOnChangeWeek} 
        />
      );
      
      const dayButtons = screen.getAllByRole('tab');
      fireEvent.click(dayButtons[0]);
      
      expect(mockOnSelect).toHaveBeenCalledTimes(1);
      expect(mockOnSelect).toHaveBeenCalledWith(expect.any(Date));
    });

    it('should call onChangeWeek when previous button is clicked', () => {
      render(
        <WeekSlider 
          selectedDate={testDate} 
          onSelect={mockOnSelect} 
          onChangeWeek={mockOnChangeWeek} 
        />
      );
      
      fireEvent.click(screen.getByLabelText('previous days'));
      
      expect(mockOnChangeWeek).toHaveBeenCalledTimes(1);
      expect(mockOnChangeWeek).toHaveBeenCalledWith(expect.any(Date));
    });

    it('should call onChangeWeek when next button is clicked', () => {
      render(
        <WeekSlider 
          selectedDate={testDate} 
          onSelect={mockOnSelect} 
          onChangeWeek={mockOnChangeWeek} 
        />
      );
      
      fireEvent.click(screen.getByLabelText('next days'));
      
      expect(mockOnChangeWeek).toHaveBeenCalledTimes(1);
      expect(mockOnChangeWeek).toHaveBeenCalledWith(expect.any(Date));
    });
  });

  describe('Week Display', () => {
    it('should start week from Sunday', () => {
      const wednesday = new Date('2024-01-17'); // Wednesday
      const { container } = render(
        <WeekSlider 
          selectedDate={wednesday} 
          onSelect={mockOnSelect} 
          onChangeWeek={mockOnChangeWeek} 
        />
      );
      
      const dayButtons = container.querySelectorAll('.day');
      const firstDate = dayButtons[0].querySelector('.date')?.textContent;
      expect(firstDate).toBe('14'); // Sunday, January 14
    });

    it('should display correct week when date changes', () => {
      const { rerender, container } = render(
        <WeekSlider 
          selectedDate={testDate} 
          onSelect={mockOnSelect} 
          onChangeWeek={mockOnChangeWeek} 
        />
      );
      
      const newDate = new Date('2024-01-25');
      rerender(
        <WeekSlider 
          selectedDate={newDate} 
          onSelect={mockOnSelect} 
          onChangeWeek={mockOnChangeWeek} 
        />
      );
      
      const selectedDay = container.querySelector('.day.selected .date');
      expect(selectedDay?.textContent).toBe('25');
    });
  });
});
