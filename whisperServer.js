const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

const apiKey = ''; // Ще вземем ключа от .env.local файла
const apiUrl = 'https://api.openai.com/v1/whisper';

app.use(express.static('public'));

app.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const audioPath = path.join(__dirname, req.file.path);
    const audioData = fs.readFileSync(audioPath);

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

    fs.unlinkSync(audioPath); // Изтрий аудио файла след обработка

    res.json({ transcription: response.data.transcription });
  } catch (error) {
    console.error('Error transcribing audio:', error);
    res.status(500).send('Error transcribing audio');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
