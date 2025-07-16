import { useState, useCallback } from 'react'
import { CssBaseline, Container } from '@mui/material'
import UserCreationForm from './components/UserCreationForm/UserCreationForm'
import { createUser } from './services/api'

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateForm = (formData) => {
  const errors = {}
  
  if (!formData.firstName.trim()) {
    errors.firstName = 'First Name is required'
  }
  
  if (!formData.lastName.trim()) {
    errors.lastName = 'Last Name is required'
  }
  
  if (!formData.email.trim()) {
    errors.email = 'Email Address is required'
  } else if (!emailRegex.test(formData.email)) {
    errors.email = 'Please enter a valid email address'
  }
  
  return errors
}

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [apiError, setApiError] = useState('')
  const [validationErrors, setValidationErrors] = useState({})

  const handleDismissError = useCallback(() => {
    setApiError('')
  }, [])

  const handleSubmit = useCallback(async (formData) => {
    // Clear previous states
    setApiError('')
    setValidationErrors({})
    setIsSuccess(false)
    
    // Validate form
    const errors = validateForm(formData)
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }
    
    setIsLoading(true)
    
    try {
      await createUser(formData)
      setIsSuccess(true)
    } catch (error) {
      console.error('Error creating user:', error)
      // Show generic error message for any API failure
      setApiError('An error occurred while creating the user. Please try again later.')
      
      // Auto-dismiss error after 5 seconds
      setTimeout(() => {
        setApiError('')
      }, 5000)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm">
        <UserCreationForm
          onSubmit={handleSubmit}
          onDismissError={handleDismissError}
          isLoading={isLoading}
          isSuccess={isSuccess}
          apiError={apiError}
          errors={validationErrors}
        />
      </Container>
    </>
  )
}

export default App
