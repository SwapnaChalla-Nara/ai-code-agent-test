import React, { useState } from 'react';
import { Box, TextField, Button, Alert, Typography } from '@mui/material';
import { createUser } from '../../services/api';

const UserCreationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First Name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createUser(formData);
      setSuccessMessage('User created successfully!');
      setFormData({ firstName: '', lastName: '', email: '' });
    } catch (error) {
      setErrorMessage('An error occurred while creating the user. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismissError = () => {
    setErrorMessage('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Creation Form
      </Typography>
      
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      
      {errorMessage && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          onClose={handleDismissError}
        >
          {errorMessage}
        </Alert>
      )}
      
      <TextField
        label="First Name"
        fullWidth
        margin="normal"
        value={formData.firstName}
        onChange={handleInputChange('firstName')}
        error={!!errors.firstName}
        helperText={errors.firstName}
        disabled={isSubmitting}
      />
      
      <TextField
        label="Last Name"
        fullWidth
        margin="normal"
        value={formData.lastName}
        onChange={handleInputChange('lastName')}
        error={!!errors.lastName}
        helperText={errors.lastName}
        disabled={isSubmitting}
      />
      
      <TextField
        label="Email Address"
        fullWidth
        margin="normal"
        type="email"
        value={formData.email}
        onChange={handleInputChange('email')}
        error={!!errors.email}
        helperText={errors.email}
        disabled={isSubmitting}
      />
      
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating...' : 'Create User'}
      </Button>
    </Box>
  );
};

export default UserCreationForm;