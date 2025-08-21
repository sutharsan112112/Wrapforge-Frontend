import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyServices = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyServices = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/service?mine=true`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices(res.data);
      } catch (err) {
        console.error('Error fetching my services:', err);
      }
    };
    fetchMyServices();
  }, []);

  return (
    <div className="py-16 px-4 bg-white mx-4 md:mx-20 my-10 rounded-xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center bg-yellow-400 hover:bg-orange-400 text-black px-4 py-2 rounded-md font-semibold"
      >
        <ArrowLeft className="mr-2" size={18} />
        Back
      </button>

      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">My Service Orders</h2>

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
              <p className="text-sm text-gray-600 mt-1">Description: {service.description}</p>
              <p className="text-sm text-gray-800 font-semibold mt-1">Price: Rs.{service.price}</p>
              <p className="text-sm mt-2">
                Status:{" "}
                <span
                  className={`font-medium ${
                    service.status === 'Available'
                      ? 'text-green-600'
                      : service.status === 'Unavailable'
                      ? 'text-yellow-600'
                      : 'text-gray-600'
                  }`}
                >
                  {service.status}
                </span>
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-4 text-center text-xl text-gray-500">
            You have not created any service orders yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyServices;
