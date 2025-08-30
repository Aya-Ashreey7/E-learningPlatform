import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [level, setLevel] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      const docRef = doc(db, "Courses", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCourse({ id: docSnap.id, ...docSnap.data() });

      const courseData = docSnap.data();
setCourse({ id: docSnap.id, ...courseData });

// لو الكورس Adult
if (courseData.audience === "Adults" && courseData.category_id) {
  const q = query(
    collection(db, "Courses"),
    where("category_id", "==", courseData.category_id),
    where("audience", "==", "Adults")
  );

  const querySnap = await getDocs(q);
  const related = querySnap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((c) => c.id !== id);

  setRelatedCourses(related);
} else if (courseData.category_id) {
  
  const q = query(
    collection(db, "Courses"),
    where("category_id", "==", courseData.category_id)
  );

  const querySnap = await getDocs(q);
  const related = querySnap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((c) => c.id !== id);

  setRelatedCourses(related);
}


      }
    };
    fetchCourse();
  }, [id]);

  const handleAddReview = async () => {
    if (!review.trim()) return;
    const reviewsRef = collection(db, "Courses", id, "Reviews");
    await addDoc(reviewsRef, {
      text: review,
      date: new Date(),
    });
    setReviews([...reviews, { text: review, date: new Date() }]);
    setReview("");
  };

  if (!course) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto py-10 px-6">
        {/* Main Course Section */}
        <div className="grid md:grid-cols-2 gap-8 bg-[#fff] p-6 rounded-lg shadow-md">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-64 object-cover rounded-lg"
          />

          <div>
            <h1 className="text-4xl font-bold text-[#071d49] mb-4">
              {course.title}
            </h1>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <p className="text-gray-800 font-semibold mb-2">
              Instructor: {course.instructor || "Not specified"}
            </p>

            {/* Level Selection */}
            <div className="mb-4">
              <label className="block font-semibold mb-2 text-[#071d49]">
                Choose Level:
              </label>
              <select
                className="border rounded px-3 py-2 focus:ring-2 focus:ring-[#ffd100]"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Date Selection */}
            <div className="mb-4">
              <label className="block font-semibold mb-2 text-[#071d49]">
                Available Dates:
              </label>
              <select
                className="border rounded px-3 py-2 focus:ring-2 focus:ring-[#ffd100]"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                <option value="">Select Date</option>
                {course.dates?.map((d, i) => (
                  <option key={i} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-[#071d49] mb-4">Reviews</h2>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your review..."
            className="w-full border rounded px-3 py-2 mb-2 focus:ring-2 focus:ring-[#ffd100]"
          />
          <button
            onClick={handleAddReview}
            className="bg-[#071d49] text-[#ffd100] px-4 py-2 rounded hover:bg-[#ffd100] hover:text-[#071d49] transition"
          >
            Submit Review
          </button>

          <div className="mt-4 space-y-2">
            {reviews.map((r, i) => (
              <div key={i} className="p-3 border rounded bg-gray-50">
                {r.text}
              </div>
            ))}
          </div>
        </div>

        {/* Related Courses */}
        {/* Related Courses */}
<div className="mt-10">
  <h2 className="text-2xl font-bold text-[#071d49] mb-4">
    Related Courses
  </h2>
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {relatedCourses.length > 0 ? (
      relatedCourses.map((c) => (
        <div
          key={c.id}
          onClick={() => (window.location.href = `/course/${c.id}`)}
          className="p-4 border rounded shadow bg-[#fff] hover:shadow-lg transition cursor-pointer"
        >
          <img
            src={c.image}
            alt={c.title}
            className="w-full h-40 object-cover rounded mb-3"
          />
          <h3 className="font-semibold text-[#071d49]">{c.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{c.description}</p>
        </div>
      ))
    ) : (
      <p className="text-gray-500">No related courses found.</p>
    )}
  </div>
</div>

      </div>
      <Footer />
    </>
  );
}
