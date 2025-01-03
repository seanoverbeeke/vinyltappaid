import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function Header({ title, showAddButton = true }) {
  const navigate = useNavigate()

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3,
        mt: 1
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
          onClick={() => navigate('/create')}
          size="small"
        >
          Add New Artist
        </Button>
      )}
    </Box>
  )
}

export default Header 