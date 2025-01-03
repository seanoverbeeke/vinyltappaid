import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material'
import { 
  Menu as MenuIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  List as ListIcon,
  Logout as LogoutIcon
} from '@mui/icons-material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthenticator } from '@aws-amplify/ui-react'

function Navigation() {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const { signOut } = useAuthenticator()

  const handleLogout = async () => {
    try {
      handleClose()
      signOut()
      localStorage.clear()
      sessionStorage.clear()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const menuItems = [
    { text: 'Landing', icon: <HomeIcon />, path: '/' },
    { text: 'Artist List', icon: <ListIcon />, path: '/artist-list' },
    { text: 'Search', icon: <SearchIcon />, path: '/search' },
    { divider: true },
    { text: 'Logout', icon: <LogoutIcon />, onClick: handleLogout }
  ]

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenuItemClick = (path) => {
    navigate(path)
    handleClose()
  }

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: 'background.paper',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <Toolbar sx={{ 
        width: '100%', 
        maxWidth: '1800px', 
        margin: '0 auto',
        padding: '0 24px',
        minHeight: '70px'
      }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 700,
            color: 'primary.main'
          }}
        >
          Vinyl Tap
        </Typography>
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={handleClick}
          aria-controls={open ? 'menu-dropdown' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <Menu
        id="menu-dropdown"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            backgroundColor: 'background.paper',
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1.5,
            },
          },
        }}
      >
        {menuItems.map((item) => (
          item.divider ? (
            <Divider key="divider" sx={{ my: 1 }} />
          ) : (
            <MenuItem 
              key={item.text} 
              onClick={() => item.onClick ? item.onClick() : handleMenuItemClick(item.path)}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'text.secondary', minWidth: 36 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </MenuItem>
          )
        ))}
      </Menu>
    </AppBar>
  )
}

export default Navigation 