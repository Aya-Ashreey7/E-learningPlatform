import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { FaShoppingCart, FaHeart, FaBell } from "react-icons/fa";
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
    <nav className="sticky top-0 z-[60] bg-[#071d49] py-4 px-4 md:px-8 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl md:text-2xl font-bold cursor-pointer transition"
          style={{ color: "#ffd100" }}
        >
          Scientific Center
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white cursor-pointer p-2 rounded-lg hover:bg-white/10 transition"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-6 lg:space-x-8 items-center font-medium">
          {/* Courses dropdown */}
          <li className="relative">
            <button
              onClick={() => setCoursesMenuOpen(!coursesMenuOpen)}
              className="flex items-center text-white hover:text-[#ffd100] transition cursor-pointer"
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
                  className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 overflow-hidden"
                >
                  <NavLink
                    to="/courses/kids"
                    className="block px-4 py-2 text-[#071d49] hover:bg-[#ffd100] hover:text-[#071d49] transition cursor-pointer"
                    onClick={() => setCoursesMenuOpen(false)}
                  >
                    Kids Courses
                  </NavLink>
                  <NavLink
                    to="/courses/adults"
                    className="block px-4 py-2 text-[#071d49] hover:bg-[#ffd100] hover:text-[#071d49] transition cursor-pointer"
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
                className="text-white hover:text-[#ffd100] transition cursor-pointer"
              >
                {link.name}
              </Link>
            </li>
          ))}

          {/* Icons */}
          <li>
            <button
              onClick={() =>
                user ? navigate("/wishlist") : navigate("/login")
              }
              className="text-white hover:text-[#ffd100] transition cursor-pointer"
              aria-label="Wishlist"
            >
              <FaHeart size={18} />
            </button>
          </li>
          <li>
            <button
              onClick={() => (user ? navigate("/cart") : navigate("/login"))}
              className="text-white hover:text-[#ffd100] transition cursor-pointer"
              aria-label="Cart"
            >
              <FaShoppingCart size={18} />
            </button>
          </li>
          <li>
            <button
              onClick={() =>
                user ? navigate("/notifications") : navigate("/login")
              }
              className="text-white hover:text-[#ffd100] transition cursor-pointer"
              aria-label="Notifications"
            >
              <FaBell size={18} />
            </button>
          </li>

          {/* User dropdown */}
          <li className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-[#ffd100] text-[#071d49] font-bold shadow-md cursor-pointer hover:brightness-95 transition"
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
                  className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-50 overflow-hidden"
                >
                  {!user ? (
                    <>
                      <NavLink
                        to="/login"
                        className="block px-4 py-2 text-[#071d49] hover:bg-[#ffd100] cursor-pointer"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Login
                      </NavLink>
                      <NavLink
                        to="/register"
                        className="block px-4 py-2 text-[#071d49] hover:bg-[#ffd100] cursor-pointer"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Register
                      </NavLink>
                    </>
                  ) : (
                    <>
                      <NavLink
                        to="/ProfilePage"
                        className="block px-4 py-2 text-[#071d49] hover:bg-[#ffd100] cursor-pointer"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Profile
                      </NavLink>
                      <button
                        onClick={() => {
                          signOut(auth);
                          setUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-[#071d49] hover:bg-[#ffd100] cursor-pointer"
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
              className="absolute top-14 left-0 w-full bg-white shadow-[0_20px_50px_rgba(7,29,73,0.2)] rounded-2xl 
              flex flex-col gap-1 p-5 md:hidden z-50 items-stretch text-left border border-[rgba(7,29,73,0.08)]"
            >
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="text-[#071d49] font-medium hover:bg-[#ffd100]/20 rounded-lg px-3 py-2.5 cursor-pointer"
              >
                Home
              </Link>

              <div>
                <button
                  onClick={() => setMobileCoursesOpen(!mobileCoursesOpen)}
                  className="flex justify-between items-center w-full text-[#071d49] font-medium py-2.5 px-3 rounded-lg hover:bg-[#ffd100]/20 cursor-pointer"
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
                      className="pl-4 flex flex-col space-y-1 overflow-hidden"
                    >
                      <Link
                        to="/courses/kids"
                        onClick={() => setMenuOpen(false)}
                        className="text-slate-600 hover:text-[#071d49] cursor-pointer px-3 py-2"
                      >
                        Kids Courses
                      </Link>
                      <Link
                        to="/courses/adults"
                        onClick={() => setMenuOpen(false)}
                        className="text-slate-600 hover:text-[#071d49] cursor-pointer px-3 py-2"
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
                  className="text-[#071d49] font-medium hover:bg-[#ffd100]/20 rounded-lg px-3 py-2.5 cursor-pointer"
                >
                  {link.name}
                </Link>
              ))}

              <button
                onClick={() => {
                  if (!user) navigate("/login");
                  else navigate("/wishlist");
                  setMenuOpen(false);
                }}
                className="text-[#071d49] font-medium hover:bg-[#ffd100]/20 rounded-lg px-3 py-2.5 text-left cursor-pointer"
              >
                Wishlist
              </button>
              <button
                onClick={() => {
                  if (!user) navigate("/login");
                  else navigate("/cart");
                  setMenuOpen(false);
                }}
                className="text-[#071d49] font-medium hover:bg-[#ffd100]/20 rounded-lg px-3 py-2.5 text-left cursor-pointer"
              >
                Cart
              </button>
              <button
                onClick={() => {
                  if (!user) navigate("/login");
                  else navigate("/notifications");
                  setMenuOpen(false);
                }}
                className="text-[#071d49] font-medium hover:bg-[#ffd100]/20 rounded-lg px-3 py-2.5 text-left cursor-pointer"
              >
                Notifications
              </button>

              <div className="border-t border-[rgba(7,29,73,0.08)] mt-2 pt-2">
                {!user ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="block text-center sc-btn sc-btn-navy w-full mb-2"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="block text-center sc-btn sc-btn-primary w-full"
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="text-[#071d49] font-medium hover:bg-[#ffd100]/20 rounded-lg px-3 py-2.5 cursor-pointer block"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        signOut(auth);
                        setMenuOpen(false);
                      }}
                      className="text-[#071d49] font-medium hover:bg-[#ffd100]/20 rounded-lg px-3 py-2.5 text-left cursor-pointer w-full"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
