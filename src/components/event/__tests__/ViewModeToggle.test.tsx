import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ViewModeToggle from '../../event/ViewModeToggle';
import { ViewMode } from '../../../features/events';

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
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  };
});

describe('ViewModeToggle', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all three view mode options', () => {
      render(<ViewModeToggle mode="single" onChange={mockOnChange} />);
      
      expect(screen.getByText('Single Day')).toBeInTheDocument();
      expect(screen.getByText('Multi Day')).toBeInTheDocument();
      expect(screen.getByText('List')).toBeInTheDocument();
    });

    it('should have correct class name', () => {
      const { container } = render(
        <ViewModeToggle mode="single" onChange={mockOnChange} />
      );
      
      expect(container.querySelector('.view-toggle')).toBeInTheDocument();
    });

    it('should have correct aria-label', () => {
      render(<ViewModeToggle mode="single" onChange={mockOnChange} />);
      
      expect(screen.getByLabelText('View mode')).toBeInTheDocument();
    });

    it('should highlight selected mode - single', () => {
      render(<ViewModeToggle mode="single" onChange={mockOnChange} />);
      
      const singleButton = screen.getByText('Single Day');
      expect(singleButton).toHaveAttribute('aria-pressed', 'true');
      
      const multiButton = screen.getByText('Multi Day');
      expect(multiButton).toHaveAttribute('aria-pressed', 'false');
      
      const listButton = screen.getByText('List');
      expect(listButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('should highlight selected mode - multi', () => {
      render(<ViewModeToggle mode="multi" onChange={mockOnChange} />);
      
      const multiButton = screen.getByText('Multi Day');
      expect(multiButton).toHaveAttribute('aria-pressed', 'true');
      
      const singleButton = screen.getByText('Single Day');
      expect(singleButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('should highlight selected mode - list', () => {
      render(<ViewModeToggle mode="list" onChange={mockOnChange} />);
      
      const listButton = screen.getByText('List');
      expect(listButton).toHaveAttribute('aria-pressed', 'true');
      
      const singleButton = screen.getByText('Single Day');
      expect(singleButton).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('User Interactions', () => {
    it('should call onChange when Single Day is clicked', () => {
      render(<ViewModeToggle mode="multi" onChange={mockOnChange} />);
      
      fireEvent.click(screen.getByText('Single Day'));
      
      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith('single');
    });

    it('should call onChange when Multi Day is clicked', () => {
      render(<ViewModeToggle mode="single" onChange={mockOnChange} />);
      
      fireEvent.click(screen.getByText('Multi Day'));
      
      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith('multi');
    });

    it('should call onChange when List is clicked', () => {
      render(<ViewModeToggle mode="single" onChange={mockOnChange} />);
      
      fireEvent.click(screen.getByText('List'));
      
      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith('list');
    });

    it('should handle multiple clicks', () => {
      render(<ViewModeToggle mode="single" onChange={mockOnChange} />);
      
      fireEvent.click(screen.getByText('Multi Day'));
      fireEvent.click(screen.getByText('List'));
      fireEvent.click(screen.getByText('Single Day'));
      
      expect(mockOnChange).toHaveBeenCalledTimes(3);
      expect(mockOnChange).toHaveBeenNthCalledWith(1, 'multi');
      expect(mockOnChange).toHaveBeenNthCalledWith(2, 'list');
      expect(mockOnChange).toHaveBeenNthCalledWith(3, 'single');
    });
  });

  describe('Props Updates', () => {
    it('should update selected mode when prop changes', () => {
      const { rerender } = render(
        <ViewModeToggle mode="single" onChange={mockOnChange} />
      );
      
      expect(screen.getByText('Single Day')).toHaveAttribute('aria-pressed', 'true');
      
      rerender(<ViewModeToggle mode="multi" onChange={mockOnChange} />);
      expect(screen.getByText('Multi Day')).toHaveAttribute('aria-pressed', 'true');
      
      rerender(<ViewModeToggle mode="list" onChange={mockOnChange} />);
      expect(screen.getByText('List')).toHaveAttribute('aria-pressed', 'true');
    });

    it('should handle onChange prop update', () => {
      const newMockOnChange = jest.fn();
      
      const { rerender } = render(
        <ViewModeToggle mode="single" onChange={mockOnChange} />
      );
      
      fireEvent.click(screen.getByText('Multi Day'));
      expect(mockOnChange).toHaveBeenCalledWith('multi');
      
      rerender(<ViewModeToggle mode="single" onChange={newMockOnChange} />);
      
      fireEvent.click(screen.getByText('List'));
      expect(newMockOnChange).toHaveBeenCalledWith('list');
      expect(mockOnChange).toHaveBeenCalledTimes(1); // Should not be called again
    });
  });

  describe('ViewMode Types', () => {
    it('should accept all valid ViewMode values', () => {
      const modes: ViewMode[] = ['single', 'multi', 'list'];
      
      modes.forEach(mode => {
        const { unmount } = render(
          <ViewModeToggle mode={mode} onChange={mockOnChange} />
        );
        
        const expectedButton = mode === 'single' ? 'Single Day' :
                              mode === 'multi' ? 'Multi Day' : 'List';
        
        expect(screen.getByText(expectedButton)).toHaveAttribute('aria-pressed', 'true');
        unmount();
      });
    });
  });
});
