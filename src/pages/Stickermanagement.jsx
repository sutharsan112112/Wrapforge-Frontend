import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import EditSticker from './EditSticker'; // 🔁 Make sure this path is correct

const StickerManagement = () => {
  const [stickers, setStickers] = useState([]);
  const [editStickerId, setEditStickerId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const navigate = useNavigate();

  // Fetch all stickers
  const fetchStickers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/sticker`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStickers(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchStickers();
  }, []);

  // Delete handler
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this sticker?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/sticker/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStickers((prev) => prev.filter((s) => s._id !== id));
      alert("Sticker deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Delete failed. Please try again.");
    }
  };

  // Open modal
  const handleEditClick = (id) => {
    setEditStickerId(id);
    setShowEditModal(true);
  };

  return (
    <div className="py-16 px-4 bg-white mx-4 md:mx-20 my-10 rounded-xl relative">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center bg-yellow-400 hover:bg-orange-400 text-black px-4 py-2 rounded-md font-semibold"
      >
        <ArrowLeft className="mr-2" size={18} />
        Back
      </button>

      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">All Stickers</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {stickers.map((sticker) => (
          <div key={sticker._id} className="bg-gray-50 rounded-xl shadow-md p-4">
            <img
              src={`${import.meta.env.VITE_API_URL}/uploads/${sticker.image}`}
              alt={sticker.name}
              className="w-full h-48 object-contain rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold">{sticker.name}</h3>
            <p className="text-gray-600 text-sm mt-2">Type: {sticker.design}</p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEditClick(sticker._id)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(sticker._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 👇 Modal rendering */}
      {showEditModal && (
        <EditSticker
          id={editStickerId}
          onClose={() => setShowEditModal(false)}
          onSuccess={fetchStickers}
        />
      )}
    </div>
  );
};

export default StickerManagement;