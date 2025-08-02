import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaMapMarkerAlt, FaEye } from 'react-icons/fa';

const BookCard = ({ book }) => {
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

  const getConditionText = (condition) => {
    return condition.charAt(0).toUpperCase() + condition.slice(1);
  };

  return (
    <div className="book-card">
      <img
        src={book.image || '/placeholder-book.jpg'}
        alt={book.title}
        className="book-image"
        onError={(e) => {
          e.target.src = '/placeholder-book.jpg';
        }}
      />
      
      <div className="book-content">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author}</p>
        
        {book.genre && (
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
            {book.genre}
          </p>
        )}
        
        <div className="book-condition">
          <span className={`badge ${getConditionColor(book.condition)}`}>
            {getConditionText(book.condition)}
          </span>
        </div>
        
        {book.description && (
          <p style={{ 
            fontSize: '14px', 
            color: '#666', 
            marginBottom: '15px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {book.description}
          </p>
        )}
        
        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <FaUser style={{ marginRight: '5px', color: '#666' }} />
            <span style={{ fontSize: '14px', color: '#666' }}>
              {book.owner?.username}
            </span>
          </div>
          
          {book.owner?.location && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FaMapMarkerAlt style={{ marginRight: '5px', color: '#666' }} />
              <span style={{ fontSize: '14px', color: '#666' }}>
                {book.owner.location}
              </span>
            </div>
          )}
        </div>
        
        <div className="book-actions">
          <Link to={`/books/${book._id}`} className="btn btn-primary">
            <FaEye style={{ marginRight: '4px' }} />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard; 