import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Star, Lock } from "lucide-react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const CartPage = () => {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [removeConfirm, setRemoveConfirm] = useState(null);
  const [showEmptyCartAlert, setShowEmptyCartAlert] = useState(false);

  const baseTotal = cartItems.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const discount = appliedCoupon === "SUMMER20" ? 20 : 0;
  const total = Math.max(0, baseTotal - discount);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setShowEmptyCartAlert(true);
    } else {
      navigate("/checkout/checkout", { state: { cartItems, total } });
    }
  };

  const applyCoupon = () => {
    setAppliedCoupon(coupon.trim().toUpperCase());
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#071d49] font-inter flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow px-4 lg:px-10 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white p-10 rounded-lg shadow-md border border-dashed border-gray-300 text-center">
              <ShoppingBag className="text-gray-300 mb-6" size={64} />
              <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
              <p className="text-gray-600 max-w-sm mb-4">
                Looks like you haven't added any courses yet. Explore top-rated content to start learning.
              </p>
              <Link
                to="/Courses"
                className="inline-block bg-[#071d49] text-white px-6 py-3 rounded-full font-medium hover:bg-[#0a2b70] transition"
              >
                🔍 Browse Courses
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg p-4 shadow-sm border hover:border-[#ffd100] hover:shadow-md transition transform hover:scale-[1.01] flex gap-4"
              >
                <img src={item.image} alt={item.title} className="w-28 h-28 rounded object-cover" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#071d49]">{item.title}</h3>
                  <p className="text-sm text-gray-500">By {item.instructor || "Instructor"}</p>
                  <div className="flex items-center gap-2 text-sm text-yellow-600 mt-1">
                    <Star size={14} /> 4.6 (12,322 ratings)
                  </div>
                  <div className="text-sm text-gray-600 mt-1">📚 {item.duration || "40h"} • Quizzes • Certificate</div>
                  <div className="text-sm text-gray-600">🏷️ Bestseller • Lifetime Access</div>
                  <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <Lock size={14} /> Secured • Mobile Friendly
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <p className="text-lg font-bold text-[#071d49]">{Number(item.price).toFixed(2)} EGP</p>
                  <div className="text-sm flex flex-col items-end gap-1">
                    <button className="text-[#071d49] hover:underline text-xs">Move to Wishlist</button>
                    <button
                      className="text-red-600 hover:text-red-800 text-xs"
                      onClick={() => setRemoveConfirm(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white shadow-lg rounded-xl p-6 space-y-4 h-fit sticky top-24 border border-gray-200">
          <h3 className="text-xl font-semibold mb-2">🧾 Order Summary</h3>
          <div className="flex justify-between text-sm">
            <span>Courses ({cartItems.length})</span>
            <span>{baseTotal.toFixed(2)} EGP</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount ({appliedCoupon})</span>
              <span>- {discount.toFixed(2)} EGP</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{total.toFixed(2)} EGP</span>
          </div>
          <hr />
          <div className="flex justify-between font-semibold text-lg">
            <span>Estimated Total</span>
            <span>{total.toFixed(2)} EGP</span>
          </div>

          <input
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Coupon Code"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-[#ffd100]"
          />
          <button
            onClick={applyCoupon}
            className="w-full bg-[#071d49] text-white rounded py-2 hover:bg-[#0a2b70] transition"
          >
            Apply Coupon
          </button>

          <button
            onClick={handleCheckout}
            className="w-full bg-[#ffd100] text-[#071d49] font-semibold rounded py-2 hover:bg-yellow-400 mt-2 transition"
          >
            🔐 Proceed to Secure Checkout
          </button>
        </div>
      </div>

      {/* Confirm Remove Modal */}
      {removeConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="mb-4">Are you sure you want to remove this course?</p>
            <div className="flex gap-4 justify-center">
              <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => setRemoveConfirm(null)}>
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  removeFromCart(removeConfirm);
                  setRemoveConfirm(null);
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty Cart Alert */}
      {showEmptyCartAlert && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-sm mx-auto">
            <h2 className="text-lg font-semibold mb-2 text-red-600">Cart is Empty</h2>
            <p className="text-gray-700 mb-4">Please add at least one course to your cart before checking out.</p>
            <button
              className="bg-[#071d49] text-white px-4 py-2 rounded hover:bg-[#0a2b70]"
              onClick={() => setShowEmptyCartAlert(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CartPage;
