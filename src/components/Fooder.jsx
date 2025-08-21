import React from 'react';
import { Link } from 'react-router-dom'; // <-- Add this import

const Fooder = () => {
    return (
        <>
          {/* Footer Section */}
      <footer className="bg-yellow-500 text-white px-10 py-10 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-justify md:text-left">
          <div>
            <h4 className="font-semibold mb-2 text-xl">Quick Links</h4>
            <ul className="space-y-1 text-lg">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/">About us</Link></li>
              <li><Link to="/">Vehicle</Link></li>
              <li><Link to="/">Service</Link></li>
              <li><Link to="/">Contact us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-2xl">Contact Us</h4>
            <p className="text-lg">Email: support@WrapForge.com</p>
            <p className="text-lg">Phone: +94 XXX XXX XXX</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-2xl">Follow Us</h4>
            <ul className="space-y-1 text-lg">
              <li>Facebook: @WrapForge</li>
              <li>Instagram: @WrapForge_mods</li>
              <li>YouTube: WrapForge Official</li>
              <li>Twitter: @WrapForge_design</li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-6 text-2xl">© 2025 WrapForge. All rights reserved.</div>
      </footer>
        </>
    );
};

export default Fooder;