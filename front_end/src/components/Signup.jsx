import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api/users'; 

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize the hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message + '. Redirecting to login...');
        setError('');
        setFormData({ username: '', email: '', password: '' });
        
        // 🛑 Redirection Logic 🛑
        setTimeout(() => {
            navigate('/login'); // Redirect to the login page after 2 seconds
        }, 2000);

      } else {
        setError(data.message || 'Registration failed.');
        setMessage('');
      }
    } catch (err) {
      setError('Network error. Could not connect to the server.');
      setMessage('');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Create Account</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          style={styles.input}
        />
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
          Sign Up
        </button>
      </form>
      {message && <p style={styles.successMessage}>{message}</p>}
      {error && <p style={styles.errorMessage}>{error}</p>}
    </div>
  );
};

// Basic Inline Styles (Keep these or move them to a CSS file)
const styles = {
    // ... (Your existing styles for container, header, form, input, button)
    container: { maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' },
    header: { textAlign: 'center', color: '#333', marginBottom: '20px' },
    form: { display: 'flex', flexDirection: 'column' },
    input: { padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '16px' },
    button: { padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
    successMessage: { color: 'green', textAlign: 'center', marginTop: '15px' },
    errorMessage: { color: 'red', textAlign: 'center', marginTop: '15px' }
};

export default Signup;