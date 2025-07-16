import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import UserCreationForm from './UserCreationForm';
import * as api from '../../services/api';

// Mock the API module
vi.mock('../../services/api');

const theme = createTheme();

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('UserCreationForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // User Story 1: Form Display
  describe('Form Display', () => {
    it('AC 1.1: should render a form with First Name text input field', () => {
      renderWithTheme(<UserCreationForm />);
      
      const firstNameInput = screen.getByLabelText('First Name');
      expect(firstNameInput).toBeInTheDocument();
      expect(firstNameInput).toHaveAttribute('type', 'text');
    });

    it('AC 1.2: should render a form with Last Name text input field', () => {
      renderWithTheme(<UserCreationForm />);
      
      const lastNameInput = screen.getByLabelText('Last Name');
      expect(lastNameInput).toBeInTheDocument();
      expect(lastNameInput).toHaveAttribute('type', 'text');
    });

    it('AC 1.3: should render a form with Email Address text input field', () => {
      renderWithTheme(<UserCreationForm />);
      
      const emailInput = screen.getByLabelText('Email Address');
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('AC 1.4: should render a button with the text "Create User"', () => {
      renderWithTheme(<UserCreationForm />);
      
      const createButton = screen.getByRole('button', { name: 'Create User' });
      expect(createButton).toBeInTheDocument();
    });
  });

  // User Story 2: Form Validation
  describe('Form Validation', () => {
    it('AC 2.1: should show "First Name is required" when Create User is clicked with empty First Name', async () => {
      const user = userEvent.setup();
      renderWithTheme(<UserCreationForm />);
      
      const createButton = screen.getByRole('button', { name: 'Create User' });
      await user.click(createButton);
      
      expect(screen.getByText('First Name is required')).toBeInTheDocument();
    });

    it('AC 2.2: should show "Last Name is required" when Create User is clicked with empty Last Name', async () => {
      const user = userEvent.setup();
      renderWithTheme(<UserCreationForm />);
      
      const createButton = screen.getByRole('button', { name: 'Create User' });
      await user.click(createButton);
      
      expect(screen.getByText('Last Name is required')).toBeInTheDocument();
    });

    it('AC 2.3: should show "Email Address is required" when Create User is clicked with empty Email', async () => {
      const user = userEvent.setup();
      renderWithTheme(<UserCreationForm />);
      
      const createButton = screen.getByRole('button', { name: 'Create User' });
      await user.click(createButton);
      
      expect(screen.getByText('Email Address is required')).toBeInTheDocument();
    });

    it('AC 2.4: should show "Please enter a valid email address" for invalid email format', async () => {
      const user = userEvent.setup();
      renderWithTheme(<UserCreationForm />);
      
      const firstNameInput = screen.getByLabelText('First Name');
      const lastNameInput = screen.getByLabelText('Last Name');
      const emailInput = screen.getByLabelText('Email Address');
      
      // Fill required fields but with invalid email
      await user.type(firstNameInput, 'John');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'invalid-email');
      
      const createButton = screen.getByRole('button', { name: 'Create User' });
      await user.click(createButton);
      
      // Check for the error message
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });
    });

    it('AC 2.5: should not trigger API POST request when validation fails', async () => {
      const user = userEvent.setup();
      const mockCreateUser = vi.mocked(api.createUser);
      
      renderWithTheme(<UserCreationForm />);
      
      const createButton = screen.getByRole('button', { name: 'Create User' });
      await user.click(createButton);
      
      expect(mockCreateUser).not.toHaveBeenCalled();
    });

    it('should clear validation errors when user starts typing', async () => {
      const user = userEvent.setup();
      renderWithTheme(<UserCreationForm />);
      
      const firstNameInput = screen.getByLabelText('First Name');
      const createButton = screen.getByRole('button', { name: 'Create User' });
      
      // Trigger validation error
      await user.click(createButton);
      expect(screen.getByText('First Name is required')).toBeInTheDocument();
      
      // Start typing to clear error
      await user.type(firstNameInput, 'John');
      expect(screen.queryByText('First Name is required')).not.toBeInTheDocument();
    });
  });

  // User Story 3: Successful Submission
  describe('Successful Submission', () => {
    it('AC 3.1: should send POST request to API endpoint when valid data is submitted', async () => {
      const user = userEvent.setup();
      const mockCreateUser = vi.mocked(api.createUser);
      mockCreateUser.mockResolvedValue({ userId: '123', message: 'User created successfully' });
      
      renderWithTheme(<UserCreationForm />);
      
      const firstNameInput = screen.getByLabelText('First Name');
      const lastNameInput = screen.getByLabelText('Last Name');
      const emailInput = screen.getByLabelText('Email Address');
      const createButton = screen.getByRole('button', { name: 'Create User' });
      
      await user.type(firstNameInput, 'John');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'john.doe@example.com');
      await user.click(createButton);
      
      expect(mockCreateUser).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      });
    });

    it('AC 3.2: should send request body as JSON object with firstName, lastName, and email', async () => {
      const user = userEvent.setup();
      const mockCreateUser = vi.mocked(api.createUser);
      mockCreateUser.mockResolvedValue({ userId: '123', message: 'User created successfully' });
      
      renderWithTheme(<UserCreationForm />);
      
      const firstNameInput = screen.getByLabelText('First Name');
      const lastNameInput = screen.getByLabelText('Last Name');
      const emailInput = screen.getByLabelText('Email Address');
      const createButton = screen.getByRole('button', { name: 'Create User' });
      
      await user.type(firstNameInput, 'Jane');
      await user.type(lastNameInput, 'Smith');
      await user.type(emailInput, 'jane.smith@example.com');
      await user.click(createButton);
      
      expect(mockCreateUser).toHaveBeenCalledWith({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com'
      });
    });

    it('AC 3.3: should clear form fields upon successful response', async () => {
      const user = userEvent.setup();
      const mockCreateUser = vi.mocked(api.createUser);
      mockCreateUser.mockResolvedValue({ userId: '123', message: 'User created successfully' });
      
      renderWithTheme(<UserCreationForm />);
      
      const firstNameInput = screen.getByLabelText('First Name');
      const lastNameInput = screen.getByLabelText('Last Name');
      const emailInput = screen.getByLabelText('Email Address');
      const createButton = screen.getByRole('button', { name: 'Create User' });
      
      await user.type(firstNameInput, 'John');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'john.doe@example.com');
      await user.click(createButton);
      
      await waitFor(() => {
        expect(firstNameInput).toHaveValue('');
        expect(lastNameInput).toHaveValue('');
        expect(emailInput).toHaveValue('');
      });
    });

    it('AC 3.4: should display success message "User created successfully!"', async () => {
      const user = userEvent.setup();
      const mockCreateUser = vi.mocked(api.createUser);
      mockCreateUser.mockResolvedValue({ userId: '123', message: 'User created successfully' });
      
      renderWithTheme(<UserCreationForm />);
      
      const firstNameInput = screen.getByLabelText('First Name');
      const lastNameInput = screen.getByLabelText('Last Name');
      const emailInput = screen.getByLabelText('Email Address');
      const createButton = screen.getByRole('button', { name: 'Create User' });
      
      await user.type(firstNameInput, 'John');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'john.doe@example.com');
      await user.click(createButton);
      
      await waitFor(() => {
        expect(screen.getByText('User created successfully!')).toBeInTheDocument();
      });
    });

    it('should disable form during submission', async () => {
      const user = userEvent.setup();
      const mockCreateUser = vi.mocked(api.createUser);
      
      // Mock a delayed response
      mockCreateUser.mockImplementation(() => new Promise(resolve => {
        setTimeout(() => resolve({ userId: '123', message: 'User created successfully' }), 100);
      }));
      
      renderWithTheme(<UserCreationForm />);
      
      const firstNameInput = screen.getByLabelText('First Name');
      const lastNameInput = screen.getByLabelText('Last Name');
      const emailInput = screen.getByLabelText('Email Address');
      const createButton = screen.getByRole('button', { name: 'Create User' });
      
      await user.type(firstNameInput, 'John');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'john.doe@example.com');
      await user.click(createButton);
      
      // Check if form is disabled during submission
      expect(firstNameInput).toBeDisabled();
      expect(lastNameInput).toBeDisabled();
      expect(emailInput).toBeDisabled();
      expect(createButton).toBeDisabled();
      expect(screen.getByText('Creating...')).toBeInTheDocument();
      
      // Wait for submission to complete
      await waitFor(() => {
        expect(screen.getByText('User created successfully!')).toBeInTheDocument();
      });
    });
  });

  // User Story 4: Submission Failure
  describe('Submission Failure', () => {
    it('AC 4.1: should display generic error message when API call fails', async () => {
      const user = userEvent.setup();
      const mockCreateUser = vi.mocked(api.createUser);
      mockCreateUser.mockRejectedValue(new Error('Network error'));
      
      renderWithTheme(<UserCreationForm />);
      
      const firstNameInput = screen.getByLabelText('First Name');
      const lastNameInput = screen.getByLabelText('Last Name');
      const emailInput = screen.getByLabelText('Email Address');
      const createButton = screen.getByRole('button', { name: 'Create User' });
      
      await user.type(firstNameInput, 'John');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'john.doe@example.com');
      await user.click(createButton);
      
      await waitFor(() => {
        expect(screen.getByText('An error occurred while creating the user. Please try again later.')).toBeInTheDocument();
      });
    });

    it('AC 4.2: should allow error message to be dismissed', async () => {
      const user = userEvent.setup();
      const mockCreateUser = vi.mocked(api.createUser);
      mockCreateUser.mockRejectedValue(new Error('Network error'));
      
      renderWithTheme(<UserCreationForm />);
      
      const firstNameInput = screen.getByLabelText('First Name');
      const lastNameInput = screen.getByLabelText('Last Name');
      const emailInput = screen.getByLabelText('Email Address');
      const createButton = screen.getByRole('button', { name: 'Create User' });
      
      await user.type(firstNameInput, 'John');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'john.doe@example.com');
      await user.click(createButton);
      
      await waitFor(() => {
        expect(screen.getByText('An error occurred while creating the user. Please try again later.')).toBeInTheDocument();
      });
      
      // Find and click the close button on the error alert
      const closeButton = screen.getByRole('button', { name: 'Close' });
      await user.click(closeButton);
      
      expect(screen.queryByText('An error occurred while creating the user. Please try again later.')).not.toBeInTheDocument();
    });

    it('should handle HTTP 400 error', async () => {
      const user = userEvent.setup();
      const mockCreateUser = vi.mocked(api.createUser);
      mockCreateUser.mockRejectedValue(new Error('HTTP error! status: 400'));
      
      renderWithTheme(<UserCreationForm />);
      
      const firstNameInput = screen.getByLabelText('First Name');
      const lastNameInput = screen.getByLabelText('Last Name');
      const emailInput = screen.getByLabelText('Email Address');
      const createButton = screen.getByRole('button', { name: 'Create User' });
      
      await user.type(firstNameInput, 'John');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'john.doe@example.com');
      await user.click(createButton);
      
      await waitFor(() => {
        expect(screen.getByText('An error occurred while creating the user. Please try again later.')).toBeInTheDocument();
      });
    });

    it('should handle HTTP 500 error', async () => {
      const user = userEvent.setup();
      const mockCreateUser = vi.mocked(api.createUser);
      mockCreateUser.mockRejectedValue(new Error('HTTP error! status: 500'));
      
      renderWithTheme(<UserCreationForm />);
      
      const firstNameInput = screen.getByLabelText('First Name');
      const lastNameInput = screen.getByLabelText('Last Name');
      const emailInput = screen.getByLabelText('Email Address');
      const createButton = screen.getByRole('button', { name: 'Create User' });
      
      await user.type(firstNameInput, 'John');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'john.doe@example.com');
      await user.click(createButton);
      
      await waitFor(() => {
        expect(screen.getByText('An error occurred while creating the user. Please try again later.')).toBeInTheDocument();
      });
    });

    it('should handle network error', async () => {
      const user = userEvent.setup();
      const mockCreateUser = vi.mocked(api.createUser);
      mockCreateUser.mockRejectedValue(new Error('Network error'));
      
      renderWithTheme(<UserCreationForm />);
      
      const firstNameInput = screen.getByLabelText('First Name');
      const lastNameInput = screen.getByLabelText('Last Name');
      const emailInput = screen.getByLabelText('Email Address');
      const createButton = screen.getByRole('button', { name: 'Create User' });
      
      await user.type(firstNameInput, 'John');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'john.doe@example.com');
      await user.click(createButton);
      
      await waitFor(() => {
        expect(screen.getByText('An error occurred while creating the user. Please try again later.')).toBeInTheDocument();
      });
    });
  });

  // Additional edge cases and integration tests
  describe('Edge Cases and Integration', () => {
    it('should handle form submission with trimmed whitespace', async () => {
      const user = userEvent.setup();
      const mockCreateUser = vi.mocked(api.createUser);
      mockCreateUser.mockResolvedValue({ userId: '123', message: 'User created successfully' });
      
      renderWithTheme(<UserCreationForm />);
      
      const firstNameInput = screen.getByLabelText('First Name');
      const lastNameInput = screen.getByLabelText('Last Name');
      const emailInput = screen.getByLabelText('Email Address');
      const createButton = screen.getByRole('button', { name: 'Create User' });
      
      await user.type(firstNameInput, '  John  ');
      await user.type(lastNameInput, '  Doe  ');
      await user.type(emailInput, 'john.doe@example.com');
      await user.click(createButton);
      
      expect(mockCreateUser).toHaveBeenCalledWith({
        firstName: '  John  ',
        lastName: '  Doe  ',
        email: 'john.doe@example.com'
      });
    });

    it('should validate fields containing only whitespace as empty', async () => {
      const user = userEvent.setup();
      renderWithTheme(<UserCreationForm />);
      
      const firstNameInput = screen.getByLabelText('First Name');
      const lastNameInput = screen.getByLabelText('Last Name');
      const emailInput = screen.getByLabelText('Email Address');
      const createButton = screen.getByRole('button', { name: 'Create User' });
      
      await user.type(firstNameInput, '   ');
      await user.type(lastNameInput, '   ');
      await user.type(emailInput, '   ');
      await user.click(createButton);
      
      expect(screen.getByText('First Name is required')).toBeInTheDocument();
      expect(screen.getByText('Last Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email Address is required')).toBeInTheDocument();
    });

    it('should handle multiple rapid submissions', async () => {
      const user = userEvent.setup();
      const mockCreateUser = vi.mocked(api.createUser);
      mockCreateUser.mockImplementation(() => new Promise(resolve => {
        setTimeout(() => resolve({ userId: '123', message: 'User created successfully' }), 100);
      }));
      
      renderWithTheme(<UserCreationForm />);
      
      const firstNameInput = screen.getByLabelText('First Name');
      const lastNameInput = screen.getByLabelText('Last Name');
      const emailInput = screen.getByLabelText('Email Address');
      const createButton = screen.getByRole('button', { name: 'Create User' });
      
      await user.type(firstNameInput, 'John');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'john.doe@example.com');
      
      // Try to submit - first submission should work
      await user.click(createButton);
      
      // Button should be disabled after clicking, so additional clicks shouldn't work
      expect(createButton).toBeDisabled();
      
      // Wait for submission to complete
      await waitFor(() => {
        expect(screen.getByText('User created successfully!')).toBeInTheDocument();
      });
      
      // API should only be called once
      expect(mockCreateUser).toHaveBeenCalledTimes(1);
    });
  });
});