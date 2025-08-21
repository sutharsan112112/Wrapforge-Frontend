import React, { useState, useEffect } from 'react';
import {
  Car, Users, Box, Wrench,
  Tag, PlusCircle, DollarSign, X, ClipboardList, UserPlus, LayoutDashboard
} from 'lucide-react';
import { useNavigate, NavLink } from 'react-router-dom';
import AddStickers from '../pages/Addstickers';
import AddVehicle from '../pages/AddVehicles';
import AddService from '../pages/AddService';

// ✅ SidebarLink component added here
const SidebarLink = ({ icon, label, to }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 p-2 rounded-md cursor-pointer ${
          isActive ? 'bg-indigo-100 font-semibold' : 'hover:bg-gray-100'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [showAddStickerModal, setShowAddStickerModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);

  const recentServices = [
    { vehicle: "Toyota Camry", plate: "ABC-123", customer: "John Smith", service: "Oil Change", status: "Completed", date: "2023-12-01" },
    { vehicle: "Honda Civic", plate: "XYZ-789", customer: "Sarah Johnson", service: "Brake Repair", status: "In Progress", date: "2023-12-02" },
    { vehicle: "Ford F-150", plate: "DEF-456", customer: "Mike Wilson", service: "Engine Diagnostic", status: "Pending", date: "2023-12-03" },
  ];


  useEffect(() => {
    if (showAddStickerModal || showAddVehicleModal || showAddServiceModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowAddStickerModal(false);
        setShowAddVehicleModal(false);
        setShowAddServiceModal(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [showAddStickerModal, showAddVehicleModal, showAddServiceModal]);

  return (
    <div className="flex mt-20 min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-yellow-300 shadow-md p-4 hidden md:block">
        <h2 className="text-2xl font-bold mb-2">Admin Panel</h2>
        <p className="text-xs text-gray-500 mb-4">Vehicle Service Management</p>
        <nav className="space-y-2">
          <button
        onClick={() => navigate('/admin')}
        className="w-full flex items-center gap-3 p-2 rounded-md transition text-sm bg-gray-100 text-black font-medium"
      >
        <LayoutDashboard size={20} />
        Dashboard
      </button>

      <button
        onClick={() => navigate('/vehiclesmanagement')}
        className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-gray-100 transition "
      >
        <Car size={20} />
        <span>Vehiclesmanagement</span>
      </button>

      <button
        onClick={() => navigate('/usermanagement')}
        className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-gray-100 transition"
      >
        <UserPlus size={20} />
        <span>Usermanagement</span>
      </button>

      <button
        onClick={() => navigate('/stickermanagement')}
        className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-gray-100 transition"
      >
        <Tag size={20} />
        <span>Stickermanagement</span>
      </button>

      <button
        onClick={() => navigate('/servicemanagement')}
        className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-gray-100 transition"
      >
        <ClipboardList size={20} />
        <span>Servicemanagement</span>
      </button>

      <button
        onClick={() => navigate('/contact-message')}
        className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-gray-100 transition"
      >
        <Box size={20} />
        <span>Contact Message</span>
      </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back! Here's what's happening with your business today.</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Active Vehicles" value="124" growth="12%" icon={<Car size={20} />} color="bg-indigo-200" />
          <StatCard title="Customers" value="89" growth="8%" icon={<Users size={20} />} color="bg-green-200" />
          <StatCard title="Pending Services" value="34" growth="-3%" icon={<Wrench size={20} />} color="bg-yellow-200" />
          <StatCard title="Monthly Revenue" value="$45,230" growth="15%" icon={<DollarSign size={20} />} color="bg-purple-200" />
        </div>

        {/* Recent Services Table */}
        <div className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-lg font-semibold mb-2">Recent Services</h2>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="py-2">VEHICLE</th>
                <th>LICENSE PLATE</th>
                <th>CUSTOMER</th>
                <th>SERVICE</th>
                <th>STATUS</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-md">
              {recentServices.map((service, index) => (
                <ServiceRow key={index} {...service} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-6">
          <ActionButton
            icon={<PlusCircle size={16} />}
            label="Add Vehicle"
            color="bg-yellow-400 hover:bg-orange-500"
            onClick={() => setShowAddVehicleModal(true)}
          />
          <ActionButton
            icon={<Tag size={16} />}
            label="Add Stickers"
            color="bg-yellow-400 hover:bg-orange-500"
            onClick={() => setShowAddStickerModal(true)}
          />
          <ActionButton 
            icon={<ClipboardList size={16} />}
            label="Add Service"
            color="bg-yellow-400 hover:bg-orange-500"
            onClick={() => setShowAddServiceModal(true)}
          />
        </div>

        {/* Add Stickers Modal */}
        {showAddStickerModal && (
          <Modal onClose={() => setShowAddStickerModal(false)}>
            <AddStickers />
          </Modal>
        )}

        {/* Add Service Modal */}
        {showAddServiceModal && (
          <Modal onClose={() => setShowAddServiceModal(false)}>
            <AddService />
          </Modal>
        )}

        {/* Add Vehicle Modal */}
        {showAddVehicleModal && (
          <Modal onClose={() => setShowAddVehicleModal(false)}>
            <AddVehicle />
          </Modal>
        )}

        
      </main>
    </div>
  );
};

// Modal Wrapper
const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 z-50 bg-opacity-30 backdrop-blur-sm bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
    <div className="bg-white h-[80vh] rounded-xl max-w-xl w-full relative shadow-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
      <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-red-500" aria-label="Close modal">
        <X size={20} />
      </button>
      <div className="p-6 h-full">{children}</div>
    </div>
  </div>
);

// Stat Card Component
const StatCard = ({ title, value, growth, color, icon }) => (
  <div className={`p-4 ${color} rounded-md shadow-md flex items-center justify-between`}>
    <div>
      <p className="text-xs text-gray-600 mb-1">{title}</p>
      <h3 className="text-xl font-bold">{value}</h3>
      <p className={`text-sm ${parseFloat(growth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {growth.startsWith('-') ? '↓' : '↑'} {growth.replace('-', '')}
      </p>
    </div>
    <div className="text-gray-700">{icon}</div>
  </div>
);

// Table Row Component
const ServiceRow = ({ vehicle, plate, customer, service, status, date }) => {
  const statusColor =
    status === 'Completed' ? 'bg-green-100 text-green-700'
    : status === 'In Progress' ? 'bg-yellow-100 text-yellow-700'
    : 'bg-gray-200 text-gray-700';

  return (
    <tr className="border-b hover:bg-gray-50 transition">
      <td className="py-2 font-medium">{vehicle}</td>
      <td>{plate}</td>
      <td>{customer}</td>
      <td>{service}</td>
      <td><span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>{status}</span></td>
      <td>{date}</td>
    </tr>
  );
};

// Action Button
const ActionButton = ({ icon, label, color, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-md text-black ${color} shadow-md hover:opacity-90 transition font-semibold`}
    type="button"
  >
    {icon}
    {label}
  </button>
);

export default AdminDashboard;
