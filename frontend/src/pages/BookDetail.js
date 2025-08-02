import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUser, FaMapMarkerAlt, FaEnvelope, FaBook, FaExchangeAlt, FaEdit, FaTrash } from 'react-icons/fa';
import RequestModal from '../components/RequestModal';

const BookDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/books/${id}`);
      setBook(response.data);
    } catch (error) {
      console.error('Error fetching book:', error);
      toast.error('Failed to load book details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`/api/books/${id}`);
        toast.success('Book deleted successfully');
        navigate('/my-books');
      } catch (error) {
        console.error('Error deleting book:', error);
        toast.error('Failed to delete book');
      }
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'excellent':
        return 'badge-success';
      case 'good':
        return 'badge-primary';
      case 'fair':
        return 'badge-warning';
      case 'poor':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading book details...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container">
        <div className="alert alert-danger">Book not found</div>
      </div>
    );
  }

  const isOwner = user && book.owner._id === user.id;

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">{book.title}</h1>
          <p className="text-muted">by {book.author}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
          {/* Book Image */}
          <div>
            <img
              src={book.image || '/placeholder-book.jpg'}
              alt={book.title}
              style={{ 
                width: '100%', 
                height: '400px', 
                objectFit: 'cover',
                borderRadius: '10px'
              }}
              onError={(e) => {
                e.target.src = '/placeholder-book.jpg';
              }}
            />
          </div>

          {/* Book Details */}
          <div>
            <div style={{ marginBottom: '20px' }}>
              <span className={`badge ${getConditionColor(book.condition)}`}>
                {book.condition.charAt(0).toUpperCase() + book.condition.slice(1)} Condition
              </span>
            </div>

            {book.description && (
              <div style={{ marginBottom: '20px' }}>
                <h4>Description</h4>
                <p>{book.description}</p>
              </div>
            )}

            {book.genre && (
              <div style={{ marginBottom: '20px' }}>
                <h4>Genre</h4>
                <p>{book.genre}</p>
              </div>
            )}

            {book.isbn && (
              <div style={{ marginBottom: '20px' }}>
                <h4>ISBN</h4>
                <p>{book.isbn}</p>
              </div>
            )}

            {book.year && (
              <div style={{ marginBottom: '20px' }}>
                <h4>Publication Year</h4>
                <p>{book.year}</p>
              </div>
            )}

            {book.language && (
              <div style={{ marginBottom: '20px' }}>
                <h4>Language</h4>
                <p>{book.language}</p>
              </div>
            )}

            {/* Owner Information */}
            <div style={{ marginBottom: '20px' }}>
              <h4>Owner Information</h4>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <FaUser style={{ marginRight: '8px', color: '#666' }} />
                <span>{book.owner.username}</span>
              </div>
              
              {book.owner.location && (
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <FaMapMarkerAlt style={{ marginRight: '8px', color: '#666' }} />
                  <span>{book.owner.location}</span>
                </div>
              )}
              
              {book.owner.bio && (
                <div style={{ marginTop: '10px' }}>
                  <p style={{ fontSize: '14px', color: '#666' }}>{book.owner.bio}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="book-actions">
              {isAuthenticated ? (
                isOwner ? (
                  <div className="d-flex gap-3">
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate(`/edit-book/${id}`)}
                    >
                      <FaEdit style={{ marginRight: '4px' }} />
                      Edit Book
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={handleDelete}
                    >
                      <FaTrash style={{ marginRight: '4px' }} />
                      Delete Book
                    </button>
                  </div>
                ) : (
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowRequestModal(true)}
                    disabled={!book.isAvailable}
                  >
                    <FaExchangeAlt style={{ marginRight: '4px' }} />
                    {book.isAvailable ? 'Request Exchange' : 'Not Available'}
                  </button>
                )
              ) : (
                <div className="alert alert-info">
                  Please <a href="/login" className="alert-link">login</a> to request this book
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showRequestModal && (
        <RequestModal
          book={book}
          onClose={() => setShowRequestModal(false)}
          onSuccess={() => {
            setShowRequestModal(false);
            fetchBook();
          }}
        />
      )}
    </div>
  );
};

export default BookDetail; 