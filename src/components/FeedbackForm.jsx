import { useState } from "react"
import { Star, Send, User, MessageCircle, Award, CheckCircle, AlertCircle, Loader } from "lucide-react"
import { createFeedback } from "../feedbackService"

export default function FeedbackForm({ courseData, onFeedbackSubmitted }) {
    const [formData, setFormData] = useState({
        userName: "",
        userEmail: "",
        rating: 5,
        title: "",
        message: "",
        category: "course",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState(null)
    const [errors, setErrors] = useState({})

    const validateForm = () => {
        const newErrors = {}

        if (!formData.userName.trim()) {
            newErrors.userName = "Name is required"
        }

        if (!formData.userEmail.trim()) {
            newErrors.userEmail = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.userEmail)) {
            newErrors.userEmail = "Please enter a valid email"
        }

        if (!formData.title.trim()) {
            newErrors.title = "Title is required"
        }

        if (!formData.message.trim()) {
            newErrors.message = "Message is required"
        } else if (formData.message.trim().length < 10) {
            newErrors.message = "Message must be at least 10 characters long"
        }

        if (formData.rating < 1 || formData.rating > 5) {
            newErrors.rating = "Please select a rating"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    const handleRatingChange = (rating) => {
        setFormData((prev) => ({
            ...prev,
            rating,
        }))

        if (errors.rating) {
            setErrors((prev) => ({
                ...prev,
                rating: "",
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)
        setSubmitStatus(null)

        try {
            // Prepare feedback data for Firestore
            const feedbackData = {
                userId: `user_${Date.now()}`, // In a real app, this would come from authentication
                userName: formData.userName.trim(),
                userEmail: formData.userEmail.trim(),
                userAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.userName)}&background=ffd100&color=071d49&size=150`,
                courseId: courseData.id,
                courseName: courseData.title,
                rating: Number.parseInt(formData.rating),
                title: formData.title.trim(),
                message: formData.message.trim(),
                status: "pending", // Will be reviewed by admin
                isPublic: false,
                helpfulVotes: 0,
                category: formData.category,
            }

            // Submit to Firestore
            const feedbackId = await createFeedback(feedbackData)

            console.log("Feedback submitted successfully with ID:", feedbackId)

            // Reset form
            setFormData({
                userName: "",
                userEmail: "",
                rating: 5,
                title: "",
                message: "",
                category: "course",
            })

            setSubmitStatus("success")

            // Notify parent component
            if (onFeedbackSubmitted) {
                onFeedbackSubmitted(feedbackId)
            }

            // Auto-hide success message after 5 seconds
            setTimeout(() => {
                setSubmitStatus(null)
            }, 5000)
        } catch (error) {
            console.error("Error submitting feedback:", error)
            setSubmitStatus("error")

            // Auto-hide error message after 5 seconds
            setTimeout(() => {
                setSubmitStatus(null)
            }, 5000)
        } finally {
            setIsSubmitting(false)
        }
    }

    const getRatingText = (rating) => {
        const ratingTexts = {
            1: "Poor 😞",
            2: "Fair 😐",
            3: "Good 🙂",
            4: "Very Good 😊",
            5: "Excellent 🤩",
        }
        return ratingTexts[rating] || "Select Rating"
    }

    return (
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-lg">
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-[#071d49] mb-2 flex items-center gap-2">
                    <MessageCircle className="text-[#ffd100]" />
                    Share Your Experience
                </h3>
            </div>

            {/* Success Message */}
            {submitStatus === "success" && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                    <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                    <div>
                        <p className="text-green-800 font-medium">Feedback Submitted Successfully! 🎉</p>
                        <p className="text-green-600 text-sm">
                            Thank you for your feedback! It will be reviewed and published soon.
                        </p>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {submitStatus === "error" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                    <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                    <div>
                        <p className="text-red-800 font-medium">Submission Failed</p>
                        <p className="text-red-600 text-sm">There was an error submitting your feedback. Please try again.</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* User Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="userName" className="block text-sm font-medium text-[#071d49] mb-2">
                            <User size={16} className="inline mr-1" />
                            Your Name *
                        </label>
                        <input
                            type="text"
                            id="userName"
                            name="userName"
                            value={formData.userName}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffd100] focus:border-transparent transition-colors ${errors.userName ? "border-red-300 bg-red-50" : "border-gray-300"
                                }`}
                            placeholder="Enter your full name"
                            disabled={isSubmitting}
                        />
                        {errors.userName && <p className="text-red-500 text-sm mt-1">{errors.userName}</p>}
                    </div>

                    <div>
                        <label htmlFor="userEmail" className="block text-sm font-medium text-[#071d49] mb-2">
                            <MessageCircle size={16} className="inline mr-1" />
                            Your Email *
                        </label>
                        <input
                            type="email"
                            id="userEmail"
                            name="userEmail"
                            value={formData.userEmail}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffd100] focus:border-transparent transition-colors ${errors.userEmail ? "border-red-300 bg-red-50" : "border-gray-300"
                                }`}
                            placeholder="Enter your email address"
                            disabled={isSubmitting}
                        />
                        {errors.userEmail && <p className="text-red-500 text-sm mt-1">{errors.userEmail}</p>}
                    </div>
                </div>

                {/* Rating */}
                <div>
                    <label className="block text-sm font-medium text-[#071d49] mb-3">
                        <Award size={16} className="inline mr-1" />
                        Your Rating *
                    </label>
                    <div className="flex items-center gap-4">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    type="button"
                                    onClick={() => handleRatingChange(rating)}
                                    disabled={isSubmitting}
                                    className={`p-1 rounded-lg transition-all hover:scale-110 ${isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                                        }`}
                                >
                                    <Star
                                        size={32}
                                        className={`transition-colors ${rating <= formData.rating ? "text-[#ffd100] fill-current" : "text-gray-300 hover:text-[#ffd100]"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <span className="text-[#071d49] font-medium text-lg">{getRatingText(formData.rating)}</span>
                    </div>
                    {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
                </div>

                {/* Feedback Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-[#071d49] mb-2">
                        Feedback Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffd100] focus:border-transparent transition-colors ${errors.title ? "border-red-300 bg-red-50" : "border-gray-300"
                            }`}
                        placeholder="Give your feedback a title (e.g., 'Great course for beginners!')"
                        disabled={isSubmitting}
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* Feedback Message */}
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-[#071d49] mb-2">
                        Your Feedback *
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffd100] focus:border-transparent transition-colors resize-vertical ${errors.message ? "border-red-300 bg-red-50" : "border-gray-300"
                            }`}
                        placeholder="Share your detailed experience with this course. What did you like? What could be improved? How would you recommend it to others?"
                        disabled={isSubmitting}
                    />
                    <div className="flex justify-between items-center mt-1">
                        {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
                        <p className="text-gray-500 text-sm ml-auto">{formData.message.length}/500 characters</p>
                    </div>
                </div>

                {/* Category (Hidden for now, defaulting to 'course') */}
                <input type="hidden" name="category" value="course" />

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 ${isSubmitting
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-[#ffd100] text-[#071d49] hover:bg-[#ffd100]/90 shadow-lg"
                            }`}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader size={20} className="animate-spin" />
                                Submitting Feedback...
                            </>
                        ) : (
                            <>
                               
                                Submit Feedback 
                            </>
                        )}
                    </button>
                </div>

            </form>
        </div>
    )
}
