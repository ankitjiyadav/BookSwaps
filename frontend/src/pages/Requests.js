import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes, FaTrash, FaUser, FaBook, FaExchangeAlt } from 'react-icons/fa';

const Requests = () => {
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('received');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const [receivedRes, sentRes] = await Promise.all([
        axios.get('/api/requests/received'),
        axios.get('/api/requests/sent')
      ]);
      setReceivedRequests(receivedRes.data);
      setSentRequests(sentRes.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await axios.put(`/api/requests/${requestId}/status`, { status });
      toast.success(`Request ${status}`);
      fetchRequests();
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error('Failed to update request status');
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to cancel this request?')) {
      try {
        await axios.delete(`/api/requests/${requestId}`);
        toast.success('Request cancelled');
        fetchRequests();
      } catch (error) {
        console.error('Error cancelling request:', error);
        toast.error('Failed to cancel request');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge badge-warning">Pending</span>;
      case 'accepted':
        return <span className="badge badge-success">Accepted</span>;
      case 'declined':
        return <span className="badge badge-danger">Declined</span>;
      default:
        return <span className="badge badge-secondary">{status}</span>;
    }
  };

  const RequestCard = ({ request, isReceived }) => (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-0">
            <FaBook style={{ marginRight: '8px' }} />
            {request.book.title}
          </h5>
          <small className="text-muted">by {request.book.author}</small>
        </div>
        {getStatusBadge(request.status)}
      </div>
      
      <div className="card-body">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h6>Request Details</h6>
            <div style={{ marginBottom: '10px' }}>
              <strong>From:</strong> {isReceived ? request.requester.username : request.bookOwner.username}
            </div>
            {request.message && (
              <div style={{ marginBottom: '10px' }}>
                <strong>Message:</strong> {request.message}
              </div>
            )}
            <div>
              <strong>Date:</strong> {new Date(request.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          {request.exchangeBook && (
            <div>
              <h6>Exchange Offer</h6>
              <div style={{ marginBottom: '10px' }}>
                <strong>Book:</strong> {request.exchangeBook.title}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Author:</strong> {request.exchangeBook.author}
              </div>
              {request.exchangeMessage && (
                <div>
                  <strong>Message:</strong> {request.exchangeMessage}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="d-flex gap-2 mt-3">
          {isReceived && request.status === 'pending' && (
            <>
              <button
                className="btn btn-success"
                onClick={() => handleStatusUpdate(request._id, 'accepted')}
              >
                <FaCheck style={{ marginRight: '4px' }} />
                Accept
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleStatusUpdate(request._id, 'declined')}
              >
                <FaTimes style={{ marginRight: '4px' }} />
                Decline
              </button>
            </>
          )}
          
          {!isReceived && request.status === 'pending' && (
            <button
              className="btn btn-danger"
              onClick={() => handleCancelRequest(request._id)}
            >
              <FaTrash style={{ marginRight: '4px' }} />
              Cancel Request
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading requests...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card mb-4">
        <div className="card-header">
          <h1 className="card-title">
            <FaExchangeAlt style={{ marginRight: '8px' }} />
            Book Requests
          </h1>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="card mb-4">
        <div className="card-header">
          <div className="d-flex gap-3">
            <button
              className={`btn ${activeTab === 'received' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('received')}
            >
              Received ({receivedRequests.length})
            </button>
            <button
              className={`btn ${activeTab === 'sent' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('sent')}
            >
              Sent ({sentRequests.length})
            </button>
          </div>
        </div>
      </div>

      {/* Requests List */}
      {activeTab === 'received' ? (
        receivedRequests.length === 0 ? (
          <div className="empty-state">
            <h3>No received requests</h3>
            <p>You haven't received any book requests yet.</p>
          </div>
        ) : (
          <div>
            {receivedRequests.map(request => (
              <RequestCard key={request._id} request={request} isReceived={true} />
            ))}
          </div>
        )
      ) : (
        sentRequests.length === 0 ? (
          <div className="empty-state">
            <h3>No sent requests</h3>
            <p>You haven't sent any book requests yet.</p>
          </div>
        ) : (
          <div>
            {sentRequests.map(request => (
              <RequestCard key={request._id} request={request} isReceived={false} />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Requests; 