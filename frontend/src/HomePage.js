import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="text-center">
        <h1>Welcome to Access Abilities</h1>
        <div className="mt-4">
          <Link to="/transcribe" className="btn btn-primary btn-lg mr-2">Record Audio</Link>
          <Link to="/transcribe" className="btn btn-secondary btn-lg">Upload Audio</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
// Compare this snippet from frontend/src/TranscriptionPage.js:
