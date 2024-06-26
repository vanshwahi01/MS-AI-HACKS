const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const ffmpegPath = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
const fetch = require('node-fetch'); // Use node-fetch to align with your requirement
require('dotenv').config();

const app = express();

// Enable CORS
app.use(cors());

app.use(bodyParser.json());

const connectionString = 'mongodb+srv://cosmicworksadmin:6476489758Dan@dghq5z6zfvye5vk-mongo.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000';

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const userSchema = new mongoose.Schema({
  name: String,
  language: String,
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  res.send('Welcome to the Whisper Text-to-Speech API!');
});

app.post('/api/login', async (req, res) => {
  const { name, language } = req.body;

  if (!name || !language) {
    return res.status(400).json({ message: 'Name and language are required.' });
  }

  try {
    const user = new User({ name, language });
    await user.save();
    res.status(200).send({ message: 'User logged in successfully' });
  } catch (error) {
    console.error('Error saving user to database', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Configure multer for file upload handling
const upload = multer({ dest: 'uploads/' });

app.post('/api/transcribe', upload.single('file'), (req, res) => {
  const audioFile = req.file;

  if (!audioFile) {
    return res.status(400).json({ message: 'Audio file is required.' });
  }

  // Path to the saved audio file
  const filePath = audioFile.path;
  const wavFilePath = `${filePath}.wav`;

  // Convert audio file to WAV format
  ffmpeg(filePath)
    .setFfmpegPath(ffmpegPath)
    .toFormat('wav')
    .on('error', (error) => {
      console.error(`Error converting file: ${error}`);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    })
    .on('end', () => {
      // Call the Python script to transcribe the audio
      exec(`python3 real_time_transcription.py ${wavFilePath}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing script: ${error}`);
          return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        if (stderr) {
          return res.status(500).json({ message: 'Error during transcription', error: stderr });
        }
        res.json({ transcription: stdout.trim() });
      });
    })
    .save(wavFilePath);
});

app.post('/api/translate', async (req, res) => {
  const { text, language } = req.body;

  const getHeaders = () => {
    return {
      'Content-Type': 'application/json'
    };
  };

  const BACKEND_URI = 'https://dghq5z6zfvye5vk-api.blackwave-e0d1d49b.eastus.azurecontainerapps.io';

  try {
    const body = JSON.stringify({ text: text, target_language: language });
    console.log("wer are here now.")

    const response = await fetch(`${BACKEND_URI}/translate`, {
      method: 'POST',
      mode: 'cors',
      headers: getHeaders(),
      body: body
    });

    if (!response.ok) {
      throw new Error(`Request failed with status code ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    res.json({ translatedText: data.translated_text });
  } catch (error) {
    console.error('Error translating text LOL', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});