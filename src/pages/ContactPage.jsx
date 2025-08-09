import React from "react";
import { Mail, Phone } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#071d49] px-4 py-12 flex flex-col items-center font-inter">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center mb-10">Contact Us</h1>

      {/* Contact Info + Map */}
      <div className="grid md:grid-cols-2 gap-10 max-w-6xl w-full mb-14">
        {/* Contact Info */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-md space-y-6">
          <h2 className="text-2xl font-semibold text-[#071d49]">Need A Direct Line?</h2>
          <p className="text-sm text-gray-600">
            Contact us via phone or email. We’re happy to help with any questions.
          </p>

          <div className="flex items-start gap-4">
            <Phone className="text-[#ffd100] mt-1" />
            <div>
              <p className="text-sm font-medium text-[#071d49]">Phone</p>
              <p className="text-sm text-gray-600">(234) 456 78903</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Mail className="text-[#ffd100] mt-1" />
            <div>
              <p className="text-sm font-medium text-[#071d49]">Email</p>
              <p className="text-sm text-gray-600">contact@lightpress.com</p>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="rounded-2xl overflow-hidden shadow-md w-full h-64 md:h-auto border border-gray-200">
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
      <div className="max-w-4xl w-full bg-white border border-gray-200 shadow-md rounded-2xl p-8 space-y-6">
        <h3 className="text-xl font-semibold text-[#071d49]">Send a Message</h3>
        <p className="text-sm text-gray-600">
          Your email address will not be published. Required fields are marked *
        </p>

        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Name*"
              required
              className="w-full px-4 py-2 border border-gray-300 bg-white text-[#071d49] rounded-md focus:outline-none focus:ring-2 ring-[#ffd100]"
            />
            <input
              type="email"
              placeholder="Email*"
              required
              className="w-full px-4 py-2 border border-gray-300 bg-white text-[#071d49] rounded-md focus:outline-none focus:ring-2 ring-[#ffd100]"
            />
          </div>
          <textarea
            rows="5"
            placeholder="Comment"
            required
            className="w-full px-4 py-2 border border-gray-300 bg-white text-[#071d49] rounded-md focus:outline-none focus:ring-2 ring-[#ffd100]"
          ></textarea>

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
  );
};

export default ContactPage;
