export const APITranscribeAudio = async (audioBlob: Blob): Promise<string> => {
  const formData = new FormData();
  formData.append('file', audioBlob, `audio.${audioBlob.type.match(/audio\/(\w+)/)?.[1] ?? 'webm'}`);

  const response = await fetch('/api/whisper', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Failed to transcribe audio');
  }

  return await response.text();
};

