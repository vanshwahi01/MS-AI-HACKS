import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import TranscriptionPage from './TranscriptionPage';
import TranslationPage from './TranslationPage';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <div>
        {isLoggedIn ? (
          <>
            <Header />
            <div className="container py-4">
              <Routes>
                <Route path="/home" element={<HomePage />} />
                <Route path="/transcribe" element={<TranscriptionPage />} />
                <Route path="/translate" element={<TranslationPage />} />
              </Routes>
            </div>
          </>
        ) : (
          <LoginPage onLogin={handleLogin} />
        )}
      </div>
    </Router>
  );
};

export default App;
