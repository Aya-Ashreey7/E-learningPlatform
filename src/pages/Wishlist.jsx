import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { FaClock, FaUsers, FaShoppingCart } from "react-icons/fa";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
  }, []);

  const handleRemove = (id) => {
    const updated = wishlist.filter((course) => course.id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white py-10 px-6">
        <h1 className="text-4xl font-bold text-center text-[#071d49] mb-8">
          My Wishlist 
        </h1>

        {wishlist.length === 0 ? (
          <p className="text-center text-gray-500">Your wishlist is empty.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {wishlist.map((course) => (
              <div
                key={course.id}
                className="bg-[#fff] rounded-lg shadow-md hover:shadow-xl transition duration-300 border border-gray-200"
              >
                <img
                  src={course.image}
                  alt={course.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-[#071d49] mb-2">
                    {course.name}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    {course.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <FaClock className="mr-2 text-[#ffd100]" /> {course.duration}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <FaUsers className="mr-2 text-[#ffd100]" /> {course.students}{" "}
                    enrolled
                  </div>

                  <p className="text-xl font-bold text-[#071d49] mb-4">
                    ${course.price}
                  </p>

                  <div className="flex justify-between">
                    <button className="flex items-center bg-[#071d49] text-[#ffd100] px-4 py-2 rounded-lg hover:bg-[#ffd100] hover:text-[#071d49] transition">
                      <FaShoppingCart className="mr-2" /> Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(course.id)}
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
      <Footer />
    </>
  );
}
