// Header.js
import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="logo">
        <h1>Access Abilities</h1>
      </div>
      <nav className="nav-menu">
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#contact">Analytics</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
