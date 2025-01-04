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
import { Add as AddIcon, Delete as DeleteIcon, Upload as UploadIcon, QrCode as QrCodeIcon } from '@mui/icons-material'
import { createArtist, getArtist, updateArtist, getUploadUrl, generateQrCode } from '../../services/artistService'
import Header from '../../components/Header'

function ArtistForm() {
  const { artistId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthenticator()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [qrLoading, setQrLoading] = useState(false)
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

      // Validate artistId format - now allowing hyphens
      const artistIdPattern = /^[a-z0-9-]+$/
      if (!artistId && !artistIdPattern.test(formData.artistId)) {
        throw new Error('Artist ID can only contain lowercase letters, numbers, and hyphens')
      }

      // Ensure required fields are present
      if (!formData.artistName.trim()) {
        throw new Error('Artist Name is required')
      }

      // Clean up the form data
      const cleanFormData = {
        ...formData,
        artistId: formData.artistId.toLowerCase(),
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

      // Navigate to artist list after successful save
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
    // For artistId: allow lowercase letters, numbers, and hyphens
    if (name === 'artistId') {
      const sanitizedValue = value.toLowerCase().replace(/[^a-z0-9-]/g, '')
      setFormData(prev => ({
        ...prev,
        [name]: sanitizedValue
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
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

  const handleGalleryChange = (index, value) => {
    const newGallery = [...formData.gallery]
    newGallery[index] = value
    setFormData(prev => ({
      ...prev,
      gallery: newGallery
    }))
  }

  const addGalleryImage = () => {
    setFormData(prev => ({
      ...prev,
      gallery: [...prev.gallery, '']
    }))
  }

  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
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

  const addAudioFile = () => {
    setFormData(prev => ({
      ...prev,
      audioFiles: [...prev.audioFiles, { title: '', url: '', id: `song${prev.audioFiles.length + 1}` }]
    }))
  }

  const removeAudioFile = (index) => {
    setFormData(prev => ({
      ...prev,
      audioFiles: prev.audioFiles.filter((_, i) => i !== index)
    }))
  }

  const handleFileUpload = async (file, type, index = null) => {
    try {
      setLoading(true);
      console.log('Starting upload process for:', { file, type, artistId });
      
      // Get original file extension and create clean file name
      const originalFileName = file.name;
      const fileExtension = originalFileName.split('.').pop().toLowerCase();
      const cleanFileName = originalFileName
        .toLowerCase()
        .replace(/[^a-z0-9.]/g, '-');
        
      // Create the full path
      const fileName = `${type}/${cleanFileName}`;
      
      console.log('Requesting upload URL for:', fileName);

      const { uploadUrl, fileUrl } = await getUploadUrl(artistId, fileName, file.type);
      console.log('Received upload URL:', { uploadUrl, fileUrl });
      console.log('Attempting to upload to S3...');

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        mode: 'cors'
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status: ${uploadResponse.status}`);
      }

      console.log('File uploaded successfully to:', fileUrl);

      // Update the artist record with the new file URL
      let newData;
      if (type === 'images') {
        if (index === null) {
          // Hero shot
          newData = await new Promise(resolve => {
            setFormData(prev => {
              const newState = {
                ...prev,
                heroShot: fileUrl
              };
              resolve(newState);
              return newState;
            });
          });
        } else {
          // Gallery image
          newData = await new Promise(resolve => {
            setFormData(prev => {
              const gallery = Array.isArray(prev.gallery) ? [...prev.gallery] : [];
              const newGallery = [...gallery];
              newGallery[index] = fileUrl;
              
              console.log('Updating gallery with:', newGallery);
              
              const newState = {
                ...prev,
                gallery: newGallery
              };
              resolve(newState);
              return newState;
            });
          });
        }
      } else if (type === 'music') {
        newData = await new Promise(resolve => {
          setFormData(prev => {
            const newAudioFiles = Array.isArray(prev.audioFiles) ? [...prev.audioFiles] : [];
            if (!newAudioFiles[index]) {
              newAudioFiles[index] = { title: originalFileName.replace(`.${fileExtension}`, ''), id: `song${index + 1}` };
            }
            newAudioFiles[index] = {
              ...newAudioFiles[index],
              url: fileUrl
            };
            const newState = {
              ...prev,
              audioFiles: newAudioFiles
            };
            resolve(newState);
            return newState;
          });
        });
      }

      // Only update the database once with the new data
      if (newData) {
        const { artistId: _, ...updates } = newData;
        console.log('Saving updates to database:', updates);
        await updateArtist(artistId, updates);
      }
    } catch (error) {
      console.error('Upload error details:', error);
      setError(`Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQrCode = async () => {
    if (!artistId) return
    
    try {
      setQrLoading(true)
      setError('')
      await generateQrCode(artistId)
      // Show success message
      alert('QR Code generated successfully!')
    } catch (err) {
      console.error('QR generation error:', err)
      setError('Failed to generate QR code: ' + err.message)
    } finally {
      setQrLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/artist-list');
  };

  if (loading) {
    return (
      <>
        <Header 
          title={artistId ? 'Edit Artist' : 'Create Artist'} 
          showAddButton={false}
        />
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
      <Header 
        title={artistId ? 'Edit Artist' : 'Create Artist'} 
        showAddButton={false}
      />
      <Paper sx={{ p: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
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
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  label="Hero Shot URL"
                  name="heroShot"
                  value={formData.heroShot}
                  onChange={handleChange}
                  disabled={loading}
                />
                <input
                  accept="image/*"
                  type="file"
                  id="hero-shot-upload"
                  hidden
                  onChange={(e) => handleFileUpload(e.target.files[0], 'images')}
                />
                <label htmlFor="hero-shot-upload">
                  <IconButton 
                    component="span" 
                    disabled={loading || !artistId}
                    color="primary"
                  >
                    <UploadIcon />
                  </IconButton>
                </label>
              </Box>
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
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Gallery Images</Typography>
                <IconButton onClick={addGalleryImage} color="primary">
                  <AddIcon />
                </IconButton>
              </Box>
              {formData.gallery.map((url, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    label={`Image URL ${index + 1}`}
                    value={url}
                    onChange={(e) => handleGalleryChange(index, e.target.value)}
                    disabled={loading}
                  />
                  <input
                    accept="image/*"
                    type="file"
                    id={`gallery-upload-${index}`}
                    hidden
                    onChange={(e) => handleFileUpload(e.target.files[0], 'images', index)}
                  />
                  <label htmlFor={`gallery-upload-${index}`}>
                    <IconButton 
                      component="span" 
                      disabled={loading || !artistId}
                      color="primary"
                    >
                      <UploadIcon />
                    </IconButton>
                  </label>
                  <IconButton onClick={() => removeGalleryImage(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Grid>

            {/* Audio Files Section */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Audio Files</Typography>
                <IconButton onClick={addAudioFile} color="primary">
                  <AddIcon />
                </IconButton>
              </Box>
              {formData.audioFiles.map((file, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    label="Title"
                    value={file.title}
                    onChange={(e) => handleAudioFileChange(index, 'title', e.target.value)}
                    sx={{ flex: 1 }}
                    disabled={loading}
                  />
                  <TextField
                    label="URL"
                    value={file.url}
                    onChange={(e) => handleAudioFileChange(index, 'url', e.target.value)}
                    sx={{ flex: 2 }}
                    disabled={loading}
                  />
                  <input
                    accept="audio/*"
                    type="file"
                    id={`audio-upload-${index}`}
                    hidden
                    onChange={(e) => handleFileUpload(e.target.files[0], 'music', index)}
                  />
                  <label htmlFor={`audio-upload-${index}`}>
                    <IconButton 
                      component="span" 
                      disabled={loading || !artistId}
                      color="primary"
                    >
                      <UploadIcon />
                    </IconButton>
                  </label>
                  <IconButton onClick={() => removeAudioFile(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={loading}
                >
                  {artistId ? 'Update' : 'Create'}
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