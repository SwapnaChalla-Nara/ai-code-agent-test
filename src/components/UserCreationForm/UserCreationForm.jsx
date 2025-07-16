import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography 
} from '@mui/material';

const UserCreationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: Implement form submission logic
    console.log('Form submitted:', formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create User
      </Typography>
      
      <TextField
        fullWidth
        label="First Name"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        margin="normal"
        required
      />
      
      <TextField
        fullWidth
        label="Last Name"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        margin="normal"
        required
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
      />
      
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 3, mb: 2 }}
      >
        Create User
      </Button>
    </Box>
  );
};

export default UserCreationForm;