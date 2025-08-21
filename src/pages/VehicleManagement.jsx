// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { ArrowLeft, Trash2, Pencil } from 'lucide-react';
// import { toast } from 'react-toastify';

// const VehiclesManagement = () => {
//   const [vehicles, setVehicles] = useState([]);
//   const navigate = useNavigate();

//   const fetchVehicles = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get(`${import.meta.env.VITE_API_URL}/vehicles`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setVehicles(res.data);
//     } catch (err) {
//       console.error('Fetch error:', err);
//       toast.error('Failed to load vehicles');
//     }
//   };

//   useEffect(() => {
//     fetchVehicles();
//   }, []);

//   const is3DModel = (url) => url.endsWith('.glb') || url.endsWith('.gltf');

//   // ✅ Delete vehicle
//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this vehicle?')) return;

//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`${import.meta.env.VITE_API_URL}/vehicles/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success('Vehicle deleted successfully!');
//       setVehicles((prev) => prev.filter((v) => v._id !== id)); // remove from UI
//     } catch (err) {
//       console.error('Delete error:', err);
//       toast.error(err.response?.data?.message || 'Failed to delete vehicle');
//     }
//   };

//   return (
//     <div className="py-16 px-4 bg-white mx-4 md:mx-20 my-10 rounded-xl">
//       {/* 🔙 Back Button */}
//       <button
//         onClick={() => navigate(-1)}
//         className="mb-6 flex items-center bg-yellow-400 hover:bg-orange-400 text-black px-4 py-2 rounded-md font-semibold"
//       >
//         <ArrowLeft className="mr-2" size={18} />
//         Back
//       </button>

//       <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">All Vehicles</h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//         {vehicles.length > 0 ? (
//           vehicles.map((vehicle) => (
//             <div key={vehicle._id} className="bg-gray-50 rounded-xl shadow-md p-4 relative">
//               {is3DModel(vehicle.image) ? (
//                 <model-viewer
//                   src={vehicle.image}
//                   alt={vehicle.name}
//                   auto-rotate
//                   camera-controls={false}
//                   autoplay
//                   disable-pan
//                   disable-tap
//                   shadow-intensity="1"
//                   environment-image="neutral"
//                   style={{ width: '100%' }}
//                   min-camera-orbit="auto auto 2m"
//                   max-camera-orbit="auto auto 10m"
//                 />
//               ) : (
//                 <img
//                   src={vehicle.image || 'default-image-url'}
//                   alt={vehicle.name}
//                   className="w-full h-48 object-cover rounded-md mb-4"
//                 />
//               )}
//               <h3 className="text-lg font-semibold">{vehicle.name}</h3>
//               <p className="text-gray-600 text-sm mt-1">Model: {vehicle.model}</p>
//               <p className="text-gray-600 text-sm mt-1">Year: {vehicle.year}</p>
//               {vehicle.size && (
//                 <p className="text-gray-600 text-sm mt-1">Size: {vehicle.size}</p>
//               )}

//               {/* ✅ Update & Delete Buttons */}
//               <div className="flex justify-between mt-4">
//                 <button
//                   onClick={() => navigate(`/edit-vehicle/${vehicle._id}`)}
//                   className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
//                 >
//                   <Pencil size={16} className="mr-1" /> Update
//                 </button>
//                 <button
//                   onClick={() => handleDelete(vehicle._id)}
//                   className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
//                 >
//                   <Trash2 size={16} className="mr-1" /> Delete
//                 </button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="col-span-3 text-center text-xl text-gray-500">
//             No vehicles available yet.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VehiclesManagement;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Pencil, X } from 'lucide-react';
import { toast } from 'react-toastify';

const VehiclesManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null); // For editing
  const [updatedData, setUpdatedData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const navigate = useNavigate();

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/vehicles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Failed to load vehicles');
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const is3DModel = (url) => url.endsWith('.glb') || url.endsWith('.gltf');

  // ✅ Delete vehicle
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Vehicle deleted successfully!');
      setVehicles((prev) => prev.filter((v) => v._id !== id)); // remove from UI
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err.response?.data?.message || 'Failed to delete vehicle');
    }
  };

  // ✅ Open Edit Modal
  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setUpdatedData({
      name: vehicle.name || "",
      model: vehicle.model || "",
      year: vehicle.year || "",
    });
    setPreviewUrl(vehicle.image || "");
    setImageFile(null);
  };

  // ✅ Form Change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setImageFile(files[0]);
      setPreviewUrl(URL.createObjectURL(files[0]));
    } else {
      setUpdatedData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Submit Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    const token = localStorage.getItem("token");
    try {
      const formData = new FormData();
      Object.entries(updatedData).forEach(([key, val]) =>
        formData.append(key, val)
      );
      if (imageFile) formData.append("image", imageFile);

      await axios.put(
        `${API_URL}/vehicles/${selectedVehicle._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Vehicle updated successfully!");
      setSelectedVehicle(null);
      fetchVehicles();
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update vehicle");
    }
  };

  return (
    <div className="py-16 px-4 bg-white mx-4 md:mx-20 my-10 rounded-xl relative">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center bg-yellow-400 hover:bg-orange-400 text-black px-4 py-2 rounded-md font-semibold"
      >
        <ArrowLeft className="mr-2" size={18} />
        Back
      </button>

      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">All Vehicles</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {vehicles.length > 0 ? (
          vehicles.map((vehicle) => (
            <div key={vehicle._id} className="bg-gray-50 rounded-xl shadow-md p-4 relative">
              {is3DModel(vehicle.image) ? (
                <model-viewer
                  src={vehicle.image}
                  alt={vehicle.name}
                  auto-rotate
                  camera-controls={false}
                  autoplay
                  disable-pan
                  disable-tap
                  shadow-intensity="1"
                  environment-image="neutral"
                  style={{ width: '100%' }}
                  min-camera-orbit="auto auto 2m"
                  max-camera-orbit="auto auto 10m"
                />
              ) : (
                <img
                  src={vehicle.image || 'default-image-url'}
                  alt={vehicle.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <h3 className="text-lg font-semibold">{vehicle.name}</h3>
              <p className="text-gray-600 text-sm mt-1">Model: {vehicle.model}</p>
              <p className="text-gray-600 text-sm mt-1">Year: {vehicle.year}</p>


              {/* ✅ Update & Delete Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEdit(vehicle)}
                  className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                >
                  <Pencil size={16} className="mr-1" /> Update
                </button>
                <button
                  onClick={() => handleDelete(vehicle._id)}
                  className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                >
                  <Trash2 size={16} className="mr-1" /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-xl text-gray-500">
            No vehicles available yet.
          </div>
        )}
      </div>

      {/* ✅ Edit Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="relative w-full max-w-md bg-white p-6 rounded-xl shadow-xl border">
            <button
              onClick={() => setSelectedVehicle(null)}
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
                  name="year"
                  value={updatedData.year}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium" htmlFor="image">Replace Image (optional)</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*,.glb,.gltf"
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded-md p-2"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 mt-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700"
              >
                Update Vehicle
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclesManagement;
