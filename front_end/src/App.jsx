import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';

const App = () => {
  return (
    <Router>
      <div style={styles.appContainer}>
        <nav style={styles.navBar}>
          <Link to="/" style={styles.navLink}>
            Wishify
          </Link>
          <div style={styles.authLinks}>
            <Link to="/login" style={styles.navLink}>
              Login
            </Link>
            <Link to="/signup" style={styles.navLink}>
              Sign Up
            </Link>
          </div>
        </nav>
        
        <div style={styles.content}>
          <Routes>
            <Route path="/login" element={<Login />} />
            {/* 🛑 MODIFIED: The root path ("/") now renders the Signup component 🛑 */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Signup />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

// Basic Inline Styles
const styles = {
  appContainer: {
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
  },
  navBar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 20px',
    backgroundColor: '#282c34',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  authLinks: {
    display: 'flex',
    gap: '20px',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '18px',
  },
  content: {
    padding: '20px',
  },
  homeMessage: {
    marginTop: '50px',
    color: '#333',
  }
};

export default App;