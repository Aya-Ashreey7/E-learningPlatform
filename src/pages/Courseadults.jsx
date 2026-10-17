import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import {
  FaClock,
  FaUsers,
  FaHeart,
  FaShoppingCart,
  FaBookOpen,
} from "react-icons/fa";
import { Search, X, ChevronDown, SlidersHorizontal } from "lucide-react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../components/AuthContext/AuthContext";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

export default function CourseAdults() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]); // ✅ هنا بنخزن كل الكاتيجوريز
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [jobFunctionFilter, setJobFunctionFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { addToCart } = useCart();

  // ✅ نجيب الكاتيجوريز
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Categories"), (snapshot) => {
      const cats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(cats);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ نجيب الكورسات + نضيف معاها اسم الكاتيجوري
  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, "Courses"),
      where("audience", "==", "Adults")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const courseData = snapshot.docs.map((doc) => {
        const data = doc.data();
        // نلاقي الكاتيجوري اللي ليه نفس الـ id
        const category = categories.find((cat) => cat.id === data.category_id);
        return {
          id: doc.id,
          ...data,
          categoryName: category ? category.name : "Unknown",
        };
      });
      setCourses(courseData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [categories]); // 👈 مهم عشان لما الكاتيجوريز تتجاب الأول

  // ✅ Wishlist
  const handleAddToWishlist = (course) => {
    if (!user) {
      toast.error("Please login first to add to wishlist");
      return;
    }

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const exists = wishlist.find((item) => item.id === course.id);

    if (!exists) {
      wishlist.push(course);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      toast.success("Added to Wishlist");
    } else {
      toast.error("This course is already in Wishlist!");
    }
  };

  // ✅ Cart
  const handleAddToCart = (course) => {
    if (!user) {
      toast.error("Please login first to add to cart.");
      return;
    }

    const added = addToCart(course); // addToCart من Context

    if (!added) {
      toast.error("This course is already in Cart!");
    } else {
      toast.success("Added to Cart");
    }
  };
  // ✅ Filters values
  // const jobFunctions = [
  //   ...new Set(courses.map((c) => c.jobFunction).filter(Boolean)),
  // ];

  // ✅ Filter logic
  const filteredCourses = courses.filter((course) => {
    const title = course?.title || "";
    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter ? course.categoryName === categoryFilter : true) &&
      (jobFunctionFilter ? course.jobFunction === jobFunctionFilter : true)
    );
  });

  // ✅ Pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#f4f7fb] py-10 px-4 md:px-6">
        <div className="max-w-7xl mx-auto mb-8">
          <span className="sc-eyebrow mb-3">Adults Track</span>
          <h1 className="text-3xl md:text-4xl font-bold text-[#071d49]">
            Adult Courses
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl">
            Professional programs designed to help you grow skills and advance your career.
          </p>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#ffd100] border-t-[#071d49]"></div>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="mb-8 max-w-7xl mx-auto">
              <div className="bg-white border border-[#e8edf5] rounded-2xl shadow-sm p-3 md:p-4">
                <div className="flex flex-col md:flex-row gap-3 md:items-center">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#071d49]/45 pointer-events-none"
                    />
                    <input
                      type="text"
                      placeholder="Search adult courses by name..."
                      className="w-full h-12 pl-11 pr-10 rounded-xl border border-[#e8edf5] bg-[#f8fafc] text-[#071d49] placeholder:text-slate-400 outline-none focus:border-[#ffd100] focus:ring-4 focus:ring-[#ffd100]/25 transition"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTerm("");
                          setCurrentPage(1);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-[#071d49] hover:bg-[#ffd100]/30 transition"
                        aria-label="Clear search"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {/* Category filter */}
                  <div className="relative w-full md:w-60">
                    <SlidersHorizontal
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#071d49]/45 pointer-events-none z-10"
                    />
                    <select
                      className="w-full h-12 appearance-none cursor-pointer pl-10 pr-10 rounded-xl border border-[#e8edf5] bg-[#f8fafc] text-[#071d49] font-medium outline-none focus:border-[#ffd100] focus:ring-4 focus:ring-[#ffd100]/25 transition"
                      value={categoryFilter}
                      onChange={(e) => {
                        setCategoryFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="">All Categories</option>
                      {Array.from(new Set(courses.map((c) => c.categoryName))).map(
                        (cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        )
                      )}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#071d49]/50 pointer-events-none"
                    />
                  </div>

                  {(searchTerm.trim() !== "" || categoryFilter !== "") && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm("");
                        setCategoryFilter("");
                        setCurrentPage(1);
                      }}
                      className="h-12 px-4 rounded-xl border border-[#e8edf5] bg-white text-[#071d49] font-semibold hover:bg-[#ffd100] hover:border-[#ffd100] transition whitespace-nowrap"
                    >
                      Clear filters
                    </button>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between text-sm text-slate-500 px-1">
                  <span>
                    Showing{" "}
                    <span className="font-semibold text-[#071d49]">
                      {filteredCourses.length}
                    </span>{" "}
                    course{filteredCourses.length === 1 ? "" : "s"}
                  </span>
                  {categoryFilter && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#071d49] text-[#ffd100] text-xs font-bold px-2.5 py-1">
                      {categoryFilter}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            {filteredCourses.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
                {currentCourses.map((course) => (
                  <div
                    key={course.id}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-[#e8edf5] w-full flex flex-col h-full"
                  >
                    <Link to={`/course/${course.id}`} className="block relative aspect-[16/10] overflow-hidden bg-[#f4f7fb]">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071d49]/50 via-transparent to-transparent" />
                      <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-[#ffd100] text-[#071d49] rounded-full text-[11px] font-bold uppercase tracking-wide">
                        {course.categoryName}
                      </span>
                    </Link>

                    <div className="p-5 flex flex-col flex-grow">
                      <div>
                        <h2 className="text-lg font-bold text-[#071d49] group-hover:text-[#0d2a63] transition mb-2 line-clamp-2 min-h-[3.25rem]">
                          {course.title}
                        </h2>
                        <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                          {course.description}
                        </p>
                      </div>

                      <div className="flex-grow"></div>

                      <div className="flex justify-between text-sm text-slate-500 font-medium mb-4">
                        <span className="flex items-center gap-1.5">
                          <FaClock className="text-[#071d49]" />
                          {course.duration}h
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FaUsers className="text-[#071d49]" />
                          {course.traineesCount}
                        </span>
                      </div>

                      <div className="flex justify-between items-center mb-4">
                        <p className="text-xl font-extrabold text-[#071d49]">
                          {course.price}
                          <span className="ml-1 text-xs font-semibold text-slate-400">EGP</span>
                        </p>
                      </div>

                      <div className="mt-auto flex gap-2">
                        <button
                          onClick={() => handleAddToCart(course)}
                          className="flex-1 flex items-center justify-center gap-2 bg-[#071d49] text-[#ffd100] px-3 py-2.5 rounded-xl hover:bg-[#ffd100] hover:text-[#071d49] transition text-sm font-bold"
                        >
                          <FaShoppingCart /> Add to Cart
                        </button>

                        <button
                          onClick={() => handleAddToWishlist(course)}
                          className="flex items-center justify-center gap-2 bg-[#f4f7fb] text-[#071d49] px-3 py-2.5 rounded-xl hover:bg-[#ffd100] transition text-sm font-semibold border border-[#e8edf5]"
                          aria-label="Add to wishlist"
                        >
                          <FaHeart />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-500 min-h-[50vh]">
                <FaBookOpen className="text-5xl mb-3 text-[#071d49]/40" />
                <p className="text-xl font-medium text-[#071d49]">No Courses Available</p>
              </div>
            )}
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10 gap-2">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => goToPage(index + 1)}
                    className={`h-10 w-10 rounded-full border font-semibold ${
                      currentPage === index + 1
                        ? "bg-[#071d49] text-[#ffd100] border-[#071d49] cursor-pointer"
                        : "bg-white text-[#071d49] border-[#e8edf5] cursor-pointer hover:bg-[#ffd100]/30"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
