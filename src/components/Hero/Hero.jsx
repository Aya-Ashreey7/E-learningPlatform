import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

import { FaChild, FaUserGraduate } from "react-icons/fa";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaHeadset,
  FaLaptop,
  FaUserFriends,
  FaArrowRight,
} from "react-icons/fa";
import StatsSection from "../StatsSection/StatsSection";
import StudentFeedbackSlider from "../Feedback/Feedback";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const categories = [
  {
    title: "Kids Courses",
    description: "Fun and educational courses for kids",
    icon: <FaChild size={36} />,
    link: "/courses/kids",
  },
  {
    title: "Adult Courses",
    description: "Specialized courses for adults in various fields",
    icon: <FaUserGraduate size={36} />,
    link: "/courses/adults",
  },
];

const features = [
  {
    title: "Live Interactive Classes",
    description:
      "Our classes bring together technology, innovation, and a global perspective. Let's dive in, discuss, and experience real-world learning!",
    icon: <FaUsers size={28} />,
  },
  {
    title: "Learn from the Best",
    description:
      "We have distinguished international faculty educated in renowned universities and have decades of industry and academic experience.",
    icon: <FaChalkboardTeacher size={28} />,
  },
  {
    title: "Personalised Support",
    description:
      "We provide you with expertise and dedicated support throughout your program from our student engagement team and course administrators.",
    icon: <FaHeadset size={28} />,
  },
  {
    title: "Advanced LMS",
    description:
      "Our cutting-edge Learning Management System makes learning more engaging and personalised, unlocking the power of data-driven insights.",
    icon: <FaLaptop size={28} />,
  },
  {
    title: "Cutting-Edge Pedagogy",
    description:
      "We use innovative teaching methods, digital tools, and experiential learning to offer an advanced pedagogy that fosters global competence.",
    icon: <FaChalkboardTeacher size={28} />,
  },
  {
    title: "Global Alumni",
    description:
      "We shape a world of talent. Our intensive programs empower and foster some of the world's most talented individuals.",
    icon: <FaUserFriends size={28} />,
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
        className="relative w-full min-h-[78vh] md:min-h-[86vh] bg-cover bg-center flex items-center overflow-hidden transition-[filter] duration-1000"
        style={{
          backgroundImage: heroImage ? `url(${heroImage})` : "none",
          backgroundColor: "#04122f",
          filter: isLoaded ? "none" : "blur(12px)",
        }}
      >
        <div className="absolute inset-0 sc-hero-glow" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,209,0,0.18),transparent_40%)]" />
        <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#ffd100]/10 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-5 md:px-10 py-20 md:py-28">
          <motion.div
            className="max-w-2xl"
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="sc-eyebrow mb-5 !text-[#ffd100] !bg-white/10 !border-white/20">
              Scientific Center
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-5 leading-[1.1]">
              Learn something new everyday.
            </h1>
            <p className="text-white/85 text-lg md:text-xl mb-8 max-w-xl leading-relaxed">
              Become professional and ready to join the world.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <motion.a
                href="#categories"
                className="sc-btn sc-btn-primary"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Browse Courses
                <FaArrowRight size={14} />
              </motion.a>
              <Link to="/aboutus" className="sc-btn sc-btn-secondary">
                About the Center
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <StatsSection />
      {/* Categories Section */}
      <section id="categories" className="sc-section px-4 md:px-10 relative">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#fff_0%,#f4f7fb_100%)]" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="sc-eyebrow mb-4">Pathways</span>
            <motion.h2
              className="font-display text-3xl md:text-5xl font-bold text-[#071d49] mb-3"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Explore Our Categories
            </motion.h2>
            <p className="text-slate-500 text-base md:text-lg">
              Choose the learning track that fits your goals — for kids or adults.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {categories.map((cat, index) => (
              <Link
                to={cat.link}
                key={index}
                className="sc-card group p-8 md:p-10 text-left relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 h-28 w-28 bg-[#ffd100]/15 rounded-bl-[4rem] transition-transform group-hover:scale-110" />
                <div className="relative">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#071d49] text-[#ffd100] mb-5 group-hover:scale-105 transition-transform">
                    {cat.icon}
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-[#071d49] mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-slate-500 text-sm md:text-base mb-5">
                    {cat.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[#071d49] font-semibold text-sm group-hover:gap-3 transition-all">
                    Explore courses <FaArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="sc-section px-4 md:px-10 bg-[#071d49] relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(255,209,0,0.25),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.08),transparent_40%)]" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <motion.h2
              className="font-display text-3xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Why Learn At Scientific Center?
            </motion.h2>
            <ul className="flex flex-wrap justify-center gap-3 md:gap-5 mb-2">
              {["Affordable", "Accessible", "Flexible"].map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-2 text-white/90 text-sm md:text-base bg-white/10 border border-white/15 rounded-full px-4 py-1.5"
                >
                  <FaCheckCircle className="text-[#ffd100]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-left hover:bg-white/10 hover:border-[#ffd100]/40 transition duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffd100] text-[#071d49] mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-display text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/aboutus" className="sc-btn sc-btn-primary">
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
