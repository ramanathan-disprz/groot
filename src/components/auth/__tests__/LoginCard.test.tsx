import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginCard from '../../auth/LoginCard';
import toast from 'react-hot-toast';

// Mock dependencies
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
}));

jest.mock('../../auth/Logo', () => {
  return function Logo() {
    return <div data-testid="logo">Logo</div>;
  };
});

describe('LoginCard', () => {
  const mockOnSubmit = jest.fn();
  const mockOnRegisterClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SIMPLE CASES
  describe('Rendering', () => {
    it('should render logo', () => {
      render(<LoginCard onSubmit={mockOnSubmit} />);
      
      expect(screen.getByTestId('logo')).toBeInTheDocument();
    });

    it('should render title', () => {
      render(<LoginCard onSubmit={mockOnSubmit} />);
      
      expect(screen.getByText('Sign in with Disprz Account')).toBeInTheDocument();
    });

    it('should render email and password inputs', () => {
      render(<LoginCard onSubmit={mockOnSubmit} />);
      
      expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter password/i)).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<LoginCard onSubmit={mockOnSubmit} />);
      
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('should render create account link', () => {
      render(<LoginCard onSubmit={mockOnSubmit} onRegisterClick={mockOnRegisterClick} />);
      
      expect(screen.getByText(/create disprz account/i)).toBeInTheDocument();
    });

    it('should have correct input types', () => {
      render(<LoginCard onSubmit={mockOnSubmit} />);
      
      expect(screen.getByPlaceholderText(/enter email/i)).toHaveAttribute('type', 'email');
      expect(screen.getByPlaceholderText(/enter password/i)).toHaveAttribute('type', 'password');
    });

    it('should have correct aria-labels', () => {
      render(<LoginCard onSubmit={mockOnSubmit} />);
      
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Submit')).toBeInTheDocument();
    });
  });

  // LOGICAL CASES
  describe('Form Validation', () => {
    it('should show error when both fields are empty', () => {
      render(<LoginCard onSubmit={mockOnSubmit} />);
      
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
      
      expect(toast.error).toHaveBeenCalledWith('Enter all the details');
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show error when email is empty', () => {
      render(<LoginCard onSubmit={mockOnSubmit} />);
      
      fireEvent.change(screen.getByPlaceholderText(/enter password/i), { 
        target: { value: 'password123' } 
      });
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
      
      expect(toast.error).toHaveBeenCalledWith('Enter all the details');
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show error when password is empty', () => {
      render(<LoginCard onSubmit={mockOnSubmit} />);
      
      fireEvent.change(screen.getByPlaceholderText(/enter email/i), { 
        target: { value: 'test@example.com' } 
      });
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
      
      expect(toast.error).toHaveBeenCalledWith('Enter all the details');
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should submit form with valid data', () => {
      render(<LoginCard onSubmit={mockOnSubmit} />);
      
      const loginData = {
        email: 'user@example.com',
        password: 'password123'
      };
      
      fireEvent.change(screen.getByPlaceholderText(/enter email/i), { 
        target: { value: loginData.email } 
      });
      fireEvent.change(screen.getByPlaceholderText(/enter password/i), { 
        target: { value: loginData.password } 
      });
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
      
      expect(mockOnSubmit).toHaveBeenCalledWith(loginData);
      expect(toast.error).not.toHaveBeenCalled();
    });
  });

  describe('User Interactions', () => {
    it('should update email input on change', () => {
      render(<LoginCard onSubmit={mockOnSubmit} />);
      
      const emailInput = screen.getByPlaceholderText(/enter email/i);
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      
      expect(emailInput).toHaveValue('test@test.com');
    });

    it('should update password input on change', () => {
      render(<LoginCard onSubmit={mockOnSubmit} />);
      
      const passwordInput = screen.getByPlaceholderText(/enter password/i);
      fireEvent.change(passwordInput, { target: { value: 'mypassword' } });
      
      expect(passwordInput).toHaveValue('mypassword');
    });

    it('should call onRegisterClick when register link is clicked', () => {
      render(<LoginCard onSubmit={mockOnSubmit} onRegisterClick={mockOnRegisterClick} />);
      
      fireEvent.click(screen.getByText(/create disprz account/i));
      
      expect(mockOnRegisterClick).toHaveBeenCalled();
    });

    it('should not call onRegisterClick if not provided', () => {
      render(<LoginCard onSubmit={mockOnSubmit} />);
      
      const registerLink = screen.getByText(/create disprz account/i);
      fireEvent.click(registerLink);
      
      // Should not throw error
      expect(mockOnRegisterClick).not.toHaveBeenCalled();
    });

    it('should handle register link click event', () => {
      const mockPreventDefault = jest.fn();
      render(<LoginCard onSubmit={mockOnSubmit} onRegisterClick={mockOnRegisterClick} />);
      
      const registerLink = screen.getByText(/create disprz account/i);
      
      // Simulate click with preventDefault
      fireEvent.click(registerLink, {
        preventDefault: mockPreventDefault
      });
      
      expect(mockOnRegisterClick).toHaveBeenCalled();
    });

    it('should submit form on enter key in password field', () => {
      render(<LoginCard onSubmit={mockOnSubmit} />);
      
      const emailInput = screen.getByPlaceholderText(/enter email/i);
      const passwordInput = screen.getByPlaceholderText(/enter password/i);
      
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      
      fireEvent.submit(emailInput.closest('form')!);
      
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123'
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle input values correctly', () => {
      render(<LoginCard onSubmit={mockOnSubmit} />);
      
      fireEvent.change(screen.getByPlaceholderText(/enter email/i), { 
        target: { value: 'test@test.com' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/enter password/i), { 
        target: { value: '  password  ' } 
      });
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
      
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: '  password  '
      });
    });

    it('should handle special characters in password', () => {
      render(<LoginCard onSubmit={mockOnSubmit} />);
      
      const specialPassword = 'p@$$w0rd!#%';
      
      fireEvent.change(screen.getByPlaceholderText(/enter email/i), { 
        target: { value: 'test@test.com' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/enter password/i), { 
        target: { value: specialPassword } 
      });
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
      
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: specialPassword
      });
    });

    it('should handle rapid input changes', () => {
      render(<LoginCard onSubmit={mockOnSubmit} />);
      
      const emailInput = screen.getByPlaceholderText(/enter email/i);
      
      fireEvent.change(emailInput, { target: { value: 'a' } });
      fireEvent.change(emailInput, { target: { value: 'ab' } });
      fireEvent.change(emailInput, { target: { value: 'abc' } });
      fireEvent.change(emailInput, { target: { value: 'abc@test.com' } });
      
      expect(emailInput).toHaveValue('abc@test.com');
    });

    it('should handle form reset', () => {
      render(<LoginCard onSubmit={mockOnSubmit} />);
      
      const emailInput = screen.getByPlaceholderText(/enter email/i);
      const passwordInput = screen.getByPlaceholderText(/enter password/i);
      
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password' } });
      
      // Clear inputs
      fireEvent.change(emailInput, { target: { value: '' } });
      fireEvent.change(passwordInput, { target: { value: '' } });
      
      expect(emailInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
    });

    it('should handle long email addresses', () => {
      render(<LoginCard onSubmit={mockOnSubmit} />);
      
      const longEmail = 'verylongemailaddress@subdomain.example.com';
      
      fireEvent.change(screen.getByPlaceholderText(/enter email/i), { 
        target: { value: longEmail } 
      });
      fireEvent.change(screen.getByPlaceholderText(/enter password/i), { 
        target: { value: 'password' } 
      });
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
      
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: longEmail,
        password: 'password'
      });
    });
  });
});
