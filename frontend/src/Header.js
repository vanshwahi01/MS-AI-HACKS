import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="app-header">
      <div className="logo">
        <h1>Access Abilities</h1>
      </div>
      <nav className="nav-menu">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/transcribe">Transcription</Link></li>
          <li><Link to="/translate">Translation</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
