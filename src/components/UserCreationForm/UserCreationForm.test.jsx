import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UserCreationForm from './UserCreationForm'

describe('UserCreationForm', () => {
  let mockOnSubmit
  let mockOnDismissError

  beforeEach(() => {
    mockOnSubmit = vi.fn()
    mockOnDismissError = vi.fn()
  })

  // User Story 1: Form Display - AC 1.1-1.4
  describe('Form Display', () => {
    it('AC 1.1: renders a text input field labeled "First Name"', () => {
      render(<UserCreationForm onSubmit={mockOnSubmit} onDismissError={mockOnDismissError} />)
      
      const firstNameInput = screen.getByLabelText(/first name/i)
      expect(firstNameInput).toBeInTheDocument()
      expect(firstNameInput).toHaveAttribute('type', 'text')
    })

    it('AC 1.2: renders a text input field labeled "Last Name"', () => {
      render(<UserCreationForm onSubmit={mockOnSubmit} onDismissError={mockOnDismissError} />)
      
      const lastNameInput = screen.getByLabelText(/last name/i)
      expect(lastNameInput).toBeInTheDocument()
      expect(lastNameInput).toHaveAttribute('type', 'text')
    })

    it('AC 1.3: renders a text input field labeled "Email Address"', () => {
      render(<UserCreationForm onSubmit={mockOnSubmit} onDismissError={mockOnDismissError} />)
      
      const emailInput = screen.getByLabelText(/email address/i)
      expect(emailInput).toBeInTheDocument()
      expect(emailInput).toHaveAttribute('type', 'email')
    })

    it('AC 1.4: renders a button with the text "Create User"', () => {
      render(<UserCreationForm onSubmit={mockOnSubmit} onDismissError={mockOnDismissError} />)
      
      const createButton = screen.getByRole('button', { name: /create user/i })
      expect(createButton).toBeInTheDocument()
    })
  })

  // User Story 2: Form Validation - AC 2.1-2.5
  describe('Form Validation', () => {
    it('AC 2.1: shows "First Name is required" when First Name field is empty on submit', async () => {
      render(
        <UserCreationForm 
          onSubmit={mockOnSubmit} 
          onDismissError={mockOnDismissError}
          errors={{ firstName: 'First Name is required' }}
        />
      )
      
      const errorMessage = screen.getByText('First Name is required')
      expect(errorMessage).toBeInTheDocument()
    })

    it('AC 2.2: shows "Last Name is required" when Last Name field is empty on submit', () => {
      render(
        <UserCreationForm 
          onSubmit={mockOnSubmit} 
          onDismissError={mockOnDismissError}
          errors={{ lastName: 'Last Name is required' }}
        />
      )
      
      const errorMessage = screen.getByText('Last Name is required')
      expect(errorMessage).toBeInTheDocument()
    })

    it('AC 2.3: shows "Email Address is required" when Email field is empty on submit', () => {
      render(
        <UserCreationForm 
          onSubmit={mockOnSubmit} 
          onDismissError={mockOnDismissError}
          errors={{ email: 'Email Address is required' }}
        />
      )
      
      const errorMessage = screen.getByText('Email Address is required')
      expect(errorMessage).toBeInTheDocument()
    })

    it('AC 2.4: shows "Please enter a valid email address" for invalid email format', () => {
      render(
        <UserCreationForm 
          onSubmit={mockOnSubmit} 
          onDismissError={mockOnDismissError}
          errors={{ email: 'Please enter a valid email address' }}
        />
      )
      
      const errorMessage = screen.getByText('Please enter a valid email address')
      expect(errorMessage).toBeInTheDocument()
    })

    it('AC 2.5: calls onSubmit when form is submitted (validation is handled by parent)', async () => {
      const user = userEvent.setup()
      render(<UserCreationForm onSubmit={mockOnSubmit} onDismissError={mockOnDismissError} />)
      
      const firstNameInput = screen.getByLabelText(/first name/i)
      const lastNameInput = screen.getByLabelText(/last name/i)
      const emailInput = screen.getByLabelText(/email address/i)
      const createButton = screen.getByRole('button', { name: /create user/i })

      await user.type(firstNameInput, 'John')
      await user.type(lastNameInput, 'Doe')
      await user.type(emailInput, 'john@example.com')
      await user.click(createButton)

      expect(mockOnSubmit).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      })
    })
  })

  // User Story 3: Successful Submission - AC 3.1-3.4
  describe('Successful Submission', () => {
    it('AC 3.1-3.2: form calls onSubmit with correct data structure (firstName, lastName, email)', async () => {
      const user = userEvent.setup()
      render(<UserCreationForm onSubmit={mockOnSubmit} onDismissError={mockOnDismissError} />)
      
      const firstNameInput = screen.getByLabelText(/first name/i)
      const lastNameInput = screen.getByLabelText(/last name/i)
      const emailInput = screen.getByLabelText(/email address/i)
      const createButton = screen.getByRole('button', { name: /create user/i })

      await user.type(firstNameInput, 'Jane')
      await user.type(lastNameInput, 'Smith')
      await user.type(emailInput, 'jane@example.com')
      await user.click(createButton)

      expect(mockOnSubmit).toHaveBeenCalledWith({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com'
      })
    })

    it('AC 3.3: form is disabled when isSuccess is true', () => {
      render(
        <UserCreationForm 
          onSubmit={mockOnSubmit} 
          onDismissError={mockOnDismissError}
          isSuccess={true}
        />
      )
      
      const firstNameInput = screen.getByLabelText(/first name/i)
      const lastNameInput = screen.getByLabelText(/last name/i)
      const emailInput = screen.getByLabelText(/email address/i)
      const createButton = screen.getByRole('button', { name: /create user/i })

      expect(firstNameInput).toBeDisabled()
      expect(lastNameInput).toBeDisabled()
      expect(emailInput).toBeDisabled()
      expect(createButton).toBeDisabled()
    })

    it('AC 3.4: displays success message "User created successfully!" when isSuccess is true', () => {
      render(
        <UserCreationForm 
          onSubmit={mockOnSubmit} 
          onDismissError={mockOnDismissError}
          isSuccess={true}
        />
      )
      
      const successMessage = screen.getByText('User created successfully!')
      expect(successMessage).toBeInTheDocument()
    })
  })

  // User Story 4: Submission Failure - AC 4.1-4.2
  describe('Submission Failure', () => {
    it('AC 4.1: displays generic error message when API call fails', () => {
      const errorMessage = 'An error occurred while creating the user. Please try again later.'
      render(
        <UserCreationForm 
          onSubmit={mockOnSubmit} 
          onDismissError={mockOnDismissError}
          apiError={errorMessage}
        />
      )
      
      const errorAlert = screen.getByText(errorMessage)
      expect(errorAlert).toBeInTheDocument()
    })

    it('AC 4.2: error message is dismissible via close button', async () => {
      const user = userEvent.setup()
      const errorMessage = 'An error occurred while creating the user. Please try again later.'
      render(
        <UserCreationForm 
          onSubmit={mockOnSubmit} 
          onDismissError={mockOnDismissError}
          apiError={errorMessage}
        />
      )
      
      const closeButton = screen.getByRole('button', { name: /close/i })
      expect(closeButton).toBeInTheDocument()
      
      await user.click(closeButton)
      expect(mockOnDismissError).toHaveBeenCalled()
    })
  })

  // Loading State Tests
  describe('Loading State', () => {
    it('disables form when isLoading is true', () => {
      render(
        <UserCreationForm 
          onSubmit={mockOnSubmit} 
          onDismissError={mockOnDismissError}
          isLoading={true}
        />
      )
      
      const firstNameInput = screen.getByLabelText(/first name/i)
      const lastNameInput = screen.getByLabelText(/last name/i)
      const emailInput = screen.getByLabelText(/email address/i)
      const createButton = screen.getByRole('button', { name: /creating user/i })

      expect(firstNameInput).toBeDisabled()
      expect(lastNameInput).toBeDisabled()
      expect(emailInput).toBeDisabled()
      expect(createButton).toBeDisabled()
    })

    it('shows loading button text and spinner when isLoading is true', () => {
      render(
        <UserCreationForm 
          onSubmit={mockOnSubmit} 
          onDismissError={mockOnDismissError}
          isLoading={true}
        />
      )
      
      const loadingButton = screen.getByRole('button', { name: /creating user/i })
      expect(loadingButton).toBeInTheDocument()
    })
  })
})