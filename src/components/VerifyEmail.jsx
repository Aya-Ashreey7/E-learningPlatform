// VerifyEmail.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import toast from "react-hot-toast";

export default function VerifyEmail() {
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(async () => {
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) {
        toast.success("Email verified! You can now log in.");
        clearInterval(interval);
        navigate("/login");
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Check Your Inbox 📩</h1>
        <p className="mt-2 text-gray-600">
          Please verify your email address to continue.
        </p>

        <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-md font-medium">
          ⚠️ If you don't see the email, check your <strong>Spam</strong>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          This page will automatically redirect once verified.
        </p>
      </div>
    </div>
  );
}
