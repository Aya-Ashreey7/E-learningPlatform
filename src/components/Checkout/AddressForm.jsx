import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";

// Validation schema with restrictions
const schema = yup.object().shape({
  fullName: yup
    .string()
    .required("Full Name is required")
    .matches(/^[A-Za-z\s]+$/, "Full Name should not contain numbers or symbols"),
  phone: yup
    .string()
    .required("Phone Number is required")
    .matches(/^\d{10,11}$/, "Enter a valid phone number"),
  city: yup
    .string()
    .required("City is required")
    .matches(/^[A-Za-z\s]+$/, "City should only contain letters"),
  area: yup
    .string()
    .required("Area is required")
    .matches(/^[A-Za-z\s]+$/, "Area should only contain letters"),
  address: yup
    .string()
    .required("Address is required")
    .matches(/^[A-Za-z\s,.-]+$/, "Address should not contain numbers"),
  floor: yup.string(), // optional
});

const AddressForm = ({ onSave }) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    try {
      localStorage.setItem("checkoutAddress", JSON.stringify(data));
      if (onSave) onSave(data);
      navigate("/checkout/checkout");
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center p-4 font-inter relative overflow-hidden">
      {/* Decorative Background Effects */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#ffd100]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#ffd100]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#071d49]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="backdrop-blur-xl bg-white/50 border border-[#071d49]/10 shadow-xl rounded-xl p-6 space-y-5"
        >
          <h3 className="text-2xl font-bold text-[#071d49] text-center">
            Billing Details
          </h3>

          {[
            { label: "Full Name", name: "fullName" },
            { label: "Phone Number", name: "phone", type: "tel" },
            { label: "City", name: "city" },
            { label: "Area", name: "area" },
            { label: "Address", name: "address" },
            { label: "Floor No (optional)", name: "floor" },
          ].map(({ label, name, type = "text" }) => (
            <div key={name}>
              <input
                type={type}
                placeholder={label}
                {...register(name)}
                className={`w-full px-4 py-2 rounded-md bg-white/90 border border-[#071d49]/20 text-[#071d49] placeholder-[#071d49]/60 focus:bg-white focus:border-[#ffd100] focus:outline-none focus:ring-2 focus:ring-[#ffd100]/40 transition-all duration-200 ${
                  errors[name] ? "border-red-400" : ""
                }`}
              />
              {errors[name] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[name]?.message}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#071d49] text-white rounded py-2 hover:bg-[#0a2b70] transition"
          >
            {isSubmitting ? "Saving..." : "Save Address"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;
