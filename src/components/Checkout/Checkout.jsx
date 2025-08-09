import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaMoneyBillWave, FaMobileAlt, FaWallet } from "react-icons/fa";
import { MapPin } from "lucide-react";
import PaymentModal from "./PaymentModal";
import AddressForm from "./AddressForm";

const LS_KEY = "checkoutAddress";

const getSavedAddress = () => {
  try {
    const data = localStorage.getItem(LS_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const saveAddress = (address) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(address));
  } catch {
    console.warn("Unable to access localStorage");
  }
};

const clearAddress = () => localStorage.removeItem(LS_KEY);

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [address, setAddress] = useState(() => getSavedAddress());
  const [method, setMethod] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const passedItems = location.state?.cartItems || [];
    const storedItems = JSON.parse(localStorage.getItem("checkoutCart") || "[]");
    const cart = passedItems.length > 0 ? passedItems : storedItems;

    setCartItems(
      cart.map((item) => ({
        ...item,
        quantity: item.quantity || 1,
      }))
    );

    const passedTotal = location.state?.total;
    const storedTotal = parseFloat(localStorage.getItem("checkoutTotal") || "0");
    setTotal(passedTotal ?? storedTotal);

    if (passedItems.length > 0) {
      localStorage.setItem("checkoutCart", JSON.stringify(passedItems));
      localStorage.setItem("checkoutTotal", (passedTotal ?? 0).toString());
    }
  }, [location.state]);

  useEffect(() => {
    if (address) saveAddress(address);
  }, [address]);

  const handleEdit = () => {
    clearAddress();
    setAddress(null);
  };

  const handlePayNow = () => {
    if (!method) {
      alert("Please select a payment method.");
      return;
    }
    setShowModal(true);
  };

  const grandTotal = total;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left: Address & Payment */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Billing Details */}
          <div className="bg-white border border-[#071d49]/40 p-4 rounded-md shadow animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-1 text-[#071d49]">
                <MapPin size={18} className="text-[#071d49]" /> Billing Details
              </h2>
              {!address && <span className="text-sm text-red-500">Required</span>}
              {address && (
                <button
                  onClick={handleEdit}
                  className="text-sm px-3 py-1 border border-[#071d49] text-[#071d49] rounded hover:bg-[#ffd100] hover:text-[#071d49] transition"
                >
                  Edit
                </button>
              )}
            </div>
            {!address ? (
              <AddressForm onSave={setAddress} />
            ) : (
              <div className="bg-[#f9f9f9] rounded-xl p-4 mb-4 shadow-sm border border-[#071d49]/20 transition duration-300 hover:border-[#ffd100] hover:shadow-md animate-fade-in">
                <h3 className="text-lg font-semibold text-[#071d49] mb-3">Billing Details</h3>
                <div className="space-y-1 text-sm text-[#071d49]">
                  {address?.fullName && <p><span className="font-medium">Full Name:</span> {address.fullName}</p>}
                  {address?.phone && <p><span className="font-medium">Phone:</span> {address.phone}</p>}
                  {address?.city && <p><span className="font-medium">City:</span> {address.city}</p>}
                  {address?.area && <p><span className="font-medium">Area:</span> {address.area}</p>}
                  {address?.address && <p><span className="font-medium">Address:</span> {address.address}</p>}
                  {address?.floor && <p><span className="font-medium">Floor:</span> {address.floor}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Payment Method */}
          {address && (
            <div className="bg-white border border-[#071d49]/40 p-4 rounded-md shadow animate-slide-up">
              <h2 className="text-lg font-semibold mb-4 text-[#071d49]">Select Payment Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PaymentOption
                  label="Cash"
                  method={method}
                  setMethod={setMethod}
                  icon={<FaMoneyBillWave className="text-2xl text-[#ffd100]" />}
                />
                <PaymentOption
                  label="Instapay"
                  method={method}
                  setMethod={setMethod}
                  icon={<FaMobileAlt className="text-2xl text-[#071d49]" />}
                />
                <PaymentOption
                  label="Vodafone Cash"
                  method={method}
                  setMethod={setMethod}
                  icon={<FaWallet className="text-2xl text-[#071d49]" />}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: Order Summary */}
        <div className="bg-white border border-[#071d49]/40 p-4 rounded-md shadow self-start h-fit animate-slide-up">
          <h2 className="text-lg font-semibold mb-4 text-[#071d49]">Order Summary</h2>
          <div className="space-y-2 text-sm text-[#071d49]">
            {cartItems.map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span>{item.title} x{item.quantity}</span>
                <span>{(item.price * item.quantity).toFixed(2)} EGP</span>
              </div>
            ))}
            <div className="flex justify-between text-[#071d49]/80">
              <span>Handling Fee:</span>
              <span>0.00 EGP</span>
            </div>
            <hr />
            <div className="flex justify-between font-bold text-lg text-[#071d49]">
              <span>Total:</span>
              <span>{grandTotal.toFixed(2)} EGP</span>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-[#071d49]/60">
            <span className="inline-block px-2 py-1 border border-[#071d49]/30 rounded">
              🔐 Secure checkout
            </span>
          </div>
          <button
            onClick={handlePayNow}
            disabled={!method}
            className={`mt-4 w-full py-2 rounded-md font-semibold transition-all duration-300 transform ${
              method
                ? "bg-gradient-to-r from-[#071d49] to-[#ffd100] text-white hover:scale-105"
                : "bg-gray-300 text-white cursor-not-allowed"
            }`}
          >
            Pay Now
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <PaymentModal
          method={method}
          onClose={() => setShowModal(false)}
          cartItems={cartItems}
          total={total}
          address={address}
        />
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out both;
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
};

// Reusable payment card
const PaymentOption = ({ label, method, setMethod, icon }) => {
  const isSelected = method === label;
  return (
    <div
      onClick={() => setMethod(label)}
      className={`flex items-center gap-2 p-3 rounded-md border cursor-pointer justify-center transition-all duration-300 transform hover:scale-105 ${
        isSelected
          ? "bg-[#ffd100]/10 border-[#ffd100]"
          : "bg-gray-50 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span className="font-medium text-[#071d49]">{label}</span>
    </div>
  );
};

export default Checkout;
