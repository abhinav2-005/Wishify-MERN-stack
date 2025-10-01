import React, { useState, useEffect, useCallback } from 'react'; // 🛑 Added useCallback
import { useNavigate } from 'react-router-dom'; 

const API_WISHES_URL = 'http://localhost:5000/api/wishes'; 

const Home = () => {
    const [wishes, setWishes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // 🛑 FIX: Wrapped fetchWishes in useCallback 🛑
    const fetchWishes = useCallback(async () => {
        setIsLoading(true);
        setError('');
        
        const token = localStorage.getItem('token');
        if (!token) {
            setError('User not authenticated. Redirecting to login.');
            setTimeout(() => navigate('/login'), 1500);
            return;
        }
        
        try {
            const response = await fetch(API_WISHES_URL, { 
                method: 'GET',
                headers: { 
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json'
                } 
            });

            const data = await response.json();

            if (response.ok) {
                setWishes(data);
                setIsLoading(false);
            } else {
                setError(data.message || 'Failed to fetch list. Please log in again.');
                localStorage.removeItem('token');
                setTimeout(() => navigate('/login'), 1500);
            }
        } catch (err) {
            setError('Network error. Could not connect to the server.');
            setIsLoading(false);
        }
    }, [navigate]); // navigate is a stable function, but is included as per React guidelines

    // 🛑 FIX: Added fetchWishes to the dependency array 🛑
    useEffect(() => {
        fetchWishes();
    }, [fetchWishes]); 

    const handleNewEntry = () => {
        navigate('/add-wish');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (isLoading) return <p style={styles.loading}>Loading Wishing List...</p>;
    if (error && error.includes('authenticated')) return <p style={styles.errorMessage}>{error}</p>;

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Your Personalized Wishing List</h2>
            
            <button 
                onClick={handleNewEntry} 
                style={styles.addButton}>
                + Add New Entry
            </button>

            {error && <p style={styles.errorMessage}>{error}</p>}
            
            {wishes.length === 0 ? (
                <p style={styles.emptyMessage}>Your list is empty. Click 'Add New Entry' to get started!</p>
            ) : (
                <div style={styles.listContainer}>
                    {wishes.map(wish => (
                        <div key={wish._id} style={styles.wishCard}>
                            <h3 style={styles.wishName}>{wish.name}</h3>
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

// Basic Inline Styles
const styles = {
    container: { maxWidth: '800px', margin: '50px auto', padding: '20px', textAlign: 'center' },
    header: { color: '#333', marginBottom: '30px' },
    addButton: {
        padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none',
        borderRadius: '5px', cursor: 'pointer', fontSize: '16px', marginBottom: '30px',
    },
    listContainer: { display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' },
    wishCard: {
        border: '1px solid #ddd', padding: '15px', borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)', backgroundColor: '#ffffff',
    },
    wishName: { marginTop: '0', marginBottom: '10px', color: '#007bff' },
    loading: { textAlign: 'center', marginTop: '50px', fontSize: '1.2em' },
    errorMessage: { color: 'red', textAlign: 'center', marginTop: '30px', border: '1px solid red', padding: '10px', borderRadius: '5px', backgroundColor: '#fdd' },
    emptyMessage: { color: '#666', marginTop: '30px', fontSize: '1.1em' },
    sentStatus: { color: 'green', fontWeight: 'bold' },
    pendingStatus: { color: 'orange', fontWeight: 'bold' }
};

export default Home;
