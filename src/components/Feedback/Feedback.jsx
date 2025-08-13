// src/components/Feedback/Feedback.jsx
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase"; 

export default function StudentFeedbackSlider() {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Query: كل الفيدباك مرتّب حسب createdAt تنازلي (يظهر الأحدث أول)
    const q = query(
      collection(db, "feedback"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFeedbackData(items);
        setLoading(false);
      },
      (error) => {
        console.error("feedback snapshot error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: feedbackData.length >= 2 ? 2 : 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        Loading feedback...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center text-[#071d49] mb-8">
        What Our Students Say
      </h2>

      {feedbackData.length === 0 ? (
        <p className="text-center text-gray-600">No feedback yet.</p>
      ) : (
        <Slider {...settings}>
          {feedbackData.map((student) => (
            <div key={student.id} className="p-4">
              <div className="bg-white border border-[#ffd100] rounded-lg shadow-md p-6 text-center flex flex-col items-center h-[350px]">
                <img
                  src={student.img || "https://via.placeholder.com/100"}
                  alt={student.name || "Student"}
                  className="w-24 h-24 rounded-full border-4 border-[#ffd100] mb-4 object-cover"
                />

                <h3 className="text-xl font-semibold text-[#071d49]">
                  {student.name || "Anonymous"}
                </h3>
                <p className="text-sm text-gray-600">{student.course}</p>
                <p className="text-sm text-gray-500">{student.country}</p>

                <p className="mt-4 text-gray-700 italic overflow-hidden text-ellipsis">
                  “{student.feedback}”
                </p>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
}
