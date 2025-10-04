import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterCard from '../../auth/RegisterCard';
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

describe('RegisterCard', () => {
  const mockOnSubmit = jest.fn();
  const mockOnLoginClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SIMPLE CASES
  describe('Rendering', () => {
    it('should render logo', () => {
      render(<RegisterCard onSubmit={mockOnSubmit} />);
      
      expect(screen.getByTestId('logo')).toBeInTheDocument();
    });

    it('should render title', () => {
      render(<RegisterCard onSubmit={mockOnSubmit} />);
      
      expect(screen.getByText('Create an Account with Disprz')).toBeInTheDocument();
    });

    it('should render all input fields', () => {
      render(<RegisterCard onSubmit={mockOnSubmit} />);
      
      expect(screen.getByPlaceholderText(/enter name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter password/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<RegisterCard onSubmit={mockOnSubmit} />);
      
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('should render login link', () => {
      render(<RegisterCard onSubmit={mockOnSubmit} onLoginClick={mockOnLoginClick} />);
      
      expect(screen.getByText(/sign in with disprz account/i)).toBeInTheDocument();
      expect(screen.getByText(/do you already have an account\?/i)).toBeInTheDocument();
    });

    it('should have correct input types', () => {
      render(<RegisterCard onSubmit={mockOnSubmit} />);
      
      expect(screen.getByPlaceholderText(/enter name/i)).toHaveAttribute('type', 'text');
      expect(screen.getByPlaceholderText(/enter email/i)).toHaveAttribute('type', 'email');
      expect(screen.getByPlaceholderText(/enter password/i)).toHaveAttribute('type', 'password');
      expect(screen.getByPlaceholderText(/confirm password/i)).toHaveAttribute('type', 'password');
    });

    it('should have correct aria-labels', () => {
      render(<RegisterCard onSubmit={mockOnSubmit} />);
      
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Submit')).toBeInTheDocument();
    });
  });

  // LOGICAL CASES
  describe('Form Validation', () => {
    it('should show error when all fields are empty', () => {
      render(<RegisterCard onSubmit={mockOnSubmit} />);
      
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
      
      expect(toast.error).toHaveBeenCalledWith('Enter all the details');
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show error when name is empty', () => {
      render(<RegisterCard onSubmit={mockOnSubmit} />);
      
      fireEvent.change(screen.getByPlaceholderText(/enter email/i), { 
        target: { value: 'test@test.com' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/enter password/i), { 
        target: { value: 'password123' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { 
        target: { value: 'password123' } 
      });
      
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
      
      expect(toast.error).toHaveBeenCalledWith('Enter all the details');
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show error when passwords do not match', () => {
      render(<RegisterCard onSubmit={mockOnSubmit} />);
      
      fireEvent.change(screen.getByPlaceholderText(/enter name/i), { 
        target: { value: 'John Doe' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/enter email/i), { 
        target: { value: 'test@test.com' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/enter password/i), { 
        target: { value: 'password123' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { 
        target: { value: 'password456' } 
      });
      
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
      
      expect(toast.error).toHaveBeenCalledWith('Passwords do not match');
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show error when password is less than 6 characters', () => {
      render(<RegisterCard onSubmit={mockOnSubmit} />);
      
      fireEvent.change(screen.getByPlaceholderText(/enter name/i), { 
        target: { value: 'John Doe' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/enter email/i), { 
        target: { value: 'test@test.com' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/enter password/i), { 
        target: { value: '12345' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { 
        target: { value: '12345' } 
      });
      
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
      
      expect(toast.error).toHaveBeenCalledWith('Password must be at least 6 characters long');
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should submit form with valid data', () => {
      render(<RegisterCard onSubmit={mockOnSubmit} />);
      
      const registerData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      };
      
      fireEvent.change(screen.getByPlaceholderText(/enter name/i), { 
        target: { value: registerData.name } 
      });
      fireEvent.change(screen.getByPlaceholderText(/enter email/i), { 
        target: { value: registerData.email } 
      });
      fireEvent.change(screen.getByPlaceholderText(/enter password/i), { 
        target: { value: registerData.password } 
      });
      fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { 
        target: { value: registerData.confirmPassword } 
      });
      
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
      
      expect(mockOnSubmit).toHaveBeenCalledWith(registerData);
      expect(toast.error).not.toHaveBeenCalled();
    });
  });

  describe('User Interactions', () => {
    it('should update name input on change', () => {
      render(<RegisterCard onSubmit={mockOnSubmit} />);
      
      const nameInput = screen.getByPlaceholderText(/enter name/i);
      fireEvent.change(nameInput, { target: { value: 'Jane Smith' } });
      
      expect(nameInput).toHaveValue('Jane Smith');
    });

    it('should update email input on change', () => {
      render(<RegisterCard onSubmit={mockOnSubmit} />);
      
      const emailInput = screen.getByPlaceholderText(/enter email/i);
      fireEvent.change(emailInput, { target: { value: 'jane@test.com' } });
      
      expect(emailInput).toHaveValue('jane@test.com');
    });

    it('should update password inputs on change', () => {
      render(<RegisterCard onSubmit={mockOnSubmit} />);
      
      const passwordInput = screen.getByPlaceholderText(/enter password/i);
      const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i);
      
      fireEvent.change(passwordInput, { target: { value: 'mypassword' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'mypassword' } });
      
      expect(passwordInput).toHaveValue('mypassword');
      expect(confirmPasswordInput).toHaveValue('mypassword');
    });

    it('should call onLoginClick when login link is clicked', () => {
      render(<RegisterCard onSubmit={mockOnSubmit} onLoginClick={mockOnLoginClick} />);
      
      fireEvent.click(screen.getByText(/sign in with disprz account/i));
      
      expect(mockOnLoginClick).toHaveBeenCalled();
    });

    it('should not call onLoginClick if not provided', () => {
      render(<RegisterCard onSubmit={mockOnSubmit} />);
      
      const loginLink = screen.getByText(/sign in with disprz account/i);
      fireEvent.click(loginLink);
      
      // Should not throw error
      expect(mockOnLoginClick).not.toHaveBeenCalled();
    });

    it('should submit form on enter key', () => {
      render(<RegisterCard onSubmit={mockOnSubmit} />);
      
      const form = screen.getByPlaceholderText(/enter name/i).closest('form');
      
      fireEvent.change(screen.getByPlaceholderText(/enter name/i), { 
        target: { value: 'John Doe' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/enter email/i), { 
        target: { value: 'john@test.com' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/enter password/i), { 
        target: { value: 'password123' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { 
        target: { value: 'password123' } 
      });
      
      fireEvent.submit(form!);
      
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@test.com',
        password: 'password123',
        confirmPassword: 'password123'
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in name', () => {
      render(<RegisterCard onSubmit={mockOnSubmit} />);
      
      const specialName = "O'Brien-Smith Jr.";
      
      fireEvent.change(screen.getByPlaceholderText(/enter name/i), { 
        target: { value: specialName } 
      });
      fireEvent.change(screen.getByPlaceholderText(/enter email/i), { 
        target: { value: 'test@test.com' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/enter password/i), { 
        target: { value: 'password123' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { 
        target: { value: 'password123' } 
      });
      
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
      
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        name: specialName
      }));
    });

    it('should handle exactly 6 character password', () => {
      render(<RegisterCard onSubmit={mockOnSubmit} />);
      
      fireEvent.change(screen.getByPlaceholderText(/enter name/i), { 
        target: { value: 'John' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/enter email/i), { 
        target: { value: 'test@test.com' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/enter password/i), { 
        target: { value: '123456' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { 
        target: { value: '123456' } 
      });
      
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
      
      expect(mockOnSubmit).toHaveBeenCalled();
      expect(toast.error).not.toHaveBeenCalled();
    });

    it('should handle form reset', () => {
      render(<RegisterCard onSubmit={mockOnSubmit} />);
      
      const nameInput = screen.getByPlaceholderText(/enter name/i);
      const emailInput = screen.getByPlaceholderText(/enter email/i);
      
      fireEvent.change(nameInput, { target: { value: 'Test' } });
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      
      // Clear inputs
      fireEvent.change(nameInput, { target: { value: '' } });
      fireEvent.change(emailInput, { target: { value: '' } });
      
      expect(nameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
    });

    it('should validate fields in correct order', () => {
      render(<RegisterCard onSubmit={mockOnSubmit} />);
      
      // Only fill name, but with short mismatched passwords
      fireEvent.change(screen.getByPlaceholderText(/enter name/i), { 
        target: { value: 'John' } 
      });
      
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
      
      // Should show empty fields error first
      expect(toast.error).toHaveBeenCalledWith('Enter all the details');
      expect(toast.error).toHaveBeenCalledTimes(1);
    });
  });
});
