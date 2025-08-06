// RegisterForm.jsx
import { useState } from "react";
import { BookOpen, GraduationCap, Users, Award, Eye, EyeOff } from "lucide-react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = z
    .object({
        firstName: z.string().min(2, "First name is required"),
        lastName: z.string().min(2, "Last name is required"),
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
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );
            const user = userCredential.user;
            if (user) {
                await sendEmailVerification(user);
                localStorage.setItem("firstName", data.firstName);
                localStorage.setItem("lastName", data.lastName);

                toast.success("Verification email sent. Please check your inbox 📩");
                navigate("/verify-email");
            }
        } catch (error) {
            console.error("Registration error:", error);
            toast.error(error?.message || "Registration failed. Please try again.", {
                position: "top-center",
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl" />
            </div>

            {/* Floating icons */}
            <div className="absolute top-20 left-20 text-blue-400/30 animate-bounce">
                <BookOpen size={32} />
            </div>
            <div className="absolute top-32 right-32 text-purple-400/30 animate-pulse">
                <GraduationCap size={28} />
            </div>
            <div className="absolute bottom-32 left-32 text-indigo-400/30 animate-bounce delay-1000">
                <Award size={24} />
            </div>
            <div className="absolute bottom-20 right-20 text-pink-400/30 animate-pulse delay-500">
                <Users size={30} />
            </div>

            {/* Card */}
            <div className="w-full max-w-md relative z-10">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl shadow-black/10 rounded-xl">
                    {/* Header */}
                    <div className="text-center space-y-4 p-6 pb-0">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Join SCCD
                            </h1>
                            <p className="text-gray-600 mt-2">Start your learning journey today</p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-6 space-y-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {/* First Name */}
                                <div className="space-y-2">
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                        First Name
                                    </label>
                                    <input
                                        {...rhfRegister("firstName")}
                                        id="firstName"
                                        type="text"
                                        className="w-full px-3 py-2 backdrop-blur-sm bg-white/50 border border-white/30 rounded-md focus:bg-white/70 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
                                        aria-invalid={!!errors.firstName}
                                    />
                                    {errors.firstName && (
                                        <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div className="space-y-2">
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                        Last Name
                                    </label>
                                    <input
                                        {...rhfRegister("lastName")}
                                        id="lastName"
                                        type="text"
                                        className="w-full px-3 py-2 backdrop-blur-sm bg-white/50 border border-white/30 rounded-md focus:bg-white/70 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
                                        aria-invalid={!!errors.lastName}
                                    />
                                    {errors.lastName && (
                                        <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <input
                                    {...rhfRegister("email")}
                                    id="email"
                                    type="email"
                                    className="w-full px-3 py-2 backdrop-blur-sm bg-white/50 border border-white/30 rounded-md focus:bg-white/70 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
                                    aria-invalid={!!errors.email}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        {...rhfRegister("password")}
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        className="w-full px-3 py-2 pr-10 backdrop-blur-sm bg-white/50 border border-white/30 rounded-md focus:bg-white/70 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
                                        aria-invalid={!!errors.password}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((s) => !s)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
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
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        {...rhfRegister("confirmPassword")}
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="w-full px-3 py-2 pr-10 backdrop-blur-sm bg-white/50 border border-white/30 rounded-md focus:bg-white/70 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
                                        aria-invalid={!!errors.confirmPassword}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((s) => !s)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
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
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                            >
                                {isSubmitting ? "Creating account..." : "Create Account"}
                            </button>
                        </form>

                        {/* Login link */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{" "}
                                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                    <div className="backdrop-blur-sm bg-white/10 rounded-lg p-3 border border-white/20">
                        <BookOpen className="w-6 h-6 mx-auto text-blue-500 mb-2" />
                        <p className="text-xs text-gray-600 font-medium">1000+ Courses</p>
                    </div>
                    <div className="backdrop-blur-sm bg-white/10 rounded-lg p-3 border border-white/20">
                        <Users className="w-6 h-6 mx-auto text-purple-500 mb-2" />
                        <p className="text-xs text-gray-600 font-medium">Expert Teachers</p>
                    </div>
                    <div className="backdrop-blur-sm bg-white/10 rounded-lg p-3 border border-white/20">
                        <Award className="w-6 h-6 mx-auto text-indigo-500 mb-2" />
                        <p className="text-xs text-gray-600 font-medium">Certificates</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
