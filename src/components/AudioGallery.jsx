import { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  LinearProgress,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  DragIndicator as DragIcon,
  Sync as SyncIcon,
} from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableAudioItem({ file, index, onDelete, onTitleChange }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Create/recreate audio object when URL changes
  useEffect(() => {
    if (file.url) {
      const newAudio = new Audio(file.url);
      newAudio.onended = () => setIsPlaying(false);
      setAudio(newAudio);

      // Cleanup on unmount or URL change
      return () => {
        newAudio.pause();
        newAudio.src = '';
      };
    }
  }, [file.url]);

  const togglePlay = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      // Reset audio position if it ended
      if (audio.ended) {
        audio.currentTime = 0;
      }
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Stop playing if component unmounts
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        setIsPlaying(false);
      }
    };
  }, [audio]);

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      component={Paper}
      variant="outlined"
      sx={{ mb: 1, p: 2 }}
    >
      <IconButton {...listeners} sx={{ mr: 1, cursor: 'grab', '&:active': { cursor: 'grabbing' } }}>
        <DragIcon />
      </IconButton>
      
      {file.processing ? (
        <Tooltip title="Processing upload...">
          <IconButton sx={{ mr: 2 }}>
            <SyncIcon sx={{ animation: 'spin 2s linear infinite', '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' }
            }}} />
          </IconButton>
        </Tooltip>
      ) : (
        <IconButton onClick={togglePlay} sx={{ mr: 2 }} disabled={!file.url}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </IconButton>
      )}
      
      <TextField
        size="small"
        label="Title"
        value={file.title}
        onChange={(e) => onTitleChange(index, e.target.value)}
        sx={{ flex: 1, mr: 2 }}
        autoFocus={file.processing}
        placeholder={file.processing ? "Enter song title..." : ""}
      />

      <IconButton onClick={() => onDelete(index)} color="error">
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
}

export default function AudioGallery({ 
  audioFiles, 
  onAudioFilesChange, 
  onUpload, 
  uploadProgress = {} 
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fileInputRef = useState(null);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = audioFiles.findIndex(file => file.id === active.id);
      const newIndex = audioFiles.findIndex(file => file.id === over.id);
      
      onAudioFilesChange(arrayMove(audioFiles, oldIndex, newIndex));
    }
  };

  const handleFilesSelected = (event) => {
    const files = Array.from(event.target.files);
    
    // Immediately add placeholder items for each file
    const newFiles = files.map(file => {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const cleanBaseName = file.name
        .toLowerCase()
        .split('.')
        .slice(0, -1)
        .join('.')
        .replace(/[^a-z0-9]/g, '-')
        .split('-')
        .join(' ');

      return {
        id: `song-${timestamp}-${randomStr}`,
        title: cleanBaseName,
        processing: true,
        originalFile: file
      };
    });

    onAudioFilesChange([...audioFiles, ...newFiles]);
    onUpload(files);
    event.target.value = null;
  };

  const handleDelete = (index) => {
    onAudioFilesChange(audioFiles.filter((_, i) => i !== index));
  };

  const handleTitleChange = (index, newTitle) => {
    const newFiles = [...audioFiles];
    newFiles[index] = { ...newFiles[index], title: newTitle };
    onAudioFilesChange(newFiles);
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => fileInputRef.current?.click()}
        >
          Add Audio Files
        </Button>
        <input
          type="file"
          multiple
          accept="audio/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFilesSelected}
        />
        <Typography variant="body2" color="text.secondary">
          {audioFiles.length} audio file{audioFiles.length !== 1 ? 's' : ''} in library
        </Typography>
      </Box>

      {/* Upload Progress Bars */}
      {Object.entries(uploadProgress).map(([fileId, progress]) => (
        <Box key={fileId} sx={{ mb: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="caption" color="text.secondary">
            Uploading... {Math.round(progress)}%
          </Typography>
        </Box>
      ))}

      {/* Audio List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={audioFiles.map(file => file.id)}
          strategy={verticalListSortingStrategy}
        >
          <List>
            {audioFiles.map((file, index) => (
              <SortableAudioItem
                key={file.id}
                file={file}
                index={index}
                onDelete={handleDelete}
                onTitleChange={handleTitleChange}
              />
            ))}
          </List>
        </SortableContext>
      </DndContext>
    </Box>
  );
} 