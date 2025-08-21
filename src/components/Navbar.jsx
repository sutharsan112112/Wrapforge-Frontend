import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import LoginPage from '../auth/Login page.jsx';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useCart } from '../pages/cartContext.jsx'; // adjust the path

function Navbar() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
const { cartItems } = useCart();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <>
      {/* Navbar */}
      <nav className="shadow-md flex items-center justify-between fixed top-0 left-0 w-full bg-white z-50 px-6">
        {/* Logo */}
        <div className="logo items-center flex">
          <img src="/src/assets/images/WrapForge logo.png" alt="Logo" className="h-20 w-20" />
          <h1 className="text-2xl font-bold text-gray-800">WrapForge</h1>
        </div>

        {/* Links + Auth */}
        <div className="flex items-center space-x-4 relative">
          <Link to="/" className="cursor-pointer hover:text-orange-500 px-5 py-5 text-xl">Home</Link>
          <Link to="/vehicles" className="cursor-pointer hover:text-orange-500 px-5 py-5 text-xl">Vehicle</Link>
          <ScrollLink to="service" smooth duration={500} className="cursor-pointer hover:text-orange-500 px-5 py-5 text-xl">Service</ScrollLink>
<Link to="/cart" className="relative inline-block text-sm font-semibold text-blue-600 hover:underline">
  🛒 Cart
  {cartItems.length > 0 && (
    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
      {cartItems.length}
    </span>
  )}
</Link>

          {!user ? (
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-yellow-500 text-white px-6 py-3 rounded hover:bg-orange-500 transition-colors"
            >
              Login
            </button>
          ) : (
            <div className="relative">
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 cursor-pointer bg-yellow-500 px-4 py-2 rounded-full text-white font-medium shadow"
              >
                <FaUserCircle className="text-xl" />
                <span>{user.name?.split(' ')[0] || 'User'}</span>
              </div>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white border rounded-md shadow-md z-50 p-4 text-sm">
                  <div className="mb-3">
                    <p className="text-gray-800 font-semibold">{user.name}</p>
                    <p className="text-gray-500">{user.email}</p>
                    <p className="text-gray-400 capitalize">{user.role}</p>
                  </div>
                  <hr className="my-2" />
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      if (user?.role === 'partner') {
                        navigate('/partnerprofile');
                      } else {
                        navigate('/userprofile');
                      }
                    }}
                    className="w-full text-left px-3 py-2 text-blue-600 hover:bg-gray-100 rounded"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 text-red-600 hover:text-white hover:bg-red-600 px-3 py-2 rounded transition"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Login Modal */}
      {showLoginModal && (
        <div
          className="fixed inset-0 z-50 bg-opacity-30 backdrop-blur-sm bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowLoginModal(false)}
        >
          <div
            className="bg-white h-[80vh] rounded-xl max-w-xl w-full relative shadow-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              style={{ fontSize: "30px" }}
              aria-label="Close modal"
            >
              ×
            </button>
            <div className="p-6 h-full">
              <LoginPage isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
