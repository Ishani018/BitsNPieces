import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Menu from './Menu'; // Adjust the path as necessary

function App() {
  const [logoClicked, setLogoClicked] = useState(false);

  const handleLogoClick = () => {
    setLogoClicked(true);
  };

  return (
    <Router>
      <div className="App">
        <header className={`App-header ${logoClicked ? 'shrink' : ''}`}>
          <Link to="/menu" onClick={handleLogoClick}>
            <img
              src={logo}
              className={`App-logo ${logoClicked ? 'small' : ''}`}
              alt="logo"
            />
          </Link>
        </header>

        <Routes>
          {/* Default route that loads App component */}
          {/* <Route path="/" element={<div></div>} /> */}
          
          {/* Route for Menu */}
          <Route path="/menu" element={<Menu />} />
          
          {/* Redirect any other routes to Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
