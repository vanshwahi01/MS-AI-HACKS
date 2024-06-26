import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/home">Access Abilities</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/home">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/transcribe">Features</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/translate">Translation</Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
