import { createTheme } from '@mui/material'

export const theme = createTheme({
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