import React from "react";
import { Mail, Phone } from "lucide-react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Swal from "sweetalert2";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

// Validation schema
const schema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .matches(/^[A-Za-z\s]+$/, "Name should only contain letters and spaces"),
  email: yup
    .string()
    .required("Email is required")
    .matches(
      /^[A-Za-z][A-Za-z0-9._%+-]*[0-9]+[A-Za-z0-9._%+-]*@gmail\.com$/,
      "Email must start with a letter, contain at least one number, and end with @gmail.com"
    ),
  comment: yup.string().required("Comment is required"),
});

const ContactPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await addDoc(collection(db, "messages"), {
        name: data.name,
        email: data.email,
        comment: data.comment,
        createdAt: new Date(),
      });

      Swal.fire({
        icon: "success",
        title: "Message Sent!",
        text: "Thank you for contacting us. We will get back to you soon.",
        confirmButtonColor: "#071d49",
      });

      reset();
    } catch (error) {
      console.error("Error saving message:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#071d49] font-inter flex flex-col">
      <Navbar />
      <div className="min-h-screen bg-[#f9f9f9] px-4 py-12 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center mb-10">Contact Us</h1>

        {/* Contact Info + Map */}
        <div className="grid md:grid-cols-2 gap-10 max-w-6xl w-full mb-14">
          <div className="bg-white border rounded-2xl p-8 shadow-md space-y-6">
            <h2 className="text-2xl font-semibold">Need A Direct Line?</h2>
            <p className="text-sm text-gray-600">
              Contact us via phone or email. We’re happy to help with any questions.
            </p>

            <div className="flex items-start gap-4">
              <Phone className="text-[#ffd100] mt-1" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-gray-600">(234) 456 78903</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="text-[#ffd100] mt-1" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-gray-600">contact@lightpress.com</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-md w-full h-64 md:h-auto border">
            <iframe
              title="Beni Suef Location"
              src="https://www.google.com/maps?q=beni+suef,+egypt&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-4xl w-full bg-white border shadow-md rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-semibold">Send a Message</h3>
          <p className="text-sm text-gray-600">
            Your email address will not be published. Required fields are marked *
          </p>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <input
                  type="text"
                  placeholder="Name*"
                  {...register("name")}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ring-[#ffd100] ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email*"
                  {...register("email")}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ring-[#ffd100] ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <textarea
                rows="5"
                placeholder="Comment"
                {...register("comment")}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ring-[#ffd100] ${
                  errors.comment ? "border-red-500" : "border-gray-300"
                }`}
              ></textarea>
              {errors.comment && (
                <p className="text-red-500 text-sm">{errors.comment.message}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="save" className="accent-[#ffd100]" />
              <label htmlFor="save" className="text-sm text-gray-600">
                Save my name, email in this browser for the next time I comment
              </label>
            </div>

            <button
              type="submit"
              className="bg-[#071d49] text-white px-6 py-2 rounded-md font-medium hover:bg-[#0a2b70] transition"
            >
              Post Comment
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
