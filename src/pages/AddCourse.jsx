import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout/DashboardLayout";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

export default function AddCourse() {
  const [title, setTilte] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [instructor, setInstructor] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !description.trim() ||
      !category.trim() ||
      !instructor.trim() ||
      !price.trim() ||
      !duration.trim()
    ) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "Courses"), {
        title,
        description,
        category,
        instructor,
        price,
        duration,
        image: "",
      });

      // Reset form
      setTilte("");
      setDescription("");
      setCategory("");
      setInstructor("");
      setPrice("");
      setDuration("");

      //   alert("Course added successfully!"); اعمله بي toast
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Error adding course");
    } finally {
      setLoading(false);
    }
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
              className="w-full p-3   rounded-lg bg-[#e2e8f0] text-[#071d49]"
              type="text"
              placeholder="e.g., JavaScript for Beginners"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-base  font-semibold mb-1 text-[#071d49]">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3     rounded-lg bg-[#e2e8f0] text-[#071d49]"
              rows="4"
              placeholder="Brief description of the course"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-base font-semibold mb-1 text-[#071d49]">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3  rounded-lg bg-[#e2e8f0] text-[#071d49]"
            >
              <option value="" disabled hidden>
                {" "}
                Select a category
              </option>
              <option>Programming</option>
              <option>Design</option>
              <option>Marketing</option>
            </select>
          </div>

          {/* Instructor + Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-base  font-semibold mb-1 text-[#071d49]">
                Instructor Name
              </label>
              <input
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                type="text"
                className="w-full p-3   rounded-lg bg-[#e2e8f0] text-[#071d49]"
              />
            </div>
            <div>
              <label className="block text-base  font-semibold mb-1 text-[#071d49]">
                Price
              </label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                className="w-full p-3   rounded-lg bg-[#e2e8f0] text-[#071d49]"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-base  font-semibold mb-1 text-[#071d49]">
              Duration
            </label>
            <input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              type="text"
              className="w-full p-3   rounded-lg bg-[#e2e8f0] text-[#071d49]"
              placeholder="e.g., 10 hours"
            />
          </div>

          {/* Image لسه هرفع الصور علي firebase  */}
          <div>
            <label className="block text-base  font-semibold mb-1 text-[#071d49]">
              Course Image
            </label>
            <input
              type="file"
              className="w-full p-2 bg-[#e2e8f0] text-[#071d49]  rounded-lg"
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#ffd100] hover:bg-yellow-400 transition text-black font-semibold px-6 py-3 
              rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Course"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
