import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [coursesMenuOpen, setCoursesMenuOpen] = useState(false);
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) setUserData(userSnap.data());
        } catch (error) {
          console.error("❌ Error fetching user data:", error);
        }
      } else {
        setUserData(null);
      }
    };
    fetchUserData();
  }, [user]);

  const getInitials = () => {
    if (userData?.firstName || userData?.lastName) {
      const first = userData.firstName?.[0] || "";
      const last = userData.lastName?.[0] || "";
      return (first + last).toUpperCase();
    }
    if (user?.email) return user.email[0].toUpperCase();
    return "U";
  };

  const links = [
    { name: "Blog", to: "/blog" },
    { name: "About us", to: "/aboutus" },
    { name: "Contact us", to: "/contact" },
  ];

  return (
    <nav className="bg-[#071d49] py-4 px-6 md:px-10 shadow-md">
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
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-8 items-center font-medium">
          {/* Courses dropdown */}
          <li className="relative">
            <button
              onClick={() => setCoursesMenuOpen(!coursesMenuOpen)}
              className="flex items-center text-white hover:text-[#ffd100] transition"
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
                  className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50"
                >
                  <NavLink
                    to="/courses/kids"
                    className="block px-4 py-2 text-gray-700 hover:bg-[#ffd100] hover:text-[#071d49] rounded-t-lg"
                    onClick={() => setCoursesMenuOpen(false)}
                  >
                    Kids Courses
                  </NavLink>
                  <NavLink
                    to="/courses/adults"
                    className="block px-4 py-2 text-gray-700 hover:bg-[#ffd100] hover:text-[#071d49] rounded-b-lg"
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
              <Link
                to={link.to}
                className="text-white hover:text-[#ffd100] transition"
              >
                {link.name}
              </Link>
            </li>
          ))}

          {/* Wishlist & Cart */}
          <li>
            <button
              onClick={() => {
                if (!user) navigate("/login");
                else navigate("/wishlist");
              }}
              className="text-white hover:text-[#ffd100] transition"
            >
              <FaHeart size={20} />
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                if (!user) navigate("/login");
                else navigate("/cart");
              }}
              className="text-white hover:text-[#ffd100] transition"
            >
              <FaShoppingCart size={20} />
            </button>
          </li>

          {/* User dropdown */}
          <li className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-[#ffd100] text-[#071d49] font-bold shadow-md"
            >
              {getInitials()}
            </button>
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-50"
                >
                  {!user ? (
                    <>
                      <NavLink
                        to="/login"
                        className="block px-4 py-2 text-gray-700 hover:bg-[#ffd100] hover:text-[#071d49]"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Login
                      </NavLink>
                      <NavLink
                        to="/register"
                        className="block px-4 py-2 text-gray-700 hover:bg-[#ffd100] hover:text-[#071d49]"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Register
                      </NavLink>
                    </>
                  ) : (
                    <>
                      <NavLink
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-[#ffd100] hover:text-[#071d49]"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Profile
                      </NavLink>
                      <button
                        onClick={() => {
                          signOut(auth);
                          setUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-[#ffd100] hover:text-[#071d49]"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        </ul>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute top-16 left-0 w-full bg-[#fff] shadow-lg rounded-b-lg flex flex-col gap-3 p-5 md:hidden"
            >
              {/* Links */}
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="text-[#071d49] font-medium hover:text-[#ffd100]"
              >
                Home
              </Link>

              {/* Mobile Courses Dropdown */}
              <div>
                <button
                  onClick={() => setMobileCoursesOpen(!mobileCoursesOpen)}
                  className="flex justify-between items-center w-full text-[#071d49] font-medium py-2"
                >
                  Courses
                  <ChevronDown
                    size={16}
                    className={`ml-2 transform transition ${
                      mobileCoursesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {mobileCoursesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="pl-4 flex flex-col space-y-2 overflow-hidden"
                    >
                      <Link
                        to="/courses/kids"
                        onClick={() => setMenuOpen(false)}
                        className="text-gray-600 hover:text-[#071d49]"
                      >
                        Kids Courses
                      </Link>
                      <Link
                        to="/courses/adults"
                        onClick={() => setMenuOpen(false)}
                        className="text-gray-600 hover:text-[#071d49]"
                      >
                        Adult Courses
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="text-[#071d49] font-medium hover:text-[#ffd100]"
                >
                  {link.name}
                </Link>
              ))}

              {/* Wishlist & Cart */}
              <button
                onClick={() => {
                  if (!user) navigate("/login");
                  else navigate("/wishlist");
                  setMenuOpen(false);
                }}
                className="text-[#071d49] font-medium hover:text-[#ffd100] text-left"
              >
                Wishlist
              </button>
              <button
                onClick={() => {
                  if (!user) navigate("/login");
                  else navigate("/cart");
                  setMenuOpen(false);
                }}
                className="text-[#071d49] font-medium hover:text-[#ffd100] text-left"
              >
                Cart
              </button>

              {/* Auth Links */}
              {!user ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-[#071d49] font-medium hover:text-[#ffd100]"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="text-[#071d49] font-medium hover:text-[#ffd100]"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="text-[#071d49] font-medium hover:text-[#ffd100]"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      signOut(auth);
                      setMenuOpen(false);
                    }}
                    className="text-[#071d49] font-medium hover:text-[#ffd100] text-left"
                  >
                    Logout
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
