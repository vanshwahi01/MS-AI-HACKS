import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Header from './Header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Landing Page Component
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <h1>Welcome to Access Abilities</h1>
      <div>
        <button className="mr-4" onClick={() => navigate('/transcribe')}>Record Audio</button>
        <button onClick={() => navigate('/transcribe')}>Upload Audio</button>
      </div>
    </div>
  );
};


// Transcription Page Component
const TranscriptionPage = () => {
  const [uploading, setUploading] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      return;
    }

    const file = acceptedFiles[0];
    if (!file.type.startsWith('audio/') || file.size > 400 * 1024 * 1024) {
      return;
    }

    setAudioFile(file);
  }, []);

  const transcribeAudio = async () => {
    setUploading(true);

    try {
      const formData = new FormData();
      audioFile && formData.append('file', audioFile);

      const response = await axios.post(`http://localhost:3001/api/transcribe`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setTranscription(response.data.transcription);
      toast.success('Transcription successful.')
    } catch (error) {
      toast.error('An error occurred during transcription.');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: 'audio/*',
  });

  return (
    <div className="container mx-auto py-12">
      <ToastContainer />
      <h1 className="text-4xl mb-6">Transcription</h1>
      <div
        {...getRootProps()}
        className={`dropzone p-6 border-2 border-dashed rounded ${isDragActive ? 'border-green-500' : isDragReject ? 'border-red-500' : 'border-gray-300'
          }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the audio file here...</p>
        ) : audioFile ? (
          <p>Selected file: {audioFile.name}</p>
        ) : (
          <p>Drag and drop an audio file here, or click to select a file</p>
        )}
      </div>
      {uploading && <p className="mt-4">Uploading and transcribing...</p>}
      {transcription && (
        <div className="mt-4">
          <h2 className="text-2xl mb-2">Transcription:</h2>
          <p>{transcription}</p>
          <button className="mt-4" onClick={() => navigate('/translate', { state: { transcription } })}>Translate</button>
        </div>
      )}
      <button
        className="mt-4"
        onClick={transcribeAudio}
        disabled={uploading || !audioFile}
      >
        Transcribe
      </button>
    </div>
  );
};

// Translation Page Component
const TranslationPage = () => {
  const location = useLocation();
  const [language, setLanguage] = useState('en');
  const [translatedText, setTranslatedText] = useState('');
  const transcription = location.state?.transcription || '';

  const translateText = async () => {
    try {
      const response = await axios.post(`http://localhost:3001/api/translate`, {
        text: transcription,
        targetLang: language,
      });

      setTranslatedText(response.data.translatedText);
      toast.success('Translation successful.')
    } catch (error) {
      toast.error('An error occurred during translation.');
    }
  };

  return (
    <div className="container mx-auto py-12">
      <ToastContainer />
      <h1 className="text-4xl mb-6">Translation</h1>
      <div className="translation-box">
        <h2 className="text-2xl mb-2">Transcription:</h2>
        <p>{transcription}</p>
        <h2 className="text-2xl mb-2">Translation:</h2>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
        </select>
        <button onClick={translateText}>Translate</button>
        {translatedText && (
          <div className="mt-4">
            <h2 className="text-2xl mb-2">Translated Text:</h2>
            <p>{translatedText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <Router>
      <div className="container mx-auto py-12">
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/transcribe" element={<TranscriptionPage />} />
          <Route path="/translate" element={<TranslationPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
