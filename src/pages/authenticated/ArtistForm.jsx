import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthenticator } from '@aws-amplify/ui-react'
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Stack,
  FormControlLabel,
  Switch,
  Tabs,
  Tab,
} from '@mui/material'
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Share as ShareIcon,
} from '@mui/icons-material'
import { createArtist, getArtist, updateArtist } from '../../services/artistService'
import Header from '../../components/Header'

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`artist-tabpanel-${index}`}
      aria-labelledby={`artist-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

function ArtistForm() {
  const { artistId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthenticator()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingTourDate, setEditingTourDate] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const [formData, setFormData] = useState({
    artistId: '',
    artistName: '',
    bio: '',
    email: '',
    genre: '',
    heroShot: '',
    instagram: '',
    tiktok: '',
    label: '',
    socialShare: '',
    artistWebsite: '',
    quickFacts: {
      fact1: '',
      fact2: '',
      fact3: '',
    },
    gallery: [],
    audioFiles: [],
    tourDates: [],
    spotifyArtistId: '',
    currentSong: '',
    userId: ''
  })

  useEffect(() => {
    if (artistId) {
      loadArtist()
    }
  }, [artistId])

  const loadArtist = async () => {
    try {
      setLoading(true)
      const data = await getArtist(artistId)
      setFormData({
        ...data,
        tourDates: data.tourDates || [],
        quickFacts: data.quickFacts || { fact1: '', fact2: '', fact3: '' },
        gallery: data.gallery || [],
        audioFiles: data.audioFiles || []
      })
    } catch (err) {
      setError('Failed to load artist data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!user?.signInDetails?.loginId) {
        throw new Error('You must be logged in to update an artist')
      }

      if (artistId) {
        await updateArtist(artistId, {
          spotifyArtistId: formData.spotifyArtistId,
          tourDates: formData.tourDates
        })
        navigate('/artist-list')
      }
    } catch (err) {
      console.error('Form submission error:', err)
      setError(err.message || 'Failed to save artist')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addTourDate = () => {
    const newIndex = formData.tourDates.length
    setFormData(prev => ({
      ...prev,
      tourDates: [...prev.tourDates, {
        date: '',
        time: '',
        venue: '',
        location: '',
        isPublic: true
      }]
    }))
    setEditingTourDate(newIndex)
  }

  const removeTourDate = (index) => {
    setFormData(prev => ({
      ...prev,
      tourDates: prev.tourDates.filter((_, i) => i !== index)
    }))
  }

  const formatTime = (time) => {
    if (!time) return ''
    return time
  }

  const handleTourDateChange = (index, field, value) => {
    setFormData(prev => {
      const newTourDates = [...prev.tourDates]
      newTourDates[index] = {
        ...newTourDates[index],
        [field]: value
      }
      return {
        ...prev,
        tourDates: newTourDates
      }
    })
  }

  if (loading) {
    return (
      <>
        <Header />
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '200px'
        }}>
          <CircularProgress />
        </Box>
      </>
    )
  }

  return (
    <>
      <Header />
        <Paper sx={{ mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab icon={<PersonIcon />} label="Basic Info" />
              <Tab icon={<EventIcon />} label="Tour Dates" />
              <Tab icon={<ShareIcon />} label="Social & Facts" />
            </Tabs>
          </Box>

          <form onSubmit={handleSubmit}>
            {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}

            {/* Basic Info Tab */}
            <TabPanel value={activeTab} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Artist Details</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Artist ID"
                            name="artistId"
                            value={formData.artistId}
                            onChange={handleChange}
                            disabled={!!artistId}
                            required
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Artist Name"
                            name="artistName"
                            value={formData.artistName}
                            onChange={handleChange}
                            required
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Additional Info</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Genre"
                            name="genre"
                            value={formData.genre}
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Label"
                            name="label"
                            value={formData.label}
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Biography</Typography>
                      <TextField
                        fullWidth
                        label="Bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        multiline
                        rows={4}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Tour Dates Tab */}
            <TabPanel value={activeTab} index={1}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6">Tour Dates</Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={addTourDate}
                    >
                      Add Tour Date
                    </Button>
                  </Box>

                  <Stack spacing={2}>
                    {formData.tourDates.map((date, index) => (
                      <Paper 
                        key={index} 
                        elevation={2} 
                        sx={{ 
                          p: 2,
                          transition: 'all 0.2s',
                          '&:hover': {
                            boxShadow: 4
                          }
                        }}
                      >
                        {editingTourDate === index ? (
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Date"
                                value={date.date}
                                onChange={(e) => handleTourDateChange(index, 'date', e.target.value)}
                                helperText="Format: MMM D, YYYY (e.g., Jan 30, 2025)"
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Time"
                                value={date.time}
                                onChange={(e) => handleTourDateChange(index, 'time', e.target.value)}
                                helperText="Format: HH:mm (e.g., 19:30)"
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Venue"
                                value={date.venue}
                                onChange={(e) => handleTourDateChange(index, 'venue', e.target.value)}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Location"
                                value={date.location}
                                onChange={(e) => handleTourDateChange(index, 'location', e.target.value)}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={date.isPublic}
                                    onChange={(e) => handleTourDateChange(index, 'isPublic', e.target.checked)}
                                  />
                                }
                                label={date.isPublic ? "Public Event" : "Private Event"}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  startIcon={<DeleteIcon />}
                                  onClick={() => {
                                    removeTourDate(index)
                                    setEditingTourDate(null)
                                  }}
                                >
                                  Delete
                                </Button>
                                <Button
                                  variant="outlined"
                                onClick={() => setEditingTourDate(null)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="contained"
                                onClick={() => setEditingTourDate(null)}
                                >
                                Save
                                </Button>
                              </Box>
                            </Grid>
                          </Grid>
                        ) : (
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                              <Paper 
                                elevation={1}
                                sx={{ 
                                  p: 1.5,
                                  textAlign: 'center',
                                  minWidth: 100,
                                  bgcolor: 'primary.main',
                                  color: 'primary.contrastText'
                                }}
                              >
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                  {date.date.split(',')[0]}
                                </Typography>
                                <Typography variant="subtitle2">
                                  {date.date.split(',')[1] || ''}
                                </Typography>
                              </Paper>

                              <Box sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                    {date.venue}
                                  </Typography>
                                  <Button
                                    startIcon={<EditIcon />}
                                    onClick={() => setEditingTourDate(index)}
                                    variant="outlined"
                                    size="small"
                                  >
                                    Edit
                                  </Button>
                                </Box>
                                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                  {date.location} • {formatTime(date.time)}
                                </Typography>
                                {!date.isPublic && (
                                  <Typography 
                                    variant="caption" 
                                    sx={{ 
                                      display: 'inline-block',
                                      bgcolor: 'action.selected',
                                      px: 1,
                                      py: 0.5,
                                      borderRadius: 1,
                                      mt: 1
                                    }}
                                  >
                                    Private Event
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </Box>
                        )}
                      </Paper>
                    ))}

                    {formData.tourDates.length === 0 && (
                      <Box 
                        sx={{ 
                          textAlign: 'center',
                          py: 4,
                          bgcolor: 'action.hover',
                          borderRadius: 1
                        }}
                      >
                        <Typography color="text.secondary" gutterBottom>
                          No tour dates added yet
                        </Typography>
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={addTourDate}
                          sx={{ mt: 1 }}
                        >
                          Add Your First Tour Date
                        </Button>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </TabPanel>

            {/* Social & Facts Tab */}
            <TabPanel value={activeTab} index={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Social Media</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Instagram"
                            name="instagram"
                            value={formData.instagram}
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="TikTok"
                            name="tiktok"
                            value={formData.tiktok}
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Website"
                            name="artistWebsite"
                            value={formData.artistWebsite}
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Spotify Artist ID"
                            name="spotifyArtistId"
                            value={formData.spotifyArtistId}
                            onChange={handleChange}
                            helperText="Enter the Spotify artist ID (e.g., 7fh69dHXXlOOJEca9Asw7f)"
                          />
                        </Grid>
                        {formData.spotifyArtistId && (
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" gutterBottom>
                              Spotify Preview
                            </Typography>
                            <Box
                              sx={{
                                position: 'relative',
                                paddingTop: '380px',
                                width: '100%',
                                borderRadius: 1,
                                overflow: 'hidden',
                                bgcolor: 'background.paper',
                                border: 1,
                                borderColor: 'divider',
                              }}
                            >
                              <iframe
                                src={`https://open.spotify.com/embed/artist/${formData.spotifyArtistId}`}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                allowtransparency="true"
                                allow="encrypted-media"
                                style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  border: 0,
                                }}
                              />
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Quick Facts</Typography>
                      <Grid container spacing={2}>
                        {['fact1', 'fact2', 'fact3'].map((factKey) => (
                          <Grid item xs={12} key={factKey}>
                            <TextField
                              fullWidth
                              label={`Fact ${factKey.slice(-1)}`}
                              value={formData.quickFacts[factKey] || ''}
                              onChange={(e) => handleQuickFactChange(factKey, e.target.value)}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

              <Box sx={{ 
                mt: 3,
                display: 'flex',
                gap: 2,
                justifyContent: 'flex-end',
                p: 2,
                borderTop: 1,
                borderColor: 'divider',
              }}>
                <Button 
                  variant="outlined" 
              onClick={() => navigate('/artist-list')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={loading}
                >
              Save Changes
                </Button>
              </Box>
          </form>
        </Paper>
    </>
  )
}

export default ArtistForm 