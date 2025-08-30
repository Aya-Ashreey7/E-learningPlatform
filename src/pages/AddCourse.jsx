import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout/DashboardLayout";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";

export default function AddCourse() {
  const [title, setTilte] = useState("");
  const [description, setDescription] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [instructor, setInstructor] = useState("");
  const [price, setPrice] = useState("");
  const [audience, setAudience] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  // الحقول الجديدة
  const [traineesCount, setTraineesCount] = useState("");
  const [certificate, setCertificate] = useState(""); // Yes / No
  const [lecturesAvailability, setLecturesAvailability] = useState(""); // Yes / No

  // جلب الكاتيجوريز
  useEffect(() => {
    async function fetchCategories() {
      const querySnapshot = await getDocs(collection(db, "Categories"));
      const cats = querySnapshot.docs.map((doc) => doc.data().name);
      setCategoriesOptions(cats);
    }
    fetchCategories();
  }, []);

  // لما تختار "Add new category"
  const handleCategoryChange = (e) => {
    if (e.target.value === "add_new") {
      setShowNewCategoryInput(true);
      setCategoryName("");
    } else {
      setShowNewCategoryInput(false);
      setCategoryName(e.target.value);
    }
  };

  // حفظ الكاتيجوري الجديدة
  const handleAddNewCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      toast.error("Please enter category name");
      return;
    }

    if (categoriesOptions.includes(trimmed)) {
      toast.error("Category already exists");
      return;
    }

    setCategoriesOptions((prev) => [...prev, trimmed]);
    setCategoryName(trimmed);
    setNewCategoryName("");
    setShowNewCategoryInput(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !description.trim() ||
      !categoryName.trim() ||
      !audience.trim() ||
      !instructor.trim() ||
      !price.trim() ||
      !duration.trim() ||
      !traineesCount.trim() ||
      !certificate.trim() ||
      !lecturesAvailability.trim()
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      let imgUrl = "";
      if (image) {
        toast.loading("Uploading image...");
        imgUrl = await imagUploadCloudinary(image);
        toast.dismiss();
      }
      const categoriesRef = collection(db, "Categories");
      const q = query(categoriesRef, where("name", "==", categoryName));
      const querySnapshot = await getDocs(q);

      let categoryId;

      if (querySnapshot.empty) {
        const newCategoryDoc = await addDoc(categoriesRef, {
          name: categoryName,
        });
        categoryId = newCategoryDoc.id;
      } else {
        categoryId = querySnapshot.docs[0].id;
      }

      await addDoc(collection(db, "Courses"), {
        title,
        description,
        category_id: categoryId,
        instructor,
        price,
        duration,
        audience,
        traineesCount,
        certificate,
        lecturesAvailability,
        image: imgUrl,
      });

      setTilte("");
      setDescription("");
      setCategoryName("");
      setInstructor("");
      setPrice("");
      setDuration("");
      setTraineesCount("");
      setCertificate("");
      setLecturesAvailability("");

      toast.success("Course added successfully!");
    } catch (error) {
      console.error("Error adding course:", error);
      toast.error("Error adding course");
    } finally {
      setLoading(false);
    }
  };

  // imageHandel
  const handelImageCourse = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  // imageUploadCloudinary
  const imagUploadCloudinary = async (file) => {
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
      <div className="p-6 space-y-6 min-h-screen">
        <h2 className="text-2xl font-bold text-[#071d49] border-[#1f3261] pb-2">
          Add New Course
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Course Title */}
          <div>
            <label className="block text-base font-semibold mb-1 text-[#071d49]">
              Course Title
            </label>
            <input
              value={title}
              onChange={(e) => setTilte(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#e2e8f0] text-[#071d49]"
              type="text"
              placeholder="e.g., JavaScript for Beginners"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-base font-semibold mb-1 text-[#071d49]">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#e2e8f0] text-[#071d49]"
              rows="4"
              placeholder="Brief description of the course"
            />
          </div>

          {/* Audience */}
          <div>
            <label className="block text-base font-semibold mb-1 text-[#071d49]">
              Audience
            </label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#e2e8f0] text-[#071d49]"
              required
            >
              <option value="" disabled>
                Select audience
              </option>
              <option value="Kids">Kids</option>
              <option value="Adults">Adults</option>
            </select>
          </div>

          {/* Trainees Count */}
          <div>
            <label className="block text-base font-semibold mb-1 text-[#071d49]">
              Trainees Count
            </label>
            <input
              value={traineesCount}
              onChange={(e) => setTraineesCount(e.target.value)}
              type="number"
              className="w-full p-3 rounded-lg bg-[#e2e8f0] text-[#071d49]"
              placeholder="Number of trainees"
            />
          </div>

          {/* Certificate */}
          <div>
            <label className="block text-base font-semibold mb-1 text-[#071d49]">
              Certificate
            </label>
            <select
              value={certificate}
              onChange={(e) => setCertificate(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#e2e8f0] text-[#071d49]"
            >
              <option value="" disabled>
                Select
              </option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* Lectures Availability */}
          <div>
            <label className="block text-base font-semibold mb-1 text-[#071d49]">
              Lectures Availability
            </label>
            <select
              value={lecturesAvailability}
              onChange={(e) => setLecturesAvailability(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#e2e8f0] text-[#071d49]"
            >
              <option value="" disabled>
                Select
              </option>
              <option value="Available">Available</option>
              <option value="Not Available">Not Available</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-base font-semibold mb-1 text-[#071d49]">
              Category
            </label>
            <select
              value={categoryName}
              onChange={handleCategoryChange}
              className="w-full p-3 rounded-lg bg-[#e2e8f0] text-[#071d49]"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categoriesOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="add_new" className="font-bold text-blue-600">
                + Add new category
              </option>
            </select>

            {showNewCategoryInput && (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Enter new category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-grow p-2 rounded border border-gray-400"
                />
                <button
                  type="button"
                  onClick={handleAddNewCategory}
                  className="bg-blue-600 text-white px-3 rounded"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCategoryInput(false);
                    setNewCategoryName("");
                  }}
                  className="bg-gray-400 text-black px-3 rounded"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Instructor + Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-semibold mb-1 text-[#071d49]">
                Instructor Name
              </label>
              <input
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                type="text"
                className="w-full p-3 rounded-lg bg-[#e2e8f0] text-[#071d49]"
              />
            </div>
            <div>
              <label className="block text-base font-semibold mb-1 text-[#071d49]">
                Price
              </label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                className="w-full p-3 rounded-lg bg-[#e2e8f0] text-[#071d49]"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-base font-semibold mb-1 text-[#071d49]">
              Duration
            </label>
            <input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              type="text"
              className="w-full p-3 rounded-lg bg-[#e2e8f0] text-[#071d49]"
              placeholder="e.g., 10 hours"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-base font-semibold mb-1 text-[#071d49]">
              Course Image
            </label>
            <input
              type="file"
              className="w-full p-2 bg-[#e2e8f0] text-[#071d49] rounded-lg cursor-pointer"
              onChange={handelImageCourse}
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#ffd100] hover:bg-yellow-400 transition text-black font-semibold px-6 py-3 rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Course"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
