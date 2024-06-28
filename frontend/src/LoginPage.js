import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('en');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`https://speech-backend-otxqton76-cole-dermotts-projects.vercel.app/api/login`, { name, language });
      if (response.status === 200) {
        onLogin(); 
        navigate('/home');
      } else {
        console.error('Error logging in');
      }
    } catch (error) {
      console.error('Error logging in', error);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card p-4 shadow-sm">
        <div className="card-body">
          <h1 className="card-title text-center mb-4">Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="language">Language:</label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="form-control"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Hindi</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-block mt-4"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
