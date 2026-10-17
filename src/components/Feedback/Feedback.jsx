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
      <section className="py-20 bg-[#f4f7fb] relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <RefreshCw className="animate-spin mx-auto mb-4 text-[#071d49]" size={40} />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#071d49] mb-3">Loading Testimonials...</h2>
            <p className="text-slate-500 text-lg">Fetching student feedback from our database</p>
          </div>
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section className="py-20 bg-[#f4f7fb] relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <MessageSquare className="mx-auto mb-4 text-red-400" size={40} />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#071d49] mb-3">Unable to Load Testimonials</h2>
            <p className="text-slate-500 text-lg mb-6">{error}</p>
            <button
              onClick={loadFeedbacks}
              className="sc-btn sc-btn-primary"
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
      <section className="py-20 bg-[#f4f7fb] relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <MessageSquare className="mx-auto mb-4 text-slate-300" size={40} />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#071d49] mb-3">Student Feedbacks</h2>
            <p className="text-slate-500 text-lg">No approved Feedbacks available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-[#f4f7fb] relative overflow-hidden">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-10 left-10 w-40 h-40 bg-[#ffd100]/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-[#071d49]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <FeedbackHeader feedbacks={feedbacks} />
        <FeedbackCarousel feedbacks={feedbacks} />
      </div>
    </section>
  )
}
