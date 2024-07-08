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
const apiUrl = 'https://api.openai.com/v1/whisper';

app.use(express.static('public'));

app.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const audioPath = path.join(__dirname, req.file.path);
    const convertedAudioPath = `${audioPath}.wav`;

    // Convert audio to WAV format if necessary
    exec(`ffmpeg -i ${audioPath} ${convertedAudioPath}`, async error => {
      if (error) {
        console.error('Error converting audio:', error);
        return res.status(500).send('Error converting audio');
      }

      const audioData = fs.readFileSync(convertedAudioPath);

      try {
        const response = await axios.post(
          apiUrl,
          {
            audio: audioData.toString('base64'),
            format: 'wav'
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            }
          }
        );

        fs.unlinkSync(audioPath); // Delete the original audio file
        fs.unlinkSync(convertedAudioPath); // Delete the converted audio file

        res.json({ transcription: response.data.transcription });
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
