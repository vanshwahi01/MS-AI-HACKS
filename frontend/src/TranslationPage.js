import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { chatApi } from './api';

const TranslationPage = () => {
  const location = useLocation();
  const { transcription = '' } = location.state || {};
  const [translatedText, setTranslatedText] = useState('');
  const [language, setLanguage] = useState('es'); // default to Spanish

  const handleTranslate = async () => {
    const prompt = `Here is the text: "${transcription}". Translate it to ${language}.`;
    const request = {
      session_id: '1234', // Replace with actual session ID logic if needed
      prompt: prompt
    };

    try {
      const response = await chatApi(request);
      if (!response.ok) {
        throw new Error(`Request failed with status code ${response.status}`);
      }

      const data = await response.json();
      setTranslatedText(data.message);
      toast.success('Translation successful.');
    } catch (error) {
      toast.error('An error occurred during translation.');
      console.error('Error translating text', error.message);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <ToastContainer />
      <h1 className="text-4xl mb-6">Translation</h1>
      <div className="mb-4">
        <h2 className="text-2xl mb-2">Original Transcription:</h2>
        <p>{transcription}</p>
      </div>
      <div className="mb-4">
        <label htmlFor="language" className="block text-gray-700">Translate to:</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        >
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
          <option value="zh">English</option>
          {/* Add more languages as needed */}
        </select>
      </div>
      <button
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        onClick={handleTranslate}
      >
        Translate
      </button>
      {translatedText && (
        <div className="mt-4">
          <h2 className="text-2xl mb-2">Translated Text:</h2>
          <p>{translatedText}</p>
        </div>
      )}
    </div>
  );
};

export default TranslationPage;
