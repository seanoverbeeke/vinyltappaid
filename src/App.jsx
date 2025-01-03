import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme, Box, Container } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import Navigation from './components/Navigation'
import ArtistList from './pages/ArtistList'
import ArtistForm from './pages/ArtistForm'
import SearchArtist from './pages/SearchArtist'
import ArtistProfile from './pages/ArtistProfile'

console.log('App.jsx is loading')

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1DB954', // Spotify green
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#121212',
      paper: '#181818',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#181818',
          backgroundImage: 'none',
        }
      }
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingTop: '24px',
          paddingBottom: '24px',
        }
      }
    }
  }
})

function App() {
  console.log('App component rendering')
  return (
    <React.StrictMode>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Router>
          <Box sx={{ 
            minHeight: '100vh',
            bgcolor: 'background.default',
            color: 'text.primary',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Navigation />
            <Container maxWidth="xl">
              <Box 
                component="main" 
                sx={{ 
                  py: 3,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Routes>
                  <Route path="/" element={<ArtistList />} />
                  <Route path="/create" element={<ArtistForm />} />
                  <Route path="/edit/:artistId" element={<ArtistForm />} />
                  <Route path="/search" element={<SearchArtist />} />
                  <Route path="/profile/:artistId" element={<ArtistProfile />} />
                  <Route path="/about" element={<Navigate to="/" />} />
                  <Route path="/settings" element={<Navigate to="/" />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Box>
            </Container>
          </Box>
        </Router>
      </ThemeProvider>
    </React.StrictMode>
  )
}

export default App 