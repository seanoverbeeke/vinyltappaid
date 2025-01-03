import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Box, Container, ThemeProvider } from '@mui/material'
import { theme } from './theme'
import Navigation from './components/Navigation'
import AppRoutes from './AppRoutes'
import { Authenticator } from '@aws-amplify/ui-react'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Authenticator.Provider>
        <BrowserRouter>
          <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
            <Navigation />
            <Container>
              <Box sx={{ py: 4 }}>
                <AppRoutes />
              </Box>
            </Container>
          </Box>
        </BrowserRouter>
      </Authenticator.Provider>
    </ThemeProvider>
  )
}

export default App 