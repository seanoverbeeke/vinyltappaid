import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuthenticator } from '@aws-amplify/ui-react'

function Header({ title, showAddButton = false }) {
  const navigate = useNavigate()
  const { user } = useAuthenticator()
  
  const handleAddClick = () => {
    // User is already authenticated, just navigate directly to create form
    navigate('/create', { replace: true })
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        py: 1
      }}
    >
      <Typography 
        variant="h5" 
        sx={{ 
          color: 'text.primary',
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>
      {showAddButton && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddClick}
          size="small"
        >
          Add New Artist
        </Button>
      )}
    </Box>
  )
}

export default Header 