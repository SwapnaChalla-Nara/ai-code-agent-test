import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import UserCreationForm from './components/UserCreationForm/UserCreationForm';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserCreationForm />
    </ThemeProvider>
  );
}

export default App;
