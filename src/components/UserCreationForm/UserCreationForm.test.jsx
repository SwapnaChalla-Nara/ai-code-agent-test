import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserCreationForm from './UserCreationForm';
import * as api from '../../services/api';

// Mock the API service
vi.mock('../../services/api', () => ({
  createUser: vi.fn()
}));

describe('UserCreationForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<UserCreationForm />);
    
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create User' })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<UserCreationForm />);
    
    const submitButton = screen.getByRole('button', { name: 'Create User' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('First Name is required')).toBeInTheDocument();
      expect(screen.getByText('Last Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email Address is required')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const mockCreateUser = vi.mocked(api.createUser);
    mockCreateUser.mockResolvedValueOnce({ userId: '123', message: 'User created successfully' });
    
    render(<UserCreationForm />);
    
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'john@example.com' } });
    
    const submitButton = screen.getByRole('button', { name: 'Create User' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      });
    });
    
    await waitFor(() => {
      expect(screen.getByText('User created successfully!')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    const mockCreateUser = vi.mocked(api.createUser);
    mockCreateUser.mockRejectedValueOnce(new Error('API Error'));
    
    render(<UserCreationForm />);
    
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'john@example.com' } });
    
    const submitButton = screen.getByRole('button', { name: 'Create User' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('An error occurred while creating the user. Please try again later.')).toBeInTheDocument();
    });
  });
});