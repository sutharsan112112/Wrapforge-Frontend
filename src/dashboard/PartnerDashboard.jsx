import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ FIXED: import useNavigate
import {
  LayoutDashboard, Car, Wrench, Calendar, Tag,
  Bell, Search, UserPlus, X, ClipboardList, History
} from 'lucide-react';
import AddStickers from '../pages/Addstickers';
import AddService from '../pages/AddService';

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const [showAddStickerModal, setShowAddStickerModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);

  useEffect(() => {
    if (showAddStickerModal ) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    const handleEsc = (e) => {
      if (e.key === 'Escape') setShowAddStickerModal(false);
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [showAddStickerModal]);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 mt-20 relative">
      {/* Sidebar */}
      <aside className="w-64 bg-yellow-300 shadow-md p-4 hidden md:block" aria-label="Sidebar Navigation">
        <h2 className="text-2xl font-bold mb-1">Partner Panel</h2>
        <p className="text-xs text-gray-500 mb-4">Welcome to your dashboard</p>
        <nav className="space-y-2">
         <button
      onClick={() => navigate('/partnerdashboard')}
      className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-gray-100 transition bg-gray-100 text-black"
    >
      <LayoutDashboard size={20} />
      Dashboard
    </button>
    
<button
  onClick={() => navigate('/my-services')}
  className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-gray-100 transition"
>
  <Car size={20} />
  Get Service Order
</button>


    <button
      onClick={() => navigate('/stickermanagement')}
      className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-gray-100 transition"
    >
      <Tag size={20} />
      <span>My Stickers</span>
    </button>

    <button
      onClick={() => navigate('/servicemanagement')}
      className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-gray-100 transition"
    >
      <Wrench size={20} />
     My Services
    </button>

    {/* <button
      onClick={() => navigate('/schedule')}
      className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-gray-100 transition"
    >
      <Calendar size={20} />
      Schedule
    </button>

    <button
      onClick={() => navigate('/history')}
      className="flex item-center gap-2 w-full p-2 rounded-md hover:bg-gray-100 transition"
    >
      <History className="w-5 h-5" />
      History
    </button> */}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm flex justify-between items-center px-6 py-3">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
            <button
              className="relative p-2 rounded-full hover:bg-gray-100"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="px-6 pb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3">Recent Service Records</h2>
            <table className="w-full text-sm border border-gray-200 border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 border">Vehicle</th>
                  <th className="px-4 py-3 border">Service</th>
                  <th className="px-4 py-3 border">Date</th>
                  <th className="px-4 py-3 border">Status</th>
                </tr>
              </thead>
              <tbody>
                <ServiceRow vehicle="Honda City" service="Oil Change" date="2025-06-20" status="Completed" />
                <ServiceRow vehicle="Suzuki Alto" service="Tire Rotation" date="2025-06-18" status="In Progress" />
                <ServiceRow vehicle="Toyota Prius" service="Engine Check" date="2025-06-15" status="Pending" />
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-wrap gap-4 mt-6 px-6">
          <ActionButton
            icon={<UserPlus size={16} />}
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
      </main>

   {/* Sticker Modal */}
{showAddStickerModal && (
  <div
    className="fixed inset-0 z-50 bg-opacity-30 backdrop-blur-sm bg-black/50 flex items-center justify-center p-4"
    onClick={() => setShowAddStickerModal(false)}
  >
    <div
      className="bg-white h-[80vh] max-w-xl w-full rounded-xl relative shadow-lg overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => setShowAddStickerModal(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        aria-label="Close modal"
      >
        <X size={20} />
      </button>
      <div className="p-6 overflow-auto max-h-[80vh]">
        <AddStickers />
      </div>
    </div>
  </div>
)}

{/* Service Modal */}
{showAddServiceModal && (
  <div
    className="fixed inset-0 z-50 bg-opacity-30 backdrop-blur-sm bg-black/50 flex items-center justify-center p-4"
    onClick={() => setShowAddServiceModal(false)}
  >
    <div
      className="bg-white h-[80vh] max-w-xl w-full rounded-xl relative shadow-lg overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => setShowAddServiceModal(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        aria-label="Close modal"
      >
        <X size={20} />
      </button>
      <div className="p-6 overflow-auto max-h-[80vh]">
        <AddService />
      </div>
    </div>
  </div>
)}
  </div>
  );
};

// Sidebar Item
const SidebarItem = ({ icon, label, active }) => (
  <button
    className={`w-full flex items-center gap-3 p-2 rounded-md transition text-sm
      ${active ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
    aria-label={label}
  >
    {icon}
    <span>{label}</span>
  </button>
);

// Service Row
const ServiceRow = ({ vehicle, service, date, status }) => {
  const statusColor =
    status === 'Completed'
      ? 'bg-green-100 text-green-700'
      : status === 'In Progress'
      ? 'bg-yellow-100 text-yellow-700'
      : 'bg-gray-200 text-gray-700';

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-2 border">{vehicle}</td>
      <td className="px-4 py-2 border">{service}</td>
      <td className="px-4 py-2 border">{date}</td>
      <td className="px-4 py-2 border">
        <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>{status}</span>
      </td>
    </tr>
  );
};

// Action Button
const ActionButton = ({ icon, label, color, onClick }) => (
  <button
    onClick={onClick}
    className={`${color} text-black rounded-md font-semibold flex items-center justify-center gap-2 py-2 px-4 shadow-md`}
  >
    {icon}
    {label}
  </button>
);

export default PartnerDashboard;
