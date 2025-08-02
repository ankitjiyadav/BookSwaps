import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookDetail from './pages/BookDetail';
import AddBook from './pages/AddBook';
import MyBooks from './pages/MyBooks';
import Requests from './pages/Requests';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route 
              path="/add-book" 
              element={
                <PrivateRoute>
                  <AddBook />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/my-books" 
              element={
                <PrivateRoute>
                  <MyBooks />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/requests" 
              element={
                <PrivateRoute>
                  <Requests />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App; 