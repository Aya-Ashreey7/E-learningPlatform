import { useState, useEffect } from "react"
import DashboardLayout from "../components/DashboardLayout/DashboardLayout"
import { Eye, Check, X, Star, User, Search, ChevronDown, MessageSquare, ThumbsUp } from "lucide-react"

//  feedback data
const mockFeedbacks = [
    {
        id: "feedback_001",
        userId: "user_123",
        userName: "Ahmed Mohamed",
        userEmail: "ahmed.mohamed@email.com",
        userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        courseId: "course_001",
        courseName: "React Fundamentals",
        rating: 5,
        title: "Excellent Course!",
        message:
            "This course exceeded my expectations. The instructor explained complex concepts in a very clear and understandable way. I highly recommend it to anyone wanting to learn React.",
        createdAt: new Date("2025-08-10T14:30:00Z"),
        status: "pending", // pending, approved, rejected
        isPublic: false,
        helpfulVotes: 0,
        category: "Adult",
    },
    {
        id: "feedback_002",
        userId: "user_456",
        userName: "Sara Ali",
        userEmail: "sara.ali@email.com",
        userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        courseId: "course_002",
        courseName: "JavaScript Mastery",
        rating: 4,
        title: "Great content, minor issues",
        message:
            "The course content is really good and comprehensive. However, some of the video quality could be improved. Overall, I learned a lot and would recommend it.",
        createdAt: new Date("2025-08-09T10:15:00Z"),
        status: "approved",
        isPublic: true,
        helpfulVotes: 12,
        category: "Adult",
    },
    {
        id: "feedback_003",
        userId: "user_789",
        userName: "Mohamed Hassan",
        userEmail: "mohamed.hassan@email.com",
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        courseId: null,
        courseName: null,
        rating: 3,
        title: "Website feedback",
        message:
            "The website is good but the navigation could be more intuitive. Also, the search functionality needs improvement.",
        createdAt: new Date("2025-08-08T16:45:00Z"),
        status: "approved",
        isPublic: true,
        helpfulVotes: 5,
        category: "Kids",
    },
    {
        id: "feedback_004",
        userId: "user_101",
        userName: "Fatima Ahmed",
        userEmail: "fatima.ahmed@email.com",
        userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        courseId: "course_003",
        courseName: "Python for Beginners",
        rating: 2,
        title: "Disappointing experience",
        message:
            "The course was not as advertised. Many topics were rushed through and the exercises were too basic. Expected more depth.",
        createdAt: new Date("2025-08-07T09:20:00Z"),
        status: "rejected",
        isPublic: false,
        helpfulVotes: 0,
        category: "Adult",
    },
    {
        id: "feedback_005",
        userId: "user_202",
        userName: "Omar Khaled",
        userEmail: "omar.khaled@email.com",
        userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        courseId: "course_001",
        courseName: "React Fundamentals",
        rating: 5,
        title: "Perfect for beginners",
        message:
            "As someone new to React, this course was exactly what I needed. Step-by-step explanations and practical examples made learning enjoyable.",
        createdAt: new Date("2025-08-06T13:10:00Z"),
        status: "pending",
        isPublic: false,
        helpfulVotes: 0,
        category: "Adult",
    },
]

export default function Feedback() {
    const [feedbacks, setFeedbacks] = useState(mockFeedbacks)
    const [filteredFeedbacks, setFilteredFeedbacks] = useState(mockFeedbacks)
    const [selectedFeedback, setSelectedFeedback] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [ratingFilter, setRatingFilter] = useState("all")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [showFeedbackDetails, setShowFeedbackDetails] = useState(false)

    useEffect(() => {
        let filtered = feedbacks
        if (searchTerm) {
            filtered = filtered.filter(
                (feedback) =>
                    feedback.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    feedback.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    feedback.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    feedback.userEmail.toLowerCase().includes(searchTerm.toLowerCase()),
            )
        }
        if (statusFilter !== "all") {
            filtered = filtered.filter((feedback) => feedback.status === statusFilter)
        }
        if (ratingFilter !== "all") {
            filtered = filtered.filter((feedback) => feedback.rating === Number.parseInt(ratingFilter))
        }
        if (categoryFilter !== "all") {
            filtered = filtered.filter((feedback) => feedback.category === categoryFilter)
        }

        setFilteredFeedbacks(filtered)
    }, [searchTerm, statusFilter, ratingFilter, categoryFilter, feedbacks])

    const handleStatusChange = (feedbackId, newStatus) => {
        setFeedbacks((prevFeedbacks) =>
            prevFeedbacks.map((feedback) =>
                feedback.id === feedbackId
                    ? {
                        ...feedback,
                        status: newStatus,
                        isPublic: newStatus === "approved",
                    }
                    : feedback,
            ),
        )
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-300"
            case "approved":
                return "bg-green-100 text-green-800 border-green-300"
            case "rejected":
                return "bg-red-100 text-red-800 border-red-300"
            default:
                return "bg-gray-100 text-gray-800 border-gray-300"
        }
    }

    const getRatingStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star key={index} size={16} className={index < rating ? "text-[#ffd100] fill-current" : "text-gray-300"} />
        ))
    }

    const formatDate = (date) => {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    const FeedbackDetailsModal = ({ feedback, onClose }) => {
        if (!feedback) return null

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-[#071d49]">
                        <h2 className="text-xl font-bold text-white">Feedback Details</h2>
                        <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 space-y-6 bg-white">
                        {/* User & Feedback Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* User Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-[#071d49] flex items-center gap-2">
                                    <User size={20} />
                                    User Information
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={feedback.userAvatar || "/placeholder.svg"}
                                            alt={feedback.userName}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-[#071d49]"
                                        />
                                        <div>
                                            <p className="text-[#071d49] font-bold">{feedback.userName}</p>
                                            <p className="text-gray-600 text-sm">{feedback.userEmail}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 text-sm">User ID:</span>
                                        <p className="text-[#071d49] font-medium font-mono">{feedback.userId}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Feedback Metadata */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-[#071d49] flex items-center gap-2">
                                    <MessageSquare size={20} />
                                    Feedback Details
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                                    <div>
                                        <span className="text-gray-600 text-sm">Category:</span>
                                        <p className="text-[#071d49] font-medium capitalize">{feedback.category}</p>
                                    </div>
                                    {feedback.courseName && (
                                        <div>
                                            <span className="text-gray-600 text-sm">Course:</span>
                                            <p className="text-[#071d49] font-medium">{feedback.courseName}</p>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-gray-600 text-sm">Rating:</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            {getRatingStars(feedback.rating)}
                                            <span className="text-[#071d49] font-bold">({feedback.rating}/5)</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 text-sm">Submitted:</span>
                                        <p className="text-[#071d49] font-medium">{formatDate(feedback.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feedback Content */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#071d49]">Feedback Content</h3>
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                <h4 className="text-[#071d49] font-bold text-lg mb-3">{feedback.title}</h4>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{feedback.message}</p>
                            </div>
                        </div>

                        {/* Status & Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-[#071d49]">Current Status</h3>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 text-sm">Status:</span>
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(feedback.status)}`}
                                        >
                                            {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="text-gray-600 text-sm">Public:</span>
                                        <span className={`text-sm font-medium ${feedback.isPublic ? "text-green-600" : "text-red-600"}`}>
                                            {feedback.isPublic ? "Yes" : "No"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-[#071d49]">Engagement</h3>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 text-sm flex items-center gap-1">
                                            <ThumbsUp size={14} />
                                            Helpful Votes:
                                        </span>
                                        <span className="text-[#071d49] font-bold">{feedback.helpfulVotes}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {feedback.status === "pending" && (
                            <div className="flex gap-4 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        handleStatusChange(feedback.id, "approved")
                                        onClose()
                                    }}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                                >
                                    <Check size={20} />
                                    Approve & Publish
                                </button>
                                <button
                                    onClick={() => {
                                        handleStatusChange(feedback.id, "rejected")
                                        onClose()
                                    }}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                                >
                                    <X size={20} />
                                    Reject Feedback
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#071d49]">Feedback Management</h1>
                        <p className="text-gray-600 mt-1">Review and manage user feedback and testimonials</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="flex gap-4">
                        <div className="bg-white rounded-lg p-4 border-2 border-[#071d49] shadow-lg">
                            <div className="text-[#ffd100] text-sm font-bold">Total Feedback</div>
                            <div className="text-[#071d49] text-2xl font-bold text-center">{feedbacks.length}</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border-2 border-[#071d49] shadow-lg">
                            <div className="text-[#ffd100] text-sm font-bold">Pending</div>
                            <div className="text-[#071d49] text-2xl font-bold text-center">
                                {feedbacks.filter((f) => f.status === "pending").length}
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border-2 border-[#071d49] shadow-lg">
                            <div className="text-[#ffd100] text-sm font-bold">Published</div>
                            <div className="text-[#071d49] text-2xl font-bold text-center">
                                {feedbacks.filter((f) => f.status === "approved").length}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg p-6 border-2 border-[#071d49] shadow-lg">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by user name, title, message, or course..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-[#071d49] placeholder-gray-500 focus:border-[#ffd100] focus:outline-none focus:ring-2 focus:ring-[#ffd100]/20 transition-all"
                            />
                        </div>

                        {/* Filters Row */}
                        <div className="flex gap-4">
                            {/* Status Filter */}
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="appearance-none bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 pr-10 text-[#071d49] focus:border-[#ffd100] focus:outline-none focus:ring-2 focus:ring-[#ffd100]/20 transition-all font-medium"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            </div>

                            {/* Rating Filter */}
                            <div className="relative">
                                <select
                                    value={ratingFilter}
                                    onChange={(e) => setRatingFilter(e.target.value)}
                                    className="appearance-none bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 pr-10 text-[#071d49] focus:border-[#ffd100] focus:outline-none focus:ring-2 focus:ring-[#ffd100]/20 transition-all font-medium"
                                >
                                    <option value="all">All Ratings</option>
                                    <option value="5">5 Stars</option>
                                    <option value="4">4 Stars</option>
                                    <option value="3">3 Stars</option>
                                    <option value="2">2 Stars</option>
                                    <option value="1">1 Star</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            </div>

                            {/* Category Filter */}
                            <div className="relative">
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="appearance-none bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 pr-10 text-[#071d49] focus:border-[#ffd100] focus:outline-none focus:ring-2 focus:ring-[#ffd100]/20 transition-all font-medium"
                                >
                                    <option value="all">All Categories</option>
                                    <option value="course">Adult</option>
                                    <option value="website">Kids</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feedback Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredFeedbacks.map((feedback) => (
                        <div
                            key={feedback.id}
                            className="bg-white rounded-lg border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden"
                        >
                            {/* Card Header */}
                            <div className="p-4 border-b border-gray-200 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={feedback.userAvatar || "/placeholder.svg"}
                                            alt={feedback.userName}
                                            className="w-10 h-10 rounded-full object-cover border-2 border-[#071d49]"
                                        />
                                        <div>
                                            <h3 className="text-[#071d49] font-bold">{feedback.userName}</h3>
                                            <p className="text-gray-600 text-sm">{formatDate(feedback.createdAt)}</p>
                                        </div>
                                    </div>
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(feedback.status)}`}
                                    >
                                        {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                                    </span>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-4 space-y-3">
                                {/* Rating and Course */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {getRatingStars(feedback.rating)}
                                        <span className="text-[#071d49] font-bold">({feedback.rating}/5)</span>
                                    </div>
                                    <span className="text-xs bg-[#ffd100]/20 text-[#071d49] px-2 py-1 rounded-full font-medium">
                                        {feedback.category}
                                    </span>
                                </div>

                                {/* Course Name */}
                                {feedback.courseName && (
                                    <p className="text-gray-600 text-sm">
                                        <strong>Course:</strong> {feedback.courseName}
                                    </p>
                                )}

                                {/* Feedback Title */}
                                <h4 className="text-[#071d49] font-bold text-lg">{feedback.title}</h4>

                                {/* Feedback Message */}
                                <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">{feedback.message}</p>

                                {/* Engagement */}
                                {feedback.helpfulVotes > 0 && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <ThumbsUp size={14} />
                                        <span>{feedback.helpfulVotes} people found this helpful</span>
                                    </div>
                                )}
                            </div>

                            {/* Card Actions */}
                            <div className="p-4 border-t border-gray-200 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => {
                                            setSelectedFeedback(feedback)
                                            setShowFeedbackDetails(true)
                                        }}
                                        className="flex items-center gap-2 text-[#071d49] hover:text-[#ffd100] font-medium transition-colors"
                                    >
                                        <Eye size={16} />
                                        View Details
                                    </button>

                                    {feedback.status === "pending" && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleStatusChange(feedback.id, "approved")}
                                                className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors border border-green-200 hover:border-green-300"
                                                title="Approve"
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(feedback.id, "rejected")}
                                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
                                                title="Reject"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredFeedbacks.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border-2 border-gray-200">
                        <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
                        <h3 className="text-[#071d49] text-lg font-bold mb-2">No feedback found</h3>
                        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>

            {/* Feedback Details Modal */}
            {showFeedbackDetails && (
                <FeedbackDetailsModal
                    feedback={selectedFeedback}
                    onClose={() => {
                        setShowFeedbackDetails(false)
                        setSelectedFeedback(null)
                    }}
                />
            )}
        </DashboardLayout>
    )
}
