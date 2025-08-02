import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaUpload } from 'react-icons/fa';

const AddBook = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    condition: 'good',
    genre: '',
    isbn: '',
    year: '',
    language: 'English',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token'); // Make sure user is logged in and token is stored

      if (!token) {
        toast.error('You must be logged in to add a book.');
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();

      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (image) {
        formDataToSend.append('image', image);
      }

     await axios.post('http://localhost:5001/api/books', formDataToSend, {
  headers: {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${token}`
  }
});


      toast.success('Book added successfully!');
      navigate('/my-books');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add book';
      toast.error(message);
      console.error(error); // See the full error for debugging
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ maxWidth: '600px', margin: '50px auto' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <FaPlus style={{ marginRight: '8px' }} />
              Add New Book
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Input fields - no change needed */}
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter book title"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Author *</label>
              <input
                type="text"
                name="author"
                className="form-control"
                value={formData.author}
                onChange={handleChange}
                required
                placeholder="Enter author name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe the book..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Condition *</label>
              <select
                name="condition"
                className="form-control"
                value={formData.condition}
                onChange={handleChange}
                required
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Genre</label>
              <select
                name="genre"
                className="form-control"
                value={formData.genre}
                onChange={handleChange}
              >
                <option value="">Select Genre</option>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label">ISBN</label>
                <input
                  type="text"
                  name="isbn"
                  className="form-control"
                  value={formData.isbn}
                  onChange={handleChange}
                  placeholder="Enter ISBN"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Publication Year</label>
                <input
                  type="number"
                  name="year"
                  className="form-control"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="e.g., 2020"
                  min="1800"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Language</label>
              <select
                name="language"
                className="form-control"
                value={formData.language}
                onChange={handleChange}
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <FaUpload style={{ marginRight: '4px' }} />
                Book Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="form-control"
              />
              {imagePreview && (
                <div style={{ marginTop: '10px' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>

            <div className="d-flex gap-3">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Adding Book...' : 'Add Book'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/my-books')}
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

export default AddBook;
