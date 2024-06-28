import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TranscriptionPage = () => {
  const [uploading, setUploading] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const mediaRecorderRef = useRef(null);
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

  const transcribeAudio = async (file) => {
    setUploading(true);

    try {
      const formData = new FormData();
      file && formData.append('file', file);

      const response = await axios.post('https://speech-backend-otxqton76-cole-dermotts-projects.vercel.app/api/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setTranscription(response.data.transcription);
      toast.success('Transcription successful.');
      navigate('/translate', { state: { transcription: response.data.transcription } });
    } catch (error) {
      toast.error('An error occurred during transcription.');
      console.error('Error transcribing audio', error.response?.data || error.message);
    } finally {
      setUploading(false);
    }
  };

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (event) => {
        const audioBlob = new Blob([event.data], { type: 'audio/wav' });
        setRecordedAudio(audioBlob);
      };
      mediaRecorder.start();
      setRecording(true);
    }).catch(error => {
      console.error('Error accessing microphone', error);
    });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const downloadRecordedAudio = () => {
    if (recordedAudio) {
      const url = URL.createObjectURL(recordedAudio);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'recorded-audio.wav';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const handleTranscribeRecordedAudio = () => {
    if (recordedAudio) {
      transcribeAudio(recordedAudio);
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
        className={`dropzone p-6 border-2 border-dashed rounded ${isDragActive ? 'border-green-500' : isDragReject ? 'border-red-500' : 'border-gray-300'}`}
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
      <button
        className="mt-4"
        onClick={() => transcribeAudio(audioFile)}
        disabled={uploading || !audioFile}
      >
        Transcribe
      </button>
      {transcription && (
        <div className="mt-4">
          <h2 className="text-2xl mb-2">Transcription:</h2>
          <p>{transcription}</p>
        </div>
      )}
      <div className="mt-6">
        <h2 className="text-2xl mb-4">Record Audio</h2>
        <button
          onClick={recording ? stopRecording : startRecording}
          className="btn btn-primary"
        >
          {recording ? 'Stop Recording' : 'Start Recording'}
        </button>
        {recordedAudio && (
          <>
            <button
              className="btn btn-secondary ml-2"
              onClick={downloadRecordedAudio}
            >
              Download Recorded Audio
            </button>
            <button
              className="btn btn-success ml-2"
              onClick={handleTranscribeRecordedAudio}
            >
              Transcribe Recorded Audio
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TranscriptionPage;
