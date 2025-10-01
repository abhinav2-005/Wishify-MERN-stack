import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api/users'; 

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('Logging in...');
    
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Store the JWT token
        localStorage.setItem('token', data.token); 
        
        // Seeding temporary data for the new user before redirect
        await fetchSeedData(data.token); 

        setMessage(data.message + ' Redirecting...');
        
        // Redirect to the dashboard/home page
        setTimeout(() => navigate('/dashboard'), 500); 
        
      } else {
        setError(data.message || 'Login failed. Check credentials.');
        setMessage('');
      }
    } catch (err) {
      setError('Network error. Could not connect to the server.');
      setMessage('');
    }
  };

  // Helper function to call the temporary seed endpoint after successful login
  const fetchSeedData = async (token) => {
    try {
      // Endpoint is protected by auth middleware, requires the token
      await fetch('http://localhost:5000/api/wishes/seed', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('User data seeded successfully.');
    } catch (err) {
      console.error('Failed to seed user data:', err);
    }
  };


  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Log In</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Log In
        </button>
      </form>
      {message && <p style={styles.successMessage}>{message}</p>}
      {error && <p style={styles.errorMessage}>{error}</p>}
      <p style={styles.signupLink}>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

// Basic Inline Styles
const styles = {
    container: { maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' },
    header: { textAlign: 'center', color: '#333', marginBottom: '20px' },
    form: { display: 'flex', flexDirection: 'column' },
    input: { padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '16px' },
    button: { padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
    successMessage: { color: 'green', textAlign: 'center', marginTop: '15px' },
    errorMessage: { color: 'red', textAlign: 'center', marginTop: '15px' },
    signupLink: { textAlign: 'center', marginTop: '15px', fontSize: '14px' }
};

export default Login;
