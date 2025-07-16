import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { createUser } from '../../services/api';

const UserCreationForm = ({
  initialData = { firstName: '', lastName: '', email: '' },
  initialErrors = {},
  isLoading: externalIsLoading = false,
  successMessage: externalSuccessMessage = '',
  errorMessage: externalErrorMessage = '',
  showValidationErrors = false,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [validationErrors, setValidationErrors] = useState(initialErrors);
  const [isLoading, setIsLoading] = useState(externalIsLoading);
  const [successMessage, setSuccessMessage] = useState(externalSuccessMessage);
  const [errorMessage, setErrorMessage] = useState(externalErrorMessage);

  // Update state when props change (for Storybook)
  useEffect(() => {
    setFormData(initialData);
    setValidationErrors(initialErrors);
    setIsLoading(externalIsLoading);
    setSuccessMessage(externalSuccessMessage);
    setErrorMessage(externalErrorMessage);
  }, [initialData, initialErrors, externalIsLoading, externalSuccessMessage, externalErrorMessage]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First Name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email Address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
    }
    
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Don't submit if already loading (for Storybook)
    if (isLoading) {
      return;
    }
    
    // Clear previous messages
    setSuccessMessage('');
    setErrorMessage('');
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setValidationErrors({});
    setIsLoading(true);
    
    try {
      await createUser(formData);
      setSuccessMessage('User created successfully!');
      setFormData({ firstName: '', lastName: '', email: '' });
    } catch (error) {
      setErrorMessage('An error occurred while creating the user. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New User
      </Typography>
      
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
      
      <TextField
        fullWidth
        label="First Name"
        name="firstName"
        value={formData.firstName}
        onChange={handleInputChange}
        error={!!validationErrors.firstName}
        helperText={validationErrors.firstName}
        margin="normal"
        disabled={isLoading}
      />
      
      <TextField
        fullWidth
        label="Last Name"
        name="lastName"
        value={formData.lastName}
        onChange={handleInputChange}
        error={!!validationErrors.lastName}
        helperText={validationErrors.lastName}
        margin="normal"
        disabled={isLoading}
      />
      
      <TextField
        fullWidth
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        error={!!validationErrors.email}
        helperText={validationErrors.email}
        margin="normal"
        disabled={isLoading}
      />
      
      <Box sx={{ mt: 3, position: 'relative' }}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? 'Creating User...' : 'Create User'}
        </Button>
        {isLoading && (
          <CircularProgress
            size={24}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default UserCreationForm;