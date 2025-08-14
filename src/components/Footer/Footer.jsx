import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#071d49] text-white py-10">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        
        {/* Logo & About */}
        <div>
          <h2 className="text-2xl font-bold text-[#ffd100] mb-4">Scientific Center</h2>
          <p className="text-sm leading-relaxed">
            Inspiring curiosity and promoting lifelong learning through education,
            science, and innovation. Our mission is to make science exciting and
            accessible for everyone.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-[#ffd100] mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-[#ffd100] transition">Home</a></li>
            <li><a href="/aboutus" className="hover:text-[#ffd100] transition">About Us</a></li>
            <li><a href="/courses" className="hover:text-[#ffd100] transition">Courses</a></li>
            <li><a href="/contact" className="hover:text-[#ffd100] transition">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-[#ffd100] mb-4">Contact Us</h3>
          <p className="text-sm">123 Science Road, Knowledge City</p>
          <p className="text-sm">Email: info@scientificcenter.com</p>
          <p className="text-sm">Phone: +1 (234) 567-890</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 border-t border-[#ffd100]/30 pt-4 flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-4 text-sm">
        <p>© {new Date().getFullYear()} Scientific Center. All rights reserved.</p>
        
        {/* Social Links */}
        <div className="flex space-x-4 text-lg mt-4 md:mt-0">
          <Link to="https://www.facebook.com/share/1EdGMkGCss/?mibextid=wwXIfr" aria-label="Facebook" className="hover:text-[#F5F5F1]/80 transition">
            <FaFacebookF />
          </Link>
          <Link to="https://www.instagram.com/scientific_center1?igsh=dHlvcXB6aXo1M3pm" aria-label="Instagram" className="hover:text-[#F5F5F1]/80 transition">
            <FaInstagram />
          </Link>
          <a href="#" aria-label="YouTube" className="hover:text-[#F5F5F1]/80 transition">
            <FaYoutube />
          </a>
        </div>
      </div>
    </footer>
  );
}
