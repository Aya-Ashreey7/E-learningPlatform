import { useState, useEffect, memo } from "react";
import Navbar from "../components/Navbar/Navbar";
import { FaStar, FaBook, FaGraduationCap, FaLaptop } from "react-icons/fa";
import CoursesList from "../components/CoursesKids/CoursesList";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

// SearchBar مفصول ومستقل مع React.memo
const SearchBar = memo(function SearchBar({
  search,
  setSearch,
  filter,
  setFilter,
  categories,
}) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex items-center gap-4 w-full max-w-md mt-4 p-6 ml-14"
    >
      <input
        type="text"
        placeholder="Search"
        autoComplete="off"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-grow p-2 rounded-xl border border-gray-300 shadow-md 
          focus:outline-none focus:ring-2 focus:ring-[#071d49] hover:border-[#071d49]"
      />
      <div className="relative">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="appearance-none p-2 pl-8 pr-4 rounded-xl border border-gray-300 shadow-md cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-[#071d49] hover:border-[#071d49]"
        >
          <option value="all">All</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name.toLowerCase()}>
              {cat.name}
            </option>
          ))}
        </select>

        <svg
          className="w-5 h-5 absolute left-2 top-2.5 pointer-events-none text-gray-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M3 4h18M9 12h6M10 16h4" />
        </svg>
      </div>
    </form>
  );
});

export default function CourseKids() {
  const iconsList = [
    {
      id: 1,
      icon: <FaStar size={40} className="text-gray-400" />,
      top: "5%", // رفعتها من 10% لـ 5%
      left: "2%",
    },
    {
      id: 2,
      icon: <FaBook size={40} className="text-gray-400" />,
      top: "15%", // رفعتها من 30% لـ 15%
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

  // حالات البحث والفلترة
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

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
        // جلب الكورسات
        const coursesCol = collection(db, "Courses");
        const coursesSnapshot = await getDocs(coursesCol);
        const coursesList = coursesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // جلب التصنيفات
        const categoriesCol = collection(db, "Categories");
        const categoriesSnapshot = await getDocs(categoriesCol);
        const categoriesList = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));

        setCourses(coursesList);
        setCategories(categoriesList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // بناء خريطة من category_id -> category name
  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {});

  // فلترة الكورسات حسب البحث والفلتر
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

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-[#f9f9f9] overflow-hidden">
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

        <SearchBar
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
          categories={categories}
        />

        {loading ? (
          <p className="text-center mt-6 text-gray-500">Loading courses...</p>
        ) : (
          <CoursesList courses={filteredCourses} categoryMap={categoryMap} />
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
    </>
  );
}
