import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


const resetSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export default function ResetPassword() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(resetSchema),
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const actionCodeSettings = {
                url: window.location.origin + "/login",
                handleCodeInApp: false,
            };

            await sendPasswordResetEmail(auth, data.email, actionCodeSettings);
            toast.success("Password reset email sent. Check your inbox (and spam).");
            navigate("/login");
        } catch (err) {
            console.error("Reset password error:", err);
            const code = err?.code;

            if (code === "auth/user-not-found") {
                toast.error("No account found with that email.");

            } else if (code === "auth/invalid-email") {
                toast.error("Invalid email address.");
            } else if (code === "auth/too-many-requests") {
                toast.error("Too many requests. Please try again later.");
            } else {
                toast.error(err?.message || "Failed to send reset email. Try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold mb-2 text-center">Reset Password</h2>
                <p className="text-sm text-gray-400 mb-6 text-center">Enter your email and we'll send a reset link.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            {...register("email")}
                            id="email"
                            type="email"
                            className="w-full px-3 py-2 mt-1 rounded-md bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                            required
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-md font-semibold disabled:opacity-60"
                    >
                        {loading ? "Sending..." : "Send reset link"}
                    </button>
                </form>

                <div className="mt-4 text-sm text-center">
                    <Link to="/login" className="text-blue-400 hover:underline">Back to sign in</Link>
                </div>
            </div>
        </div>
    );
}
