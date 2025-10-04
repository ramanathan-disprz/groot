import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal from '../../common/Modal';

describe('Modal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render children when open', () => {
      render(
        <Modal open={true} onClose={mockOnClose}>
          <div>Modal Content</div>
        </Modal>
      );

      expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('should have open class when open is true', () => {
      const { container } = render(
        <Modal open={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      const backdrop = container.querySelector('.event-modal__backdrop');
      expect(backdrop).toHaveClass('open');
    });

    it('should not have open class when open is false', () => {
      const { container } = render(
        <Modal open={false} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      const backdrop = container.querySelector('.event-modal__backdrop');
      expect(backdrop).not.toHaveClass('open');
    });

    it('should render multiple children', () => {
      render(
        <Modal open={true} onClose={mockOnClose}>
          <h1>Title</h1>
          <p>Paragraph</p>
          <button>Button</button>
        </Modal>
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Paragraph')).toBeInTheDocument();
      expect(screen.getByText('Button')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onClose when backdrop is clicked', () => {
      const { container } = render(
        <Modal open={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      const backdrop = container.querySelector('.event-modal__backdrop');
      fireEvent.click(backdrop!);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when modal content is clicked', () => {
      const { container } = render(
        <Modal open={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      const content = container.querySelector('.event-modal__content');
      fireEvent.click(content!);

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should stop propagation when content is clicked', () => {
      const { container } = render(
        <Modal open={true} onClose={mockOnClose}>
          <button>Click me</button>
        </Modal>
      );

      const button = screen.getByText('Click me');
      const clickEvent = new MouseEvent('click', { bubbles: true });
      const stopPropagationSpy = jest.spyOn(clickEvent, 'stopPropagation');

      // Click on content area (parent of button)
      const content = container.querySelector('.event-modal__content');
      fireEvent(content!, clickEvent);

      expect(stopPropagationSpy).toHaveBeenCalled();
    });
  });

  describe('Keyboard Interactions', () => {
    it('should call onClose when Escape key is pressed and modal is open', () => {
      render(
        <Modal open={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      fireEvent.keyDown(window, { key: 'Escape' });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when other keys are pressed', () => {
      render(
        <Modal open={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      fireEvent.keyDown(window, { key: 'Enter' });
      fireEvent.keyDown(window, { key: 'Space' });
      fireEvent.keyDown(window, { key: 'Tab' });

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should not add event listener when modal is closed', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      
      render(
        <Modal open={false} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      expect(addEventListenerSpy).not.toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    it('should add event listener when modal is open', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      
      render(
        <Modal open={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    it('should remove event listener when modal is closed', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      
      const { rerender } = render(
        <Modal open={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      rerender(
        <Modal open={false} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    it('should remove event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      
      const { unmount } = render(
        <Modal open={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid open/close changes', () => {
      const { rerender } = render(
        <Modal open={false} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      rerender(
        <Modal open={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      rerender(
        <Modal open={false} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      rerender(
        <Modal open={true} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      );

      fireEvent.keyDown(window, { key: 'Escape' });
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should handle null children', () => {
      const { container } = render(
        <Modal open={true} onClose={mockOnClose}>
          {null}
        </Modal>
      );

      const modalBody = container.querySelector('.modal__body');
      expect(modalBody).toBeInTheDocument();
      expect(modalBody).toBeEmptyDOMElement();
    });

    it('should handle empty children', () => {
      const { container } = render(
        <Modal open={true} onClose={mockOnClose}>
          {''}
        </Modal>
      );

      const modalBody = container.querySelector('.modal__body');
      expect(modalBody).toBeInTheDocument();
    });

    it('should handle complex nested children', () => {
      render(
        <Modal open={true} onClose={mockOnClose}>
          <div>
            <form>
              <input type="text" placeholder="Name" />
              <button type="submit">Submit</button>
            </form>
          </div>
        </Modal>
      );

      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('should not interfere with form submission inside modal', () => {
      const handleSubmit = jest.fn();
      
      render(
        <Modal open={true} onClose={mockOnClose}>
          <form onSubmit={handleSubmit}>
            <button type="submit">Submit</button>
          </form>
        </Modal>
      );

      const form = screen.getByText('Submit').closest('form');
      fireEvent.submit(form!);

      expect(handleSubmit).toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});
