import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@google/model-viewer';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe("pk_test_51RaqQmQT1p2ujxyWRhPBEbbz4gAg2wj0K2p6s0RHXI4IhA3xroHMqNGuONS1hUQtCx8fFaZHdR3emfZhkixhXi4o00eNI4EvqY");

const VehicleStickerViewer = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [stickers, setStickers] = useState([]);
  const [appliedStickers, setAppliedStickers] = useState([]);
  const [clientSecret, setClientSecret] = useState(null);
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  // ✅ Fetch vehicle
  useEffect(() => {
    fetch(`http://localhost:5000/api/vehicles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const path = data.image?.startsWith('/uploads')
          ? `http://localhost:5000${data.image}`
          : data.image;
        setVehicle(path);
      })
      .catch((err) => console.error('Vehicle fetch error:', err));
  }, [id]);

  // ✅ Fetch stickers
  useEffect(() => {
    fetch('http://localhost:5000/api/sticker')
      .then((res) => res.json())
      .then((data) => setStickers(data))
      .catch((err) => console.error('Sticker fetch error:', err));
  }, []);

  // ✅ Handle sticker drop
  const handleDrop = (e) => {
    e.preventDefault();
    const stickerSrc = e.dataTransfer.getData('sticker');
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    setAppliedStickers((prev) => [...prev, { src: stickerSrc, x, y }]);
  };

// ✅ Save customization & create payment intent
const handleSave = async () => {
  if (appliedStickers.length === 0) {
    toast.warn('No stickers applied to save!');
    return;
  }

  const token = localStorage.getItem('token'); // 🔹 Get token from localStorage

  if (!token) {
    toast.error('Please login to save customization');
    return;
  }

  try {
    // 1️⃣ Save customization
    const res = await fetch('http://localhost:5000/api/customizations', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`  // 🔹 Send token
      },
      body: JSON.stringify({ vehicleId: id, stickers: appliedStickers }),
    });

    if (!res.ok) throw new Error('Save failed');

    const savedData = await res.json();

    // 2️⃣ Create Checkout Session
    const paymentRes = await fetch('http://localhost:5000/api/payment/create-checkout-session', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ customizationId: savedData._id, amount: 10 }),
    });

    const data = await paymentRes.json();
    console.log('Payment API Response:', data); // 🔹 Debug in console

    if (!data.clientSecret) {
      toast.error('Payment setup failed. Check backend logs.');
      return;
    }

    setClientSecret(data.clientSecret); // Show payment form
    toast.info('Customization saved! Enter card to pay.');
  } catch (err) {
    toast.error(`Error saving: ${err.message}`);
  }
};

// ✅ Handle Stripe Payment
const handlePayment = async (e) => {
  e.preventDefault();

  if (!stripe || !elements) return;

  const cardElement = elements.getElement(CardElement);

  const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: cardElement,
    },
  });

  if (error) {
    toast.error(`Payment failed: ${error.message}`);
  } else if (paymentIntent.status === 'succeeded') {
    toast.success('✅ Payment Successful! Your customization is saved.');
    setAppliedStickers([]);
    setClientSecret(null); // Hide form
  }
};

return (
  <div className="min-h-screen bg-gray-100 p-6 mt-20">
    <ToastContainer position="top-center" />

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center bg-yellow-400 hover:bg-orange-400 text-black px-4 py-2 rounded-md font-semibold"
        >
          <ArrowLeft className="mr-2" size={18} />
          Back
        </button>

        <h2 className="text-2xl font-bold">Sticker Customization</h2>

        <button
          onClick={handleSave}
          className="flex items-center bg-yellow-400 hover:bg-orange-400 text-black px-4 py-2 rounded-md font-semibold"
        >
          <Save size={20} className="mr-2" />
          Save & Pay
        </button>
      </div>

      {/* Vehicle Viewer */}
      <div
        className="relative w-full max-w-5xl h-[600px] mx-auto border bg-white rounded shadow"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {vehicle ? (
          vehicle.endsWith('.glb') ? (
            <model-viewer
              src={vehicle}
              auto-rotate
              camera-controls
              style={{ width: '100%', height: '100%' }}
              background-color="#fff"
            ></model-viewer>
          ) : (
            <img
              src={vehicle}
              alt="Vehicle"
              className="w-full h-full object-contain"
            />
          )
        ) : (
          <p className="text-center text-gray-600 mt-32 text-xl">
            Loading vehicle...
          </p>
        )}

        {/* Applied Stickers */}
        {appliedStickers.map((s, i) => (
          <img
            key={i}
            src={s.src}
            alt={`Sticker ${i}`}
            className="absolute w-24 h-24 object-contain pointer-events-none"
            style={{ top: `${s.y}px`, left: `${s.x}px` }}
          />
        ))}
      </div>

      {/* Sticker Selector */}
      <div className="mt-6 flex justify-center flex-wrap gap-4">
        {stickers.map((sticker, idx) => {
          const stickerUrl = sticker.imageUrl.startsWith('http')
            ? sticker.imageUrl
            : `http://localhost:5000${sticker.imageUrl}`;

          return (
            <img
              key={idx}
              src={stickerUrl}
              alt={sticker.name}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('sticker', stickerUrl)}
              onError={(e) => (e.target.src = '/fallback.png')}
              className="w-20 h-20 object-contain border rounded shadow cursor-move bg-white"
            />
          );
        })}
      </div>

      {/* Clear Button */}
      <div className="text-center mt-4">
        <button
          onClick={() => setAppliedStickers([])}
          className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
        >
          Clear Stickers
        </button>
      </div>

      {/* Stripe Payment Form */}
      {clientSecret && (
        <form onSubmit={handlePayment} className="max-w-md mx-auto mt-6 p-4 bg-white rounded shadow">
          <CardElement className="border p-3 rounded" />
          <button
            type="submit"
            className="mt-4 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            disabled={!stripe}
          >
            Pay Now
          </button>
        </form>
      )}
    </div>
  );
};

export default function Wrapper() {
  return (
    <Elements stripe={stripePromise}>
      <VehicleStickerViewer />
    </Elements>
  );
};