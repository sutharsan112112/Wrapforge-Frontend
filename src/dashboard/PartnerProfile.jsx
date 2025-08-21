import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessagesSquare } from 'lucide-react';
import axios from 'axios';

const PartnerProfile = () => {
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      alert("Please login first.");
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setPartner(parsedUser);

    // ✅ FIXED API endpoint
    axios.get('http://localhost:5000/api/requests/partner', {
      headers: { Authorization: `Bearer ${parsedUser.token}` }
    })
    .then(res => {
      setRequests(res.data || []);
      setLoading(false);
    })
    .catch(err => {
      console.error('Failed to fetch requests:', err);
      setLoading(false);
    });
  }, [navigate]);

  if (!partner) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-20">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center bg-yellow-400 hover:bg-orange-400 text-black px-4 py-2 rounded-md font-semibold"
      >
        <ArrowLeft className="mr-2" size={18} />
        Back
      </button>

      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {partner.name}</h1>
          <p className="text-gray-600 mt-2">Here are your recent user requests.</p>
        </header>

        {loading ? (
          <p className="text-gray-500">Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-500">No user requests found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((req) => (
              <div
                key={req._id}
                className="bg-white rounded-xl shadow-md p-5 transform transition hover:scale-105 hover:shadow-xl"
              >
                <h3 className="text-lg font-bold text-gray-700 mb-2">
                  Request from: <span className="text-blue-600">{req.userId?.name || 'Unknown User'}</span>
                </h3>
                <p className="text-gray-600">
                  Requested Vehicle: <span className="font-semibold">{req.customizationId?.vehicleId?.name || 'N/A'}</span>
                </p>
                <p className="text-sm text-gray-400 mt-1">Date: {new Date(req.createdAt).toLocaleDateString()}</p>

                <div className="flex justify-between items-center mt-4">
                  <button className="flex items-center text-blue-600 hover:underline text-sm" onClick={() => alert('Respond functionality coming soon')}>
                    <MessagesSquare size={18} className="mr-1" />
                    Respond
                  </button>
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium"
                    onClick={() => alert('Accept functionality coming soon')}
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerProfile;
