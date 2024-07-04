export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  const formData = new FormData();
  formData.append('file', audioBlob);

  const response = await fetch('/api/whisperApi', {
    method: 'POST',
    body: formData
  });

  return await response.text();
};
