import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaBook, FaUser, FaSignOutAlt, FaPlus, FaList } from 'react-icons/fa';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar shadow-sm">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <FaBook className="me-2" />
          <span>BookSwap</span>
        </Link>

        <ul className="navbar-nav d-flex align-items-center gap-3">
          <li>
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <Link 
                  to="/add-book" 
                  className={`nav-link ${location.pathname === '/add-book' ? 'active' : ''}`}
                >
                  <FaPlus className="me-1" />
                  Add Book
                </Link>
              </li>
              <li>
                <Link 
                  to="/my-books" 
                  className={`nav-link ${location.pathname === '/my-books' ? 'active' : ''}`}
                >
                  <FaList className="me-1" />
                  My Books
                </Link>
              </li>
              <li>
                <Link 
                  to="/requests" 
                  className={`nav-link ${location.pathname === '/requests' ? 'active' : ''}`}
                >
                  Requests
                </Link>
              </li>
              <li className="d-flex align-items-center">
                <Link 
                  to="/profile" 
                  className={`nav-link d-flex align-items-center ${location.pathname === '/profile' ? 'active' : ''}`}
                >
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.username} 
                      className="user-avatar me-2"
                    />
                  ) : (
                    <div className="user-avatar me-2">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {user?.username}
                </Link>
              </li>
              <li>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-outline"
                >
                  <FaSignOutAlt className="me-1" />
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link 
                  to="/login" 
                  className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
