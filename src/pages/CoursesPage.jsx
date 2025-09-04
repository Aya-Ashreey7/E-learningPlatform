// src/pages/CoursesPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Search, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext"; // ✅ Import cart context

const CoursesPage = () => {
  const { addToCart } = useCart(); // ✅ Get addToCart from context

  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [instructorFilter, setInstructorFilter] = useState([]);
  const [priceFilter, setPriceFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState(null);
  const [levelFilter, setLevelFilter] = useState([]);

  // Dynamic filter options
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [levels, setLevels] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Courses"));
        const fetched = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const uniqueCategories = [...new Set(fetched.map((c) => c.category))];
        const uniqueInstructors = [...new Set(fetched.map((c) => c.instructor))];
        const uniqueLevels = [...new Set(fetched.map((c) => c.level))];

        setCategories(uniqueCategories);
        setInstructors(uniqueInstructors);
        setLevels(uniqueLevels);

        setCourses(fetched);
        setFilteredCourses(fetched);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Apply filters
  useEffect(() => {
    let updated = [...courses];

    if (searchTerm.trim()) {
      updated = updated.filter((c) =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter.length > 0) {
      updated = updated.filter((c) => categoryFilter.includes(c.category));
    }

    if (instructorFilter.length > 0) {
      updated = updated.filter((c) => instructorFilter.includes(c.instructor));
    }

    if (priceFilter === "free") {
      updated = updated.filter((c) => c.price === 0);
    } else if (priceFilter === "paid") {
      updated = updated.filter((c) => c.price > 0);
    }

    if (ratingFilter) {
      updated = updated.filter((c) => c.rating >= ratingFilter);
    }

    if (levelFilter.length > 0) {
      updated = updated.filter((c) => levelFilter.includes(c.level));
    }

    setFilteredCourses(updated);
  }, [
    searchTerm,
    categoryFilter,
    instructorFilter,
    priceFilter,
    ratingFilter,
    levelFilter,
    courses,
  ]);

  const toggleCheckbox = (value, setState, state) => {
    if (state.includes(value)) {
      setState(state.filter((v) => v !== value));
    } else {
      setState([...state, value]);
    }
  };

  return (
    <div className="bg-white min-h-screen px-6 py-8">
      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">All Courses</h1>

            <div className="flex items-center gap-3">
              {/* Search bar */}
              <div className="flex items-center border rounded px-3 py-1 bg-gray-50">
                <Search size={18} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent border-none outline-none px-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Go to Cart Button */}
              <button
                onClick={() => navigate("/cart")}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[#ffd100] text-[#071d49] font-semibold hover:bg-[#ffcd00]/90 transition-all"
              >
                Go to Cart
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex items-center justify-center min-h-screen -translate-y-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-[#071d49]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onAddToCart={() => addToCart(course)} // ✅ Add to Cart action
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <button className="px-3 py-1 border rounded-full mx-1 bg-black text-white">
              1
            </button>
            <button className="px-3 py-1 border rounded-full mx-1">2</button>
            <button className="px-3 py-1 border rounded-full mx-1">3</button>
          </div>
        </div>

        {/* Sidebar Filters */}
        <div className="w-64 shrink-0">
          {/* Category */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">Course Category</h3>
            {categories.map((cat) => (
              <label key={cat} className="flex items-center space-x-2 text-sm mb-1">
                <input
                  type="checkbox"
                  checked={categoryFilter.includes(cat)}
                  onChange={() =>
                    toggleCheckbox(cat, setCategoryFilter, categoryFilter)
                  }
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>

          {/* Instructor */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">Instructors</h3>
            {instructors.map((name) => (
              <label key={name} className="flex items-center space-x-2 text-sm mb-1">
                <input
                  type="checkbox"
                  checked={instructorFilter.includes(name)}
                  onChange={() =>
                    toggleCheckbox(name, setInstructorFilter, instructorFilter)
                  }
                />
                <span>{name}</span>
              </label>
            ))}
          </div>

          {/* Price */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">Price</h3>
            <label className="flex items-center space-x-2 text-sm mb-1">
              <input
                type="radio"
                name="price"
                checked={priceFilter === ""}
                onChange={() => setPriceFilter("")}
              />
              <span>All</span>
            </label>
            <label className="flex items-center space-x-2 text-sm mb-1">
              <input
                type="radio"
                name="price"
                checked={priceFilter === "free"}
                onChange={() => setPriceFilter("free")}
              />
              <span>Free</span>
            </label>
            <label className="flex items-center space-x-2 text-sm mb-1">
              <input
                type="radio"
                name="price"
                checked={priceFilter === "paid"}
                onChange={() => setPriceFilter("paid")}
              />
              <span>Paid</span>
            </label>
          </div>

          {/* Review */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">Review</h3>
            {[5, 4, 3, 2, 1].map((stars) => (
              <label key={stars} className="flex items-center space-x-2 text-sm mb-1">
                <input
                  type="radio"
                  name="rating"
                  checked={ratingFilter === stars}
                  onChange={() => setRatingFilter(stars)}
                />
                <span>{"⭐".repeat(stars)}</span>
              </label>
            ))}
          </div>

          {/* Level */}
          <div className="mb-6">
            <h3 className="font-bold mb-2">Level</h3>
            {levels.map((level) => (
              <label key={level} className="flex items-center space-x-2 text-sm mb-1">
                <input
                  type="checkbox"
                  checked={levelFilter.includes(level)}
                  onChange={() =>
                    toggleCheckbox(level, setLevelFilter, levelFilter)
                  }
                />
                <span>{level}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
