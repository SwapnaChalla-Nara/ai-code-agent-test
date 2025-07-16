import React from 'react';
import UserCreationForm from './UserCreationForm';

export default {
  title: 'Components/UserCreationForm',
  component: UserCreationForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A comprehensive user creation form with validation, loading states, and error handling.',
      },
    },
  },
  tags: ['autodocs'],
};

// Default state story
export const Default = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'The default state of the UserCreationForm with empty fields ready for user input.',
      },
    },
  },
};

// Validation errors story
export const ValidationErrors = {
  render: function() {
    return React.createElement(UserCreationForm, {
      initialData: {
        firstName: '',
        lastName: '',
        email: '',
      },
      initialErrors: {
        firstName: 'First Name is required',
        lastName: 'Last Name is required',
        email: 'Email Address is required',
      },
      showValidationErrors: true,
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows validation error messages when form is submitted with invalid or empty fields.',
      },
    },
  },
};

// Invalid email validation story
export const InvalidEmailValidation = {
  render: function() {
    return React.createElement(UserCreationForm, {
      initialData: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
      },
      initialErrors: {
        email: 'Please enter a valid email address',
      },
      showValidationErrors: true,
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows email validation error when an invalid email format is entered.',
      },
    },
  },
};

// Loading state story
export const Loading = {
  render: function() {
    return React.createElement(UserCreationForm, {
      initialData: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      },
      isLoading: true,
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the loading state when the API call is in progress.',
      },
    },
  },
};

// Success state story
export const Success = {
  render: function() {
    return React.createElement(UserCreationForm, {
      initialData: {
        firstName: '',
        lastName: '',
        email: '',
      },
      successMessage: 'User created successfully!',
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the success message when user creation is completed successfully.',
      },
    },
  },
};

// API error story
export const APIError = {
  render: function() {
    return React.createElement(UserCreationForm, {
      initialData: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      },
      errorMessage: 'An error occurred while creating the user. Please try again later.',
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows error handling when the API call fails.',
      },
    },
  },
};