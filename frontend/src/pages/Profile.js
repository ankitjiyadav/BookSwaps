import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaEdit, FaSave, FaCalendarAlt, FaBook, FaExchangeAlt } from 'react-icons/fa';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    location: '',
    avatar: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        bio: user.bio || '',
        location: user.location || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

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
      await updateProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user.username || '',
      bio: user.bio || '',
      location: user.location || '',
      avatar: user.avatar || ''
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="card-title">
            <FaUser style={{ marginRight: '8px' }} />
            Profile
          </h2>
          {!isEditing && (
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              <FaEdit style={{ marginRight: '4px' }} />
              Edit Profile
            </button>
          )}
        </div>

        <div className="card-body">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  <FaUser style={{ marginRight: '4px' }} />
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  minLength="3"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaEnvelope style={{ marginRight: '4px' }} />
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  value={user.email}
                  disabled
                  style={{ backgroundColor: '#f8f9fa' }}
                />
                <small className="text-muted">Email cannot be changed</small>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaMapMarkerAlt style={{ marginRight: '4px' }} />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter your location"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea
                  name="bio"
                  className="form-control"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tell us about yourself..."
                  maxLength="500"
                />
                <small className="text-muted">
                  {formData.bio.length}/500 characters
                </small>
              </div>

              <div className="form-group">
                <label className="form-label">Avatar URL</label>
                <input
                  type="url"
                  name="avatar"
                  className="form-control"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="Enter image URL"
                />
              </div>

              <div className="d-flex gap-3">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  <FaSave style={{ marginRight: '4px' }} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="profile-header">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="profile-avatar"
                  />
                ) : (
                  <div className="profile-avatar-placeholder">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <h3 style={{ marginBottom: '10px', color: '#333' }}>{user.username}</h3>
                {user.bio && (
                  <p style={{ color: '#666', maxWidth: '400px', margin: '0 auto' }}>
                    {user.bio}
                  </p>
                )}
              </div>

              <div className="profile-info">
                <h4>Account Information</h4>
                <div className="profile-info-item">
                  <span className="profile-info-label">Username</span>
                  <span className="profile-info-value">{user.username}</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Email</span>
                  <span className="profile-info-value">{user.email}</span>
                </div>
                {user.location && (
                  <div className="profile-info-item">
                    <span className="profile-info-label">Location</span>
                    <span className="profile-info-value">{user.location}</span>
                  </div>
                )}
                <div className="profile-info-item">
                  <span className="profile-info-label">Member Since</span>
                  <span className="profile-info-value">
                    <FaCalendarAlt style={{ marginRight: '4px' }} />
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="profile-stats">
                <div className="profile-stat-card">
                  <div className="profile-stat-number">0</div>
                  <div className="profile-stat-label">
                    <FaBook style={{ marginRight: '4px' }} />
                    Books Listed
                  </div>
                </div>
                <div className="profile-stat-card">
                  <div className="profile-stat-number">0</div>
                  <div className="profile-stat-label">
                    <FaExchangeAlt style={{ marginRight: '4px' }} />
                    Successful Exchanges
                  </div>
                </div>
                <div className="profile-stat-card">
                  <div className="profile-stat-number">0</div>
                  <div className="profile-stat-label">
                    <FaUser style={{ marginRight: '4px' }} />
                    Active Requests
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 