import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, User, ChevronDown } from 'lucide-react';
import { FaShoppingCart, FaHeart } from 'react-icons/fa'; // ✅ Cart & Wishlist icons
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [coursesMenuOpen, setCoursesMenuOpen] = useState(false);
  const customColor = '#ffd100';

  const links = [
    { name: 'Blog', to: '/blog' },
    { name: 'About us', to: '/aboutus' },
    { name: 'Contact us', to: '/contactus' },
    
  ];

  return (
    <nav className="bg-[#071d49] py-4 px-10 relative">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-[#ffd100] text-2xl font-bold">
          Scientific Center
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-6 items-center">
          {/* Courses dropdown */}
          <li className="relative">
            <button
              onClick={() => setCoursesMenuOpen(!coursesMenuOpen)}
              className="flex items-center text-white hover:text-gray-300"
            >
              Courses <ChevronDown size={16} className="ml-1" />
            </button>

            <AnimatePresence>
              {coursesMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 mt-2 w-44 bg-white shadow-lg rounded-md z-50"
                >
                  <NavLink
                    to="/courses/kids"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setCoursesMenuOpen(false)}
                  >
                    Kids Courses
                  </NavLink>
                  <NavLink
                    to="/courses/adults"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setCoursesMenuOpen(false)}
                  >
                    Adult Courses
                  </NavLink>
                </motion.div>
              )}
            </AnimatePresence>
          </li>

          {/* Other links */}
          {links.map((link) => (
            <li key={link.name}>
              <Link to={link.to} className="text-white  hover:text-[#ffd100]">
                {link.name}
              </Link>
            </li>
          ))}

          {/* Wishlist Icon */}
          <li>
            <NavLink to="/wishlist" className="text-white hover:text-[#ffd100]">
              <FaHeart size={22} />
            </NavLink>
          </li>

          {/* Cart Icon */}
          <li>
            <NavLink to="/cart" className="text-white hover:text-[#ffd100]">
              <FaShoppingCart size={22} />
            </NavLink>
          </li>

          {/* User dropdown */}
          <li className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="text-white hover:text-gray-300"
            >
              <User size={24} />
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md z-50"
                >
                  <NavLink
                    to="/login"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Register
                  </NavLink>
                  <NavLink
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Profile
                  </NavLink>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        </ul>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-3 space-y-2 flex flex-col items-center"
            >
              {/* Courses sub-links in mobile menu */}
              <div className="flex flex-col items-center space-y-1">
                <span className="text-white font-semibold">Courses</span>
                <NavLink
                  to="/courses/kids"
                  className="text-white hover:text-[#ffd100] block"
                  onClick={() => setMenuOpen(false)}
                >
                  Kids Courses
                </NavLink>
                <NavLink
                  to="/courses/adult"
                  className="text-white hover:text-[#ffd100] block"
                  onClick={() => setMenuOpen(false)}
                >
                  Adult Courses
                </NavLink>
              </div>

              {/* Other links */}
              {links.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? 'text-[#ffd100] font-semibold block'
                      : 'text-white hover:text-[#ffd100] block'
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {/* Wishlist + Cart in mobile */}
              <div className="flex space-x-6 mt-2">
                <NavLink
                  to="/wishlist"
                  className="text-white hover:text-[#ffd100]"
                  onClick={() => setMenuOpen(false)}
                >
                  <FaHeart size={22} />
                </NavLink>
                <NavLink
                  to="/cart"
                  className="text-white hover:text-[#ffd100]"
                  onClick={() => setMenuOpen(false)}
                >
                  <FaShoppingCart size={22} />
                </NavLink>
              </div>

              {/* Mobile User Menu */}
              <div className="flex flex-col items-center space-y-1 mt-2">
                <NavLink
                  to="/login"
                  className="text-white hover:text-[#ffd100] block"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="text-white hover:text-[#ffd100] block"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </NavLink>
                <NavLink
                  to="/profile"
                  className="text-white hover:text-[#ffd100] block"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </NavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
