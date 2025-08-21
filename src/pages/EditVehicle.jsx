import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const VehicleEdit = ({ vehicle, onClose, onUpdated }) => {
  const [updatedData, setUpdatedData] = useState({
    name: "",
    model: "",
    year: "",
    status: "",
    size: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (vehicle) {
      setUpdatedData({
        name: vehicle.name || "",
        model: vehicle.model || "",
        year: vehicle.year || "",
        status: vehicle.status || "",
        size: vehicle.size || "",
      });
      setPreviewUrl(vehicle.image || "");
    }
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setImageFile(files[0]);
      setPreviewUrl(URL.createObjectURL(files[0]));
    } else {
      setUpdatedData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      Object.entries(updatedData).forEach(([key, val]) =>
        formData.append(key, val)
      );
      if (imageFile) formData.append("image", imageFile);

      await axios.put(
        `${import.meta.env.VITE_API_URL}/vehicles/${vehicle._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Vehicle updated successfully!");
      onUpdated(); // refresh vehicle list
      onClose();
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update vehicle");
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

        <h2 className="text-2xl font-bold mb-4 text-center">Edit Vehicle</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="name">Vehicle Name *</label>
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
            <label className="text-sm font-medium" htmlFor="model">Model *</label>
            <input
              type="text"
              id="model"
              name="model"
              value={updatedData.model}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="year">Year *</label>
            <input
              type="number"
              id="year"
              name="year"
              value={updatedData.year}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="status">Status</label>
            <input
              type="text"
              id="status"
              name="status"
              value={updatedData.status}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="size">Size</label>
            <input
              type="text"
              id="size"
              name="size"
              value={updatedData.size}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="image">Replace Image (optional)</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*,.glb,.gltf"
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-md p-2"
            />
          </div>

          {previewUrl && (
            <div className="flex justify-center mt-3">
              {previewUrl.endsWith(".glb") || previewUrl.endsWith(".gltf") ? (
                <model-viewer
                  src={previewUrl}
                  alt="Vehicle Preview"
                  auto-rotate
                  camera-controls
                  style={{ height: "150px", width: "100%" }}
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="Vehicle Preview"
                  className="h-32 border rounded-md object-contain shadow"
                />
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 mt-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700"
          >
            Update Vehicle
          </button>
        </form>
      </div>
    </div>
  );
};

export default VehicleEdit;