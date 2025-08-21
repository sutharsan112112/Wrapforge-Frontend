import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Fooder';

import HomePage from './pages/Home page';
import VehiclePage from './pages/Vehicle page';
import ServicePage from './pages/Service page.jsx';
import AdminDashboard from './dashboard/AdminDashboard.jsx';
import PartnerDashboard from './dashboard/PartnerDashboard.jsx';
import UserProfile from './dashboard/UserProfile.jsx';
import LoginPage from './auth/Login page.jsx';
import SignUpPage from './auth/Signup page.jsx';
import AddVehicles from './pages/AddVehicles.jsx';
import AddStickers from './pages/Addstickers.jsx';
import Usermanagement from './pages/Usermanagement.jsx';
import VehicleScene from './pages/VehicleScene.jsx';
import Sticker from './pages/Sticker.jsx';
import ContactMessage from './pages/Contact message.jsx';
import ContactPage from './pages/Contact page.jsx';
import AddService from './pages/AddService.jsx';
import VehiclesManagement from './pages/VehicleManagement.jsx'
import VehicleStickerViewer from './pages/vechicleSticker.jsx';
import StickerManagement from './pages/Stickermanagement.jsx';
import ServiceManagement from './pages/ServiceManagement.jsx';
import { ToastContainer } from 'react-toastify';
import PartnerProfile from './dashboard/PartnerProfile.jsx';
import EditSticker from './pages/EditSticker.jsx';
import EditVehicle from './pages/EditVehicle.jsx';
// import Payment from './pages/Payment.jsx';
import CartPage from './pages/cartPage.jsx';
import CheckoutPage from './pages/checkoutPage.jsx'; 
import MyServices from './pages/MyServices.jsx';
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/vehicle' element={<VehiclePage />} />
        <Route path='/service' element={<ServicePage />} />
        <Route path='/admin' element={<AdminDashboard />} />
        <Route path='/partnerdashboard' element={<PartnerDashboard />} />
        <Route path='/userprofile' element={<UserProfile />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signuppage' element={<SignUpPage />} />
        <Route path='/addvehicles' element={<AddVehicles />} />
        <Route path='/addstickers' element={<AddStickers />} />
        <Route path="/customize/:id" element={<VehicleStickerViewer />} />
        <Route path="/vehicles" element={<VehiclePage />} />
        <Route path='/partnerprofile' element={<PartnerProfile />} />

        <Route path='/vehiclescene' element={<VehicleScene />} />
        <Route path='/sticker' element={<Sticker />} />
        <Route path='/Usermanagement' element={<Usermanagement />} />
        <Route path="/contact-message" element={<ContactMessage />} />
        <Route path="/my-services" element={<MyServices />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/add-service" element={<AddService />} />
        <Route path='/vehiclesmanagement' element={<VehiclesManagement />} />
        <Route path='/stickerManagement' element={<StickerManagement />} />
        <Route path='/servicemanagement' element={<ServiceManagement />} />
        <Route path='/edit-sticker/:id' element={<EditSticker />} />
        <Route path='/edit-vehicle/:id' element={<EditVehicle />} />
        
        {/* Protected Routes */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        {/* <Route path="/payment" element={<Payment />} /> */}
      </Routes>
      <Footer />

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />

    </>
  );
}

export default App;
