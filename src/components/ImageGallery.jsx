import { useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
  LinearProgress,
  ImageList,
  ImageListItem,
  Button,
  Dialog,
  DialogContent,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  ZoomIn as ZoomInIcon,
  Add as AddIcon,
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

function SortableImage({ url, index, onDelete }) {
  const [showPreview, setShowPreview] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <ImageListItem ref={setNodeRef} style={style} {...attributes}>
        <img
          src={url}
          alt={`Gallery ${index + 1}`}
          loading="lazy"
          style={{ height: 200, width: '100%', objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            bgcolor: 'rgba(0,0,0,0.5)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 0.5,
          }}
        >
          <IconButton
            {...listeners}
            sx={{ color: 'white', cursor: 'grab', '&:active': { cursor: 'grabbing' } }}
            size="small"
          >
            <DragIcon />
          </IconButton>
          <Box>
            <IconButton
              onClick={() => setShowPreview(true)}
              sx={{ color: 'white' }}
              size="small"
            >
              <ZoomInIcon />
            </IconButton>
            <IconButton
              onClick={() => onDelete(index)}
              sx={{ color: 'white' }}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </ImageListItem>

      <Dialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent>
          <img
            src={url}
            alt={`Gallery ${index + 1}`}
            style={{ width: '100%', height: 'auto' }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function ImageGallery({ images, onImagesChange, onUpload, uploadProgress = {} }) {
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
      const oldIndex = images.indexOf(active.id);
      const newIndex = images.indexOf(over.id);
      
      onImagesChange(arrayMove(images, oldIndex, newIndex));
    }
  };

  const handleFilesSelected = (event) => {
    const files = Array.from(event.target.files);
    onUpload(files);
    event.target.value = null; // Reset input
  };

  const handleDelete = (index) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => fileInputRef.current?.click()}
        >
          Add Images
        </Button>
        <input
          type="file"
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFilesSelected}
        />
        <Typography variant="body2" color="text.secondary">
          {images.length} image{images.length !== 1 ? 's' : ''} in gallery
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

      {/* Image Gallery */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images}
          strategy={verticalListSortingStrategy}
        >
          <ImageList
            sx={{ width: '100%', height: 'auto' }}
            cols={3}
            gap={8}
          >
            {images.map((url, index) => (
              <SortableImage
                key={url}
                url={url}
                index={index}
                onDelete={handleDelete}
              />
            ))}
          </ImageList>
        </SortableContext>
      </DndContext>
    </Box>
  );
} 