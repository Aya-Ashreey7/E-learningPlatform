import { useState, useEffect, memo } from "react";
import Navbar from "../components/Navbar/Navbar";
import { FaStar, FaBook, FaGraduationCap, FaLaptop } from "react-icons/fa";
import { Search, X, ChevronDown, SlidersHorizontal } from "lucide-react";
import CoursesList from "../components/CoursesKids/CoursesList";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import Footer from "../components/Footer/Footer";

const SearchBar = memo(function SearchBar({
  search,
  setSearch,
  filter,
  setFilter,
  categories,
  resultsCount,
}) {
  const hasActiveFilters = search.trim() !== "" || filter !== "all";

  const clearAll = () => {
    setSearch("");
    setFilter("all");
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 md:px-6 mt-6 mb-2">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="bg-white border border-[#e8edf5] rounded-2xl shadow-sm p-3 md:p-4"
      >
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#071d49]/45 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search kids courses by name or category..."
              autoComplete="off"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-11 pr-10 rounded-xl border border-[#e8edf5] bg-[#f8fafc] text-[#071d49] placeholder:text-slate-400 outline-none focus:border-[#ffd100] focus:ring-4 focus:ring-[#ffd100]/25 transition"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
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
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full h-12 appearance-none cursor-pointer pl-10 pr-10 rounded-xl border border-[#e8edf5] bg-[#f8fafc] text-[#071d49] font-medium outline-none focus:border-[#ffd100] focus:ring-4 focus:ring-[#ffd100]/25 transition"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name.toLowerCase()}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#071d49]/50 pointer-events-none"
            />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="h-12 px-4 rounded-xl border border-[#e8edf5] bg-white text-[#071d49] font-semibold hover:bg-[#ffd100] hover:border-[#ffd100] transition whitespace-nowrap"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between text-sm text-slate-500 px-1">
          <span>
            {typeof resultsCount === "number" ? (
              <>
                Showing{" "}
                <span className="font-semibold text-[#071d49]">{resultsCount}</span>{" "}
                course{resultsCount === 1 ? "" : "s"}
              </>
            ) : (
              "Filter courses"
            )}
          </span>
          {filter !== "all" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#071d49] text-[#ffd100] text-xs font-bold px-2.5 py-1">
              {filter}
            </span>
          )}
        </div>
      </form>
    </div>
  );
});

export default function CourseKids() {
  const iconsList = [
    {
      id: 1,
      icon: <FaStar size={40} className="text-gray-400" />,
      top: "5%",
      left: "2%",
    },
    {
      id: 2,
      icon: <FaBook size={40} className="text-gray-400" />,
      top: "15%",
      left: "2%",
    },
    {
      id: 3,
      icon: <FaGraduationCap size={40} className="text-gray-400" />,
      top: "5%",
      right: "2%",
    },
    {
      id: 4,
      icon: <FaLaptop size={40} className="text-gray-400" />,
      top: "15%",
      right: "2%",
    },
  ];

  const [visibleIcons, setVisibleIcons] = useState([
    iconsList[0],
    iconsList[1],
  ]);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;

  useEffect(() => {
    const interval = setInterval(() => {
      const shuffled = [...iconsList].sort(() => 0.5 - Math.random());
      setVisibleIcons(shuffled.slice(0, 2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // 1️⃣ هات الكورسات بتاعت الـ Kids
        const coursesCol = query(
          collection(db, "Courses"),
          where("audience", "==", "Kids")
        );
        const coursesSnapshot = await getDocs(coursesCol);
        const coursesList = coursesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // 2️⃣ هات الكاتيجوريز كلها
        const categoriesCol = collection(db, "Categories");
        const categoriesSnapshot = await getDocs(categoriesCol);
        const categoriesList = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));

        // 3️⃣ فلتر الكاتيجوريز بحيث يظهر بس اللي ليه كورسات Kids
        const categoryIdsWithCourses = new Set(
          coursesList.map((course) => course.category_id)
        );
        const filteredCategories = categoriesList.filter((cat) =>
          categoryIdsWithCourses.has(cat.id)
        );

        setCourses(coursesList);
        setCategories(filteredCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {});

  const filteredCourses = courses.filter((course) => {
    const courseCategoryName = categoryMap[course.category_id] || "";

    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      courseCategoryName.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      courseCategoryName.toLowerCase() === filter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  // Pagination calculations
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-[#f4f7fb] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {visibleIcons.map((item) => (
            <div
              key={item.id}
              className="absolute pointer-events-none animate-fadeOpacity"
              style={{
                top: item.top,
                ...(item.left ? { left: item.left } : {}),
                ...(item.right ? { right: item.right } : {}),
              }}
            >
              {item.icon}
            </div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 pt-10">
          <span className="sc-eyebrow mb-3">Kids Track</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#071d49]">
            Kids Courses
          </h1>
          <p className="text-slate-500 mt-2 max-w-xl">
            Fun, safe, and engaging learning experiences designed for young minds.
          </p>
        </div>

        <SearchBar
          search={search}
          setSearch={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          filter={filter}
          setFilter={(value) => {
            setFilter(value);
            setCurrentPage(1);
          }}
          categories={categories}
          resultsCount={filteredCourses.length}
        />

        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#ffd100] border-t-[#071d49]"></div>
          </div>
        ) : (
          <>
            <CoursesList courses={currentCourses} categoryMap={categoryMap} />

            {/* Pagination buttons only if there are courses */}
            {filteredCourses.length > 0 && (
              <div className="flex justify-center mt-6 mb-10 gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className="px-4 py-2 rounded-xl bg-white border border-[rgba(7,29,73,0.1)] text-[#071d49] cursor-pointer hover:bg-[#ffd100]/25 transition"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`h-10 w-10 rounded-full font-semibold ${currentPage === index + 1
                        ? "bg-[#071d49] text-[#ffd100] cursor-pointer"
                        : "bg-white border border-[rgba(7,29,73,0.1)] text-[#071d49] cursor-pointer hover:bg-[#ffd100]/25"
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className="px-4 py-2 rounded-xl bg-white border border-[rgba(7,29,73,0.1)] text-[#071d49] cursor-pointer hover:bg-[#ffd100]/25 transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
          @keyframes fadeOpacity {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.7; }
          }
          .animate-fadeOpacity {
            animation: fadeOpacity 3s ease-in-out infinite;
          }
        `}</style>
      <Footer />
    </>
  );
}
