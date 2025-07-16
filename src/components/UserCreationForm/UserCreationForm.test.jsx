import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserCreationForm from './UserCreationForm';

describe('UserCreationForm', () => {
  it('renders form with required fields', () => {
    render(<UserCreationForm />);
    
    // Check if all required fields are present
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create user/i })).toBeInTheDocument();
  });

  it('shows validation errors when form is submitted empty', () => {
    render(<UserCreationForm />);
    
    const submitButton = screen.getByRole('button', { name: /create user/i });
    fireEvent.click(submitButton);
    
    // Check validation messages
    expect(screen.getByText('First Name is required')).toBeInTheDocument();
    expect(screen.getByText('Last Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email Address is required')).toBeInTheDocument();
  });

  it('shows email validation error for invalid email format', () => {
    render(<UserCreationForm />);
    
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /create user/i });
    
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('displays loading state correctly', () => {
    render(<UserCreationForm isLoading={true} />);
    
    expect(screen.getByText('Creating User...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays success message correctly', () => {
    render(<UserCreationForm successMessage="User created successfully!" />);
    
    expect(screen.getByText('User created successfully!')).toBeInTheDocument();
  });

  it('displays error message correctly', () => {
    render(<UserCreationForm errorMessage="An error occurred while creating the user. Please try again later." />);
    
    expect(screen.getByText('An error occurred while creating the user. Please try again later.')).toBeInTheDocument();
  });
});