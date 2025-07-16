import { CssBaseline, Container } from '@mui/material'
import UserCreationForm from './components/UserCreationForm/UserCreationForm'

function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm">
        <UserCreationForm />
      </Container>
    </>
  )
}

export default App
