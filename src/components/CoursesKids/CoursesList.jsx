import CourseCard from "./CourseCard ";
import { FaBookOpen } from "react-icons/fa";

export default function CoursesList({ courses, categoryMap }) {
  if (!courses.length) {
    return (
      <div className="flex flex-col items-center mt-30 text-gray-500">
        <FaBookOpen className="text-6xl mb-2  animate-bounce" />
        <p className="text-xl">No Courses Available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-6 justify-center p-6">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          id={course.id}
          image={course.image || "/default-image.jpg"}
          title={course.title}
          category={categoryMap[course.category_id] || "Unknown"} // هنا نستخدم الاسم بدل id
          enrolled={course.traineesCount || 0}
          price={course.price}
          duration={course.duration}
        />
      ))}
    </div>
  );
}
