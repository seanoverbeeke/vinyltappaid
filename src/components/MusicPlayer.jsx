import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Slider,
  Stack,
  useTheme
} from '@mui/material'
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  SkipNext as NextIcon,
  SkipPrevious as PrevIcon,
  VolumeUp as VolumeIcon,
  VolumeOff as MuteIcon,
  MusicNote as NoteIcon
} from '@mui/icons-material'

function MusicPlayer({ tracks = [], artistName }) {
  const theme = useTheme()
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [prevVolume, setPrevVolume] = useState(0.8)
  const [isSeeking, setIsSeeking] = useState(false)
  const audioRef = useRef(new Audio())

  useEffect(() => {
    if (tracks.length > 0) {
      const audio = audioRef.current
      audio.src = tracks[currentTrackIndex].url
      audio.volume = volume
      
      const handleTimeUpdate = () => {
        if (!isSeeking) {
          setCurrentTime(audio.currentTime)
          setDuration(audio.duration)
        }
      }
      
      const handleEnded = () => {
        if (currentTrackIndex < tracks.length - 1) {
          setCurrentTrackIndex(prev => prev + 1)
          setIsPlaying(true)
          audio.play()
        } else {
          setCurrentTrackIndex(0)
          setIsPlaying(false)
        }
      }

      const handleLoadedMetadata = () => {
        setDuration(audio.duration)
        if (isPlaying) {
          audio.play().catch(() => setIsPlaying(false))
        }
      }

      const handleError = () => {
        console.error('Audio playback error')
        setIsPlaying(false)
      }
      
      audio.addEventListener('timeupdate', handleTimeUpdate)
      audio.addEventListener('ended', handleEnded)
      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
      audio.addEventListener('error', handleError)
      
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate)
        audio.removeEventListener('ended', handleEnded)
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audio.removeEventListener('error', handleError)
        audio.pause()
      }
    }
  }, [currentTrackIndex, tracks, isSeeking])

  useEffect(() => {
    const audio = audioRef.current
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [isPlaying])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handlePrevious = () => {
    if (currentTime > 3) {
      // If more than 3 seconds into song, restart current song
      audioRef.current.currentTime = 0
    } else if (currentTrackIndex > 0) {
      // Otherwise go to previous song
      setCurrentTrackIndex(prev => prev - 1)
    }
  }

  const handleNext = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(prev => prev + 1)
    } else {
      setCurrentTrackIndex(0)
      setIsPlaying(false)
    }
  }

  const handleTimeSliderChange = (_, newValue) => {
    setIsSeeking(true)
    const time = (newValue / 100) * duration
    setCurrentTime(time)
  }

  const handleTimeSliderChangeCommitted = (_, newValue) => {
    setIsSeeking(false)
    const time = (newValue / 100) * duration
    audioRef.current.currentTime = time
  }

  const handleVolumeClick = () => {
    if (volume > 0) {
      setPrevVolume(volume)
      setVolume(0)
      audioRef.current.volume = 0
    } else {
      setVolume(prevVolume)
      audioRef.current.volume = prevVolume
    }
  }

  const handleVolumeChange = (_, newValue) => {
    const newVolume = newValue / 100
    setVolume(newVolume)
    setPrevVolume(newVolume)
    audioRef.current.volume = newVolume
  }

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (tracks.length === 0) return null

  const currentTrack = tracks[currentTrackIndex]

  return (
    <Paper 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Track Info */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: 1,
            backgroundColor: theme.palette.action.selected,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <PlayIcon sx={{ fontSize: 30, color: theme.palette.primary.main }} />
        </Box>
        <Box>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              mb: 0.5,
              color: theme.palette.text.primary
            }}
          >
            {currentTrack.title || 'Unknown Track'}
          </Typography>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              color: theme.palette.primary.main,
              fontWeight: 500
            }}
          >
            {artistName}
          </Typography>
        </Box>
      </Box>

      {/* Progress Bar */}
      <Box sx={{ mb: 2 }}>
        <Slider
          value={(currentTime / duration) * 100 || 0}
          onChange={handleTimeSliderChange}
          onChangeCommitted={handleTimeSliderChangeCommitted}
          aria-label="time-indicator"
          size="small"
          sx={{
            color: theme.palette.primary.main,
            height: 4,
            '& .MuiSlider-thumb': {
              width: 8,
              height: 8,
              transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
              '&:before': {
                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
              },
              '&:hover, &.Mui-focusVisible': {
                boxShadow: `0px 0px 0px 8px ${theme.palette.primary.main}33`
              },
              '&.Mui-active': {
                width: 12,
                height: 12
              }
            },
            '& .MuiSlider-rail': {
              opacity: 0.28
            }
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: -1 }}>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
            {formatTime(currentTime)}
          </Typography>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
            {formatTime(duration)}
          </Typography>
        </Box>
      </Box>

      {/* Controls */}
      <Stack 
        direction="row" 
        spacing={0} 
        alignItems="center" 
        justifyContent="space-between" 
        sx={{ mb: 3 }}
      >
        <Box sx={{ width: 100 }} /> {/* Spacer */}
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton 
            onClick={handlePrevious}
            sx={{ 
              color: theme.palette.text.secondary,
              '&:hover': { color: theme.palette.text.primary }
            }}
          >
            <PrevIcon />
          </IconButton>
          <IconButton 
            onClick={handlePlayPause}
            sx={{ 
              color: theme.palette.primary.main,
              '&:hover': { color: theme.palette.primary.light },
              p: 1.5,
              backgroundColor: theme.palette.action.selected,
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }}
          >
            {isPlaying ? <PauseIcon sx={{ fontSize: 38 }} /> : <PlayIcon sx={{ fontSize: 38 }} />}
          </IconButton>
          <IconButton 
            onClick={handleNext}
            sx={{ 
              color: theme.palette.text.secondary,
              '&:hover': { color: theme.palette.text.primary }
            }}
          >
            <NextIcon />
          </IconButton>
        </Stack>
        <Stack 
          direction="row" 
          spacing={1} 
          alignItems="center" 
          sx={{ 
            width: 100,
            position: 'relative'
          }}
        >
          <IconButton 
            onClick={handleVolumeClick}
            sx={{ 
              color: theme.palette.text.secondary,
              '&:hover': { color: theme.palette.text.primary }
            }}
          >
            {volume === 0 ? <MuteIcon /> : <VolumeIcon />}
          </IconButton>
          <Box
            sx={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 0,
              overflow: 'hidden',
              transition: 'width 0.2s ease-in-out',
              '.MuiStack-root:hover &': {
                width: 100
              }
            }}
          >
            <Slider
              value={volume * 100}
              onChange={handleVolumeChange}
              aria-label="Volume"
              size="small"
              sx={{
                color: theme.palette.primary.main,
                width: 80,
                ml: 2,
                height: 4,
                '& .MuiSlider-thumb': {
                  width: 8,
                  height: 8,
                  transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                  '&:before': {
                    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                  },
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: `0px 0px 0px 8px ${theme.palette.primary.main}33`
                  },
                  '&.Mui-active': {
                    width: 12,
                    height: 12
                  }
                },
                '& .MuiSlider-rail': {
                  opacity: 0.28
                }
              }}
            />
          </Box>
        </Stack>
      </Stack>

      {/* Track List */}
      <Box 
        sx={{ 
          mt: 2,
          maxHeight: 300,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.action.selected,
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          },
        }}
      >
        {tracks.map((track, index) => (
          <Box
            key={index}
            onClick={() => {
              setCurrentTrackIndex(index)
              setIsPlaying(true)
            }}
            sx={{
              p: 1.5,
              cursor: 'pointer',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              backgroundColor: currentTrackIndex === index ? 
                theme.palette.action.selected : 
                'transparent',
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              },
              transition: 'background-color 0.2s ease'
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 0.5,
                backgroundColor: currentTrackIndex === index ? 
                  theme.palette.primary.main + '33' : 
                  theme.palette.action.selected,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden',
                '&::after': currentTrackIndex === index && isPlaying ? {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}33, transparent)`,
                  animation: 'pulse 2s ease-in-out infinite'
                } : {},
                '@keyframes pulse': {
                  '0%': {
                    opacity: 0.5,
                    transform: 'scale(1)'
                  },
                  '50%': {
                    opacity: 1,
                    transform: 'scale(1.1)'
                  },
                  '100%': {
                    opacity: 0.5,
                    transform: 'scale(1)'
                  }
                }
              }}
            >
              <NoteIcon 
                sx={{ 
                  fontSize: 16, 
                  color: currentTrackIndex === index ? 
                    theme.palette.primary.main : 
                    theme.palette.text.secondary,
                  transform: currentTrackIndex === index && isPlaying ? 'translateY(0)' : 'translateY(0)',
                  transition: 'transform 0.3s ease'
                }}
              />
            </Box>
            <Typography 
              variant="body2"
              sx={{ 
                color: currentTrackIndex === index ? 
                  theme.palette.primary.main : 
                  theme.palette.text.primary,
                fontWeight: currentTrackIndex === index ? 500 : 400
              }}
            >
              {track.title || `Track ${index + 1}`}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  )
}

export default MusicPlayer 