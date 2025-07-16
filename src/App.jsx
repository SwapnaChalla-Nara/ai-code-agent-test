import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import UserCreationForm from './components/UserCreationForm/UserCreationForm';

// Create a default theme
const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserCreationForm />
    </ThemeProvider>
  );
}

export default App
