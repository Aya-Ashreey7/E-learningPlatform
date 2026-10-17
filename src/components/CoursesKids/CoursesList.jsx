import CourseCard from "./CourseCard ";
import { FaBookOpen } from "react-icons/fa";

export default function CoursesList({ courses, categoryMap }) {
  if (!courses.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500">
        <FaBookOpen className="text-5xl mb-3 text-[#071d49]/40" />
        <p className="text-xl font-medium text-[#071d49]">No Courses Available</p>
        <p className="text-sm mt-1">Try another search or category filter.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6 max-w-7xl mx-auto">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          id={course.id}
          image={course.image || "/default-image.jpg"}
          title={course.title}
          category={categoryMap[course.category_id] || "Unknown"}
          enrolled={course.traineesCount || 0}
          price={course.price}
          duration={course.duration}
        />
      ))}
    </div>
  );
}
