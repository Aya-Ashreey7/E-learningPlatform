
import { useState, useEffect } from "react"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"

export default function FeedbackCarousel({ feedbacks }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    // Auto-play testimonials
    useEffect(() => {
        if (!isAutoPlaying || feedbacks.length === 0) return

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex === feedbacks.length - 1 ? 0 : prevIndex + 1))
        }, 5000) // Change every 5 seconds

        return () => clearInterval(interval)
    }, [feedbacks.length, isAutoPlaying])

    // Reset current index if feedbacks change
    useEffect(() => {
        if (feedbacks.length > 0 && currentIndex >= feedbacks.length) {
            setCurrentIndex(0)
        }
    }, [feedbacks.length, currentIndex])

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

    if (feedbacks.length === 0) {
        return (
            <div className="text-center text-white/80">
                <p>No Feedbacks available at the moment.</p>
            </div>
        )
    }

    const currentFeedback = feedbacks[currentIndex]

    return (
        <>
            {/* Main Testimonial Carousel */}
            <div className="relative max-w-4xl mx-auto mt-16">
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
                            className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentIndex ? "bg-[#ffd100] w-8" : "bg-amber-200 hover:bg-amber-300"
                                }`}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Thumbnail Grid */}
            {feedbacks.length > 1 && (
                <div className="flex justify-center flex-wrap gap-4 mt-12">
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
        </>
    )
}
