import React, { useState } from "react";
import axios from "axios";
import logo from "/src/assets/images/car.jpg";
import { toast } from "react-toastify";

const ContactPage = () => {
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agree) {
      toast.warning("⚠️ Please agree to the terms.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("⚠️ You must be logged in to send a message.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/contact/send`,
        { message }, // ✅ backend uses req.user.email from JWT
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message || "✅ Message sent successfully!");
      console.log("✅ Message sent successfully!");
      setMessage("");
      setAgree(false);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(
        error.response?.data?.message ||
          "❌ Failed to send message. Try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-4 bg-white mx-4 md:mx-20 my-10 rounded-xl">
      <h2 className="text-4xl font-extrabold text-yellow-600 mb-10 tracking-wide text-center">
        Contact Us
      </h2>
      <div className="flex flex-col md:flex-row gap-10 items-stretch">
        {/* Left Side: Image */}
        <div className="md:w-1/2 flex items-center justify-center bg-gray-100 p-4 rounded-lg shadow-md">
          <img
            src={logo}
            alt="WrapForge Logo"
            className="max-w-full h-[300px] object-contain"
          />
        </div>

        {/* Right Side: Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="md:w-1/2 bg-gray-50 p-8 rounded-lg shadow-md flex flex-col justify-between"
        >
          <h3 className="text-2xl font-bold mb-4 text-black">Contact Admin</h3>
          <p className="mb-6 text-lg font-semibold">Send us your message</p>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full border border-gray-300 rounded px-3 py-2 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
              disabled={loading}
            ></textarea>
          </div>

          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="agree"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="mr-2"
              disabled={loading}
            />
            <label htmlFor="agree" className="text-sm">
              I agree to receive communications from WrapForge.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded transition"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactPage;