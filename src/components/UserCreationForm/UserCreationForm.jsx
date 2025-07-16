import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
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

  const validate = () => {
    const newErrors = {};
    
    if (!formData.firstName) {
      newErrors.firstName = 'First Name is required';
    }
    
    if (!formData.lastName) {
      newErrors.lastName = 'Last Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email Address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create User
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
        name="firstName"
        label="First Name"
        value={formData.firstName}
        onChange={handleChange}
        error={!!errors.firstName}
        helperText={errors.firstName}
        fullWidth
        margin="normal"
        disabled={isSubmitting}
      />
      
      <TextField
        name="lastName"
        label="Last Name"
        value={formData.lastName}
        onChange={handleChange}
        error={!!errors.lastName}
        helperText={errors.lastName}
        fullWidth
        margin="normal"
        disabled={isSubmitting}
      />
      
      <TextField
        name="email"
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
        fullWidth
        margin="normal"
        disabled={isSubmitting}
      />
      
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isSubmitting}
        sx={{ mt: 3 }}
      >
        {isSubmitting ? 'Creating...' : 'Create User'}
      </Button>
    </Box>
  );
};

export default UserCreationForm;