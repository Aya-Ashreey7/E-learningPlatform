import { useState } from "react";
import { BookOpen, GraduationCap, Users, Award, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
});


export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema), });

  const onSubmit = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // --- Check if admin ---
      const adminRef = doc(db, "admins", user.uid);
      const adminSnap = await getDoc(adminRef);

      if (adminSnap.exists()) {
        toast.success(`Welcome back Admin !`);
        localStorage.setItem("role", "admin");
        navigate("/dashboard/overview");
        return;
      }

      // --- If not admin, check if normal user ---
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const firstName = localStorage.getItem("firstName") || "";
      const lastName = localStorage.getItem("lastName") || "";
      // Users must verify email
      if (!user.emailVerified) {
        toast.error("Please verify your email before logging in.");
        return;
      }

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const firstName = userData.firstName || "User";
        toast.success(`Welcome  ${firstName}!`);
        localStorage.setItem("role", "user");
        navigate("/");
        return;

      } else {
        await setDoc(userRef, { email: user.email, firstName, lastName });
        toast.success(`Welcome ${firstName || "User"}! Your profile is now saved.`);
        localStorage.setItem("role", "user");
        navigate("/");
        return;
      }


    } catch (error) {
      console.error("Login failed:", error);
      const errorMessages = {
        "auth/user-not-found": "No account found with that email address.",
        "auth/wrong-password": "Incorrect password. Please try again.",
        "auth/invalid-email": "The email address is not valid.",
        "auth/user-disabled": "This account has been disabled. Contact support.",
        "auth/too-many-requests": "Too many login attempts. Please wait and try again.",
      };

      const friendlyMessage = errorMessages[error.code] || "Login failed. Please try again.";
      toast.error(friendlyMessage);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#ffd100]/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#071d49]/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#071d49]/5 rounded-full blur-3xl" />
      </div>

      {/* Floating educational icons */}
      <div className="absolute top-20 left-20 text-[#071d49]/20 animate-bounce">
        <BookOpen size={32} />
      </div>
      <div className="absolute top-32 right-32 text-[#ffd100]/70 animate-pulse">
        <GraduationCap size={32} />
      </div>
      <div className="absolute bottom-32 left-32 text-[#071d49]/20 animate-bounce delay-1000">
        <Award size={32} />
      </div>
      <div className="absolute bottom-20 right-20 text-[#071d49]/20 animate-pulse delay-500">
        <Users size={32} />
      </div>

      {/* Main card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white border border-[rgba(7,29,73,0.08)] shadow-[0_24px_60px_rgba(7,29,73,0.12)] rounded-2xl">
          {/* Header */}
          <div className="text-center space-y-4 p-6 pb-0">
            <div className="mx-auto w-16 h-16 bg-[#071d49] rounded-2xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-8 h-8 text-[#ffd100]" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-[#071d49]">
                Welcome Back
              </h1>
              <p className="text-slate-500 mt-2">Continue your learning journey</p>
            </div>
          </div>

          {/* Form content */}
          <div className="p-6 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-[#071d49]">
                  Email Address
                </label>
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  aria-invalid={!!errors.email}
                  className="sc-input"
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-[#071d49]">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    aria-invalid={!!errors.password}
                    className="sc-input pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-[#071d49] transition-colors"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Remember / forgot */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    className="h-4 w-4 accent-[#ffd100] rounded"
                  />
                  <label htmlFor="rememberMe" className="text-sm text-slate-500">
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className="text-sm text-[#071d49] hover:text-[#0d2a63] font-semibold">
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sc-btn sc-btn-navy disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Sign up link */}
            <div className="text-center">
              <p className="text-sm text-slate-500">
                Don't have an account?{" "}
                <Link to="/register" className="text-[#071d49] hover:text-[#0d2a63] font-semibold underline decoration-[#ffd100] underline-offset-2">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Features showcase */}
        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          <div className="bg-white rounded-xl p-3 border border-[rgba(7,29,73,0.08)] shadow-sm">
            <BookOpen className="w-6 h-6 mx-auto text-[#071d49] mb-2" />
            <p className="text-xs text-slate-500 font-medium">1000+ Courses</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-[rgba(7,29,73,0.08)] shadow-sm">
            <Users className="w-6 h-6 mx-auto text-[#071d49] mb-2" />
            <p className="text-xs text-slate-500 font-medium">Expert Teachers</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-[rgba(7,29,73,0.08)] shadow-sm">
            <Award className="w-6 h-6 mx-auto text-[#ffd100] mb-2" />
            <p className="text-xs text-slate-500 font-medium">Certificates</p>
          </div>
        </div>
      </div>
    </div>
  );
}
