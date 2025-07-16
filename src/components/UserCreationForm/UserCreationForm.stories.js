import { fn } from 'storybook/test';
import UserCreationForm from './UserCreationForm';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Components/UserCreationForm',
  component: UserCreationForm,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    initialData: { 
      control: 'object',
      description: 'Initial form data'
    },
    errors: { 
      control: 'object',
      description: 'Validation errors to display'
    },
    isLoading: { 
      control: 'boolean',
      description: 'Loading state (API call in progress)'
    },
    isSuccess: { 
      control: 'boolean',
      description: 'Success state'
    },
    apiError: { 
      control: 'text',
      description: 'API error message'
    },
  },
  args: { 
    onSubmit: fn(),
    initialData: {
      firstName: '',
      lastName: '',
      email: ''
    }
  },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {
    initialData: {
      firstName: '',
      lastName: '',
      email: ''
    }
  },
};

export const ValidationErrors = {
  args: {
    initialData: {
      firstName: '',
      lastName: '',
      email: 'invalid-email'
    },
    errors: {
      firstName: 'First Name is required',
      lastName: 'Last Name is required',
      email: 'Please enter a valid email address'
    }
  },
};

export const Loading = {
  args: {
    initialData: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    },
    isLoading: true
  },
};

export const Success = {
  args: {
    initialData: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    },
    isSuccess: true
  },
};

export const APIError = {
  args: {
    initialData: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    },
    apiError: 'An error occurred while creating the user. Please try again later.'
  },
};