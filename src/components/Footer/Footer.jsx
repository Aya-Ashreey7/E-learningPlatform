import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#04122f] text-white pt-14 pb-8 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#ffd100] to-transparent" />
      <div className="absolute -top-24 right-0 h-48 w-48 rounded-full bg-[#ffd100]/10 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-10">
        {/* Logo & About */}
        <div>
          <h2 className="font-display text-2xl font-bold text-[#ffd100] mb-4">
            Scientific Center
          </h2>
          <p className="text-sm leading-relaxed text-white/70">
            Inspiring curiosity and promoting lifelong learning through education,
            science, and innovation. Our mission is to make science exciting and
            accessible for everyone.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-bold tracking-wider uppercase text-[#ffd100] mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2.5 text-sm text-white/80">
            <li>
              <a href="/" className="hover:text-[#ffd100] transition">
                Home
              </a>
            </li>
            <li>
              <a href="/aboutus" className="hover:text-[#ffd100] transition">
                About Us
              </a>
            </li>
            <li>
              <a href="/courses" className="hover:text-[#ffd100] transition">
                Courses
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-[#ffd100] transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-sm font-bold tracking-wider uppercase text-[#ffd100] mb-4">
            Contact Us
          </h3>
          <p className="text-sm text-white/80 mb-1">37 boarsaed street Ard Al Mahlag</p>
          <p className="text-sm text-white/80 mb-1">Email: info@scientificcenter.com</p>
          <p className="text-sm text-white/80">Phone: 01000745165</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative mt-12 border-t border-white/10 pt-5 flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-4 text-sm text-white/60">
        <p>© {new Date().getFullYear()} Scientific Center. All rights reserved.</p>

        <div className="flex space-x-3 text-base mt-4 md:mt-0">
          <Link
            to="https://www.facebook.com/share/1EdGMkGCss/?mibextid=wwXIfr"
            aria-label="Facebook"
            className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-white/5 hover:bg-[#ffd100] hover:text-[#071d49] transition"
          >
            <FaFacebookF />
          </Link>
          <Link
            to="https://www.instagram.com/scientific_center1?igsh=dHlvcXB6aXo1M3pm"
            aria-label="Instagram"
            className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-white/5 hover:bg-[#ffd100] hover:text-[#071d49] transition"
          >
            <FaInstagram />
          </Link>
          <a
            href="#"
            aria-label="YouTube"
            className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-white/5 hover:bg-[#ffd100] hover:text-[#071d49] transition"
          >
            <FaYoutube />
          </a>
        </div>
      </div>
    </footer>
  );
}
