import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  ImageList,
  ImageListItem,
  Link,
  useTheme
} from '@mui/material'
import {
  Instagram as InstagramIcon,
  Language as WebIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material'
import { getArtist } from "../../services/artistService"
import Header from "../../components/Header"
import MusicPlayer from "../../components/MusicPlayer"

function ArtistProfile() {
  const { artistId } = useParams()
  const navigate = useNavigate()
  const theme = useTheme()
  const [artist, setArtist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (artistId) {
      loadArtist()
    }
  }, [artistId])

  const loadArtist = async () => {
    try {
      setLoading(true)
      const data = await getArtist(artistId)
      setArtist(data)
    } catch (err) {
      setError('Failed to load artist profile')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box>
        <Header showAddButton={false} />
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Box>
    )
  }

  if (error) {
    return (
      <Box>
        <Header showAddButton={false} />
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      </Box>
    )
  }

  if (!artist) return null

  return (
    <Box>
      <Header showAddButton={false} />
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        {/* Back Button */}
        <Box sx={{ mb: 1 }}>
          <IconButton 
            onClick={() => navigate('/artist-list')} 
            sx={{ color: theme.palette.primary.main, p: 0 }}
          >
            <ArrowBackIcon />
            <Typography variant="body1" sx={{ ml: 1, color: theme.palette.primary.main }}>
              Back to Artist List
            </Typography>
          </IconButton>
        </Box>

        {/* Hero Section */}
        <Paper 
          sx={{ 
            position: 'relative',
            height: '400px',
            mb: 4,
            backgroundImage: artist.heroShot ? `url(${artist.heroShot})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: 'rgba(0,0,0,0.7)',
              p: 3,
              backdropFilter: 'blur(10px)'
            }}
          >
            <Typography variant="h3" color="white" gutterBottom>
              {artist.artistName}
            </Typography>
            <Typography variant="h6" color="white" sx={{ opacity: 0.8 }}>
              {artist.genre}
            </Typography>
          </Box>
        </Paper>

        <Grid container spacing={4}>
          {/* Left Column - Bio & Quick Facts */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>Bio</Typography>
              <Typography paragraph>{artist.bio || 'No bio available'}</Typography>
              
              {artist.quickFacts && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Quick Facts</Typography>
                  <Stack spacing={1}>
                    {artist.quickFacts.fact1 && (
                      <Chip label={artist.quickFacts.fact1} />
                    )}
                    {artist.quickFacts.fact2 && (
                      <Chip label={artist.quickFacts.fact2} />
                    )}
                    {artist.quickFacts.fact3 && (
                      <Chip label={artist.quickFacts.fact3} />
                    )}
                  </Stack>
                </>
              )}
            </Paper>

            {/* Image Gallery */}
            {artist.gallery?.length > 0 && (
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>Gallery</Typography>
                <ImageList variant="masonry" cols={2} gap={8}>
                  {artist.gallery.map((item, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={item}
                        alt={`Gallery image ${index + 1}`}
                        loading="lazy"
                        style={{ borderRadius: 8, width: '100%', height: 'auto' }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Paper>
            )}
          </Grid>

          {/* Right Column - Music Player & Social Links */}
          <Grid item xs={12} md={4}>
            {/* Social Links */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Social Media</Typography>
              <Stack spacing={2}>
                {artist.instagram && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <InstagramIcon sx={{ color: theme.palette.primary.main }} />
                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                      @{artist.instagram.replace('https://instagram.com/', '').replace('/', '')}
                    </Typography>
                  </Stack>
                )}
                {artist.tiktok && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <WebIcon sx={{ color: theme.palette.primary.main }} />
                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                      @{artist.tiktok.replace('https://tiktok.com/@', '').replace('/', '')}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Paper>

            {/* QR Code */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>QR Code</Typography>
              {artist.artistId && (
                  <Box 
                    component="img"
                  src={`https://vinyltapbucket001.s3.amazonaws.com/${artist.artistId.replace('-', '').toLowerCase()}/qrcode/qr-code.png`}
                    alt="Artist QR Code"
                    sx={{ 
                      width: '100%',
                      height: 'auto',
                      maxWidth: 200,
                      display: 'block',
                      margin: '0 auto',
                    borderRadius: 1
                    }}
                  />
              )}
            </Paper>

            {/* Music Player */}
            {artist.audioFiles?.length > 0 && (
              <MusicPlayer 
                tracks={artist.audioFiles} 
                artistName={artist.artistName}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default ArtistProfile 