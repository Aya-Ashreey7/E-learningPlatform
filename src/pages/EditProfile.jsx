// src/pages/EditProfile.jsx
import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const EditProfile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch current profile data
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setAddress(data.address || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  // Validation rules
  const validate = () => {
    const newErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required.";
    } else if (!/^[A-Za-z]{2,}$/.test(firstName.trim())) {
      newErrors.firstName = "First name must be at least 2 letters.";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    } else if (!/^[A-Za-z]{2,}$/.test(lastName.trim())) {
      newErrors.lastName = "Last name must be at least 2 letters.";
    }

    if (!address.trim()) {
      newErrors.address = "Address is required.";
    } else if (address.trim().length < 10) {
      newErrors.address = "Address must be at least 10 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        address: address.trim(),
      });
      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Loading spinner with navbar
  if (loading) {
    return (
      <div className="bg-[#f9f9f9] min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          {/* Background Shapes */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#ffd100]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#ffd100]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#071d49]/5 rounded-full blur-3xl"></div>

          {/* Spinner */}
          <div className="flex items-center justify-center min-h-screen -translate-y-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-[#071d49]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f9f9] min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex justify-center items-center px-4 font-inter relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#ffd100]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#ffd100]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#071d49]/5 rounded-full blur-3xl"></div>

        {/* Form Container */}
        <div className="relative z-10 bg-white/70 backdrop-blur-lg border border-[#071d49]/10 shadow-xl rounded-xl p-6 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-[#071d49] mb-6">
            Edit Profile
          </h1>
          <form onSubmit={handleSave} className="space-y-4">
            {/* First Name */}
            <div>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`w-full px-4 py-2 rounded-md bg-white/90 border border-[#071d49]/20 text-[#071d49] placeholder-[#071d49]/60 focus:bg-white focus:border-[#ffd100] focus:outline-none focus:ring-2 focus:ring-[#ffd100]/40 transition-all duration-200 ${errors.firstName ? "border-red-400" : ""
                  }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`w-full px-4 py-2 rounded-md bg-white/90 border border-[#071d49]/20 text-[#071d49] placeholder-[#071d49]/60 focus:bg-white focus:border-[#ffd100] focus:outline-none focus:ring-2 focus:ring-[#ffd100]/40 transition-all duration-200 ${errors.lastName ? "border-red-400" : ""
                  }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <textarea
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows="3"
                className={`w-full px-4 py-2 rounded-md bg-white/90 border border-[#071d49]/20 text-[#071d49] placeholder-[#071d49]/60 focus:bg-white focus:border-[#ffd100] focus:outline-none focus:ring-2 focus:ring-[#ffd100]/40 transition-all duration-200 ${errors.address ? "border-red-400" : ""
                  }`}
              ></textarea>
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#071d49] text-white rounded py-2 hover:bg-[#0a2b70] transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => navigate("/profilePage")}
              className="w-full bg-gray-300 text-gray-800 rounded py-2 hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
