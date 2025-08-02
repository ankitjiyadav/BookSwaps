import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUserPlus, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const success = await register(formData.username, formData.email, formData.password);
    if (success) {
      navigate('/');
    }
    
    setLoading(false);
  };

  return (
    <div className="container">
      <div style={{ maxWidth: '400px', margin: '50px auto' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title text-center">
              <FaUserPlus style={{ marginRight: '8px' }} />
              Register
            </h2>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <FaUser style={{ marginRight: '4px' }} />
                Username
              </label>
              <input
                type="text"
                name="username"
                className={`form-control ${errors.username ? 'border-danger' : ''}`}
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your username"
              />
              {errors.username && (
                <div className="alert alert-danger" style={{ fontSize: '12px', padding: '8px' }}>
                  {errors.username}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <FaEnvelope style={{ marginRight: '4px' }} />
                Email
              </label>
              <input
                type="email"
                name="email"
                className={`form-control ${errors.email ? 'border-danger' : ''}`}
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
              {errors.email && (
                <div className="alert alert-danger" style={{ fontSize: '12px', padding: '8px' }}>
                  {errors.email}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <FaLock style={{ marginRight: '4px' }} />
                Password
              </label>
              <input
                type="password"
                name="password"
                className={`form-control ${errors.password ? 'border-danger' : ''}`}
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
              {errors.password && (
                <div className="alert alert-danger" style={{ fontSize: '12px', padding: '8px' }}>
                  {errors.password}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <FaLock style={{ marginRight: '4px' }} />
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                className={`form-control ${errors.confirmPassword ? 'border-danger' : ''}`}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <div className="alert alert-danger" style={{ fontSize: '12px', padding: '8px' }}>
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <div className="text-center mt-4">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="nav-link" style={{ display: 'inline' }}>
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 