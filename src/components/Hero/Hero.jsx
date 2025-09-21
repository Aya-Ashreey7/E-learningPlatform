import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
// import "./Hero.css"; // Import the CSS file

import { FaChild, FaUserGraduate } from "react-icons/fa";
import {
  FaDollarSign,
  FaAccessibleIcon,
  FaClock,
  FaUsers,
  FaChalkboardTeacher,
  FaGlobe,
  FaCheckCircle,
  FaHeadset,
  FaLaptop,
  FaUserFriends,
} from "react-icons/fa"; // Import icons
import StatsSection from "../StatsSection/StatsSection";
import StudentFeedbackSlider from "../Feedback/Feedback";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const categories = [
  {
    title: "Kids Courses",
    description: "Fun and educational courses for kids",
    icon: <FaChild size={40} />,
    link: "/courses/kids",
  },
  {
    title: "Adult Courses",
    description: "Specialized courses for adults in various fields",
    icon: <FaUserGraduate size={40} />,
    link: "/courses/adults",
  },
];

const features = [
  {
    title: "Live Interactive Classes",
    description:
      "Our classes bring together technology, innovation, and a global perspective. Let's dive in, discuss, and experience real-world learning!",
    icon: <FaUsers size={40} />,
  },
  {
    title: "Learn from the Best",
    description:
      "We have distinguished international faculty educated in renowned universities and have decades of industry and academic experience.",
    icon: <FaChalkboardTeacher size={40} />,
  },
  {
    title: "Personalised Support",
    description:
      "We provide you with expertise and dedicated support throughout your program from our student engagement team and course administrators.",
    icon: <FaHeadset size={40} />,
  },
  {
    title: "Advanced LMS",
    description:
      "Our cutting-edge Learning Management System makes learning more engaging and personalised, unlocking the power of data-driven insights.",
    icon: <FaLaptop size={40} />,
  },
  {
    title: "Cutting-Edge Pedagogy",
    description:
      "We use innovative teaching methods, digital tools, and experiential learning to offer an advanced pedagogy that fosters global competence.",
    icon: <FaChalkboardTeacher size={40} />,
  },
  {
    title: "Global Alumni",
    description:
      "We shape a world of talent. Our intensive programs empower and foster some of the world's most talented individuals.",
    icon: <FaUserFriends size={40} />,
  },
];

const Hero = () => {
  const [heroImage, setHeroImage] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchHeroImage = async () => {
      const docRef = doc(db, "ChangeImage", "Images");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const img = new Image();
        img.src = docSnap.data().heroImage;
        img.onload = () => {
          setHeroImage(docSnap.data().heroImage);
          setIsLoaded(true);
        };
      }
    };
    fetchHeroImage();
  }, []);
  return (
    <div className="hero-container">
      <Navbar />
      <section
        id="hero"
        className="relative w-full bg-cover bg-center py-16 px-4 md:px-10 transition-all duration-1000"
        style={{
          backgroundImage: heroImage ? `url(${heroImage})` : "none",
          backgroundColor: "#f0f0f0", // placeholder light gray
          filter: isLoaded ? "none" : "blur(20px)",
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-10">
          {/* Text Section */}
          <motion.div
            className="md:w-1/2 text-center md:text-left  p-6 rounded-lg"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Learn something new everyday.
            </h1>
            <p className="text-white text-lg md:text-xl mb-6">
              Become professional and ready to join the world.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <a
                href="#categories"
                className="w-[40%] text-center inline-block bg-[#071d49] text-[#ffd100] hover:bg-[#071d49] hover:text-white px-6 py-3 rounded-b-xl text-lg transition"
              >
                Browse Courses
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
      <StatsSection /> {/* Add the new section here */}
      {/* Categories Section */}
      <section id="categories" className="bg-white py-16 px-4 md:px-10 mb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center text-[#071d49] mb-12"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Explore Our Categories
          </motion.h2>

          {/* Cards Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {categories.map((cat, index) => (
              <Link
                to={cat.link}
                key={index}
                className="bg-[#f9f9f9] p-6 rounded-lg shadow-md text-center hover:shadow-xl transition duration-300 cursor-pointer group"
              >
                <div className="text-[#ffd100] mb-4 flex justify-center group-hover:scale-110 transition-transform duration-200">
                  {cat.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#071d49] mb-2">
                  {cat.title}
                </h3>
                <p className="text-gray-600 text-sm">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="bg-[#f9f9f9] py-16 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center text-[#071d49] mb-8"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Why Learn At Scientific Center?
          </motion.h2>
          {/* Icon List */}
          <div className="elementor-widget-container mb-8">
            <ul className="elementor-icon-list-items elementor-inline-items flex justify-center">
              <li className="elementor-icon-list-item elementor-inline-item mr-6 flex items-center">
                <span className="elementor-icon-list-icon ml-2">
                  <FaCheckCircle
                    aria-hidden="true"
                    className="text-[#071d49]"
                  />
                </span>
                <span className="elementor-icon-list-text text-[#071d49]">
                  Affordable
                </span>
              </li>
              <li className="elementor-icon-list-item elementor-inline-item mr-6 flex items-center">
                <span className="elementor-icon-list-icon ml-2">
                  <FaCheckCircle
                    aria-hidden="true"
                    className="text-[#071d49]"
                  />
                </span>
                <span className="elementor-icon-list-text text-[#071d49]">
                  Accessible
                </span>
              </li>
              <li className="elementor-icon-list-item elementor-inline-item mr-6 flex items-center">
                <span className="elementor-icon-list-icon ml-2">
                  <FaCheckCircle
                    aria-hidden="true"
                    className="text-[#071d49]"
                  />
                </span>
                <span className="elementor-icon-list-text text-[#071d49]">
                  Flexible
                </span>
              </li>
            </ul>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-[#ffd100] mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#071d49] mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          {/* Button */}
          <div className="text-center mt-8">
            <Link
              to="/aboutus"
              className="inline-block bg-[#071d49] text-[#ffd100] py-3 px-8 rounded-b-xl text-lg transition duration-300 hover:bg-[#071d49] hover:text-white"
            >
              Want to know more
            </Link>
          </div>
        </div>
      </section>
      <StudentFeedbackSlider />
      <Footer />
    </div>
  );
};

export default Hero;
