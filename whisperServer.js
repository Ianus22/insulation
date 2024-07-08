const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { exec } = require('child_process');

const app = express();
const upload = multer({ dest: 'uploads/' });

const apiKey = process.env.OPENAI_API_KEY;
const apiUrl = 'https://api.openai.com/v1/audio/transcriptions';

app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const audioPath = path.join(__dirname, req.file.path);
    const convertedAudioPath = `${audioPath}.mp3`;

    // Convert audio to MP3 format
    exec(`ffmpeg -i ${audioPath} ${convertedAudioPath}`, async error => {
      if (error) {
        console.error('Error converting audio:', error);
        return res.status(500).send('Error converting audio');
      }

      const formData = new FormData();
      formData.append('file', fs.createReadStream(convertedAudioPath));
      formData.append('model', 'whisper-1');

      try {
        const response = await axios.post(apiUrl, formData, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            ...formData.getHeaders()
          }
        });

        res.json({
          transcription: response.data.transcription,
          audioUrl: `/uploads/${path.basename(convertedAudioPath)}`
        });
      } catch (error) {
        console.error('Error transcribing audio:', error);
        res.status(500).send('Error transcribing audio');
      }
    });
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).send('Error handling request');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
