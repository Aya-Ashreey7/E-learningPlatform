// src/components/CourseCard.jsx
import React from 'react';
import { useCart } from '../context/CartContext';

const CourseCard = ({ course }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden">
      {/* صورة الكورس */}
      <img
        src={course.image}
        alt={course.title}
        className="w-full h-48 object-cover"
      />

      {/* محتوى الكورس */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">{course.title}</h2>
        <p className="text-gray-600 mt-2">{course.description}</p>
        <p className="text-[#A78074] font-semibold mt-3">{course.price} EGP</p>
        <button
          onClick={() => addToCart(course)}
          className="mt-4 w-full px-4 py-2 bg-[#A78074] text-white rounded hover:bg-[#A78074]/90 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
