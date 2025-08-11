import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Clock, Heart, CheckCircle } from "lucide-react";

const CourseCard = ({ course, onAddToCart, onToggleWishlist }) => {
  const [wishlist, setWishlist] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleWishlistClick = (e) => {
    e.stopPropagation(); // Prevent triggering card click
    const newWishlistState = !wishlist;
    setWishlist(newWishlistState);
    if (onToggleWishlist) {
      onToggleWishlist(course, newWishlistState);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent triggering card click
    if (onAddToCart) {
      onAddToCart(course);
    }
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const handleCardClick = () => {
    navigate(`/courses/${course.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative rounded-2xl overflow-hidden shadow-lg bg-white transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative h-56">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Category Tag */}
        <span className="absolute top-4 left-4 text-xs font-semibold px-4 py-1 rounded-full bg-[#ffd100] text-[#071d49] shadow-md">
          {course.category}
        </span>

        {/* Wishlist Icon */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-4 right-4 p-2 rounded-full backdrop-blur bg-white/30 border border-white/50 hover:bg-white/50 transition"
        >
          <Heart
            size={20}
            className={
              wishlist
                ? "fill-[#ffd100] text-[#ffd100]"
                : "text-white"
            }
          />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-6">
        <p className="text-sm text-gray-500">By {course.instructor}</p>
        <h2 className="text-xl font-bold mt-1 leading-snug text-[#071d49] line-clamp-2">
          {course.title}
        </h2>

        {/* Course Info */}
        <div className="flex items-center gap-5 text-sm text-gray-600 mt-4">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            {course.duration}
          </div>
          <div className="flex items-center gap-1">
            <Users size={16} />
            {course.students} Students
          </div>
        </div>

        {/* Price */}
        <div className="mt-4 flex items-center gap-2">
          {course.price > 0 && course.originalPrice && (
            <span className="line-through text-gray-400">
              ${course.originalPrice}
            </span>
          )}
          <span className="font-bold text-lg text-[#ffd100]">
            {course.price === 0 ? "Free" : `$${course.price}`}
          </span>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="mt-6 w-full bg-gradient-to-r from-[#071d49] to-[#ffd100] text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg hover:brightness-105 hover:scale-105 transition-all"
        >
          Add to Cart
        </button>
      </div>

      {/* Popup Notification */}
      {showPopup && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-lg px-5 py-3 flex items-center gap-2 animate-fade-in-down">
          <CheckCircle className="text-green-500" size={20} />
          <span className="text-sm font-semibold text-[#071d49]">
            Added to cart!
          </span>
        </div>
      )}
    </div>
  );
};

export default CourseCard;
