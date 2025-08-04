
import { useState } from "react"
import { BookOpen, GraduationCap, Users, Award, Eye, EyeOff } from "lucide-react"

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Login submitted:", formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Floating educational icons */}
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

      {/* Main content */}
      <div className="w-full max-w-md relative z-10">
        {/* Glass morphism card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl shadow-black/10 rounded-xl">
          {/* Header */}
          <div className="text-center space-y-4 p-6 pb-0">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-gray-600 mt-2">Continue your learning journey</p>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder=""
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 backdrop-blur-sm bg-white/50 border border-white/30 rounded-md focus:bg-white/70 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
                  required
                />
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder=""
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 backdrop-blur-sm bg-white/50 border border-white/30 rounded-md focus:bg-white/70 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember me and Forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/30 rounded"
                  />
                  <label htmlFor="rememberMe" className="text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 underline font-medium">
                  Forgot password?
                </a>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                Sign In
              </button>
            </form>

            {/* Register link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                  Sign up here
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Features showcase */}
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
  )
}
