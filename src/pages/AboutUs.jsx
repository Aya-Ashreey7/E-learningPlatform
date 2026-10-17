import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar/Navbar"; // adjust path if needed
import Footer from "../components/Footer/Footer";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function AboutUs() {
  const [aboutImage, setAboutImage] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchImageAbout = async () => {
      const docRef = doc(db, "ChangeImage", "Images");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const img = new Image();
        img.src = docSnap.data().aboutImage;
        img.onload = () => {
          setAboutImage(docSnap.data().aboutImage);
          setIsLoaded(true);
        };
      } else {
        console.log("No such document!");
      }
    };
    fetchImageAbout();
  }, []);
  return (
    <>
      <Navbar />
      <div className="bg-[#f4f7fb] text-[#071d49] min-h-screen">
        <section className="relative overflow-hidden bg-[#071d49] text-white py-16 px-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,209,0,0.2),transparent_40%)]" />
          <div className="relative max-w-6xl mx-auto">
            <span className="sc-eyebrow mb-4 !text-[#ffd100] !bg-white/10 !border-white/20">
              Our Story
            </span>
            <motion.h2
              className="font-display text-4xl md:text-5xl font-bold"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              About Us
            </motion.h2>
          </div>
        </section>

        <section className="max-w-6xl mx-auto py-16 px-4">
          <div className="md:flex md:items-start md:gap-12 bg-white rounded-3xl border border-[rgba(7,29,73,0.08)] shadow-[0_16px_40px_rgba(7,29,73,0.08)] p-6 md:p-10">
            {/* Image */}
            <motion.img
              src={aboutImage}
              alt="About Us"
              className="w-full md:w-[380px] h-auto rounded-2xl object-cover mb-10 md:mb-0 ring-4 ring-[#ffd100]/60 shadow-lg"
              initial={{ opacity: 0, filter: "blur(20px)" }}
              animate={{
                opacity: isLoaded ? 1 : 0,
                filter: isLoaded ? "blur(0px)" : "blur(20px)",
              }}
              transition={{ duration: 1 }}
            />

            {/* Text */}
            <motion.div
              className="md:flex-1 space-y-6 text-[17px] leading-relaxed text-slate-600"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="font-display text-3xl md:text-4xl font-semibold text-[#071d49]">
                Welcome to Our Scientific Center
              </h3>
              <p>
                We started with a vision to bring world-class educational and
                scientific experiences to our community. Our programs are
                designed to inspire curiosity, encourage creativity, and promote
                lifelong learning.
              </p>

              <div className="border-t border-[#ffd100]/60 pt-6 space-y-4">
                <p>
                  Our team consists of passionate educators, scientists, and
                  innovators who believe in the power of knowledge. We offer
                  programs for both kids and adults, creating opportunities for
                  all ages to explore and grow.
                </p>

                <p>
                  We are committed to sustainability, innovation, and
                  accessibility. Every initiative we undertake is built around
                  our core values and dedication to making science exciting for
                  everyone.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
