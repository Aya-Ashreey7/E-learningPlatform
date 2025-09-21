import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout/DashboardLayout";
import toast from "react-hot-toast";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function ChangeImage() {
  const [heroImage, setHeroImage] = useState(null);
  const [aboutImage, setAboutImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadImageCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "admin_courses");
    data.append("cloud_name", "dciqod9kj");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dciqod9kj/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const json = await res.json();
    return json.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!heroImage && !aboutImage) {
      toast.error("Please choose at least one image");
      return;
    }

    setLoading(true);

    try {
      let heroUrl = "";
      let aboutUrl = "";

      if (heroImage) {
        toast.loading("Uploading Hero Image...");
        heroUrl = await uploadImageCloudinary(heroImage);
        toast.dismiss();
      }
      if (aboutImage) {
        toast.loading("Uploading about Image...");
        aboutUrl = await uploadImageCloudinary(aboutImage);
        toast.dismiss();
      }

      const docRef = doc(db, "ChangeImage", "Images");
      const existingDoc = await getDoc(docRef);
      const existingData = existingDoc.exists() ? existingDoc.data() : {};

      let updateData = {
        heroImage: heroImage ? heroUrl : existingData.heroImage,
        aboutImage: aboutImage ? aboutUrl : existingData.aboutImage,
      };

      if (heroUrl) updateData.heroImage = heroUrl;
      if (aboutUrl) updateData.aboutImage = aboutUrl;

      await setDoc(docRef, updateData, { merge: true });
      toast.success("Images updated successfully!");
      setHeroImage(null);
      setAboutImage(null);
    } catch (error) {
      console.error("Error uploading image", error);
      toast.error("Error uploading images");
    } finally {
      setLoading(false);
    }
  };
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 min-h-screen">
        <h2 className="text-2xl font-bold text-[#071d49] border-[#1f3261] pb-2">
          Change Image
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-lg font-semibold text mb-1 p-2  text-[#071d49]">
            Hero Image
          </label>
          <input
            className="w-full p-2 bg-[#e2e8f0] text-[#071d49] rounded-xl cursor-pointer"
            type="file"
            onChange={(e) => setHeroImage(e.target.files[0])}
          />

          <label className="block text-lg font-semibold text mb-1 p-2  text-[#071d49]">
            About Image
          </label>
          <input
            className="w-full p-2 bg-[#e2e8f0] text-[#071d49] rounded-xl cursor-pointer"
            type="file"
            onChange={(e) => setAboutImage(e.target.files[0])}
          />

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#ffd100]  hover:bg-yellow-400 
              transition text-black
            font-semibold px-6 py-3 rounded-lg
            shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Images"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
