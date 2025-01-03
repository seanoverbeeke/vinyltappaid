import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material'
import { getArtist } from '../services/artistService'
import Header from '../components/Header'

function SearchArtist() {
  const [searchParams] = useSearchParams()
  const [artistId, setArtistId] = useState(searchParams.get('artistId') || '')
  const [artist, setArtist] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!artistId.trim()) return

    setLoading(true)
    setError('')

    try {
      const data = await getArtist(artistId)
      setArtist(data)
    } catch (err) {
      setError('Failed to find artist')
      setArtist(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header title="Search Artists" showAddButton={false} />
      <Box>
        <Paper sx={{ p: 3, mb: 3 }}>
          <form onSubmit={handleSearch}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs>
                <TextField
                  fullWidth
                  label="Artist ID"
                  value={artistId}
                  onChange={(e) => setArtistId(e.target.value)}
                  required
                />
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {artist && (
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardMedia
                    component="img"
                    height="300"
                    image={artist.heroShot || 'https://placeholder.com/300'}
                    alt={artist.artistName}
                  />
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      {artist.artistName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {artist.genre}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>Bio</Typography>
                <Typography paragraph>{artist.bio}</Typography>

                <Typography variant="h6" gutterBottom>Quick Facts</Typography>
                <List>
                  {Object.entries(artist.quickFacts || {}).map(([key, value]) => (
                    <ListItem key={key}>
                      <ListItemText primary={key} secondary={value} />
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>Current Song</Typography>
                <Typography>{artist.currentSong}</Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>Social Media</Typography>
                <List>
                  {artist.instagram && (
                    <ListItem>
                      <ListItemText primary="Instagram" secondary={artist.instagram} />
                    </ListItem>
                  )}
                  {artist.tiktok && (
                    <ListItem>
                      <ListItemText primary="TikTok" secondary={artist.tiktok} />
                    </ListItem>
                  )}
                </List>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>
    </>
  )
}

export default SearchArtist 