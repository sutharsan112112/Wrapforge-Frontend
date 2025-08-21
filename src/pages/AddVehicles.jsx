import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddVehicle = ({ onUploadSuccess }) => {
  const [newVehicle, setNewVehicle] = useState({
    name: '',
    model: '',
    year: '',
    file: null,
  });

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', newVehicle.name);
    formData.append('model', newVehicle.model);
    formData.append('year', newVehicle.year);
    formData.append('image', newVehicle.file);

    try {
      const res = await fetch('http://localhost:5000/api/vehicles', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      toast.success('Vehicle uploaded successfully!');
      if (onUploadSuccess) onUploadSuccess(data);
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('Upload failed');
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setNewVehicle((prev) => ({
      ...prev,
      [name]: name === 'file' ? files[0] : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white bg-gray-100 px-4 py-10 text-gray-800 mt-20">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">Add New Vehicle</h1>
        <p className="text-gray-500 text-sm mt-1">Upload your vehicle</p>
      </div>
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md border">
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Vehicle Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Yamaha"
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Model</label>
            <input
              type="text"
              name="model"
              placeholder="e.g. R15"
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Year</label>
            <input
              type="number"
              name="year"
              placeholder="e.g. 2023"
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Image / .glb</label>
            <input
              type="file"
              name="file"
              accept=".jpg,.jpeg,.png,.glb"
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-2 bg-yellow-500 text-black rounded-md font-semibold flex items-center justify-center gap-2 hover:bg-orange-500"
          >
            Upload Vehicle
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVehicle;