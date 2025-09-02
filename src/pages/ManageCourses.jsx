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
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editCourseId, setEditCourseId] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);

  const [editFormData, setEditFormData] = useState({
    title: "",
    category_id: "",
    instructor: "",
    price: "",
    duration: "",
    audience: "",
    trainees_count: "",
    certificate: "",
    lectures_availability: "",
    description: "",
    image: "",
    startDate: "",
    endDate: "",
  });

  const [categories, setCategories] = useState([]);

  const toBool = (v) => {
    if (typeof v === "boolean") return v;
    if (typeof v === "number") return v !== 0;
    if (typeof v === "string") {
      const s = v.trim().toLowerCase();
      if (["true", "yes", "1", "y"].includes(s)) return true;
      if (["false", "no", "0", "n"].includes(s)) return false;
      return null;
    }
    return null;
  };

  const normalizeLectures = (v) => {
    if (typeof v === "boolean") return v ? "Available" : "Unavailable";
    if (typeof v === "string" && v.trim() !== "") return v;
    return "";
  };

  const parseNumber = (v, fallback = 0) => {
    if (typeof v === "number") return v;
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : fallback;
  };

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "Courses"));
      const data = querySnapshot.docs.map((d) => {
        const raw = d.data();

        const traineesRaw =
          raw.trainees_count ??
          raw.trainees ??
          raw.training ??
          raw.training_count ??
          raw.traineesCount ??
          raw.students ??
          raw.enrolled ??
          0;

        const certRaw =
          raw.certificate ??
          raw.has_certificate ??
          raw.includes_certificate ??
          raw.certificate_included ??
          raw.is_certified ??
          raw.certified ??
          null;

        const lecturesRaw =
          raw.lectures_availability ??
          raw.lectures ??
          raw.lecturesAvailability ??
          raw.availability ??
          raw.lectures_status ??
          "";

        const audienceRaw = raw.audience ?? "";

        return {
          id: d.id,
          ...raw,
          trainees_count: parseNumber(traineesRaw, 0),
          certificate: toBool(certRaw),
          lectures_availability: normalizeLectures(lecturesRaw),
          audience: audienceRaw,
        };
      });

      setCourses(data);
      setLoading(false);
    }
    fetchCourses();
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "Categories"));
      const cats = querySnapshot.docs.map((docu) => ({
        id: docu.id,
        name: docu.data().name,
      }));
      setCategories(cats);
      setLoading(false);
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
      title: course.title || "",
      category_id: course.category_id || "",
      instructor: course.instructor || "",
      price: course.price ?? "",
      duration: course.duration || "",
      audience: course.audience || "",
      trainees_count: String(course.trainees_count ?? "0"),
      certificate:
        course.certificate === true
          ? "true"
          : course.certificate === false
          ? "false"
          : "",
      lectures_availability: course.lectures_availability || "",
      description: course.description || "",
      image: course.image || "",
      startDate: course.startDate || "",
      endDate: course.endDate || "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    if (!editCourseId) return;

    let imageUrl = editFormData.image;

    if (editImageFile) {
      toast.info("Uploading image...");
      imageUrl = await uploadImageCloudinary(editImageFile);
      toast.dismiss();
    }
    // نحفظ بالمفاتيح القياسية
    const payload = {
      title: editFormData.title,
      category_id: editFormData.category_id,
      instructor: editFormData.instructor,
      price:
        editFormData.price === "" || editFormData.price === null
          ? 0
          : Number(editFormData.price),
      duration: editFormData.duration,
      audience: editFormData.audience || "",
      trainees_count:
        editFormData.trainees_count === "" ||
        editFormData.trainees_count === null
          ? 0
          : parseInt(editFormData.trainees_count, 10) || 0,
      certificate:
        editFormData.certificate === true ||
        editFormData.certificate === "true",
      lectures_availability: editFormData.lectures_availability || "",
      description: editFormData.description,
      image: imageUrl,
      startDate: editFormData.startDate || "",
      endDate: editFormData.endDate || "",
    };

    const docRef = doc(db, "Courses", editCourseId);
    await updateDoc(docRef, payload);

    setCourses((prev) =>
      prev.map((course) =>
        course.id === editCourseId
          ? {
              ...course,
              ...payload,
            }
          : course
      )
    );

    toast.success("Course updated successfully");
    setEditCourseId(null);
    setEditImageFile(null);
  };

  const getCategoryName = (catId) => {
    const category = categories.find((cat) => cat.id === catId);
    return category ? category.name : "Unknown Category";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen -translate-y-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-[#071d49]"></div>
        </div>
      </DashboardLayout>
    );
  }

  const LECTURE_OPTIONS = ["Available", "Unavailable"];

  const uploadImageCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "admin_courses");
    data.append("cloud_name", "dciqod9kj");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dciqod9kj/image/upload",
      {
        method: "post",
        body: data,
      }
    );
    const json = await res.json();
    return json.secure_url;
  };

  return (
    <DashboardLayout>
      <div className="p-1 min-h-screen bg-[#fff]">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-4">
          <h2 className="text-2xl font-bold text-[#071d49]">Manage Courses</h2>
          <input
            type="text"
            placeholder="Search by any detail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-2 border-[#071d49] focus:border-[#fad947]  
       p-2 rounded-lg w-full md:w-1/3 
       text-[#071d49] placeholder-gray-400 outline-none transition"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] bg-white border border-gray-300 rounded-lg shadow-md text-center">
            <thead className="bg-[#ffd100] text-[#071d49]">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Instructor</th>
                <th className="p-3">Price</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Audience</th>
                <th className="p-3">Trainees</th>
                <th className="p-3">Certificate</th>
                <th className="p-3">Lectures</th>
                <th className="p-3">Start Date</th>
                <th className="p-3">End Date</th>
                <th className="p-3">Description</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {courses
                .filter((course) => {
                  const s = search.toLowerCase();
                  const certText =
                    course.certificate === true
                      ? "yes"
                      : course.certificate === false
                      ? "no"
                      : "n/a";
                  return (
                    course.title?.toLowerCase().includes(s) ||
                    course.instructor?.toLowerCase().includes(s) ||
                    getCategoryName(course.category_id)
                      ?.toLowerCase()
                      .includes(s) ||
                    String(course.price ?? "")
                      .toLowerCase()
                      .includes(s) ||
                    course.duration?.toLowerCase().includes(s) ||
                    course.description?.toLowerCase().includes(s) ||
                    course.audience?.toLowerCase().includes(s) ||
                    String(course.trainees_count ?? "")
                      .toLowerCase()
                      .includes(s) ||
                    (course.lectures_availability || "")
                      .toLowerCase()
                      .includes(s) ||
                    certText.includes(s)
                  );
                })
                .map((course) => (
                  <tr key={course.id} className="border-t border-gray-200">
                    <td className="p-3">
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
                    <td className="p-3">
                      {getCategoryName(course.category_id)}
                    </td>
                    <td className="p-3">{course.instructor}</td>
                    <td className="p-3">{course.price}</td>
                    <td className="p-3">{course.duration}</td>
                    <td className="p-3">{course.audience || "N/A"}</td>
                    <td className="p-3">{course.trainees_count ?? 0}</td>
                    <td className="p-3">
                      {course.certificate === true
                        ? "Yes"
                        : course.certificate === false
                        ? "No"
                        : "N/A"}
                    </td>
                    <td className="p-3">
                      {course.lectures_availability || "N/A"}
                    </td>
                    <td className="p-3">{course.startDate || "—"}</td>
                    <td className="p-3">{course.endDate || "—"}</td>
                    <td className="p-3 max-w-xs group relative">
                      {course.description && course.description.length > 100 ? (
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
                        course.description || "—"
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
            <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg overflow-y-auto max-h-[90vh]">
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
                  type="number"
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

                <select
                  name="audience"
                  value={editFormData.audience || ""}
                  onChange={handleEditChange}
                  className="border p-2 rounded w-full bg-[#e2e8f0] text-[#071d49]"
                >
                  <option value="" disabled>
                    Select audience
                  </option>
                  <option value="Kids">Kids</option>
                  <option value="Adults">Adults</option>
                </select>

                <input
                  type="number"
                  min="0"
                  name="trainees_count"
                  value={editFormData.trainees_count}
                  onChange={handleEditChange}
                  className="border p-2 rounded"
                  placeholder="Number of trainees"
                />

                {/* شهادة */}
                <select
                  name="certificate"
                  value={editFormData.certificate}
                  onChange={handleEditChange}
                  className="border p-2 rounded w-full bg-[#e2e8f0] text-[#071d49]"
                >
                  <option value="" disabled>
                    Includes certificate?
                  </option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>

                {/* توفر المحاضرات */}
                <select
                  name="lectures_availability"
                  value={editFormData.lectures_availability}
                  onChange={handleEditChange}
                  className="border p-2 rounded w-full bg-[#e2e8f0] text-[#071d49]"
                >
                  <option value="" disabled>
                    Lectures availability
                  </option>
                  {/* لو القيمة الحالية مختلفة (مثلاً Recorded/Live) هنظهرها عشان متختفيش */}
                  {!LECTURE_OPTIONS.includes(
                    editFormData.lectures_availability
                  ) &&
                    editFormData.lectures_availability && (
                      <option value={editFormData.lectures_availability}>
                        {editFormData.lectures_availability}
                      </option>
                    )}
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
                <label className="block font-semibold text-[#071d49]">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={editFormData.startDate}
                  onChange={handleEditChange}
                  className="border p-2 rounded"
                />

                <label className="block font-semibold text-[#071d49]">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={editFormData.endDate}
                  onChange={handleEditChange}
                  className="border p-2 rounded"
                />

                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  className="border p-2 rounded"
                  placeholder="Description"
                />

                <label className="block font-semibold text-[#071d49]">
                  Course Image
                </label>
                {editFormData.image && (
                  <img
                    src={editFormData.image}
                    alt="Course"
                    className="w-24 h-24 object-cover rounded my-2"
                  />
                )}
                <input
                  type="file"
                  onChange={(e) => setEditImageFile(e.target.files[0])}
                  className="border p-2 rounded w-full bg-[#e2e8f0] text-[#071d49]"
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
