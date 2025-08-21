import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddStickers = () => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [stickerData, setStickerData] = useState({
    name: '',
    design: '',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setStickerData((prev) => ({ ...prev, file }));
      if (file) {
        setPreviewUrl(URL.createObjectURL(file));
      }
    } else {
      setStickerData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stickerData.file) {
      toast.warning('Please select a sticker image file.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error("Login required to upload.");
        return;
      }

      const formData = new FormData();
      formData.append('name', stickerData.name);
      formData.append('design', stickerData.design);
      formData.append('image', stickerData.file); // multer field

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/sticker`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Sticker uploaded successfully!');
      console.log('Upload success:', res.data);

      setStickerData({ name: '', design: '', file: null });
      setPreviewUrl(null);
    } catch (error) {
      console.error('Upload error:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Unauthorized: Admin or Partner access only.");
      } else {
        toast.error(error.response?.data?.message || 'Failed to upload sticker');
      }
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 px-4 py-10 text-gray-800 mt-20">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">Add New Sticker</h1>
        <p className="text-gray-500 text-sm mt-1">Upload your sticker design</p>
      </div>

      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md border">
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div>
            <label className="text-sm font-medium" htmlFor="name">Sticker Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={stickerData.name}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-md p-2"
              placeholder="Flame Decal"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="design">Design *</label>
            <input
              type="text"
              id="design"
              name="design"
              value={stickerData.design}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-md p-2"
              placeholder="Sport / Classic"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="file">Sticker File (Image only) *</label>
            <input
              type="file"
              id="image"
              name="image"
              accept=".jpg,.jpeg,.png"
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-md p-2"
              required
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
            className="w-full py-2 mt-2 bg-yellow-500 text-black rounded-md font-semibold flex items-center justify-center gap-2 hover:bg-orange-500"
          >
            <PlusCircle className="w-5 h-5" /> Upload Sticker
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStickers;