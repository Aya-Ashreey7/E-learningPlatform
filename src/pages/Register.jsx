// RegisterForm.jsx
import { useState } from "react";
import { BookOpen, GraduationCap, Users, Award, Eye, EyeOff } from "lucide-react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth, db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

const registerSchema = z
    .object({
        firstName: z.string().min(2, "First name is required").regex(/^[A-Za-z\s'-]+$/, "First name must contain only letters"),
        lastName: z.string().min(2, "Last name is required").regex(/^[A-Za-z\s'-]+$/, "Last name must contain only letters"),
        email: z.string().email("Invalid email address"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
                "Must be ≥8 chars, include uppercase, lowercase, number & special character."
            ),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",

        path: ["confirmPassword"],
    });


export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const { register: rhfRegister, handleSubmit, formState: { errors, isSubmitting } } =
        useForm({ resolver: zodResolver(registerSchema) });


    const onSubmit = async (data) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password,);
            const user = userCredential.user;
            if (user) {
                await sendEmailVerification(user);
                await setDoc(doc(db, "users", user.uid), {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    createdAt: serverTimestamp(),
                });
                localStorage.setItem("firstName", data.firstName);
                localStorage.setItem("lastName", data.lastName);

                toast.success("Verification email sent. Please check your inbox 📩");
                navigate("/verify-email");
            }
        } catch (error) {
            console.error("Registration error:", error);
            if (error.code === "auth/email-already-in-use") {
                toast.error("You already have an account", { position: "top-center" });
            } else {
                toast.error(error?.message || "Registration failed. Please try again.", {
                    position: "top-center",
                });
            }
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

            {/* Floating icons */}
            <div className="absolute top-20 left-20 text-[#071d49]/20 animate-bounce">
                <BookOpen size={32} />
            </div>
            <div className="absolute top-32 right-32 text-[#ffd100]/70 animate-pulse">
                <GraduationCap size={28} />
            </div>
            <div className="absolute bottom-32 left-32 text-[#071d49]/20 animate-bounce delay-1000">
                <Award size={24} />
            </div>
            <div className="absolute bottom-20 right-20 text-[#071d49]/20 animate-pulse delay-500">
                <Users size={30} />
            </div>

            {/* Card */}
            <div className="w-full max-w-md relative z-10">
                <div className="bg-white border border-[rgba(7,29,73,0.08)] shadow-[0_24px_60px_rgba(7,29,73,0.12)] rounded-2xl">
                    {/* Header */}
                    <div className="text-center space-y-4 p-6 pb-0">
                        <div className="mx-auto w-16 h-16 bg-[#071d49] rounded-2xl flex items-center justify-center shadow-lg">
                            <GraduationCap className="w-8 h-8 text-[#ffd100]" />
                        </div>
                        <div>
                            <h1 className="font-display text-2xl font-bold text-[#071d49]">
                                Join Scientific Center
                            </h1>
                            <p className="text-slate-500 mt-2">Start your learning journey today</p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-6 space-y-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {/* First Name */}
                                <div className="space-y-2">
                                    <label htmlFor="firstName" className="block text-sm font-medium text-[#071d49]">
                                        First Name
                                    </label>
                                    <input
                                        {...rhfRegister("firstName")}
                                        id="firstName"
                                        type="text"
                                        className="sc-input"
                                        aria-invalid={!!errors.firstName}
                                    />
                                    {errors.firstName && (
                                        <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div className="space-y-2">
                                    <label htmlFor="lastName" className="block text-sm font-medium text-[#071d49]">
                                        Last Name
                                    </label>
                                    <input
                                        {...rhfRegister("lastName")}
                                        id="lastName"
                                        type="text"
                                        className="sc-input"
                                        aria-invalid={!!errors.lastName}
                                    />
                                    {errors.lastName && (
                                        <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-[#071d49]">
                                    Email Address
                                </label>
                                <input
                                    {...rhfRegister("email")}
                                    id="email"
                                    type="email"
                                    className="sc-input"
                                    aria-invalid={!!errors.email}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-[#071d49]">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        {...rhfRegister("password")}
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        className="sc-input pr-10"
                                        aria-invalid={!!errors.password}
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


                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#071d49]">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        {...rhfRegister("confirmPassword")}
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="sc-input pr-10"
                                        aria-invalid={!!errors.confirmPassword}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((s) => !s)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-[#071d49] transition-colors"
                                        aria-label="toggle confirm password visibility"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full sc-btn sc-btn-navy disabled:opacity-60"
                            >
                                {isSubmitting ? "Creating account..." : "Create Account"}
                            </button>
                        </form>

                        {/* Login link */}
                        <div className="text-center">
                            <p className="text-sm text-slate-500">
                                Already have an account?{" "}
                                <Link to="/login" className="text-[#071d49] hover:text-[#0d2a63] font-semibold underline decoration-[#ffd100] underline-offset-2">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Features */}
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
