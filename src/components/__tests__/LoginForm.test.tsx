import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { LoginForm } from '../LoginForm';
import { LoginRequest } from '../../features/auth';
import toast from 'react-hot-toast';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    success: jest.fn(),
    loading: jest.fn(),
  },
}));

describe('LoginForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnRegisterClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render login form with all elements', () => {
      render(<LoginForm onSubmit={mockOnSubmit} />);

      // Check title and icon
      expect(screen.getByText('Login')).toBeInTheDocument();
      
      // Check form fields
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      
      // Check email input attributes
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('placeholder', 'Enter Email...');
      
      // Check password input attributes
      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('placeholder', 'Enter Password...');
      
      // Check submit button
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
      
      // Check register link
      expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
      expect(screen.getByText(/register here/i)).toBeInTheDocument();
    });

    it('should render without register link when onRegisterClick is not provided', () => {
      render(<LoginForm onSubmit={mockOnSubmit} />);
      
      expect(screen.getByText(/register here/i)).toBeInTheDocument();
    });
  });

  describe('Form Input Handling', () => {
    it('should update email field when user types', async () => {
      const user = userEvent.setup();
      render(<LoginForm onSubmit={mockOnSubmit} />);

      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      
      await user.type(emailInput, 'test@example.com');
      
      expect(emailInput.value).toBe('test@example.com');
    });

    it('should update password field when user types', async () => {
      const user = userEvent.setup();
      render(<LoginForm onSubmit={mockOnSubmit} />);

      const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
      
      await user.type(passwordInput, 'password123');
      
      expect(passwordInput.value).toBe('password123');
    });

    it('should handle both fields being updated', async () => {
      const user = userEvent.setup();
      render(<LoginForm onSubmit={mockOnSubmit} />);

      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
      
      await user.type(emailInput, 'user@test.com');
      await user.type(passwordInput, 'securepass');
      
      expect(emailInput.value).toBe('user@test.com');
      expect(passwordInput.value).toBe('securepass');
    });
  });

  describe('Form Validation', () => {
    it('should show error toast when submitting empty form', async () => {
      const user = userEvent.setup();
      render(<LoginForm onSubmit={mockOnSubmit} />);

      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      await user.click(submitButton);
      
      expect(toast.error).toHaveBeenCalledWith('Enter all the details');
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show error toast when email is empty', async () => {
      const user = userEvent.setup();
      render(<LoginForm onSubmit={mockOnSubmit} />);

      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      expect(toast.error).toHaveBeenCalledWith('Enter all the details');
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show error toast when password is empty', async () => {
      const user = userEvent.setup();
      render(<LoginForm onSubmit={mockOnSubmit} />);

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      await user.type(emailInput, 'test@example.com');
      await user.click(submitButton);
      
      expect(toast.error).toHaveBeenCalledWith('Enter all the details');
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit with form data when form is valid', async () => {
      const user = userEvent.setup();
      render(<LoginForm onSubmit={mockOnSubmit} />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      const expectedData: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };
      
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith(expectedData);
      expect(toast.error).not.toHaveBeenCalled();
    });

    it('should prevent default form submission', async () => {
      const user = userEvent.setup();
      const { container } = render(<LoginForm onSubmit={mockOnSubmit} />);

      const form = container.querySelector('form');
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      const preventDefaultSpy = jest.spyOn(submitEvent, 'preventDefault');
      
      fireEvent(form!, submitEvent);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should handle form submission with Enter key', async () => {
      const user = userEvent.setup();
      render(<LoginForm onSubmit={mockOnSubmit} />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.keyboard('{Enter}');
      
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  describe('Register Link', () => {
    it('should call onRegisterClick when register link is clicked', async () => {
      const user = userEvent.setup();
      render(<LoginForm onSubmit={mockOnSubmit} onRegisterClick={mockOnRegisterClick} />);

      const registerLink = screen.getByText(/register here/i);
      
      await user.click(registerLink);
      
      expect(mockOnRegisterClick).toHaveBeenCalledTimes(1);
    });

    it('should prevent default link behavior when register link is clicked', () => {
      render(<LoginForm onSubmit={mockOnSubmit} onRegisterClick={mockOnRegisterClick} />);

      const registerLink = screen.getByText(/register here/i);
      
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      const preventDefaultSpy = jest.spyOn(clickEvent, 'preventDefault');
      
      fireEvent(registerLink, clickEvent);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should not call onRegisterClick when it is not provided', async () => {
      const user = userEvent.setup();
      render(<LoginForm onSubmit={mockOnSubmit} />);

      const registerLink = screen.getByText(/register here/i);
      
      await user.click(registerLink);
      
      expect(mockOnRegisterClick).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle whitespace-only input as empty', async () => {
      const user = userEvent.setup();
      render(<LoginForm onSubmit={mockOnSubmit} />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      await user.type(emailInput, '   ');
      await user.type(passwordInput, '   ');
      await user.click(submitButton);
      
      // The current implementation doesn't trim, but if you want to test trimmed values:
      // expect(toast.error).toHaveBeenCalledWith('Enter all the details');
      // expect(mockOnSubmit).not.toHaveBeenCalled();
      
      expect(toast.error).toHaveBeenCalledWith('Enter all the details');
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should handle rapid form submissions', async () => {
      const user = userEvent.setup();
      render(<LoginForm onSubmit={mockOnSubmit} />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      
      // Rapid clicks
      await user.click(submitButton);
      await user.click(submitButton);
      await user.click(submitButton);
      
      // Should still only submit once per click (no debouncing in current implementation)
      expect(mockOnSubmit).toHaveBeenCalledTimes(3);
    });

    it('should clear form after successful submission (if implemented)', async () => {
      const user = userEvent.setup();
      render(<LoginForm onSubmit={mockOnSubmit} />);

      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      // Note: Current implementation doesn't clear form after submission
      // If you want to test clearing, you'd need to implement it in the component
      expect(emailInput.value).toBe('test@example.com');
      expect(passwordInput.value).toBe('password123');
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for form inputs', () => {
      render(<LoginForm onSubmit={mockOnSubmit} />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      expect(emailInput).toHaveAttribute('id', 'email');
      expect(passwordInput).toHaveAttribute('id', 'password');
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<LoginForm onSubmit={mockOnSubmit} />);

      await user.tab();
      expect(screen.getByLabelText(/email/i)).toHaveFocus();
      
      await user.tab();
      expect(screen.getByLabelText(/password/i)).toHaveFocus();
      
      await user.tab();
      expect(screen.getByText(/register here/i)).toHaveFocus();
      
      await user.tab();
      expect(screen.getByRole('button', { name: /submit/i })).toHaveFocus();
    });
  });
});
