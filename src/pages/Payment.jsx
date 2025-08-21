import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Payment = () => {
  const [billingFrequency, setBillingFrequency] = useState("yearly");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to proceed with payment.");
      navigate("/login");
    }
  }, [navigate]);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "/api/payments/subscribe",
        { billingFrequency, paymentMethod },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data && res.data.url) {
        toast.success("✅ Redirecting to secure checkout...");
        setTimeout(() => {
          window.location.href = res.data.url;
        }, 1000);
      }
    } catch (err) {
      console.error("Payment Error:", err.response?.data || err.message);
      toast.error("❌ Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
      <h2 className="text-lg font-semibold mb-2">Billing frequency</h2>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setBillingFrequency("monthly")}
          className={`w-full p-4 border rounded-lg ${
            billingFrequency === "monthly"
              ? "border-blue-500 ring-2 ring-blue-300"
              : "border-gray-300"
          }`}
        >
          <div className="text-sm font-medium">Pay monthly</div>
          <div className="text-gray-700">$239/month</div>
        </button>
        <button
          onClick={() => setBillingFrequency("yearly")}
          className={`w-full p-4 border rounded-lg ${
            billingFrequency === "yearly"
              ? "border-blue-500 ring-2 ring-blue-300"
              : "border-gray-300"
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-medium">Pay yearly</div>
              <div className="text-gray-700">$189/month</div>
            </div>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full ml-2">
              Save 20%
            </span>
          </div>
        </button>
      </div>

      <h2 className="text-lg font-semibold mb-2">Payment method</h2>
      <div className="flex gap-4 mb-6">
        {["card", "paypal", "apple", "google"].map((method) => (
          <button
            key={method}
            onClick={() => setPaymentMethod(method)}
            className={`px-4 py-2 border rounded-lg capitalize ${
              paymentMethod === method
                ? "border-blue-500 ring-2 ring-blue-300"
                : "border-gray-300"
            }`}
          >
            {method === "card" && "Credit or Debit card"}
            {method === "paypal" && "PayPal"}
            {method === "apple" && " Pay"}
            {method === "google" && "G Pay"}
          </button>
        ))}
      </div>

      {paymentMethod === "card" && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Payment information</h2>
          <div className="text-sm text-gray-500 mb-2">
            Handled by Stripe securely at checkout
          </div>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
        >
          {loading ? "Redirecting..." : "Subscribe"}
        </button>
      </div>
    </div>
  );
};

export default Payment;