import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const PaymentModal = ({
  method,
  onClose,
  cartItems = [],
  total = 0,
  address,
}) => {
  const navigate = useNavigate();

  if (!method) return null;

  const methodLower = method.toLowerCase();
  const isCash = methodLower === "cash" || methodLower === "cach";
  const isVodafone = methodLower.includes("vodafone");
  const isInstaPay = methodLower.includes("instapay");

  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  const [transactionId, setTransactionId] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [fileError, setFileError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateTransactionId = (id) => /^[1-9][0-9]{5,19}$/.test(id);

  const validateFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSize = 5 * 1024 * 1024;
    return allowedTypes.includes(file?.type) && file.size <= maxSize;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!validateFile(file)) {
      setFileError("Only JPG, JPEG, PNG files under 5MB are allowed.");
      setReceiptFile(null);
    } else {
      setFileError("");
      setReceiptFile(file);
    }
  };

  // ✅ Upload receipt to Cloudinary
  const uploadImageCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "admin_courses"); // replace with your preset
    data.append("cloud_name", "dciqod9kj"); // replace with your cloud name

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

  // ✅ Make receipt REQUIRED (except for cash)
  const isValid = (() => {
    if (isCash) return true;
    const hasValidReceipt = receiptFile && validateFile(receiptFile);
    return !!hasValidReceipt;
  })();

  const handleSubmit = async () => {
    if (!isValid) {
      setErrorMessage("Please upload a valid receipt before continuing.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const auth = getAuth();
      const user = auth.currentUser;

  
      let receiptUrl = "";
      if (receiptFile) {
        receiptUrl = await uploadImageCloudinary(receiptFile);
      }

      const newOrder = {
        userId: user ? user.uid : "guest",
        customerName: user?.displayName || "Customer",
        paymentMethod: method,
        total,
        cartItems,
        courseIds: cartItems.map((item) => item.id),
        address,
        status: "pending",
        createdAt: serverTimestamp(),
        transactionId: transactionId || "",
        receiptUrl: receiptUrl || "",
      };

      await addDoc(collection(db, "Orders"), newOrder);

      localStorage.removeItem("checkoutCart");
      localStorage.removeItem("checkoutTotal");

      onClose();
      navigate("/paymentsuccess", { state: { method } });
    } catch (error) {
      console.error("Order failed:", error);
      setErrorMessage("Order submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
    navigate("/cart");
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xl flex items-center justify-center z-50">
      <div className="bg-[#f9f9f9] border border-[#071d49] rounded-3xl shadow-2xl w-full max-w-md p-6 relative animate-slide-in">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-4 text-[#071d49] hover:text-red-500 text-xl font-bold transition duration-300"
        >
          ×
        </button>

        <h2 className="font-bold text-lg text-[#071d49] mb-4 text-center">
          {method} Payment
        </h2>

        {/* Order Summary */}
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-[#071d49]/20 transition duration-300 hover:border-[#ffd100] hover:shadow-md">
          <h3 className="text-lg font-semibold text-[#071d49] mb-3">
            Order Summary
          </h3>
          {cartItems.map((item, i) => (
            <div
              key={i}
              className="flex justify-between text-sm text-[#071d49] mb-1"
            >
              <span>
                {item.title} x{item.quantity}
              </span>
              <span>{(item.price * item.quantity).toFixed(2)} EGP</span>
            </div>
          ))}
          <p className="font-bold text-lg text-[#071d49] mt-2">
            Items: {totalQuantity}
          </p>
          <p className="font-bold text-lg text-[#071d49] mt-1">
            Total: EGP {total.toFixed(2)}
          </p>
        </div>

        {/* Payment Details */}
        <div className="space-y-4 text-[#071d49] text-sm">
          {isCash && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
              You selected cash. Please visit the center and pay within 48 hours.
            </div>
          )}

          {(isVodafone || isInstaPay) && (
            <div className="space-y-2">
              <p className="font-semibold">
                {isVodafone ? "Vodafone Cash" : "InstaPay"}
              </p>
              <p>
                {isVodafone ? (
                  <>
                    Wallet Number: <strong>01097350978</strong>
                  </>
                ) : (
                  <>
                    InstaPay Account: <strong>01097350978</strong>
                    <br />
                    <span>You can also scan the QR code to pay.</span>
                  </>
                )}
              </p>
              <input
                type="text"
                placeholder="Enter transaction number (optional)"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full mt-1 p-2 rounded border border-[#071d49]"
              />
              {transactionId && !validateTransactionId(transactionId) && (
                <p className="text-red-500 text-xs mt-1">
                  Transaction ID must be 6-20 digits and not start with 0.
                </p>
              )}

              <div>
                <label className="block mb-1 font-medium">
                  Upload receipt <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
                {fileError && (
                  <p className="text-red-500 text-xs mt-1">{fileError}</p>
                )}
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 border ${
              isValid && !loading
                ? "bg-[#071d49] text-white hover:bg-[#ffd100] hover:text-[#071d49] hover:border-[#071d49]"
                : "bg-gray-300 cursor-not-allowed text-white border-gray-300"
            }`}
          >
            {loading ? "Processing..." : "Confirm Payment"}
          </button>

          <button
            onClick={handleCancel}
            className="w-full py-3 rounded-xl font-semibold border border-red-400 text-red-500 hover:bg-red-100 transition duration-300"
          >
            Cancel
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PaymentModal;
