import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout/DashboardLayout";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editCourseId, setEditCourseId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    category_id: "", // استخدم category_id بدل category
    instructor: "",
    price: "",
    duration: "",
    description: "",
    image: "",
  });
  const [categories, setCategories] = useState([]);

  // جلب الدورات والكورسات
  useEffect(() => {
    async function fetchCourses() {
      const querySnapshot = await getDocs(collection(db, "Courses"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(data);
    }
    fetchCourses();
  }, []);

  // جلب الكاتيجوريز من الفايرستور
  useEffect(() => {
    async function fetchCategories() {
      const querySnapshot = await getDocs(collection(db, "Categories"));
      const cats = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setCategories(cats);
    }
    fetchCategories();
  }, []);

  const handleShowDescription = (desc) => {
    setSelectedDescription(desc);
    setShowModal(true);
  };

  const handleDeleteClick = (courseId) => {
    setConfirmDeleteId(courseId);
  };

  const confirmDelete = async () => {
    if (confirmDeleteId) {
      await deleteDoc(doc(db, "Courses", confirmDeleteId));
      setCourses((prev) =>
        prev.filter((course) => course.id !== confirmDeleteId)
      );
      toast.success("Course deleted successfully");
      setConfirmDeleteId(null);
    }
  };

  const handleEditClick = (course) => {
    setEditCourseId(course.id);
    setEditFormData({
      title: course.title,
      category_id: course.category_id || "", // تأكد من استخدام category_id هنا
      instructor: course.instructor,
      price: course.price,
      duration: course.duration,
      description: course.description,
      image: course.image || "",
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveEdit = async () => {
    if (!editCourseId) return;

    const docRef = doc(db, "Courses", editCourseId);
    await updateDoc(docRef, editFormData);

    setCourses((prev) =>
      prev.map((course) =>
        course.id === editCourseId ? { ...course, ...editFormData } : course
      )
    );

    toast.success("Course updated successfully");
    setEditCourseId(null);
  };

  // دالة مساعدة للحصول على اسم الفئة من الـ id
  const getCategoryName = (catId) => {
    const category = categories.find((cat) => cat.id === catId);
    return category ? category.name : "Unknown Category";
  };

  return (
    <DashboardLayout>
      <div className="p-6 min-h-screen bg-[#fff]">
        <h2 className="text-2xl font-bold text-[#071d49] pb-4">
          Manage Courses
        </h2>
        <div>
          <table className="min-w-[1200px] bg-white border border-gray-300 rounded-lg shadow-md text-center">
            <thead className="bg-[#ffd100] text-[#071d49]">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Instructor</th>
                <th className="p-3">Price</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Description</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-t border-gray-200">
                  <td className="p-6">
                    {course.image ? (
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    ) : (
                      "No image"
                    )}
                  </td>
                  <td className="p-3">{course.title}</td>
                  <td className="p-3">{getCategoryName(course.category_id)}</td>
                  <td className="p-3">{course.instructor}</td>
                  <td className="p-3">{course.price}</td>
                  <td className="p-3">{course.duration}</td>
                  <td className="p-3 max-w-xs group relative">
                    {course.description.length > 100 ? (
                      <>
                        <span className="truncate block">
                          {course.description.slice(0, 100)}...
                        </span>
                        <div className="overflow-hidden transition-all duration-300 max-h-0 opacity-0 group-hover:max-h-10 group-hover:opacity-100 flex justify-end">
                          <button
                            className="mt-2 text-sm bg-[#071d49] text-white px-2 py-1 rounded hover:bg-[#ffd100] hover:text-[#071d49] transition"
                            onClick={() =>
                              handleShowDescription(course.description)
                            }
                          >
                            Show All
                          </button>
                        </div>
                      </>
                    ) : (
                      course.description
                    )}
                  </td>
                  <td>
                    <div className="p-3 flex gap-2 justify-center">
                      <button
                        onClick={() => handleEditClick(course)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(course.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Description Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg">
              <h3 className="text-xl font-bold text-[#071d49] mb-4">
                Course Description
              </h3>
              <p className="text-gray-700 mb-6">{selectedDescription}</p>
              <div className="text-right">
                <button
                  className="bg-[#071d49] hover:bg-[#ffd100] text-white font-bold py-2 px-4 rounded transition"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Delete Modal */}
        {confirmDeleteId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg text-center">
              <h3 className="text-lg font-bold mb-4">Are you sure?</h3>
              <p className="mb-6 text-gray-600">
                Once deleted, this course cannot be restored.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editCourseId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg">
              <h3 className="text-xl font-bold mb-4">Edit Course</h3>
              <div className="flex flex-col gap-3">
                <input
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditChange}
                  className="border p-2 rounded"
                  placeholder="Title"
                />
                <select
                  name="category_id"
                  value={editFormData.category_id}
                  onChange={handleEditChange}
                  className="border p-2 rounded w-full bg-[#e2e8f0] text-[#071d49]"
                >
                  <option value="" disabled>
                    Select a category
                  </option>

                  {!categories.some(
                    (cat) => cat.id === editFormData.category_id
                  ) &&
                    editFormData.category_id && (
                      <option value={editFormData.category_id}>
                        Unknown Category ({editFormData.category_id})
                      </option>
                    )}

                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <input
                  name="instructor"
                  value={editFormData.instructor}
                  onChange={handleEditChange}
                  className="border p-2 rounded"
                  placeholder="Instructor"
                />
                <input
                  name="price"
                  value={editFormData.price}
                  onChange={handleEditChange}
                  className="border p-2 rounded"
                  placeholder="Price"
                />
                <input
                  name="duration"
                  value={editFormData.duration}
                  onChange={handleEditChange}
                  className="border p-2 rounded"
                  placeholder="Duration"
                />
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  className="border p-2 rounded"
                  placeholder="Description"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={handleSaveEdit}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditCourseId(null)}
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </DashboardLayout>
  );
}
