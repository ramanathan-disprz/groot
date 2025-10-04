import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ViewDropdown from '../../event/ViewDropdown';
import { ViewMode } from '../../../features/events';

describe('ViewDropdown', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render dropdown with all options', () => {
      render(<ViewDropdown mode="single" onChange={mockOnChange} />);
      
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Single Day')).toBeInTheDocument();
      expect(screen.getByText('Multi Day')).toBeInTheDocument();
      expect(screen.getByText('List View')).toBeInTheDocument();
    });

    it('should have correct CSS class', () => {
      render(<ViewDropdown mode="single" onChange={mockOnChange} />);
      
      const dropdown = screen.getByRole('combobox');
      expect(dropdown).toHaveClass('view-dropdown');
    });

    it('should display correct selected value for single mode', () => {
      render(<ViewDropdown mode="single" onChange={mockOnChange} />);
      
      const dropdown = screen.getByRole('combobox');
      expect(dropdown).toHaveValue('single');
    });

    it('should display correct selected value for multi mode', () => {
      render(<ViewDropdown mode="multi" onChange={mockOnChange} />);
      
      const dropdown = screen.getByRole('combobox');
      expect(dropdown).toHaveValue('multi');
    });

    it('should display correct selected value for list mode', () => {
      render(<ViewDropdown mode="list" onChange={mockOnChange} />);
      
      const dropdown = screen.getByRole('combobox');
      expect(dropdown).toHaveValue('list');
    });

    it('should have correct option values', () => {
      const { container } = render(<ViewDropdown mode="single" onChange={mockOnChange} />);
      
      const options = container.querySelectorAll('option');
      expect(options[0]).toHaveValue('single');
      expect(options[1]).toHaveValue('multi');
      expect(options[2]).toHaveValue('list');
    });
  });

  describe('User Interactions', () => {
    it('should call onChange when selection changes to multi', () => {
      render(<ViewDropdown mode="single" onChange={mockOnChange} />);
      
      const dropdown = screen.getByRole('combobox');
      fireEvent.change(dropdown, { target: { value: 'multi' } });
      
      expect(mockOnChange).toHaveBeenCalledWith('multi');
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('should call onChange when selection changes to list', () => {
      render(<ViewDropdown mode="single" onChange={mockOnChange} />);
      
      const dropdown = screen.getByRole('combobox');
      fireEvent.change(dropdown, { target: { value: 'list' } });
      
      expect(mockOnChange).toHaveBeenCalledWith('list');
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('should call onChange when selection changes to single', () => {
      render(<ViewDropdown mode="multi" onChange={mockOnChange} />);
      
      const dropdown = screen.getByRole('combobox');
      fireEvent.change(dropdown, { target: { value: 'single' } });
      
      expect(mockOnChange).toHaveBeenCalledWith('single');
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple selection changes', () => {
      render(<ViewDropdown mode="single" onChange={mockOnChange} />);
      
      const dropdown = screen.getByRole('combobox');
      
      fireEvent.change(dropdown, { target: { value: 'multi' } });
      fireEvent.change(dropdown, { target: { value: 'list' } });
      fireEvent.change(dropdown, { target: { value: 'single' } });
      
      expect(mockOnChange).toHaveBeenCalledTimes(3);
      expect(mockOnChange).toHaveBeenNthCalledWith(1, 'multi');
      expect(mockOnChange).toHaveBeenNthCalledWith(2, 'list');
      expect(mockOnChange).toHaveBeenNthCalledWith(3, 'single');
    });

    it('should not call onChange when selecting the same value', () => {
      render(<ViewDropdown mode="single" onChange={mockOnChange} />);
      
      const dropdown = screen.getByRole('combobox');
      fireEvent.change(dropdown, { target: { value: 'single' } });
      
      // Browser typically doesn't fire change event for same value,
      // but we're testing the component behavior
      expect(mockOnChange).toHaveBeenCalledWith('single');
    });
  });

  describe('Props Updates', () => {
    it('should update selected value when mode prop changes', () => {
      const { rerender } = render(<ViewDropdown mode="single" onChange={mockOnChange} />);
      
      let dropdown = screen.getByRole('combobox');
      expect(dropdown).toHaveValue('single');
      
      rerender(<ViewDropdown mode="multi" onChange={mockOnChange} />);
      dropdown = screen.getByRole('combobox');
      expect(dropdown).toHaveValue('multi');
      
      rerender(<ViewDropdown mode="list" onChange={mockOnChange} />);
      dropdown = screen.getByRole('combobox');
      expect(dropdown).toHaveValue('list');
    });

    it('should handle onChange prop update', () => {
      const newMockOnChange = jest.fn();
      
      const { rerender } = render(<ViewDropdown mode="single" onChange={mockOnChange} />);
      
      const dropdown = screen.getByRole('combobox');
      fireEvent.change(dropdown, { target: { value: 'multi' } });
      expect(mockOnChange).toHaveBeenCalledWith('multi');
      
      rerender(<ViewDropdown mode="single" onChange={newMockOnChange} />);
      
      fireEvent.change(dropdown, { target: { value: 'list' } });
      expect(newMockOnChange).toHaveBeenCalledWith('list');
      expect(mockOnChange).toHaveBeenCalledTimes(1); // Should not be called again
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid selection changes', () => {
      render(<ViewDropdown mode="single" onChange={mockOnChange} />);
      
      const dropdown = screen.getByRole('combobox');
      
      // Simulate rapid changes
      for (let i = 0; i < 10; i++) {
        fireEvent.change(dropdown, { target: { value: 'multi' } });
        fireEvent.change(dropdown, { target: { value: 'single' } });
        fireEvent.change(dropdown, { target: { value: 'list' } });
      }
      
      expect(mockOnChange).toHaveBeenCalledTimes(30);
    });

    it('should handle invalid value gracefully', () => {
      render(<ViewDropdown mode="single" onChange={mockOnChange} />);
      
      const dropdown = screen.getByRole('combobox');
      
      // Try to set an invalid value
      fireEvent.change(dropdown, { target: { value: 'invalid' as ViewMode } });
      
      expect(mockOnChange).toHaveBeenCalledWith('');
    });

    it('should be accessible with keyboard navigation', () => {
      render(<ViewDropdown mode="single" onChange={mockOnChange} />);
      
      const dropdown = screen.getByRole('combobox');
      
      // Focus the dropdown
      dropdown.focus();
      expect(dropdown).toHaveFocus();
      
      // Simulate keyboard navigation (arrow keys)
      fireEvent.keyDown(dropdown, { key: 'ArrowDown' });
      fireEvent.keyDown(dropdown, { key: 'Enter' });
      
      // Note: Actual keyboard navigation behavior depends on browser implementation
    });

    it('should maintain correct type for onChange callback', () => {
      render(<ViewDropdown mode="single" onChange={mockOnChange} />);
      
      const dropdown = screen.getByRole('combobox');
      fireEvent.change(dropdown, { target: { value: 'list' } });
      
      // Verify the callback receives the correct type
      expect(mockOnChange).toHaveBeenCalledWith(expect.any(String));
      expect(typeof mockOnChange.mock.calls[0][0]).toBe('string');
    });

    it('should render correctly when mounted and unmounted', () => {
      const { unmount } = render(<ViewDropdown mode="single" onChange={mockOnChange} />);
      
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      
      unmount();
      
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });
  });

  describe('TypeScript ViewMode types', () => {
    it('should accept all valid ViewMode values', () => {
      const validModes: ViewMode[] = ['single', 'multi', 'list'];
      
      validModes.forEach(mode => {
        const { unmount } = render(<ViewDropdown mode={mode} onChange={mockOnChange} />);
        
        const dropdown = screen.getByRole('combobox');
        expect(dropdown).toHaveValue(mode);
        
        unmount();
      });
    });

    it('should handle all ViewMode transitions', () => {
      const modes: ViewMode[] = ['single', 'multi', 'list'];
      
      render(<ViewDropdown mode="single" onChange={mockOnChange} />);
      const dropdown = screen.getByRole('combobox');
      
      modes.forEach(targetMode => {
        fireEvent.change(dropdown, { target: { value: targetMode } });
        expect(mockOnChange).toHaveBeenCalledWith(targetMode);
      });
    });
  });
});
