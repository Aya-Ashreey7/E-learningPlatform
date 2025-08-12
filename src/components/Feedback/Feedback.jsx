import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const feedbackData = [
  {
    name: "Amara",
    program: "MSc Brand Management",
    country: "Gujranwala, Pakistan",
    img: "https://images.unibuddy.co/100x100/smart/65312bc7f67b5617446049f8.jpg",
    feedback:
      "The program really helped me build my skills and confidence. The professors were amazing!"
  },
  {
    name: "John",
    program: "BSc Computer Science",
    country: "London, UK",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    feedback:
      "A truly enriching learning experience with hands-on projects and supportive mentors."
  },
  {
    name: "Fatima",
    program: "PhD Physics",
    country: "Cairo, Egypt",
    img: "https://randomuser.me/api/portraits/women/45.jpg",
    feedback:
      "I enjoyed every part of the program. The research opportunities were excellent!"
  }
];

export default function StudentFeedbackSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center text-[#071d49] mb-8">
        What Our Students Say
      </h2>
      <Slider {...settings}>
        {feedbackData.map((student, index) => (
          <div key={index} className="p-4">
            <div className="bg-white border border-[#ffd100] rounded-lg shadow-md p-6 text-center flex flex-col items-center h-[350px]">
              {/* Avatar */}
              <img
                src={student.img}
                alt={student.name}
                className="w-24 h-24 rounded-full border-4 border-[#ffd100] mb-4 object-cover"
              />
              {/* Name & Program */}
              <h3 className="text-xl font-semibold text-[#071d49]">
                {student.name}
              </h3>
              <p className="text-sm text-gray-600">{student.program}</p>
              <p className="text-sm text-gray-500">{student.country}</p>

              {/* Feedback */}
              <p className="mt-4 text-gray-700 italic overflow-hidden text-ellipsis">
                “{student.feedback}”
              </p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
