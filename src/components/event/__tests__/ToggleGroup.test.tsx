import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ToggleGroup from '../../event/ToggleGroup';

describe('ToggleGroup', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all options', () => {
      const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ];

      render(
        <ToggleGroup 
          options={options} 
          selected="option1" 
          onChange={mockOnChange} 
        />
      );

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('should apply active class to selected option', () => {
      const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ];

      render(
        <ToggleGroup 
          options={options} 
          selected="option1" 
          onChange={mockOnChange} 
        />
      );

      const option1Button = screen.getByText('Option 1');
      const option2Button = screen.getByText('Option 2');

      expect(option1Button).toHaveClass('active');
      expect(option2Button).not.toHaveClass('active');
    });

    it('should apply custom className', () => {
      const options = [{ value: 'test', label: 'Test' }];

      const { container } = render(
        <ToggleGroup 
          options={options} 
          selected="test" 
          onChange={mockOnChange} 
          className="custom-class"
        />
      );

      const toggleGroup = container.querySelector('.toggle-group');
      expect(toggleGroup).toHaveClass('toggle-group');
      expect(toggleGroup).toHaveClass('custom-class');
    });

    it('should apply aria-label when provided', () => {
      const options = [{ value: 'test', label: 'Test' }];

      render(
        <ToggleGroup 
          options={options} 
          selected="test" 
          onChange={mockOnChange} 
          ariaLabel="Test Toggle Group"
        />
      );

      expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-label', 'Test Toggle Group');
    });

    it('should render without className prop', () => {
      const options = [{ value: 'test', label: 'Test' }];

      const { container } = render(
        <ToggleGroup 
          options={options} 
          selected="test" 
          onChange={mockOnChange} 
        />
      );

      const toggleGroup = container.querySelector('.toggle-group');
      expect(toggleGroup).toHaveClass('toggle-group');
    });

    it('should have radiogroup role', () => {
      const options = [{ value: 'test', label: 'Test' }];

      render(
        <ToggleGroup 
          options={options} 
          selected="test" 
          onChange={mockOnChange} 
        />
      );

      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onChange when option is clicked', () => {
      const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ];

      render(
        <ToggleGroup 
          options={options} 
          selected="option1" 
          onChange={mockOnChange} 
        />
      );

      fireEvent.click(screen.getByText('Option 2'));

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith('option2');
    });

    it('should call onChange even when clicking already selected option', () => {
      const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ];

      render(
        <ToggleGroup 
          options={options} 
          selected="option1" 
          onChange={mockOnChange} 
        />
      );

      fireEvent.click(screen.getByText('Option 1'));

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith('option1');
    });

    it('should handle multiple clicks', () => {
      const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ];

      render(
        <ToggleGroup 
          options={options} 
          selected="option1" 
          onChange={mockOnChange} 
        />
      );

      fireEvent.click(screen.getByText('Option 2'));
      fireEvent.click(screen.getByText('Option 3'));
      fireEvent.click(screen.getByText('Option 1'));

      expect(mockOnChange).toHaveBeenCalledTimes(3);
      expect(mockOnChange).toHaveBeenNthCalledWith(1, 'option2');
      expect(mockOnChange).toHaveBeenNthCalledWith(2, 'option3');
      expect(mockOnChange).toHaveBeenNthCalledWith(3, 'option1');
    });
  });

  describe('Props Updates', () => {
    it('should update active class when selected prop changes', () => {
      const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ];

      const { rerender } = render(
        <ToggleGroup 
          options={options} 
          selected="option1" 
          onChange={mockOnChange} 
        />
      );

      expect(screen.getByText('Option 1')).toHaveClass('active');
      expect(screen.getByText('Option 2')).not.toHaveClass('active');

      rerender(
        <ToggleGroup 
          options={options} 
          selected="option2" 
          onChange={mockOnChange} 
        />
      );

      expect(screen.getByText('Option 1')).not.toHaveClass('active');
      expect(screen.getByText('Option 2')).toHaveClass('active');
    });

    it('should handle options prop update', () => {
      const initialOptions = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ];

      const newOptions = [
        { value: 'optionA', label: 'Option A' },
        { value: 'optionB', label: 'Option B' },
        { value: 'optionC', label: 'Option C' },
      ];

      const { rerender } = render(
        <ToggleGroup 
          options={initialOptions} 
          selected="option1" 
          onChange={mockOnChange} 
        />
      );

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();

      rerender(
        <ToggleGroup 
          options={newOptions} 
          selected="optionA" 
          onChange={mockOnChange} 
        />
      );

      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
      expect(screen.getByText('Option A')).toBeInTheDocument();
      expect(screen.getByText('Option B')).toBeInTheDocument();
      expect(screen.getByText('Option C')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty options array', () => {
      const { container } = render(
        <ToggleGroup 
          options={[]} 
          selected="" 
          onChange={mockOnChange} 
        />
      );

      const buttons = container.querySelectorAll('button');
      expect(buttons).toHaveLength(0);
    });

    it('should handle single option', () => {
      const options = [{ value: 'only', label: 'Only Option' }];

      render(
        <ToggleGroup 
          options={options} 
          selected="only" 
          onChange={mockOnChange} 
        />
      );

      expect(screen.getByText('Only Option')).toBeInTheDocument();
      expect(screen.getByText('Only Option')).toHaveClass('active');
    });

    it('should handle selected value not in options', () => {
      const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ];

      render(
        <ToggleGroup 
          options={options} 
          selected="nonexistent" 
          onChange={mockOnChange} 
        />
      );

      // No button should have active class
      expect(screen.getByText('Option 1')).not.toHaveClass('active');
      expect(screen.getByText('Option 2')).not.toHaveClass('active');
    });
  });

  describe('Generic Type Support', () => {
    it('should work with string literal types', () => {
      type Mode = 'mode1' | 'mode2' | 'mode3';
      
      const options: Array<{ value: Mode; label: string }> = [
        { value: 'mode1', label: 'Mode 1' },
        { value: 'mode2', label: 'Mode 2' },
        { value: 'mode3', label: 'Mode 3' },
      ];

      render(
        <ToggleGroup<Mode>
          options={options} 
          selected="mode1" 
          onChange={mockOnChange} 
        />
      );

      expect(screen.getByText('Mode 1')).toBeInTheDocument();
      expect(screen.getByText('Mode 2')).toBeInTheDocument();
      expect(screen.getByText('Mode 3')).toBeInTheDocument();
    });

    it('should work with regular strings', () => {
      const options = [
        { value: 'any-string', label: 'Any String' },
        { value: 'another-string', label: 'Another String' },
      ];

      render(
        <ToggleGroup 
          options={options} 
          selected="any-string" 
          onChange={mockOnChange} 
        />
      );

      expect(screen.getByText('Any String')).toBeInTheDocument();
      expect(screen.getByText('Another String')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have button type for all options', () => {
      const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ];

      const { container } = render(
        <ToggleGroup 
          options={options} 
          selected="option1" 
          onChange={mockOnChange} 
        />
      );

      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('type', 'button');
      });
    });

    it('should be keyboard accessible', () => {
      const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ];

      render(
        <ToggleGroup 
          options={options} 
          selected="option1" 
          onChange={mockOnChange} 
        />
      );

      const button = screen.getByText('Option 2');
      
      // Should be focusable
      button.focus();
      expect(button).toHaveFocus();
    });
  });
});
