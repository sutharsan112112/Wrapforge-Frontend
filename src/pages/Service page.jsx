import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from './cartContext'; // ✅ Correctly import the context

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const { addToCart } = useCart(); // ✅ Correctly use the hook

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/service');
        setServices(res.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  const handleShowDetails = (service) => {
    setSelectedService(service);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
  };

  const handleAddToCart = (service) => {
    console.log('Added to cart:', service.title);
    // You can add logic to save to cart context / localStorage / API
    alert(`"${service.title}" added to cart`);
  };

  const handleBuyNow = (service) => {
    console.log('Buy Now clicked:', service.title);
    // Redirect to checkout or payment page
    alert(`Redirecting to checkout for "${service.title}"`);
  };

  // Just replace the entire existing return part
return (
  <div className="py-16 px-4 bg-white mx-4 md:mx-20 my-10 rounded-xl">
    <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Our Services</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      {services.length > 0 ? (
        services.map((service) => (
          <div key={service._id} className="bg-gray-50 rounded-xl shadow-md p-4 flex flex-col justify-between">
            <img
              src={service.image}
              alt={service.title}
              className="h-40 w-full object-cover rounded-md"
            />
            <h2 className={`mt-4 font-bold text-lg ${service.status === 'Available' ? 'text-green-600' : 'text-black'}`}>
              {service.title}
            </h2>
            <h3 className="mt-2 font-semibold text-sm text-gray-700">
              {service.description.slice(0, 60)}...
            </h3>
            <h3 className="mt-2 font-semibold text-sm text-gray-700">
             Price: Rs. {service.price}
            </h3>
            <h3 className={`mt-2 text-sm ${service.status === 'Available' ? 'text-green-600 font-semibold' : 'text-black'}`}>
              {service.status}
            </h3>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => addToCart(service)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold py-1.5 px-3 rounded-md transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() => handleBuyNow(service)}
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-1.5 px-3 rounded-md transition"
              >
                Buy Now
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

    {/* Common See More Button */}
    {services.length > 0 && (
      <div className="text-center mt-10">
        <button
          onClick={() => setSelectedService(services[0])} // Example: First service for now
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition"
        >
          See More
        </button>
      </div>
    )}

    {/* Modal */}
    {selectedService && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
          <button
            onClick={handleCloseModal}
            className="absolute top-3 right-4 text-xl font-bold text-gray-500 hover:text-red-600"
          >
            ×
          </button>
          <img src={selectedService.image} alt={selectedService.title} className="w-full h-48 object-cover rounded" />
          <h2 className="text-xl font-bold mt-4">{selectedService.title}</h2>
          <p className="mt-2 text-gray-700">{selectedService.description}</p>
          <p className={`mt-2 font-semibold ${selectedService.status === 'Available' ? 'text-green-600' : 'text-red-500'}`}>
            {selectedService.status}
          </p>
        </div>
      </div>
    )}
  </div>
);
}
export default ServicesSection;
