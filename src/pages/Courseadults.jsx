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
      <div className="min-h-screen bg-white py-10 px-6">
        {/* Loading Spinner */}
        {loading ? (
          <div className="flex items-center justify-center min-h-screen -translate-y-24">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-[#071d49]"></div>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
              <input
                type="text"
                placeholder="Search by course name..."
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#071d49]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <select
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#071d49]"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
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

              {/* <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#071d49]"
            value={jobFunctionFilter}
            onChange={(e) => setJobFunctionFilter(e.target.value)}
          >
            <option value="">All Job Functions</option>
            {jobFunctions.map((job, i) => (
              <option key={i} value={job}>
                {job}
              </option>
            ))}
          </select> */}
            </div>

            {/* Courses Grid */}
            {filteredCourses.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
                {currentCourses.map((course) => (
                  <div
                    key={course.id}
                    className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-500 border border-gray-200 w-full flex flex-col h-full"
                  >
                    {/* صورة الكورس */}
                    <Link to={`/course/${course.id}`} className="block">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-48 object-cover transform group-hover:scale-105 transition duration-500"
                      />
                    </Link>

                    {/* تفاصيل الكورس */}
                    <div className="p-5 flex flex-col flex-grow">
                      {/* العنوان + الوصف */}
                      <div>
                        <h2 className="text-xl font-bold text-[#071d49] group-hover:text-[#ffd100] transition mb-3">
                          {course.title}
                        </h2>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {course.description}
                        </p>
                      </div>

                      {/* 👇 دا اللي بيضمن إن الجزء اللي تحت يثبت في نفس المستوى */}
                      <div className="flex-grow"></div>

                      {/* Duration & Trainees */}
                      <div className="flex justify-between text-base text-gray-600 font-medium mb-3">
                        <span className="flex items-center">
                          <FaClock className="mr-2 text-[#ffd100]" />{" "}
                          {course.duration}h
                        </span>
                        <span className="flex items-center">
                          <FaUsers className="mr-2 text-[#ffd100]" />{" "}
                          {course.traineesCount}
                        </span>
                      </div>

                      {/* السعر + الكاتيجوري */}
                      <div className="flex justify-between items-center mb-5">
                        <p className="text-xl font-extrabold text-[#071d49]">
                          {course.price} EGP
                        </p>
                        <span className="px-3 py-1 bg-[#071d49] text-[#ffd100] rounded-full text-xs">
                          {course.categoryName}
                        </span>
                      </div>

                      {/* الأزرار */}
                      <div className="mt-auto flex gap-3">
                        <button
                          onClick={() => handleAddToCart(course)}
                          className="flex-1 flex items-center justify-center gap-2 bg-[#071d49] text-[#ffd100] px-4 py-2 rounded-lg hover:bg-[#ffd100] hover:text-[#071d49] transition text-sm"
                        >
                          <FaShoppingCart /> Add to Cart
                        </button>

                        <button
                          onClick={() => handleAddToWishlist(course)}
                          className="flex items-center justify-center gap-2 bg-gray-100 text-[#071d49] px-4 py-2 rounded-lg hover:bg-[#ffd100] hover:text-[#071d49] transition text-sm"
                        >
                          <FaHeart /> Wishlist
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500 min-h-[50vh]  ">
                <FaBookOpen className="text-6xl mb-2 animate-bounce" />
                <p className="text-xl">No Courses Available</p>
              </div>
            )}
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => goToPage(index + 1)}
                    className={`px-4 py-2 rounded-lg border ${
                      currentPage === index + 1
                        ? "bg-[#071d49] text-white cursor-pointer"
                        : "bg-white text-[#071d49] cursor-pointer"
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
