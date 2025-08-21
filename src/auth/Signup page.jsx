import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '/src/assets/images/WrapForge logo.png';
import { toast } from 'react-toastify';

const SignupPage = ({ onClose }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmpassword: '',
    role: 'user',
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [mismatchError, setMismatchError] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    if (id === 'password') {
      setPasswordError(value.length < 6 ? 'Password must be at least 6 characters' : '');
    }

    if (id === 'confirmpassword' || (id === 'password' && formData.confirmpassword)) {
      const mismatch =
        id === 'confirmpassword'
          ? value !== formData.password
          : formData.confirmpassword !== value;
      setMismatchError(mismatch ? 'Passwords do not match' : '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const API_URL = import.meta.env.VITE_API_URL;

    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmpassword: formData.confirmpassword,
        role: formData.role,
      });

      if (res.status === 200 || res.status === 201) {
        toast.success('Registration successful!');
        if (onClose) onClose(); // Close modal
        navigate('/'); // Redirect to home
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-100 px-6 py-10 text-gray-800">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <img src={logo} alt="WrapForge Logo" className="mx-auto w-20" />
          <h2 className="mt-3 text-2xl font-bold text-[#2f1c13]">Register</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@mail.com"
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-sm text-blue-500"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {passwordError && <p className="text-sm text-red-600 mt-1">{passwordError}</p>}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label
              htmlFor="confirmpassword"
              className="block mb-1 font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmpassword"
                value={formData.confirmpassword}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-sm text-blue-500"
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {mismatchError && <p className="text-sm text-red-600 mt-1">{mismatchError}</p>}
          </div>

          {/* Terms */}
          <div className="flex items-center mb-6 text-sm">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="accent-yellow-500" required />
              <span>I agree to the</span>
              <span className="text-blue-600 hover:underline font-medium cursor-pointer">
                Terms & Conditions
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || passwordError || mismatchError}
            className="w-full bg-yellow-500 hover:bg-orange-500 text-black font-semibold py-2 rounded-md transition duration-300"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

          {/* Login Link */}
          <p className="text-center mt-5 text-sm text-gray-700 font-medium">
            Already have an account?{' '}
            <span
              onClick={() => {
                if (onClose) onClose();
                navigate('/login');
              }}
              className="text-blue-600 font-semibold hover:underline cursor-pointer"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;