import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import UserCreationForm from './UserCreationForm';
import { createUser } from '../../services/api';

// Mock the API service
vi.mock('../../services/api');

const theme = createTheme();

// Helper function to render component with theme
const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('UserCreationForm - Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should display error message when API call fails with 4xx status (AC 4.1)', async () => {
    // Mock API to reject with error
    const errorMessage = 'An error occurred while creating the user. Please try again later.';
    createUser.mockRejectedValueOnce(new Error(errorMessage));

    renderWithTheme(<UserCreationForm />);

    // Fill in valid form data
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john.doe@example.com' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create user/i }));

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Verify API was called
    expect(createUser).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    });
  });

  test('should display error message when API call fails with 5xx status (AC 4.1)', async () => {
    // Mock API to reject with server error
    const errorMessage = 'An error occurred while creating the user. Please try again later.';
    createUser.mockRejectedValueOnce(new Error(errorMessage));

    renderWithTheme(<UserCreationForm />);

    // Fill in valid form data
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Smith' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'jane.smith@example.com' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create user/i }));

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test('should display error message when network error occurs (AC 4.1)', async () => {
    // Mock API to reject with network error
    const errorMessage = 'An error occurred while creating the user. Please try again later.';
    createUser.mockRejectedValueOnce(new Error(errorMessage));

    renderWithTheme(<UserCreationForm />);

    // Fill in valid form data
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Bob' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Johnson' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'bob.johnson@example.com' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create user/i }));

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test('should allow dismissing error message (AC 4.2)', async () => {
    // Mock API to reject with error
    const errorMessage = 'An error occurred while creating the user. Please try again later.';
    createUser.mockRejectedValueOnce(new Error(errorMessage));

    renderWithTheme(<UserCreationForm />);

    // Fill in valid form data
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Brown' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'alice.brown@example.com' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create user/i }));

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Find and click the close button in the error alert
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    // Wait for error message to disappear
    await waitFor(() => {
      expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
    });
  });

  test('should auto-dismiss error message after timeout (AC 4.2)', async () => {
    // Mock API to reject with error
    const errorMessage = 'An error occurred while creating the user. Please try again later.';
    createUser.mockRejectedValueOnce(new Error(errorMessage));

    renderWithTheme(<UserCreationForm />);

    // Fill in valid form data
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Charlie' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Wilson' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'charlie.wilson@example.com' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create user/i }));

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Wait for auto-dismiss timeout (8 seconds + some buffer)
    await waitFor(
      () => {
        expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
      },
      { timeout: 10000 }
    );
  }, 15000); // Set test timeout to 15 seconds

  test('should display success message on successful submission and clear form', async () => {
    // Mock API to resolve successfully
    createUser.mockResolvedValueOnce({
      userId: '123',
      message: 'User created successfully'
    });

    renderWithTheme(<UserCreationForm />);

    // Fill in valid form data
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'David' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Miller' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'david.miller@example.com' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create user/i }));

    // Wait for success message to appear
    await waitFor(() => {
      expect(screen.getByText('User created successfully!')).toBeInTheDocument();
    });

    // Verify form was cleared
    expect(screen.getByLabelText(/first name/i)).toHaveValue('');
    expect(screen.getByLabelText(/last name/i)).toHaveValue('');
    expect(screen.getByLabelText(/email address/i)).toHaveValue('');
  });
});