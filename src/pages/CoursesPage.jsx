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
    <div className="bg-[#f4f7fb] min-h-screen px-4 md:px-6 py-8">
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="sc-eyebrow mb-2">Catalog</span>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-[#071d49]">All Courses</h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search bar */}
              <div className="flex items-center border border-[rgba(7,29,73,0.12)] rounded-xl px-3 py-2 bg-white shadow-sm min-w-[200px]">
                <Search size={18} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent border-none outline-none px-2 w-full text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Go to Cart Button */}
              <button
                onClick={() => navigate("/cart")}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-[#ffd100] text-[#071d49] font-bold hover:brightness-105 transition-all shadow-[0_8px_20px_rgba(255,209,0,0.3)]"
              >
                Go to Cart
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#ffd100] border-t-[#071d49]"></div>
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
          <div className="flex justify-center mt-8 gap-2">
            <button className="h-9 w-9 border border-[rgba(7,29,73,0.12)] rounded-full bg-[#071d49] text-[#ffd100] font-semibold">
              1
            </button>
            <button className="h-9 w-9 border border-[rgba(7,29,73,0.12)] rounded-full bg-white text-[#071d49] hover:bg-[#ffd100]/30 transition">2</button>
            <button className="h-9 w-9 border border-[rgba(7,29,73,0.12)] rounded-full bg-white text-[#071d49] hover:bg-[#ffd100]/30 transition">3</button>
          </div>
        </div>

        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 shrink-0 bg-white rounded-2xl border border-[rgba(7,29,73,0.08)] shadow-[0_12px_35px_rgba(7,29,73,0.08)] p-5 h-fit lg:sticky lg:top-24">
          {/* Category */}
          <div className="mb-6">
            <h3 className="font-bold text-[#071d49] mb-3 text-sm uppercase tracking-wide">Course Category</h3>
            {categories.map((cat) => (
              <label key={cat} className="flex items-center space-x-2 text-sm mb-2 text-slate-600">
                <input
                  type="checkbox"
                  className="accent-[#ffd100]"
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
            <h3 className="font-bold text-[#071d49] mb-3 text-sm uppercase tracking-wide">Instructors</h3>
            {instructors.map((name) => (
              <label key={name} className="flex items-center space-x-2 text-sm mb-2 text-slate-600">
                <input
                  type="checkbox"
                  className="accent-[#ffd100]"
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
            <h3 className="font-bold text-[#071d49] mb-3 text-sm uppercase tracking-wide">Price</h3>
            <label className="flex items-center space-x-2 text-sm mb-2 text-slate-600">
              <input
                type="radio"
                name="price"
                className="accent-[#ffd100]"
                checked={priceFilter === ""}
                onChange={() => setPriceFilter("")}
              />
              <span>All</span>
            </label>
            <label className="flex items-center space-x-2 text-sm mb-2 text-slate-600">
              <input
                type="radio"
                name="price"
                className="accent-[#ffd100]"
                checked={priceFilter === "free"}
                onChange={() => setPriceFilter("free")}
              />
              <span>Free</span>
            </label>
            <label className="flex items-center space-x-2 text-sm mb-2 text-slate-600">
              <input
                type="radio"
                name="price"
                className="accent-[#ffd100]"
                checked={priceFilter === "paid"}
                onChange={() => setPriceFilter("paid")}
              />
              <span>Paid</span>
            </label>
          </div>

          {/* Review */}
          <div className="mb-6">
            <h3 className="font-bold text-[#071d49] mb-3 text-sm uppercase tracking-wide">Review</h3>
            {[5, 4, 3, 2, 1].map((stars) => (
              <label key={stars} className="flex items-center space-x-2 text-sm mb-2 text-slate-600">
                <input
                  type="radio"
                  name="rating"
                  className="accent-[#ffd100]"
                  checked={ratingFilter === stars}
                  onChange={() => setRatingFilter(stars)}
                />
                <span>{"⭐".repeat(stars)}</span>
              </label>
            ))}
          </div>

          {/* Level */}
          <div>
            <h3 className="font-bold text-[#071d49] mb-3 text-sm uppercase tracking-wide">Level</h3>
            {levels.map((level) => (
              <label key={level} className="flex items-center space-x-2 text-sm mb-2 text-slate-600">
                <input
                  type="checkbox"
                  className="accent-[#ffd100]"
                  checked={levelFilter.includes(level)}
                  onChange={() =>
                    toggleCheckbox(level, setLevelFilter, levelFilter)
                  }
                />
                <span>{level}</span>
              </label>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CoursesPage;
