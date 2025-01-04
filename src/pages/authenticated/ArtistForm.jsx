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
  IconButton,
  Tooltip,
} from '@mui/material'
import { 
  QrCode as QrCodeIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
} from '@mui/icons-material'
import { createArtist, getArtist, updateArtist, getUploadUrl, generateQrCode } from '../../services/artistService'
import Header from '../../components/Header'
import ImageGallery from '../../components/ImageGallery'
import AudioGallery from '../../components/AudioGallery'

function ArtistForm() {
  const { artistId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthenticator()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [qrLoading, setQrLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [formData, setFormData] = useState({
    artistId: '',
    artistName: '',
    bio: '',
    currentSong: '',
    email: '',
    genre: '',
    heroShot: '',
    instagram: '',
    tiktok: '',
    label: '',
    quickFacts: {
      fact1: '',
      fact2: '',
      fact3: '',
    },
    gallery: [],
    audioFiles: []
  })

  useEffect(() => {
    if (artistId) {
      loadArtist()
    }
  }, [artistId])

  // Generate artist ID from name
  useEffect(() => {
    if (!artistId && formData.artistName) {
      const baseId = formData.artistName
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
      
      setFormData(prev => ({
        ...prev,
        artistId: baseId
      }))
    }
  }, [formData.artistName, artistId])

  const loadArtist = async () => {
    try {
      setLoading(true)
      const data = await getArtist(artistId)
      setFormData(data)
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
        throw new Error('You must be logged in to create an artist')
      }

      if (!formData.artistName.trim()) {
        throw new Error('Artist Name is required')
      }

      const cleanFormData = {
        ...formData,
        quickFacts: {
          fact1: formData.quickFacts?.fact1 || '',
          fact2: formData.quickFacts?.fact2 || '',
          fact3: formData.quickFacts?.fact3 || '',
        },
        gallery: formData.gallery || [],
        audioFiles: formData.audioFiles || [],
        userId: user.signInDetails.loginId
      }

      if (artistId) {
        const { artistId: _, ...updates } = cleanFormData
        await updateArtist(artistId, updates)
      } else {
        await createArtist(cleanFormData)
      }

      navigate('/artist-list')
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

  const handleQuickFactChange = (factKey, value) => {
    setFormData(prev => ({
      ...prev,
      quickFacts: {
        ...prev.quickFacts,
        [factKey]: value
      }
    }))
  }

  const handleImagesChange = (newImages) => {
    setFormData(prev => ({
      ...prev,
      gallery: newImages
    }))
  }

  const handleAudioFileChange = (index, field, value) => {
    const newAudioFiles = [...formData.audioFiles]
    newAudioFiles[index] = {
      ...newAudioFiles[index],
      [field]: value
    }
    setFormData(prev => ({
      ...prev,
      audioFiles: newAudioFiles
    }))
  }

  const handleFileUpload = async (files, type = 'images') => {
    try {
      for (const file of files) {
        const fileId = `${Date.now()}-${file.name}`
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }))

        // Get file extension
        const fileExt = file.name.split('.').pop().toLowerCase()
        
        // Create unique filename with timestamp
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(2, 8)
        const cleanBaseName = file.name
          .toLowerCase()
          .split('.')
          .slice(0, -1)
          .join('.')
          .replace(/[^a-z0-9]/g, '-')
        
        const uniqueFileName = `${cleanBaseName}-${timestamp}-${randomStr}.${fileExt}`
        const fileName = `${type}/${uniqueFileName}`
        
        const { uploadUrl, fileUrl } = await getUploadUrl(artistId || formData.artistId, fileName, file.type)

        const xhr = new XMLHttpRequest()
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100
            setUploadProgress(prev => ({ ...prev, [fileId]: percentComplete }))
          }
        })

        await new Promise((resolve, reject) => {
          xhr.open('PUT', uploadUrl)
          xhr.onload = () => resolve()
          xhr.onerror = () => reject()
          xhr.send(file)
        })

        if (type === 'images') {
          setFormData(prev => ({
            ...prev,
            gallery: [...prev.gallery, fileUrl]
          }))
        } else if (type === 'audio') {
          // Find the processing placeholder and update it
          setFormData(prev => {
            const newAudioFiles = [...prev.audioFiles]
            const processingIndex = newAudioFiles.findIndex(
              af => af.processing && af.originalFile === file
            )
            
            if (processingIndex !== -1) {
              newAudioFiles[processingIndex] = {
                ...newAudioFiles[processingIndex],
                url: fileUrl,
                processing: false,
                originalFile: undefined
              }
            }
            
            return {
              ...prev,
              audioFiles: newAudioFiles
            }
          })
        }

        setUploadProgress(prev => {
          const newProgress = { ...prev }
          delete newProgress[fileId]
          return newProgress
        })
      }
    } catch (error) {
      console.error('Upload failed:', error)
      setError(`Failed to upload files: ${error.message}`)
      
      // Remove any processing items that failed
      if (type === 'audio') {
        setFormData(prev => ({
          ...prev,
          audioFiles: prev.audioFiles.filter(af => !af.processing)
        }))
      }
    }
  }

  const handleAudioUpload = (files) => {
    handleFileUpload(files, 'audio')
  }

  const handleGenerateQrCode = async () => {
    if (!artistId) return
    
    try {
      setQrLoading(true)
      setError('')
      await generateQrCode(artistId)
      alert('QR Code generated successfully!')
    } catch (err) {
      console.error('QR generation error:', err)
      setError('Failed to generate QR code: ' + err.message)
    } finally {
      setQrLoading(false)
    }
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
      <Paper sx={{ p: 3, m: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Artist ID"
                name="artistId"
                value={formData.artistId}
                disabled
                helperText="Automatically generated from artist name"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  label="Artist Name"
                  name="artistName"
                  value={formData.artistName}
                  onChange={handleChange}
                  required
                />
                {artistId && (
                  <Tooltip title="Generate QR Code">
                    <IconButton 
                      onClick={handleGenerateQrCode}
                      disabled={qrLoading}
                      color="primary"
                      sx={{ flexShrink: 0 }}
                    >
                      {qrLoading ? <CircularProgress size={24} /> : <QrCodeIcon />}
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Current Song"
                name="currentSong"
                value={formData.currentSong}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Instagram"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
                label="Label"
                name="label"
                value={formData.label}
                onChange={handleChange}
              />
            </Grid>

            {/* Quick Facts Section */}
            <Grid item xs={12}>
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
            </Grid>

            {/* Gallery Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Gallery Images</Typography>
              <ImageGallery
                images={formData.gallery}
                onImagesChange={handleImagesChange}
                onUpload={handleFileUpload}
                uploadProgress={uploadProgress}
              />
            </Grid>

            {/* Audio Files Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Audio Files</Typography>
              <AudioGallery
                audioFiles={formData.audioFiles}
                onAudioFilesChange={(newFiles) => setFormData(prev => ({ ...prev, audioFiles: newFiles }))}
                onUpload={handleAudioUpload}
                uploadProgress={uploadProgress}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
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
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {artistId ? 'Update' : 'Create'} Artist
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </>
  )
}

export default ArtistForm 