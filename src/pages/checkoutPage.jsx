import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './cartContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');

  // ✅ Get token & user from localStorage
  const token = localStorage.getItem('token');
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

  // ✅ Prefill name & email
  useEffect(() => {
    if (storedUser?.name || storedUser?.email) {
      setShippingDetails(prev => ({
        ...prev,
        fullName: storedUser.name || '',
        email: storedUser.email || ''
      }));
    }
  }, []);

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!token) {
      toast.warn('Please login to continue checkout!');
      navigate('/login');
    }
  }, [token, navigate]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleChange = (e) => {
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    if (!token) {
      toast.error('Token missing. Please login again.');
      navigate('/login');
      return;
    }

    console.log('🔑 Token before request:', token);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          serviceId: item._id,
          title: item.title,
          image: item.image,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: calculateTotal(),
        paymentMethod,
        shippingDetails
      };

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 201) {
        toast.success('✅ Order placed successfully!');
        clearCart();
        navigate('/userprofile'); // Redirect to user profile or orders page
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order failed');
      console.error('❌ Checkout Error:', error);
    }
  };

  return (
    <div className="py-16 px-4 mx-4 md:mx-20 my-10 bg-white rounded-xl shadow-lg">

      {/* Header with Back Button */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate(-1)} // ✅ now works
          className="flex items-center bg-yellow-400 hover:bg-orange-400 text-black px-4 py-2 rounded-md font-semibold"
        >
          <ArrowLeft className="mr-2" size={18} />
          Back
        </button>
      </div>

      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">🛍 Checkout</h2>

      <form onSubmit={handleCheckout} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Details */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Shipping Details</h3>
          {Object.keys(shippingDetails).map((field) => (
            <input
              key={field}
              type={field === 'email' ? 'email' : 'text'}
              name={field}
              placeholder={field.replace(/([A-Z])/g, ' $1')}
              value={shippingDetails[field]}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
              required
            />
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-4 bg-gray-50 p-6 rounded-md shadow-inner">
          <h3 className="text-xl font-semibold text-gray-800">🧾 Order Summary</h3>
          <ul className="divide-y">
            {cartItems.map((item) => (
              <li key={item._id} className="flex justify-between py-2">
                <span>{item.title} x {item.quantity}</span>
                <span>Rs. {item.price * item.quantity}</span>
              </li>
            ))}
          </ul>

          <div className="flex justify-between text-lg font-semibold text-gray-700 mt-4">
            <span>Total:</span>
            <span>Rs. {calculateTotal()}</span>
          </div>

          {/* Payment Method */}
          <div className="mt-4">
            <h4 className="font-medium mb-2">Select Payment Method</h4>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>
            <label className="flex items-center gap-2 mt-2">
              <input
                type="radio"
                name="paymentMethod"
                value="Card"
                checked={paymentMethod === 'Card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                disabled
              />
              Card Payment (Coming Soon)
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md"
          >
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
