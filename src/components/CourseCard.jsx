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
      className="relative overflow-hidden bg-white border border-[rgba(7,29,73,0.08)] rounded-2xl shadow-[0_10px_30px_rgba(7,29,73,0.08)] hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(7,29,73,0.14)] hover:border-[#ffd100]/50 transition-all duration-300 cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative h-52">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04122f]/70 via-transparent to-transparent" />

        {/* Category Tag */}
        <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full bg-[#ffd100] text-[#071d49] shadow-md">
          {course.category}
        </span>

        {/* Wishlist Icon */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-4 right-4 p-2 rounded-full backdrop-blur-md bg-white/25 border border-white/40 hover:bg-white/50 transition"
          aria-label="Toggle wishlist"
        >
          <Heart
            size={18}
            className={
              wishlist
                ? "fill-[#ffd100] text-[#ffd100]"
                : "text-white"
            }
          />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          By {course.instructor}
        </p>
        <h2 className="font-display text-lg font-bold mt-1.5 leading-snug text-[#071d49] line-clamp-2 min-h-[3.25rem]">
          {course.title}
        </h2>

        {/* Course Info */}
        <div className="flex items-center gap-4 text-sm text-slate-500 mt-4">
          <div className="flex items-center gap-1.5">
            <Clock size={15} className="text-[#071d49]" />
            {course.duration}
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={15} className="text-[#071d49]" />
            {course.students} Students
          </div>
        </div>

        {/* Price */}
        <div className="mt-4 flex items-center gap-2">
          {course.price > 0 && course.originalPrice && (
            <span className="line-through text-slate-400 text-sm">
              ${course.originalPrice}
            </span>
          )}
          <span className="font-bold text-xl text-[#071d49]">
            {course.price === 0 ? "Free" : `$${course.price}`}
          </span>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="mt-5 w-full bg-[#071d49] text-[#ffd100] py-3 rounded-xl font-bold shadow-md hover:bg-[#0d2a63] hover:text-white transition-all"
        >
          Add to Cart
        </button>
      </div>

      {/* Popup Notification */}
      {showPopup && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-[rgba(7,29,73,0.08)] shadow-xl rounded-xl px-5 py-3 flex items-center gap-2">
          <CheckCircle className="text-emerald-500" size={20} />
          <span className="text-sm font-semibold text-[#071d49]">
            Added to cart!
          </span>
        </div>
      )}
    </div>
  );
};

export default CourseCard;
