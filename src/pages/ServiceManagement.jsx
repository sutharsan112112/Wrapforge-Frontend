import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  // Fetch all services on load
  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/service`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Failed to fetch services');
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Change status in DB and update UI
  const handleAvailabilityChange = async (serviceId, status) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/service/${serviceId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Status updated to ${status}`);
      setServices((prev) =>
        prev.map((s) => (s._id === serviceId ? res.data : s))
      );
    } catch (error) {
      console.error('Error updating service status:', error);
      toast.error('Failed to update status');
    }
  };

  // Delete service from DB and UI
  const handleDelete = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/service/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Service deleted successfully');
      setServices((prev) => prev.filter((s) => s._id !== serviceId));
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    }
  };

  return (
    <div className="py-16 px-4 bg-white mx-4 md:mx-20 my-10 rounded-xl">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center bg-yellow-400 hover:bg-orange-400 text-black px-4 py-2 rounded-md font-semibold"
      >
        <ArrowLeft className="mr-2" size={18} />
        Back
      </button>

      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">All Services</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {services.length > 0 ? (
          services.map((service) => (
            <div key={service._id} className="bg-gray-50 rounded-xl shadow-md p-4">
              <img
                src={service.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={service.title}
                className="w-full h-40 object-cover rounded-md"
              />
              <h3 className="text-lg font-semibold mt-3">{service.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{service.description}</p>
              <p className="text-sm text-gray-800 mt-2 font-semibold">
                Price: Rs.{service.price || 0}
              </p>
              <p className="text-sm text-gray-800 mt-1 font-semibold">
                Status:{' '}
                <span
                  className={
                    service.status === 'Available'
                      ? 'text-green-600'
                      : service.status === 'Unavailable'
                      ? 'text-yellow-600'
                      : 'text-gray-600'
                  }
                >
                  {service.status || 'Pending'}
                </span>
              </p>

              {/* Action Buttons */}
              <div className="px-5 py-5 mt-4 flex gap-x-3 flex-wrap">
                <button
                  className={`px-3 py-1 rounded-md text-sm text-white ${
                    service.status === 'Available'
                      ? 'bg-green-600'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                  onClick={() => handleAvailabilityChange(service._id, 'Available')}
                >
                  Available
                </button>
                <button
                  className={`px-3 py-1 rounded-md text-sm text-white ${
                    service.status === 'Unavailable'
                      ? 'bg-yellow-600'
                      : 'bg-yellow-500 hover:bg-yellow-600'
                  }`}
                  onClick={() => handleAvailabilityChange(service._id, 'Unavailable')}
                >
                  Unavailable
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md text-sm"
                  onClick={() => handleDelete(service._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-xl text-gray-500">
            No services available yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceManagement;
