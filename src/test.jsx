
import { useState, useEffect } from "react"
import { Star, Quote, ChevronLeft, ChevronRight, MessageSquare, Users, Award, RefreshCw } from "lucide-react"
import { getApprovedFeedbacks, testFeedbackConnection } from "../../feedbackService"

export default function StudentFeedbackSlider() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [feedbacks, setFeedbacks] = useState([])
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Load approved feedbacks from Firestore
    const loadFeedbacks = async () => {
        try {
            setLoading(true)
            setError(null)

            // Test connection first
            const isConnected = await testFeedbackConnection()

            if (!isConnected) {
                throw new Error("Failed to connect to Firestore")
            }

            const approvedFeedbacks = await getApprovedFeedbacks()
            setFeedbacks(approvedFeedbacks)

            // Reset current index if needed
            if (approvedFeedbacks.length > 0 && currentIndex >= approvedFeedbacks.length) {
                setCurrentIndex(0)
            }
        } catch (err) {
            console.error("Error loading feedbacks:", err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // Load feedbacks on component mount
    useEffect(() => {
        loadFeedbacks()
    }, [])

    // Auto-play testimonials
    useEffect(() => {
        if (!isAutoPlaying || feedbacks.length === 0) return

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex === feedbacks.length - 1 ? 0 : prevIndex + 1))
        }, 5000) // Change every 5 seconds

        return () => clearInterval(interval)
    }, [feedbacks.length, isAutoPlaying])

    const getRatingStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star key={index} size={16} className={index < rating ? "text-[#ffd100] fill-current" : "text-gray-300"} />
        ))
    }

    const nextTestimonial = () => {
        setIsAutoPlaying(false)
        setCurrentIndex((prevIndex) => (prevIndex === feedbacks.length - 1 ? 0 : prevIndex + 1))
    }

    const prevTestimonial = () => {
        setIsAutoPlaying(false)
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? feedbacks.length - 1 : prevIndex - 1))
    }

    const goToSlide = (index) => {
        setIsAutoPlaying(false)
        setCurrentIndex(index)
    }

    // Loading state
    if (loading) {
        return (
            <section className="py-16 bg-gradient-to-br from-[#071d49] via-[#0a2558] to-[#071d49] relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center">
                        <RefreshCw className="animate-spin mx-auto mb-4 text-[#ffd100]" size={48} />
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Loading Testimonials...</h2>
                        <p className="text-white/80 text-lg">Fetching student feedback from our database</p>
                    </div>
                </div>
            </section>
        )
    }

    // Error state
    if (error) {
        return (
            <section className="py-16 bg-gradient-to-br from-[#071d49] via-[#0a2558] to-[#071d49] relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center">
                        <MessageSquare className="mx-auto mb-4 text-red-400" size={48} />
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Unable to Load Testimonials</h2>
                        <p className="text-white/80 text-lg mb-6">{error}</p>
                        <button
                            onClick={loadFeedbacks}
                            className="bg-[#ffd100] hover:bg-[#ffd100]/90 text-[#071d49] font-bold py-3 px-8 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </section>
        )
    }

    // No feedbacks state
    if (feedbacks.length === 0) {
        return (
            <section className="py-16 bg-gradient-to-br from-[#071d49] via-[#0a2558] to-[#071d49] relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center">
                        <MessageSquare className="mx-auto mb-4 text-white/50" size={48} />
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Student Testimonials</h2>
                        <p className="text-white/80 text-lg">No approved testimonials available at the moment.</p>
                    </div>
                </div>
            </section>
        )
    }

    const currentFeedback = feedbacks[currentIndex]

    return (

        <section className="py-16 bg-gradient-to-br from-[#071d49] via-[#0a2558] to-[#071d49] relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-[#ffd100] rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#ffd100] rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full blur-2xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">What Our Students Say</h2>
                    <p className="text-white/80 text-lg max-w-3xl mx-auto">
                        Discover how our courses have transformed the learning journey of thousands of students
                    </p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-[#ffd100] rounded-full mb-4">
                            <Users className="text-[#071d49]" size={24} />
                        </div>
                        <div className="text-3xl font-bold text-white mb-2">{feedbacks.length}+</div>
                        <div className="text-white/80">Happy Students</div>
                    </div>
                    <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-[#ffd100] rounded-full mb-4">
                            <Star className="text-[#071d49] fill-current" size={24} />
                        </div>
                        <div className="text-3xl font-bold text-white mb-2">
                            {feedbacks.length > 0
                                ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
                                : "5.0"}
                            /5
                        </div>
                        <div className="text-white/80">Average Rating</div>
                    </div>
                    <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-[#ffd100] rounded-full mb-4">
                            <Award className="text-[#071d49]" size={24} />
                        </div>
                        <div className="text-3xl font-bold text-white mb-2">98%</div>
                        <div className="text-white/80">Success Rate</div>
                    </div>
                </div>

                {/* Main Testimonial Carousel */}
                <div className="relative max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
                        {/* Quote Icon */}
                        <div className="absolute top-6 right-6 opacity-10">
                            <Quote size={80} className="text-[#071d49]" />
                        </div>

                        {/* Testimonial Content */}
                        <div className="relative z-10">
                            {/* Rating */}
                            <div className="flex items-center justify-center gap-1 mb-6">
                                {getRatingStars(currentFeedback.rating)}
                                <span className="ml-2 text-[#071d49] font-bold">({currentFeedback.rating}/5)</span>
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl md:text-3xl font-bold text-[#071d49] text-center mb-6">
                                "{currentFeedback.title}"
                            </h3>

                            {/* Message */}
                            <p className="text-gray-700 text-lg leading-relaxed text-center mb-8 max-w-3xl mx-auto">
                                {currentFeedback.message}
                            </p>

                            {/* User Info */}
                            <div className="flex items-center justify-center gap-4">
                                <img
                                    src={currentFeedback.userAvatar || "/placeholder.svg?height=64&width=64"}
                                    alt={currentFeedback.userName}
                                    className="w-16 h-16 rounded-full object-cover border-4 border-[#ffd100]"
                                />
                                <div className="text-center">
                                    <div className="text-[#071d49] font-bold text-lg">{currentFeedback.userName}</div>
                                    {currentFeedback.courseName && (
                                        <div className="text-gray-600 text-sm">Student of {currentFeedback.courseName}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    {feedbacks.length > 1 && (
                        <>
                            <button
                                onClick={prevTestimonial}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 text-[#071d49] p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                                aria-label="Previous testimonial"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextTestimonial}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 text-[#071d49] p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                                aria-label="Next testimonial"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}
                </div>

                {/* Dots Indicator */}
                {feedbacks.length > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        {feedbacks.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentIndex ? "bg-[#ffd100] w-8" : "bg-white/50 hover:bg-white/70"
                                    }`}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Thumbnail Grid */}
                {feedbacks.length > 1 && (
                    <div className="flex justify-center  md:grid-cols-3 lg:grid-cols-6 gap-4 mt-12 ">
                        {feedbacks.slice(0, 6).map((feedback, index) => (
                            <div
                                key={feedback.id}
                                onClick={() => goToSlide(index)}
                                className={`cursor-pointer transition-all duration-200 ${index === currentIndex ? "scale-110 opacity-100" : "opacity-60 hover:opacity-80"
                                    }`}
                            >
                                <div className="bg-white rounded-lg p-4 text-center shadow-lg hover:shadow-xl transition-all">
                                    <img
                                        src={feedback.userAvatar || "/placeholder.svg?height=48&width=48"}
                                        alt={feedback.userName}
                                        className="w-12 h-12 rounded-full object-cover mx-auto mb-2 border-2 border-[#ffd100]"
                                    />
                                    <div className="text-[#071d49] font-bold text-sm truncate">{feedback.userName}</div>
                                    <div className="flex items-center justify-center gap-1 mt-1">{getRatingStars(feedback.rating)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}





            </div>
        </section>
    )
}
