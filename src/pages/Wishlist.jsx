import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { FaClock, FaUsers, FaShoppingCart, FaBookOpen } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { useAuth } from "../components/AuthContext/AuthContext";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removeConfirm, setRemoveConfirm] = useState(null);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
    setLoading(false);
  }, []);

  const handleAddToCart = (course) => {
    if (!user) {
      toast.error("Please login first to add to cart");
      return;
    }
    const added = addToCart(course);
    if (!added) {
      toast.error("This course is already in Cart!");
    } else {
      toast.success("Added to Cart");
    }
  };

  const confirmRemove = () => {
    const updated = wishlist.filter((course) => course.id !== removeConfirm);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    setRemoveConfirm(null);
    toast.success("Course removed from Wishlist");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white py-10 px-6">
        <h1 className="text-4xl font-bold text-center text-[#071d49] mb-8">
          My Wishlist
        </h1>

        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-[#071d49]"></div>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
            <FaBookOpen className="text-6xl mb-4 animate-bounce text-[#071d49]" />
            <p className="text-xl font-semibold">Your wishlist is empty.</p>
            <p className="text-sm mt-2">
              Start adding courses you like to your wishlist.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {wishlist.map((course) => (
              <div
                key={course.id}
                className="bg-[#fff] rounded-lg shadow-md hover:shadow-xl transition duration-300 border border-gray-200"
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-[#071d49] mb-2">
                    {course.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    {course.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <FaClock className="mr-2 text-[#ffd100]" />{" "}
                    {course.duration}h
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <FaUsers className="mr-2 text-[#ffd100]" />{" "}
                    {course.students} enrolled
                  </div>

                  <p className="text-xl font-bold text-[#071d49] mb-4">
                    {course.price} EGP
                  </p>

                  <div className="flex justify-between">
                    <button
                      onClick={() => handleAddToCart(course)}
                      className="flex items-center bg-[#071d49] text-[#ffd100] px-4 py-2 rounded-lg hover:bg-[#ffd100] hover:text-[#071d49] transition"
                    >
                      <FaShoppingCart className="mr-2" /> Add to Cart
                    </button>
                    <button
                      onClick={() => setRemoveConfirm(course.id)}
                      className="flex items-center bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Remove Popup */}
      {removeConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="mb-4">Are you sure you want to remove this course?</p>
            <div className="flex gap-4 justify-center">
              <button
                className="bg-gray-200 px-4 py-2 rounded"
                onClick={() => setRemoveConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={confirmRemove}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
