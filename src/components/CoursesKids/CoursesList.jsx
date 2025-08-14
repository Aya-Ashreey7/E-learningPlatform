import CourseCard from "./CourseCard ";

export default function CoursesList({ courses, categoryMap }) {
  if (!courses.length) {
    return (
      <p className="text-center mt-6 text-gray-500">No courses available.</p>
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
