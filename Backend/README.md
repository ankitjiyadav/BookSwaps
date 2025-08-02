# BookSwap - Book Exchange Marketplace

A full-stack MERN application for users to exchange used books. Built with MongoDB, Express.js, React.js, and Node.js.

## Features

### Core Features
- **User Authentication**: Secure login/signup with JWT tokens
- **Book Management**: Users can post books with title, author, condition, and images
- **Book Requests**: Request functionality with status tracking (pending, accepted, declined)
- **User Dashboard**: Manage own books and requests
- **Search & Filter**: Find books by title, author, condition, and genre

### Additional Features
- **Image Upload**: Support for book cover images
- **Real-time Notifications**: Toast notifications for user actions
- **Responsive Design**: Mobile-friendly interface
- **Modern UI**: Clean and intuitive user interface
- **Profile Management**: Edit user profiles and preferences

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **multer** - File upload handling
- **express-validator** - Input validation

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **React Icons** - Icon library

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BookSwap
   ```

2. **Install server dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Configuration**
   - Copy `config.env` to `.env`
   - Update the following variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     PORT=5000
     ```

5. **Start the development servers**
   ```bash
   # Start both server and client
   npm run dev
   
   # Or start them separately
   npm run server    # Backend on port 5000
   npm run client    # Frontend on port 3000
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Books
- `GET /api/books` - Get all books (with filters)
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book
- `GET /api/books/user/my-books` - Get user's books

### Requests
- `POST /api/requests` - Create book request
- `GET /api/requests/received` - Get received requests
- `GET /api/requests/sent` - Get sent requests
- `PUT /api/requests/:id/status` - Update request status
- `DELETE /api/requests/:id` - Cancel request

## Usage

### For Users
1. **Register/Login**: Create an account or sign in
2. **Add Books**: Post books you want to exchange
3. **Browse Books**: Search and filter available books
4. **Request Exchange**: Send requests for books you want
5. **Manage Requests**: Accept/decline incoming requests
6. **Update Profile**: Customize your profile information

### Features Overview
- **Book Listings**: View all available books with search and filter options
- **Book Details**: See comprehensive information about each book
- **Request System**: Send and manage book exchange requests
- **User Profiles**: View and edit user information
- **My Books**: Manage your own book listings

## Project Structure

```
BookSwap/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   └── index.js       # App entry point
│   └── package.json
├── models/                 # MongoDB models
├── routes/                 # API routes
├── middleware/             # Custom middleware
├── uploads/               # Image uploads
├── server.js              # Express server
└── package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@bookswap.com or create an issue in the repository.

---

**BookSwap** - Connecting readers through book exchanges! 📚 # BookSwap
