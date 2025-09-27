import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    
    // 🛑 LOGIN LOGIC STUB (Requires a backend /api/users/login route) 🛑
    /*
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token/user info (e.g., localStorage)
        localStorage.setItem('token', data.token);
        setMessage('Login successful. Redirecting...');
        
        // Redirect to the dashboard/home page
        setTimeout(() => navigate('/dashboard'), 500); 
        
      } else {
        setError(data.message || 'Login failed. Check credentials.');
      }
    } catch (err) {
      setError('Network error. Could not connect to the server.');
    }
    */
    
    // Temporary simulation of success until backend is added:
    setMessage('Login successful. Redirecting...');
    setTimeout(() => navigate('/dashboard'), 500); 
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
    button: { padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
    successMessage: { color: 'green', textAlign: 'center', marginTop: '15px' },
    errorMessage: { color: 'red', textAlign: 'center', marginTop: '15px' }
};

export default Login;