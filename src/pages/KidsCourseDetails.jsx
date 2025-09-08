import { useEffect, useState } from "react"
import { Clock, Users, Award, Star, BookOpen, Heart, CheckCircle, User, Trophy, Sparkles, MessageSquare, } from "lucide-react"
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { useAuth } from "../components/AuthContext/AuthContext";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import FeedbackForm from "../components/FeedbackForm";
import FeedbackCarousel from "../components/Feedback/FeedbackCarousel";
import { getApprovedFeedbacks } from "../feedbackService";
import { getCourseById } from "../courseService";





export default function KidsCourseDetails() {
    const [activeTab, setActiveTab] = useState("overview")
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [feedbacks, setFeedbacks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourse = async () => {
            const docRef = doc(db, "Courses", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setCourse(docSnap.data());
            } else {
                console.log("No such course!");
            }
        };
        fetchCourse();
    }, [id]);

    useEffect(() => {
        if (course) {
            let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
            const exists = wishlist.find((item) => item.id === id);
            setIsInWishlist(!!exists);
        }
    }, [course, id]);

    // useEffect(() => {
    //     const loadFeedbacks = async () => {
    //         try {
    //             const approvedFeedbacks = await getApprovedFeedbacks()
    //             setFeedbacks(approvedFeedbacks)
    //         } catch (err) {
    //             console.error("Error loading feedbacks:", err)
    //         }
    //     }
    //     loadFeedbacks()
    // }, [])

    // Load course data and feedbacks
    useEffect(() => {
        const loadCourseData = async () => {
            try {
                setLoading(true)
                setError(null)

                // Fetch course details
                const courseData = await getCourseById(id)

                // Check if course is for adults
                if (courseData.audience !== "Kids") {
                    throw new Error("This course is not available for Kids")
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

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen -translate-y-12">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-[#071d49]"></div>
            </div>
        )
    }

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


    if (!course) return <div className="flex items-center justify-center h-screen">
        <ClipLoader color="#071d49" size={45} />
    </div>;

    const courseDataForFeedback = {
        id: course.id,
        title: course.title || "Unknown Course",
        instructor: course.instructor || "Unknown Instructor",
        category: course.category || "general",
    }
    // Handle feedback submission
    const handleFeedbackSubmitted = (feedbackId) => {
        console.log("Feedback submitted with ID:", feedbackId)
        toast.success("Thank you for your feedback! ")
        setActiveTab("reviews")
    }


    return (
        <>
            <Navbar />


            <div className="min-h-screen bg-white">
                <div className="relative bg-gradient-to-br from-[#071d49] via-[#0a2555] to-[#071d49] overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="absolute top-10 left-10 w-20 h-20 bg-[#ffd100]/20 rounded-full animate-bounce"></div>
                        <div className="absolute top-20 right-20 w-16 h-16 bg-[#ffd100]/30 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-20 left-20 w-12 h-12 bg-[#ffd100]/25 rounded-full animate-bounce delay-1000"></div>
                        <div className="absolute bottom-10 right-10 w-24 h-24 bg-[#ffd100]/15 rounded-full animate-pulse delay-500"></div>

                        <div
                            className="absolute top-1/4 left-1/4 w-8 h-8 bg-[#ffd100]/40 rotate-45 animate-spin"
                            style={{ animationDuration: "8s" }}
                        ></div>
                        <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-[#ffd100]/50 rounded-full animate-ping"></div>
                    </div>

                    <div className="relative z-10 container mx-auto px-4 py-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 text-white/80 text-sm">
                                    <span>Home</span>
                                    <span>/</span>
                                    <span>Kids Courses</span>
                                    <span>/</span>
                                    <span className="text-[#ffd100]"> {course.title} </span>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-[#ffd100] text-[#071d49] px-3 py-1 rounded-full text-sm font-bold">
                                            {course.audience}
                                        </span>
                                        {/* <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {course.level}
                                    </span> */}
                                    </div>

                                    <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">{course.title}</h1>
                                </div>

                                {/* Course Stats */}
                                <div className="flex flex-wrap gap-6">

                                    <div className="flex items-center  text-white">
                                        <Users size={20} className="text-[#ffd100]" />
                                        <span className="ml-2">{course.traineesCount}  happy students</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-white">
                                        <Clock size={20} className="text-[#ffd100]" />
                                        <span>{course.duration} hours of fun</span>
                                    </div>
                                </div>

                                {/* Instructor */}
                                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                    {/* <img
                                        src={course.instructorAvatar || "/placeholder.svg"}
                                        alt={course.instructor}
                                        className="w-12 h-12 rounded-full border-2 border-[#ffd100]"
                                    /> */}
                                    <div>
                                        <p className="text-white font-medium">Taught by</p>
                                        <p className="text-[#ffd100] font-bold">{course.instructor}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Course Preview Card */}
                            <div className="lg:ml-8">
                                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-[#ffd100]">
                                    {/* Course Image */}
                                    <div className="relative">
                                        <img
                                            src={course.image || "/placeholder.svg"}
                                            alt={course.title}
                                            className="w-full h-64 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">

                                        </div>
                                        <div className="absolute top-4 right-4">
                                            <button
                                                onClick={() => handleToggleWishlist({ id, ...course })}
                                                className="p-2 rounded-full transition-colors cursor-pointer"
                                            >
                                                <Heart
                                                    size={24}
                                                    className={`transition-colors ${isInWishlist ? "text-red-500 fill-red-500" : "text-gray-500"}`}
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Pricing and Enrollment */}
                                    <div className="p-6 space-y-4">
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                <span className="text-3xl font-bold text-[#071d49]">${course.price}</span>
                                                {/* <span className="text-lg text-gray-500 line-through">${course.originalPrice}</span> */}
                                                {/* <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-bold">30% OFF</span> */}
                                            </div>
                                            <p className="text-gray-600 text-sm mt-1">One-time payment • Lifetime access</p>
                                        </div>

                                        <button className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 
                                             bg-[#ffd100] text-[#071d49] hover:bg-[#ffd100]/90 shadow-lg`}>

                                            "Start Learning Now! " </button>



                                        {/* Course Includes Preview */}
                                        <div className="border-t pt-4 space-y-2">
                                            <h4 className="font-bold text-[#071d49] flex items-center gap-2">
                                                <Sparkles size={18} className="text-[#ffd100]" />
                                                This course includes:
                                            </h4>
                                            <div className="space-y-1 text-sm text-gray-600">

                                                <div className="flex items-center gap-2">
                                                    <CheckCircle size={16} className="text-green-500" />
                                                    <span>Interactive coding exercises</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle size={16} className="text-green-500" />
                                                    <span>Certificate of completion</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle size={16} className="text-green-500" />
                                                    <span>Lifetime access</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Navigation Tabs */}
                            <div className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-xl">
                                {[
                                    { id: "overview", label: "Overview", icon: BookOpen },
                                    { id: "instructor", label: "Teacher", icon: User },
                                    { id: "reviews", label: "Reviews", icon: Star },
                                    { id: "feedback", label: "Give Feedback", icon: MessageSquare },

                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === tab.id
                                            ? "bg-[#071d49] text-white shadow-lg"
                                            : "text-gray-600 hover:bg-white hover:shadow-md"
                                            }`}
                                    >
                                        <tab.icon size={18} />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="bg-white rounded-2xl border-2 border-gray-100 p-8">

                                {activeTab === "overview" && (
                                    <div className="space-y-8">
                                        {/* Course Description */}
                                        <div>
                                            <h3 className="text-2xl font-bold text-[#071d49] mb-4">About This Course</h3>
                                            <div className="prose prose-lg max-w-none text-gray-700">
                                                <p className="leading-relaxed">
                                                    {course.description}
                                                </p>

                                            </div>
                                        </div>

                                        {/* Course Requirements */}
                                        <div>
                                            <h3 className="text-2xl font-bold text-[#071d49] mb-4">Requirements</h3>
                                            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                                                <ul className="space-y-2 text-gray-700">
                                                    <li className="flex items-center gap-2">
                                                        <CheckCircle size={16} className="text-blue-500" />
                                                        <span>Basic computer skills (using mouse and keyboard)</span>
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <CheckCircle size={16} className="text-blue-500" />
                                                        <span>A computer with internet connection</span>
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <CheckCircle size={16} className="text-blue-500" />
                                                        <span>Curiosity and enthusiasm to learn!</span>
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <CheckCircle size={16} className="text-blue-500" />
                                                        <span>No prior programming experience needed</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "instructor" && (
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-bold text-[#071d49] mb-6 flex items-center gap-2">
                                            <User className="text-[#ffd100]" />
                                            Meet Your Instructor
                                        </h3>

                                        <div className="flex flex-col md:flex-row gap-6">
                                            {/* <div className="flex-shrink-0">
                                            <img
                                                src={course.instructorAvatar || "/placeholder.svg"}
                                                alt={course.instructor}
                                                className="w-32 h-32 rounded-full border-4 border-[#ffd100] shadow-lg"
                                            />
                                        </div> */}
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-xl font-bold text-[#071d49]">{course.instructor}</h4>
                                                    <p className="text-[#ffd100] font-medium">Kids Programming Specialist</p>
                                                </div>
                                                <p className="text-gray-700 leading-relaxed">{course.instructorBio}</p>
                                                <div className="flex flex-wrap gap-4 text-sm">
                                                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                                                        <Users size={16} className="text-blue-500" />
                                                        <span>1000+ Students Taught</span>
                                                    </div>

                                                    <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg">
                                                        <Award size={16} className="text-purple-500" />
                                                        <span>Certified Educator</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "reviews" && (
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-bold text-[#071d49] mb-6 flex items-center gap-2">
                                            <Star className="text-[#ffd100]" />
                                            Student Reviews
                                        </h3>
                                        {/* <FeedbackCarousel feedbacks={feedbacks} /> */}
                                        {feedbacks.length > 0 ? (
                                            <FeedbackCarousel feedbacks={feedbacks} />
                                        ) : (
                                            <p className="text-gray-500">No reviews available for this course  yet .</p>
                                        )}
                                    </div>
                                )}

                                {activeTab === "feedback" && (
                                    <div>
                                        <FeedbackForm courseData={courseDataForFeedback} onFeedbackSubmitted={handleFeedbackSubmitted} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Course Features */}
                            {/* <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
                                <h4 className="font-bold text-[#071d49] mb-4 flex items-center gap-2">
                                    <Trophy className="text-[#ffd100]" />
                                    Course Features
                                </h4>
                               <div className="space-y-3">
                                {course.courseIncludes.map((feature, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700 text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div> 
                            </div> */}

                            {/* Course Info */}
                            <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
                                <h4 className="font-bold text-[#071d49] mb-4">Course Information</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Age Range:</span>
                                        {/* <span className="font-medium text-[#071d49]">{course.ageRange}</span> */}
                                        <span className="font-medium text-[#071d49]">10 : 18</span>

                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Duration:</span>
                                        <span className="font-medium text-[#071d49]">{course.duration} hours</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Certificate:</span>
                                        <span className="font-medium text-green-600">{course.certificate ? " Yes" : " No"}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Students:</span>
                                        <span className="font-medium text-[#071d49]">{course.traineesCount}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Start Date:</span>
                                        <span className="font-medium text-[#071d49]">  {course.startDate}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">End Date:</span>
                                        <span className="font-medium text-[#071d49]">{course.endDate}</span>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}
