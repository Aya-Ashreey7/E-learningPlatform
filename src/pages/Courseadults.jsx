import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { FaClock, FaUsers, FaHeart, FaShoppingCart } from "react-icons/fa";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../components/AuthContext/AuthContext";

export default function CourseAdults() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]); // ✅ هنا بنخزن كل الكاتيجوريز
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [jobFunctionFilter, setJobFunctionFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ نجيب الكاتيجوريز
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Categories"), (snapshot) => {
      const cats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(cats);
    });

    return () => unsubscribe();
  }, []);

  // ✅ نجيب الكورسات + نضيف معاها اسم الكاتيجوري
  useEffect(() => {
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
    });

    return () => unsubscribe();
  }, [categories]); // 👈 مهم عشان لما الكاتيجوريز تتجاب الأول

  // ✅ Wishlist
  const handleAddToWishlist = (course) => {
    if (!user) {
      alert("Please login first to add to wishlist.");
      navigate("/login");
      return;
    }

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const exists = wishlist.find((item) => item.id === course.id);

    if (!exists) {
      wishlist.push(course);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      alert("Added to Wishlist ❤️");
    } else {
      alert("This course is already in Wishlist!");
    }
  };

  // ✅ Cart
  const handleAddToCart = (course) => {
    if (!user) {
      alert("Please login first to add to cart.");
      navigate("/login");
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = cart.find((item) => item.id === course.id);

    if (!exists) {
      cart.push(course);
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Added to Cart 🛒");
    } else {
      alert("This course is already in Cart!");
    }
  };

  // ✅ Filters values
  const jobFunctions = [...new Set(courses.map((c) => c.jobFunction).filter(Boolean))];

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
        <h1 className="text-4xl font-bold text-center text-[#071d49] mb-8">
          Adult Courses
        </h1>

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
  {Array.from(new Set(courses.map((c) => c.categoryName))).map((cat) => (
    <option key={cat} value={cat}>
      {cat}
    </option>
  ))}
</select>



          <select
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
          </select>
        </div>

        {/* Courses Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {currentCourses.map((course) => (
            <div
              key={course.id}
              className="bg-[#fff] rounded-lg shadow-md hover:shadow-xl transition duration-300 border border-gray-200"
            >
              <Link to={`/course/${course.id}`} className="block">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-[#071d49] mb-2">
                    {course.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">{course.description}</p>

                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <FaClock className="mr-2 text-[#ffd100]" /> {course.duration} hours
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <FaUsers className="mr-2 text-[#ffd100]" /> {course.traineesCount} enrolled
                  </div>

                  <p className="text-xl font-bold text-[#071d49] mb-2">${course.price}</p>
                  <p className="text-sm text-gray-500">Category: {course.categoryName}</p>
                </div>
              </Link>

              <div className="flex justify-between px-6 pb-6">
                <button
                  onClick={() => handleAddToCart(course)}
                  className="flex items-center bg-[#071d49] text-[#ffd100] px-4 py-2 rounded-lg hover:bg-[#ffd100] hover:text-[#071d49] transition"
                >
                  <FaShoppingCart className="mr-2" /> Add to Cart
                </button>

                <button
                  onClick={() => handleAddToWishlist(course)}
                  className="flex items-center bg-gray-100 text-[#071d49] px-4 py-2 rounded-lg hover:bg-[#ffd100] hover:text-[#071d49] transition"
                >
                  <FaHeart className="mr-2" /> Wishlist
                </button>
              </div>
            </div>
          ))}

          {filteredCourses.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">
              No courses found.
            </p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index + 1)}
                className={`px-4 py-2 rounded-lg border ${
                  currentPage === index + 1
                    ? "bg-[#071d49] text-white"
                    : "bg-white text-[#071d49]"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
