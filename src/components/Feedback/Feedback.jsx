import { useState, useEffect } from "react"
import { MessageSquare, RefreshCw } from "lucide-react"
import { getApprovedFeedbacks, testFeedbackConnection } from "../../feedbackService"
import FeedbackHeader from "./FeedbackHeader"
import FeedbackCarousel from "./FeedbackCarousel"

export default function StudentFeedbackSlider() {
  const [feedbacks, setFeedbacks] = useState([])
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

  return (
    <section className="py-16 bg-gradient-to-br from-[#071d49] via-[#0a2558] to-[#071d49] relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#ffd100] rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#ffd100] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header and Stats Component */}
        <FeedbackHeader feedbacks={feedbacks} />

        {/* Carousel Component */}
        <FeedbackCarousel feedbacks={feedbacks} />
      </div>
    </section>
  )
}
