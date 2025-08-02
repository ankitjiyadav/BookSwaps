import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEye, FaTrash, FaEdit, FaToggleOn, FaToggleOff, FaBook } from 'react-icons/fa';

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Base URL for API calls
  const API_BASE_URL = 'http://localhost:5001/api';

  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/books/user/my-books`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks(res.data);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to load books. Please try again.');
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const handleDelete = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/books/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Book deleted successfully');
      fetchMyBooks();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete book');
    }
  };

  const toggleAvailability = async (bookId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/books/${bookId}`,
        { isAvailable: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(`Book ${!currentStatus ? 'made available' : 'made unavailable'}`);
      fetchMyBooks();
    } catch (err) {
      console.error('Availability toggle error:', err);
      toast.error('Failed to update availability');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-book.svg';
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it's a relative path, construct the full URL
    if (imagePath.startsWith('/uploads/')) {
      return `http://localhost:5001${imagePath}`;
    }
    
    // If it doesn't start with /uploads/, assume it's a filename
    return `http://localhost:5001/uploads/${imagePath}`;
  };

  const handleImageError = (e) => {
    console.log('Image failed to load:', e.target.src);
    e.target.src = '/placeholder-book.svg';
    e.target.onerror = null; // Prevent infinite loop
  };

  const handleImageLoad = (e) => {
    console.log('Image loaded successfully:', e.target.src);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger">
          <h4>Error Loading Books</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchMyBooks}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="card-title">
            <FaBook style={{ marginRight: '8px' }} />
            My Books
          </h2>
          <Link to="/add-book" className="btn btn-primary">
            <FaPlus style={{ marginRight: '5px' }} />
            Add New Book
          </Link>
        </div>
      </div>

      {books.length === 0 ? (
        <div className="empty-state">
          <h3>No books found</h3>
          <p>You haven't added any books yet. Start by adding your first book!</p>
          <Link to="/add-book" className="btn btn-primary">
            <FaPlus style={{ marginRight: '5px' }} />
            Add First Book
          </Link>
        </div>
      ) : (
        <div className="book-grid">
          {books.map((book) => (
            <div key={book._id} className="book-card">
              <div className="book-image-container">
                <img
                  src={getImageUrl(book.image)}
                  alt={book.title}
                  className="book-image"
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
                <div className="book-overlay">
                  <div className="book-actions-overlay">
                    <Link to={`/books/${book._id}`} className="btn btn-sm btn-primary">
                      <FaEye />
                    </Link>
                    <Link to={`/books/${book._id}/edit`} className="btn btn-sm btn-warning">
                      <FaEdit />
                    </Link>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => toggleAvailability(book._id, book.isAvailable)}
                      title={book.isAvailable ? 'Make Unavailable' : 'Make Available'}
                    >
                      {book.isAvailable ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(book._id)}
                      title="Delete Book"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
              <div className="book-content">
                <h5 className="book-title">{book.title}</h5>
                <p className="book-author">by {book.author}</p>
                {book.genre && (
                  <p className="book-genre">
                    <span className="badge badge-secondary">{book.genre}</span>
                  </p>
                )}
                <p className="book-condition">
                  <strong>Condition:</strong>{' '}
                  <span className={`badge badge-${getConditionColor(book.condition)}`}>
                    {book.condition}
                  </span>
                </p>
                <p className="book-status">
                  <strong>Status:</strong>{' '}
                  <span className={`badge ${book.isAvailable ? 'badge-success' : 'badge-secondary'}`}>
                    {book.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </p>
                {book.description && (
                  <p className="book-description text-truncate">{book.description}</p>
                )}
                <div className="book-footer">
                  <small className="text-muted">
                    Added: {new Date(book.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function to get condition badge color
const getConditionColor = (condition) => {
  switch (condition) {
    case 'excellent':
      return 'success';
    case 'good':
      return 'primary';
    case 'fair':
      return 'warning';
    case 'poor':
      return 'danger';
    default:
      return 'secondary';
  }
};

export default MyBooks;
