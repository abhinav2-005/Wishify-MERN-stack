import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// 🛑 MODIFIED: Added user API URL
const API_BASE_URL = 'http://localhost:5000/api';

const Home = () => {
    const [wishes, setWishes] = useState([]);
    const [username, setUsername] = useState(''); // 🛑 NEW: State for username
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // 🛑 MODIFIED: This function now fetches both wishes and user data
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        if (!token) {
            setError('User not authenticated. Redirecting to login.');
            setTimeout(() => navigate('/login'), 1500);
            return;
        }

        try {
            // Fetch both wishes and user data at the same time
            const [wishesResponse, userResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/wishes`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_BASE_URL}/users/me`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (!wishesResponse.ok || !userResponse.ok) {
                // If either request fails, log out the user
                throw new Error('Failed to fetch data. Please log in again.');
            }

            const wishesData = await wishesResponse.json();
            const userData = await userResponse.json();

            setWishes(wishesData);
            setUsername(userData.username); // Set the username state

        } catch (err) {
            setError(err.message || 'A network error occurred.');
            localStorage.removeItem('token');
            setTimeout(() => navigate('/login'), 2000);
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchData(); // Call the unified data fetching function
    }, [fetchData]);

    const handleNewEntry = () => navigate('/add-wish');
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleDelete = async (wishId) => {
        if (!window.confirm('Are you sure you want to delete this wish?')) return;
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/wishes/${wishId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setWishes(wishes.filter(wish => wish._id !== wishId));
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to delete wish.');
            }
        } catch (err) {
            alert('A network error occurred. Could not delete wish.');
        }
    };
    
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

    if (isLoading) return <p style={styles.loading}>Loading Wishing List...</p>;
    if (error && error.includes('authenticated')) return <p style={styles.errorMessage}>{error}</p>;

    return (
        <div style={styles.container}>
            {/* 🛑 MODIFIED: Title now uses the username state */}
            <h2 style={styles.header}>
                {username ? `${username}'s` : 'Your'} Personalized Wishing List
            </h2>
            <div style={styles.headerActions}>
                <button onClick={handleNewEntry} style={styles.addButton}>+ Add New Entry</button>
                <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
            </div>
            {error && <p style={styles.errorMessage}>{error}</p>}
            {wishes.length === 0 && !isLoading ? (
                <p style={styles.emptyMessage}>Your list is empty. Click 'Add New Entry' to get started!</p>
            ) : (
                <div style={styles.listContainer}>
                    {wishes.map(wish => (
                        <div key={wish._id} style={styles.wishCard}>
                            <div style={styles.cardHeader}>
                                <h3 style={styles.wishName}>{wish.name}</h3>
                                <button onClick={() => handleDelete(wish._id)} style={styles.deleteButton}>Delete</button>
                            </div>
                            <p><strong>Email:</strong> {wish.email}</p>
                            <p><strong>Wish Type:</strong> {wish.wishType}</p>
                            <p><strong>Wish Date:</strong> {formatDate(wish.wishDate)}</p>
                            <p style={wish.isSent ? styles.sentStatus : styles.pendingStatus}>
                                {wish.isSent ? 'WISH SENT' : 'PENDING'}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Styles remain the same
const styles = {
    container: { maxWidth: '800px', margin: '50px auto', padding: '20px', textAlign: 'center' },
    header: { color: '#333', marginBottom: '30px' },
    headerActions: { display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px' },
    addButton: { padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' },
    logoutButton: { padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' },
    listContainer: { display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' },
    wishCard: { border: '1px solid #ddd', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', backgroundColor: '#ffffff' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
    wishName: { margin: '0', color: '#007bff' },
    deleteButton: { backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer', fontSize: '12px' },
    loading: { textAlign: 'center', marginTop: '50px', fontSize: '1.2em' },
    errorMessage: { color: 'red', textAlign: 'center', marginTop: '30px', border: '1px solid red', padding: '10px', borderRadius: '5px', backgroundColor: '#fdd' },
    emptyMessage: { color: '#666', marginTop: '30px', fontSize: '1.1em' },
    sentStatus: { color: 'green', fontWeight: 'bold' },
    pendingStatus: { color: 'orange', fontWeight: 'bold' }
};

export default Home;