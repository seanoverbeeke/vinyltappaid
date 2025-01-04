import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Container,
} from '@mui/material'
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material'
import { getAllArtists, deleteArtist } from "../../services/artistService"
import Header from "../../components/Header"
import { useAuthenticator } from '@aws-amplify/ui-react'

console.log('ArtistList.jsx is loading')

function ArtistList() {
  console.log('ArtistList component rendering')
  const navigate = useNavigate()
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedArtist, setSelectedArtist] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const { user } = useAuthenticator()

  console.log('Current user:', user);

  const fetchArtists = async () => {
    console.log('Fetching artists...')
    try {
      const fetchedArtists = await getAllArtists()
      console.log('Raw fetched artists:', fetchedArtists)
      
      const userArtists = user?.signInDetails?.loginId 
        ? fetchedArtists.filter(artist => artist.userId === user.signInDetails.loginId)
        : [];
        
      console.log('Filtered user artists:', userArtists)
      setArtists(userArtists)
      setError('')
    } catch (error) {
      console.error('Error fetching artists:', error)
      setError('Failed to fetch artists: ' + (error.message || 'Unknown error'))
      setArtists([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Check for loginId instead of attributes.email
    if (user?.signInDetails?.loginId) {
      console.log('ArtistList useEffect running')
      setLoading(true)
      setError('')
      fetchArtists()
    }
  }, [user])

  const handleEdit = (artistId) => {
    console.log('Navigating to edit:', artistId)
    navigate(`/artist-form/${artistId}`)
  }

  const handleView = (artistId) => {
    console.log('Navigating to profile:', artistId)
    navigate(`/artist-profile/${artistId}`)
  }

  const handleDeleteClick = (artist) => {
    setSelectedArtist(artist)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true)
    setError('')
    try {
      await deleteArtist(selectedArtist.artistId)
      setArtists(prevArtists => prevArtists.filter(a => a.artistId !== selectedArtist.artistId))
      setDeleteDialogOpen(false)
      setSelectedArtist(null)
    } catch (error) {
      console.error('Failed to delete artist:', error)
      setError(error.message || 'Failed to delete artist')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setSelectedArtist(null)
  }

  const handleAddNew = () => {
    navigate('/artist-form');
  }

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '200px'
        }}>
          <CircularProgress />
        </Box>
      )
    }

    if (error) {
      return (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            <Button 
              color="inherit" 
              size="small"
              onClick={() => setRetryCount(c => c + 1)}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )
    }

    return (
      <TableContainer component={Paper} sx={{ 
        backgroundColor: 'background.paper',
        '& .MuiTableRow-root:hover': {
          backgroundColor: 'rgba(255,255,255,0.1)',
        }
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Artist ID</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Genre</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {artists.map((artist) => (
              <TableRow key={artist.artistId}>
                <TableCell sx={{ fontWeight: 500 }}>{artist.artistName}</TableCell>
                <TableCell>{artist.artistId}</TableCell>
                <TableCell>{artist.genre}</TableCell>
                <TableCell align="right">
                  <IconButton 
                    onClick={() => handleView(artist.artistId)}
                    sx={{ color: 'text.secondary' }}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleEdit(artist.artistId)}
                    sx={{ color: 'text.secondary' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDeleteClick(artist)}
                    sx={{ color: 'text.secondary' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  return (
    <Box>
      <Header title="Artists" showAddButton={false} />
      
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
        >
          Add New Artist
        </Button>
      </Box>

      {renderContent()}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            borderRadius: 2,
            minWidth: '300px'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>Confirm Delete</DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          Are you sure you want to delete {selectedArtist?.artistName}?
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleDeleteCancel}
            variant="outlined"
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            variant="contained"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ArtistList 