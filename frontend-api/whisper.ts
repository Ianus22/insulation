import axios from 'axios';

export const APITranscribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob);

    const response = await fetch('/api/whisper', {
      method: 'POST',
      body: formData
    });

    return await response.text();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
      throw new Error(error.response?.data || 'Failed to transcribe audio');
    } else {
      console.error('Unknown error:', error);
      throw new Error('An unknown error occurred');
    }
  }
};
