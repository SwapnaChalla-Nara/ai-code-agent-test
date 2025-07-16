import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';

const UserCreationForm = ({ 
  initialData = { firstName: '', lastName: '', email: '' },
  errors = {},
  isLoading = false,
  isSuccess = false,
  apiError = '',
  onSubmit = () => {}
}) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isLoading && !isSuccess) {
      onSubmit(formData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create User
      </Typography>
      
      {/* Success Message */}
      {isSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          User created successfully!
        </Alert>
      )}
      
      {/* API Error Message */}
      {apiError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {apiError}
        </Alert>
      )}
      
      <TextField
        fullWidth
        label="First Name"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        margin="normal"
        required
        disabled={isLoading || isSuccess}
        error={!!errors.firstName}
        helperText={errors.firstName}
      />
      
      <TextField
        fullWidth
        label="Last Name"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        margin="normal"
        required
        disabled={isLoading || isSuccess}
        error={!!errors.lastName}
        helperText={errors.lastName}
      />
      
      <TextField
        fullWidth
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        margin="normal"
        required
        disabled={isLoading || isSuccess}
        error={!!errors.email}
        helperText={errors.email}
      />
      
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 3, mb: 2 }}
        disabled={isLoading || isSuccess}
        startIcon={isLoading ? <CircularProgress size={20} /> : null}
      >
        {isLoading ? 'Creating User...' : 'Create User'}
      </Button>
    </Box>
  );
};

export default UserCreationForm;