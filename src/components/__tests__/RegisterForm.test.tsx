import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterForm from '../RegisterForm';
import toast from 'react-hot-toast';

// Mock dependencies
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span>Icon</span>,
}));

describe('RegisterForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnLoginClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SIMPLE CASES
  describe('Rendering', () => {
    it('should render all form fields', () => {
      render(<RegisterForm onSubmit={mockOnSubmit} />);
      
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getAllByLabelText(/password/i)).toHaveLength(2);
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('should render login link when onLoginClick is provided', () => {
      render(<RegisterForm onSubmit={mockOnSubmit} onLoginClick={mockOnLoginClick} />);
      
      expect(screen.getByText(/login here/i)).toBeInTheDocument();
    });
  });

  // LOGICAL CASES
  describe('Form Validation', () => {
    it('should show error when fields are empty', () => {
      render(<RegisterForm onSubmit={mockOnSubmit} />);
      
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));
      
      expect(toast.error).toHaveBeenCalledWith('Enter all the details');
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show error when passwords do not match', () => {
      render(<RegisterForm onSubmit={mockOnSubmit} />);
      
      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@test.com' } });
      fireEvent.change(screen.getByPlaceholderText(/enter password/i), { target: { value: 'pass123' } });
      fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { target: { value: 'pass456' } });
      
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));
      
      expect(toast.error).toHaveBeenCalledWith('Passwords do not match');
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show error when password is less than 6 characters', () => {
      render(<RegisterForm onSubmit={mockOnSubmit} />);
      
      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@test.com' } });
      fireEvent.change(screen.getByPlaceholderText(/enter password/i), { target: { value: '12345' } });
      fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { target: { value: '12345' } });
      
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));
      
      expect(toast.error).toHaveBeenCalledWith('Password must be at least 6 characters long');
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should submit form with valid data', () => {
      render(<RegisterForm onSubmit={mockOnSubmit} />);
      
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };
      
      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: formData.name } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: formData.email } });
      fireEvent.change(screen.getByPlaceholderText(/enter password/i), { target: { value: formData.password } });
      fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { target: { value: formData.confirmPassword } });
      
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));
      
      expect(mockOnSubmit).toHaveBeenCalledWith(formData);
      expect(toast.error).not.toHaveBeenCalled();
    });
  });

  describe('User Interactions', () => {
    it('should update input values on change', () => {
      render(<RegisterForm onSubmit={mockOnSubmit} />);
      
      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      
      expect(nameInput).toHaveValue('Test User');
    });

    it('should call onLoginClick when login link is clicked', () => {
      render(<RegisterForm onSubmit={mockOnSubmit} onLoginClick={mockOnLoginClick} />);
      
      fireEvent.click(screen.getByText(/login here/i));
      
      expect(mockOnLoginClick).toHaveBeenCalled();
    });

    it('should prevent form submission on enter key', () => {
      render(<RegisterForm onSubmit={mockOnSubmit} />);
      
      const form = screen.getByLabelText(/name/i).closest('form');
      fireEvent.submit(form!);
      
      expect(toast.error).toHaveBeenCalledWith('Enter all the details');
    });
  });
});
