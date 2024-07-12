import { useRef, useState } from 'react';
import RecordRTC from 'recordrtc';

function useAudioRecorder() {
  const disconnectRef = useRef((() => {}) as () => Promise<Blob>);
  const [isRecording, setIsRecording] = useState(false);

  return {
    start: async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });

      const recorder = new RecordRTC(stream, { type: 'audio', mimeType: 'audio/webm' });
      recorder.startRecording();

      disconnectRef.current = async () => {
        await new Promise(resolve => recorder.stopRecording(() => resolve(null)));
        const blob = recorder.getBlob();

        stream.getTracks().forEach(track => track.stop());
        recorder.destroy();

        return blob;
      };

      setIsRecording(true);
    },
    stop: async () => {
      const blob = await disconnectRef.current();
      setIsRecording(false);

      return blob;
    },
    isRecording
  };
}

export { useAudioRecorder };

