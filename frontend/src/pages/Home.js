import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSearch, FaFilter, FaBook, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import BookCard from '../components/BookCard';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');

  useEffect(() => {
    fetchBooks();
  }, [searchTerm, conditionFilter, genreFilter]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (conditionFilter) params.append('condition', conditionFilter);
      if (genreFilter) params.append('genre', genreFilter);

      const response = await axios.get(`/api/books?${params.toString()}`);
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setConditionFilter('');
    setGenreFilter('');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading books...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card mb-4">
        <div className="card-header">
          <h1 className="card-title">
            <FaBook style={{ marginRight: '8px' }} />
            Welcome to BookSwap
          </h1>
          <p className="text-muted">
            Discover and exchange books with fellow readers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <FaSearch style={{ marginRight: '8px' }} />
              Search Books
            </h3>
          </div>
          
          <form onSubmit={handleSearch}>
            <div className="d-flex gap-3 flex-wrap">
              <div style={{ flex: '1', minWidth: '200px' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by title, author, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div style={{ minWidth: '150px' }}>
                <select
                  className="form-control"
                  value={conditionFilter}
                  onChange={(e) => setConditionFilter(e.target.value)}
                >
                  <option value="">All Conditions</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
              
              <div style={{ minWidth: '150px' }}>
                <select
                  className="form-control"
                  value={genreFilter}
                  onChange={(e) => setGenreFilter(e.target.value)}
                >
                  <option value="">All Genres</option>
                  <option value="fiction">Fiction</option>
                  <option value="non-fiction">Non-Fiction</option>
                  <option value="science-fiction">Science Fiction</option>
                  <option value="fantasy">Fantasy</option>
                  <option value="mystery">Mystery</option>
                  <option value="romance">Romance</option>
                  <option value="biography">Biography</option>
                  <option value="history">History</option>
                  <option value="science">Science</option>
                  <option value="technology">Technology</option>
                  <option value="philosophy">Philosophy</option>
                  <option value="poetry">Poetry</option>
                  <option value="drama">Drama</option>
                  <option value="children">Children</option>
                  <option value="cookbook">Cookbook</option>
                  <option value="travel">Travel</option>
                  <option value="art">Art</option>
                  <option value="music">Music</option>
                  <option value="sports">Sports</option>
                  <option value="business">Business</option>
                  <option value="self-help">Self-Help</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <button type="submit" className="btn btn-primary">
                  <FaSearch style={{ marginRight: '4px' }} />
                  Search
                </button>
              </div>
              
              <div>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={clearFilters}
                >
                  <FaFilter style={{ marginRight: '4px' }} />
                  Clear
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Books Grid */}
      {books.length === 0 ? (
        <div className="empty-state">
          <h3>No books found</h3>
          <p>
            {searchTerm || conditionFilter || genreFilter 
              ? 'Try adjusting your search criteria'
              : 'Be the first to add a book to the marketplace!'
            }
          </p>
        </div>
      ) : (
        <div className="book-grid">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home; 