import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddService = () => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [serviceData, setServiceData] = useState({
    title: '',
    description: '',
    price: '',
    file: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      const file = files[0];
      setServiceData((prev) => ({ ...prev, file }));

      if (file) {
        setPreviewUrl(URL.createObjectURL(file));
      }
    } else {
      setServiceData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!serviceData.file) {
      toast.warning('Please select an image file.');
      return;
    }

    if (!serviceData.price || isNaN(serviceData.price) || Number(serviceData.price) <= 0) {
      toast.warning('Please enter a valid price.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('❌ Please log in to upload a service.');
      return;
    }

    const formData = new FormData();
    formData.append('title', serviceData.title);
    formData.append('description', serviceData.description);
    formData.append('price', serviceData.price);
    formData.append('image', serviceData.file); // must match backend multer key

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/service`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200 || res.status === 201) {
        toast.success('✅ Service uploaded successfully!');
        setServiceData({ title: '', description: '', price: '', file: null });
        setPreviewUrl(null);
        navigate('/partnerdashboard'); // optional: redirect after upload
      } else {
        toast.error('Service upload failed.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      
      if (err.response) {
        toast.error(err.response.data.message || '❌ Upload failed. Try again later.');
      } else if (err.request) {
        toast.error('❌ No response from the server. Please try again later.');
      } else {
        toast.error(`Error: ${err.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 px-4 py-10 text-gray-800 mt-20">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">Add New Service</h1>
        <p className="text-sm text-gray-500 mt-1">Upload a custom service with image, details and price</p>
      </div>

      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md border">
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div>
            <label className="text-sm font-medium" htmlFor="title">Service Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={serviceData.title}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-md p-2"
              placeholder="Eg: Oil Change"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={serviceData.description}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-md p-2"
              placeholder="Eg: Full service and filter change"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="price">Price (Rs.)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={serviceData.price}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-md p-2"
              placeholder="Eg: 1500"
              min="1"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="image">Upload Image (jpg/png)</label>
            <input
              type="file"
              id="image"
              name="image" // must match multer key
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
                alt="Preview"
                className="h-40 border rounded-md object-contain shadow"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 mt-2 bg-yellow-500 text-black rounded-md font-semibold flex items-center justify-center gap-2 hover:bg-orange-500"
          >
            <PlusCircle className="w-5 h-5" /> Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddService;
