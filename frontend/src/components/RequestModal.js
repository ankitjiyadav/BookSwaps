import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTimes, FaExchangeAlt, FaBook } from 'react-icons/fa';

const RequestModal = ({ book, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    message: '',
    exchangeBookId: '',
    exchangeMessage: ''
  });
  const [userBooks, setUserBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showExchange, setShowExchange] = useState(false);

  useEffect(() => {
    fetchUserBooks();
  }, []);

  const fetchUserBooks = async () => {
    try {
      const response = await axios.get('/api/books/user/my-books');
      setUserBooks(response.data.filter(book => book.isAvailable));
    } catch (error) {
      console.error('Error fetching user books:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestData = {
        bookId: book._id,
        message: formData.message
      };

      if (showExchange && formData.exchangeBookId) {
        requestData.exchangeBookId = formData.exchangeBookId;
        requestData.exchangeMessage = formData.exchangeMessage;
      }

      await axios.post('/api/requests', requestData);
      toast.success('Request sent successfully!');
      onSuccess();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send request';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="card" style={{ maxWidth: '500px', width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3 className="card-title">
            <FaExchangeAlt style={{ marginRight: '8px' }} />
            Request Exchange
          </h3>
          <button 
            onClick={onClose}
            className="btn"
            style={{ background: 'none', border: 'none', fontSize: '20px' }}
          >
            <FaTimes />
          </button>
        </div>

        <div className="card-body">
          <div style={{ marginBottom: '20px' }}>
            <h4>Requesting: {book.title}</h4>
            <p style={{ color: '#666' }}>by {book.author}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Message to Owner</label>
              <textarea
                name="message"
                className="form-control"
                value={formData.message}
                onChange={handleChange}
                rows="3"
                placeholder="Tell the owner why you'd like this book..."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <input
                  type="checkbox"
                  checked={showExchange}
                  onChange={(e) => setShowExchange(e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                Offer a book in exchange
              </label>
            </div>

            {showExchange && (
              <>
                <div className="form-group">
                  <label className="form-label">Select Your Book</label>
                  <select
                    name="exchangeBookId"
                    className="form-control"
                    value={formData.exchangeBookId}
                    onChange={handleChange}
                    required={showExchange}
                  >
                    <option value="">Choose a book to offer...</option>
                    {userBooks.map(book => (
                      <option key={book._id} value={book._id}>
                        {book.title} by {book.author} ({book.condition})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Exchange Message</label>
                  <textarea
                    name="exchangeMessage"
                    className="form-control"
                    value={formData.exchangeMessage}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Tell them about the book you're offering..."
                  />
                </div>
              </>
            )}

            <div className="d-flex gap-3">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Request'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestModal; 