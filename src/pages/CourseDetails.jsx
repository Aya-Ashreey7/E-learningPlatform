import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Clock,
  Users,
  Star,
  BookOpen,
  Award,
  Heart,
  User,
  RefreshCw,
  AlertCircle,
  Tag,
  User2,
  MessageSquare,
  Users2,
  CalendarDays,
  CalendarDaysIcon,
  TimerIcon,
} from "lucide-react"
import { getCourseById } from "../courseService"
import { getApprovedFeedbacks } from "../feedbackService"
import FeedbackForm from "../components/FeedbackForm"
import Navbar from "../components/Navbar/Navbar"
import { useAuth } from "../components/AuthContext/AuthContext"
import toast from "react-hot-toast"
import FeedbackCarousel from "../components/Feedback/FeedbackCarousel"
import Footer from "../components/Footer/Footer"

export default function AdultCourseDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth();


  // State management
  const [course, setCourse] = useState(null)
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isInWishlist, setIsInWishlist] = useState(false);


  // Load course data and feedbacks
  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch course details
        const courseData = await getCourseById(id)

        // Check if course is for adults
        if (courseData.audience !== "Adults") {
          throw new Error("This course is not available for adults")
        }

        setCourse(courseData)

        // Fetch all approved feedbacks and filter for this course
        const allFeedbacks = await getApprovedFeedbacks()
        console.log("All feedbacks:", allFeedbacks) // Debug log

        const courseFeedbacks = allFeedbacks.filter(
          (feedback) => feedback.courseName === courseData.title || feedback.courseId === courseData.id,
        )
        console.log("Course feedbacks:", courseFeedbacks) // Debug log

        setFeedbacks(courseFeedbacks)
      } catch (err) {
        console.error("Error loading course:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadCourseData()
    }
  }, [id])

  // Check if course is in wishlist
  useEffect(() => {
    if (course && user) {
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || []
      const isInWishlist = wishlist.some((item) => item.id === course.id)
      setIsInWishlist(isInWishlist)
    }
  }, [course, user])

  // useEffect(() => {
  //   const loadFeedbacks = async () => {
  //     try {
  //       const approvedFeedbacks = await getApprovedFeedbacks()
  //       setFeedbacks(approvedFeedbacks)
  //     } catch (err) {
  //       console.error("Error loading feedbacks:", err)
  //     }
  //   }
  //   loadFeedbacks()
  // }, [])


  const courseDataForFeedback = course
    ? {
      id: course.id,
      title: course.title || "Unknown Course",
      instructor: course.instructor || "Unknown Instructor",
      category: course.category || "general",
    }
    : null

  // Handle feedback submission
  const handleFeedbackSubmitted = (feedbackId) => {
    console.log("Feedback submitted with ID:", feedbackId)
    toast.success("Thank you for your feedback! ")
    setActiveTab("reviews")
  }

  const handleEnroll = (course) => {
    if (!user) {
      toast.success("Please login first to add to cart.");
      navigate("/login");
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = cart.find((item) => item.id === course.id);

    if (!exists) {
      cart.push(course);
      localStorage.setItem("cart", JSON.stringify(cart));
      toast.success("Added to Cart ");
    } else {
      toast.success("This course is already in Cart!");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen -translate-y-12">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-[#071d49]"></div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/courses")}
            className="bg-[#071d49] hover:bg-[#071d49]/90 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Browse All Courses
          </button>
        </div>
      </div>
    )
  }

  // No course data
  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Available</h2>
          <p className="text-gray-600">The requested course could not be found.</p>
        </div>
      </div>
    )
  }


  // =========================================
  const handleToggleWishlist = (course) => {
    if (!user) {
      toast(`Please login first to add to wishlist.`);
      navigate("/login");
      return;
    }

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (isInWishlist) {
      // Remove from wishlist
      wishlist = wishlist.filter((item) => item.id !== course.id);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setIsInWishlist(false);
      toast.error("Removed from Wishlist ");
    } else {
      // Add to wishlist
      wishlist.push(course);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setIsInWishlist(true);
      toast.success("Added to Wishlist ");
    }
  };



  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#071d49] to-[#0a2558] text-white">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

              <div>
                <div className="flex items-center gap-2 text-white/80 text-sm mb-6">
                  <span>Home</span>
                  <span>/</span>
                  <span>Adult Courses</span>
                  <span>/</span>
                  <span className="text-[#ffd100]"> {course.title} </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-[#ffd100] text-[#071d49] px-3 py-1 rounded-full text-sm font-bold">
                    {course.audience || "Adults"}
                  </span>
                  {/* <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{course.level || "Intermediate"}</span> */}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
                <p className="text-xl text-white/90 mb-6">{course.description}</p>

                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2 text-white">
                    <Clock size={20} className="text-[#ffd100]" />
                    <span>{course.duration} hours </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users size={20} className="text-[#ffd100]" />
                    <span>{course.traineesCount || 0} Trainee </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleEnroll(course)}
                    className="bg-[#ffd100] hover:bg-[#ffd100]/90 text-[#071d49] font-bold py-3 px-8 rounded-lg transition-all duration-200 hover:scale-105"
                  >
                    Enroll Now - {course.price} EGP
                  </button>
                  <button
                    onClick={() => handleToggleWishlist({ id, ...course })} className={`p-3 rounded-lg border-2 transition-all ${isInWishlist
                      ? "bg-red-500 border-red-500 text-white"
                      : "border-white text-white hover:bg-white hover:text-[#071d49]"
                      }`}
                  >
                    <Heart size={20} className={isInWishlist ? "fill-current" : ""} />
                  </button>

                </div>
              </div>

              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <img
                    src={course.image || "/placeholder.svg?height=300&width=500&text=Course+Preview"}
                    alt={course.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Info Cards */}
        <div className="container mx-auto px-4 -mt-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Clock className="mx-auto mb-2 text-[#071d49]" size={24} />
              <div className="font-bold text-lg">{course.duration || "8 weeks"}</div>
              <div className="text-gray-600 text-sm">Duration</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Tag className="mx-auto mb-2 text-[#071d49]" size={24} />
              <div className="font-bold text-lg"> Price</div>
              <div className="text-gray-600 text-sm">{course.price}</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Award className="mx-auto mb-2 text-[#071d49]" size={24} />
              <div className="font-bold text-lg">Certificate</div>
              <div className="text-gray-600 text-sm"> {course.certificate == true ? "Included" : "Not Included"} </div>

            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <User2 className="mx-auto mb-2 text-[#071d49]" size={24} />
              <div className="font-bold text-lg">instructor</div>
              <div className="text-gray-600 text-sm">{course.instructor}</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Course Content */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="bg-white rounded-lg shadow-lg mb-6">
                <div className="border-b">
                  <nav className="flex space-x-8 px-6">
                    {[
                      { id: "overview", label: "Overview", icon: BookOpen },
                      { id: "instructor", label: "Instructor", icon: User },
                      { id: "reviews", label: "Reviews", icon: Star },
                      { id: "feedback", label: "Give Feedback", icon: MessageSquare },

                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                          ? "border-[#071d49] text-[#071d49]"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                          }`}
                      >
                        <tab.icon size={16} />
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-6">
                  {/* Overview Tab */}
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold text-[#071d49] mb-3">About This Course</h3>
                        <p className="text-gray-700 leading-relaxed">{course.description}</p>
                      </div>


                      <div>
                        <h3 className="text-xl font-bold text-[#071d49] mb-3">Prerequisites</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          {(
                            course.prerequisites || [
                              "Basic computer skills",
                              "Internet connection",
                              "Motivation to learn",
                            ]
                          ).map((prereq, index) => (
                            <li key={index}>{prereq}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}



                  {/* Instructor Tab */}
                  {activeTab === "instructor" && (
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">

                        <div>
                          <h3 className="text-xl font-bold text-[#071d49] ">

                            {course.instructor || "Professional Instructor"}
                          </h3>

                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {course.instructorBio ||
                          "An experienced professional with years of experience, dedicated to helping students achieve their career goals through practical, hands-on learning."}
                      </p>
                    </div>
                  )}

                  {/* Reviews Tab */}
                  {activeTab === "reviews" && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-[#071d49] mb-6 flex items-center gap-2">
                        <Star className="text-[#ffd100]" />
                        Trainee Reviews
                      </h3>
                      {feedbacks.length > 0 ? (
                        <FeedbackCarousel feedbacks={feedbacks} />
                      ) : (
                        <p className="text-gray-500">No reviews available for this course yet.</p>
                      )}
                    </div>
                  )}


                  {/* feedback Tab */}
                  {activeTab === "feedback" && (
                    <div>
                      <FeedbackForm courseData={courseDataForFeedback} onFeedbackSubmitted={handleFeedbackSubmitted} />

                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Course Info */}
            <div className="space-y-6">


              {/* Course Features */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-[#071d49] mb-4">This Course Includes:</h3>
                <div className="space-y-3">
                  {[
                    { icon: TimerIcon, text: `${course.duration} H`, value: "Duration" },
                    { icon: Award, text: `${course.certificate == true ? "Yes" : "No"} `, value: "Certificate" },
                    { icon: Users2, text: `${course.traineesCount} `, value: "Students" },
                    { icon: CalendarDays, text: `${course.startDate} `, value: "Start Date" },
                    { icon: CalendarDaysIcon, text: `${course.endDate} `, value: "End Date" },
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <feature.icon size={16} className="text-[#071d49]" />
                        <span className="text-gray-700">{feature.value}</span>
                      </div>
                      <div>
                        <span className="text-[#071d49] font-semibold">{feature.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
