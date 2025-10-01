import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_WISHES_URL = 'http://localhost:5000/api/wishes'; 

const AddWish = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        wishType: 'Birthday',
        wishDate: new Date().toISOString().split('T')[0],
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setMessage('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setMessage('Adding friend to list...');
        
        const token = localStorage.getItem('token');
        
        // CRITICAL CHECK: Ensure the user is logged in
        if (!token) {
            setError('Error: You are not logged in. Redirecting to login.');
            setIsSubmitting(false);
            setTimeout(() => navigate('/login'), 1500);
            return;
        }

        try {
            const response = await fetch(API_WISHES_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Send JWT for authentication
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message + ' Redirecting to Dashboard...');
                setError('');
                // Redirect user back to the list after a short delay
                setTimeout(() => navigate('/dashboard'), 1500); 
            } else if (response.status === 401) {
                 setError('Session expired. Please log in again.');
                 localStorage.removeItem('token');
                 setTimeout(() => navigate('/login'), 1500);
            } else {
                setError(data.message || 'Failed to add wish entry. Check server logs.');
                setMessage('');
                setIsSubmitting(false);
            }
        } catch (err) {
            setError('Network error. Could not connect to the server (Is the backend running on port 5000?).');
            setMessage('');
            setIsSubmitting(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Add New Friend to Wishing List</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                
                <label style={styles.label}>Friend's Name:</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    placeholder="E.g., Jane Doe"
                />

                <label style={styles.label}>Friend's Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    placeholder="E.g., jane@email.com"
                />

                <label style={styles.label}>Wish Type:</label>
                <select
                    name="wishType"
                    value={formData.wishType}
                    onChange={handleChange}
                    required
                    style={styles.input}
                >
                    <option value="Birthday">Birthday</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Other">Other</option>
                </select>

                <label style={styles.label}>Wish Date:</label>
                <input
                    type="date"
                    name="wishDate"
                    value={formData.wishDate}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />

                <button 
                    type="submit" 
                    style={styles.button} 
                    disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Add Entry'}
                </button>
            </form>
            {message && <p style={styles.successMessage}>{message}</p>}
            {error && <p style={styles.errorMessage}>{error}</p>}
        </div>
    );
};

// Basic Inline Styles
const styles = {
    container: { maxWidth: '450px', margin: '50px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' },
    header: { textAlign: 'center', color: '#333', marginBottom: '30px' },
    form: { display: 'flex', flexDirection: 'column' },
    label: { textAlign: 'left', marginBottom: '5px', fontWeight: '600', color: '#555' },
    input: { padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' },
    button: {
        padding: '12px 20px', backgroundColor: '#007bff', color: 'white', border: 'none',
        borderRadius: '5px', cursor: 'pointer', fontSize: '17px', marginTop: '15px',
        transition: 'background-color 0.3s',
        ':hover': { backgroundColor: '#0056b3' }
    },
    successMessage: { color: 'green', textAlign: 'center', marginTop: '15px' },
    errorMessage: { color: 'red', textAlign: 'center', marginTop: '15px', border: '1px solid red', padding: '10px', backgroundColor: '#fee', borderRadius: '5px' },
};

export default AddWish;
