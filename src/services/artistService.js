const BASE_URL = 'https://3umg10tbih.execute-api.us-east-1.amazonaws.com/prod/artist'

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

// Simple in-memory cache
let artistsCache = {
  data: null,
  timestamp: null,
  CACHE_DURATION: 30000 // 30 seconds
};

const retryFetch = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryFetch(fn, retries - 1, delay * 1.5);
  }
}

export const getAllArtists = async () => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'GET',
      headers
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch artists');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in getAllArtists:', error);
    throw error;
  }
};

// Clear cache after mutations
const clearCache = () => {
  artistsCache = {
    ...artistsCache,
    data: null,
    timestamp: null
  };
}

export const getArtist = async (artistId) => {
  try {
    const response = await fetch(`${BASE_URL}?artistId=${artistId}`, {
      method: 'GET',
      headers
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch artist')
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching artist:', error)
    throw error
  }
}

export const createArtist = async (artistData) => {
  try {
    console.log('Creating artist with data:', artistData);
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(artistData)
    });
    
    const responseText = await response.text();
    console.log('Create artist response:', responseText);
    
    if (!response.ok) {
      throw new Error(responseText || 'Failed to create artist');
    }

    clearCache(); // Clear cache after mutation
    return response.ok ? { success: true } : JSON.parse(responseText);
  } catch (error) {
    console.error('Error creating artist:', error);
    throw error;
  }
}

export const updateArtist = async (artistId, updates) => {
  try {
    const payload = {
      artistId,
      updates
    };

    console.log('Sending update payload:', payload);

    const response = await fetch(BASE_URL, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload)
    });
    
    const responseText = await response.text();
    console.log('Update response:', responseText);
    
    if (!response.ok) {
      throw new Error(`Failed to update artist: ${responseText}`);
    }

    clearCache(); // Clear cache after mutation
    return { success: true, message: responseText };
  } catch (error) {
    console.error('Error updating artist:', error);
    throw error;
  }
}

export const deleteArtist = async (artistId) => {
  try {
    const response = await fetch(`${BASE_URL}?artistId=${artistId}`, {
      method: 'DELETE',
      headers
    });
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Failed to delete artist');
    }
    
    clearCache(); // Clear cache after mutation
    // Don't try to parse response as JSON since it might be empty
    return { success: true };
  } catch (error) {
    console.error('Error deleting artist:', error);
    throw error;
  }
}

export const getUploadUrl = async (artistId, fileName, fileType) => {
  try {
    console.log('Sending upload URL request with:', { artistId, fileName, fileType })
    const response = await fetch(`${BASE_URL}?action=getUploadUrl`, {
      method: 'POST',
      headers: {
        ...headers,
        'Accept': '*/*'
      },
      body: JSON.stringify({
        artistId,
        fileName,
        fileType
      })
    })
    
    console.log('Upload URL response status:', response.status)
    const responseText = await response.text()
    console.log('Upload URL response text:', responseText)
    
    if (!response.ok) throw new Error(`Failed to get upload URL: ${responseText}`)
    return JSON.parse(responseText)
  } catch (error) {
    console.error('Error getting upload URL:', error)
    throw error
  }
}

export const generateQrCode = async (artistId) => {
  try {
    const response = await fetch(`${BASE_URL}?action=generateQrCode`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ artistId })
    })
    
    if (!response.ok) {
      const text = await response.text()
      throw new Error(text || 'Failed to generate QR code')
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw error
  }
} 