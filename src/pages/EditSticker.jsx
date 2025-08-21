import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';

const EditSticker = ({ id, onClose = () => {}, onSuccess = () => {} }) => {
  const [updatedData, setUpdatedData] = useState({
    name: '',
    design: '',
    file: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!id) {
      toast.error('Invalid sticker ID.');
      onClose();
      return;
    }

    const fetchSticker = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/sticker/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUpdatedData({
          name: res.data.name,
          design: res.data.design,
          file: null,
        });

        setPreviewUrl(`${import.meta.env.VITE_API_URL}/uploads/${res.data.image}`);
      } catch (err) {
        console.error('Sticker fetch failed:', err);
        toast.error('Failed to fetch sticker.');
        onClose();
      }
    };

    fetchSticker();
  }, [id, onClose]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      const file = files?.[0];
      setUpdatedData((prev) => ({ ...prev, file }));
      if (file) setPreviewUrl(URL.createObjectURL(file));
    } else {
      setUpdatedData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', updatedData.name);
    formData.append('design', updatedData.design);
    if (updatedData.file) {
      formData.append('image', updatedData.file);
    }

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/sticker/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Sticker updated successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update sticker.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="relative w-full max-w-md bg-white p-6 rounded-xl shadow-xl border">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Edit Sticker</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="name">Sticker Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={updatedData.name}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="design">Design *</label>
            <input
              type="text"
              id="design"
              name="design"
              value={updatedData.design}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="image">Replace Image (optional)</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-md p-2"
            />
          </div>

          {previewUrl && (
            <div className="flex justify-center mt-3">
              <img
                src={previewUrl}
                alt="Sticker Preview"
                className="h-32 border rounded-md object-contain shadow"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 mt-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700"
          >
            Update Sticker
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSticker;