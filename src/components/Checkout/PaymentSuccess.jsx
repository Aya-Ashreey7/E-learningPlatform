import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const method = location.state?.method || "Visa"; // fallback

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/contact");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9] relative overflow-hidden font-inter">
      {/* Glass Card */}
      <div className="bg-white border border-gray-200 p-10 rounded-2xl shadow-xl text-center w-full max-w-md">
        <CheckCircle
          className="mx-auto mb-4 text-[#ffd100] animate-bounce"
          size={64}
        />

        <h2 className="text-3xl font-extrabold text-[#071d49]">
          {method === "Cash" ? "Booking Confirmed!" : "Payment Successful!"}
        </h2>

        <p className="mt-2 text-sm text-gray-600">Redirecting you shortly...</p>
      </div>

      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-50px] left-[-50px] w-72 h-72 bg-[#ffd100] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-60px] right-[-40px] w-72 h-72 bg-[#071d49] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
    </div>
  );
};

export default PaymentSuccess;
