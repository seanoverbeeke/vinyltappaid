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
  Info as InfoIcon,
  Policy as PolicyIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  CreditCard as BillingIcon
} from '@mui/icons-material'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthenticator } from '@aws-amplify/ui-react'

function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const { user, signOut } = useAuthenticator()
  const isPublicPage = location.pathname === '/' || location.pathname === '/login'

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

  const getMenuItems = () => {
    const items = [
      { text: 'About', icon: <InfoIcon />, onClick: () => handleClose() },
      { text: 'Privacy', icon: <PolicyIcon />, onClick: () => handleClose() },
    ]

    if (user && !isPublicPage) {
      items.push(
        { text: 'Billing', icon: <BillingIcon />, onClick: () => handleClose() }
      )
    }

    if (user) {
      items.push(
        { divider: true },
        { text: 'Logout', icon: <LogoutIcon />, onClick: handleLogout }
      )
    } else {
      items.push(
        { divider: true },
        { text: 'Login', icon: <LoginIcon />, onClick: () => handleMenuItemClick('/login') }
      )
    }
    return items
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenuItemClick = (path) => {
    if (path) {
      navigate(path)
    }
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
          onClick={() => navigate('/')}
          sx={{ 
            flexGrow: 1,
            fontWeight: 700,
            color: 'primary.main',
            cursor: 'pointer'
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
        <Menu
          id="menu-dropdown"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'menu-button',
          }}
        >
          {getMenuItems().map((item, index) => (
            item.divider ? (
              <Divider key={`divider-${index}`} />
            ) : (
              <MenuItem
                key={item.text}
                onClick={() => item.onClick ? item.onClick() : handleMenuItemClick(item.path)}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText>{item.text}</ListItemText>
              </MenuItem>
            )
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default Navigation 