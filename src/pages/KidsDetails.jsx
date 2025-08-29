import { useState } from "react"
import { Play, Clock, Users, Award, Star, BookOpen, Heart, Share2, Download, CheckCircle, User, Trophy, Sparkles, Zap, Target, } from "lucide-react"

const courseData = {
    id: "course_kids_001",
    title: "Fun with Node.js for Kids",
    description:
        "Learn programming in a fun and interactive way! This course introduces kids to the exciting world of Node.js through games, animations, and creative projects. Perfect for young minds ready to explore coding!",
    image: "/placeholder.svg?height=400&width=600&text=Fun+Node.js+Course",
    instructor: "Ms. Sarah Johnson",
    instructorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    instructorBio:
        "Certified kids programming instructor with 8+ years of experience making coding fun and accessible for children.",
    price: 70,
    originalPrice: 100,
    duration: "50",
    audience: "Kids",
    category_id: "JhmxBmvboGl3ey3HkwOo",
    certificate: true,
    lecturesAvailability: "Available",
    traineesCount: "200",
    trainees_count: 20,
    rating: 4.8,
    totalReviews: 156,
    level: "Beginner",
    language: "English",
    lastUpdated: "2025-01-10",

    // Additional kid-friendly data
    ageRange: "8-14 years",
    prerequisites: "Basic computer skills",
    whatYouWillLearn: [
        "🎮 Create fun interactive games",
        "🌟 Build colorful web applications",
        "🤖 Make chatbots and fun projects",
        "🎨 Design creative digital art with code",
        "🏆 Earn certificates and badges",
        "👥 Work on team projects with friends",
    ],
    courseIncludes: [
        "50+ hours of video content",
        "Interactive coding exercises",
        "Downloadable resources and templates",
        "Certificate of completion",
        "24/7 community support",
        "Mobile and desktop access",
        "Fun coding challenges and games",
        "Parent progress reports",
    ],
    curriculum: [
        {
            title: "🚀 Getting Started - Your First Code Adventure",
            lessons: 8,
            duration: "2 hours",
            topics: [
                "What is programming?",
                "Setting up your coding space",
                "Your first 'Hello World!'",
                "Fun with colors and text",
            ],
        },
        {
            title: "🎮 Making Things Move - Animation Magic",
            lessons: 12,
            duration: "3 hours",
            topics: ["Creating moving objects", "Making characters dance", "Building simple games", "Adding sound effects"],
        },
        {
            title: "🌈 Building Cool Projects",
            lessons: 15,
            duration: "4 hours",
            topics: ["Weather app for kids", "Digital pet game", "Story generator", "Math quiz game"],
        },
        {
            title: "🏆 Advanced Fun - Become a Code Wizard",
            lessons: 10,
            duration: "3 hours",
            topics: [
                "Working with databases",
                "Creating user accounts",
                "Building a mini social network",
                "Final showcase project",
            ],
        },
    ],
}

export default function KidsCourseDetails() {
    const [activeTab, setActiveTab] = useState("overview")
    // const [isEnrolled, setIsEnrolled] = useState(false)
    const [isFavorited, setIsFavorited] = useState(false)

    // const handleEnroll = () => {
    //     setIsEnrolled(true)
    // }

    const toggleFavorite = () => {
        setIsFavorited(!isFavorited)
    }

    return (
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
                                <span className="text-[#ffd100]"> {courseData.title} </span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="bg-[#ffd100] text-[#071d49] px-3 py-1 rounded-full text-sm font-bold">
                                        👶 {courseData.audience}
                                    </span>
                                    {/* <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {courseData.level}
                                    </span> */}
                                </div>

                                <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">{courseData.title}</h1>

                                <p className="text-white/90 text-lg leading-relaxed">{courseData.description}</p>
                            </div>

                            {/* Course Stats */}
                            <div className="flex flex-wrap gap-6">
                                <div className="flex items-center gap-2 text-white">
                                    <div className="flex text-[#ffd100]">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={20} className={i < Math.floor(courseData.rating) ? "fill-current" : ""} />
                                        ))}
                                    </div>
                                    <span className="font-bold">{courseData.rating}</span>
                                    <span className="text-white/70">({courseData.totalReviews} reviews)</span>
                                </div>

                                <div className="flex items-center gap-2 text-white">
                                    <Users size={20} className="text-[#ffd100]" />
                                    <span>{courseData.traineesCount} happy students</span>
                                </div>

                                <div className="flex items-center gap-2 text-white">
                                    <Clock size={20} className="text-[#ffd100]" />
                                    <span>{courseData.duration} hours of fun</span>
                                </div>
                            </div>

                            {/* Instructor */}
                            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <img
                                    src={courseData.instructorAvatar || "/placeholder.svg"}
                                    alt={courseData.instructor}
                                    className="w-12 h-12 rounded-full border-2 border-[#ffd100]"
                                />
                                <div>
                                    <p className="text-white font-medium">Taught by</p>
                                    <p className="text-[#ffd100] font-bold">{courseData.instructor}</p>
                                </div>
                            </div>
                        </div>

                        {/* Course Preview Card */}
                        <div className="lg:ml-8">
                            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-[#ffd100]">
                                {/* Course Image */}
                                <div className="relative">
                                    <img
                                        src={courseData.image || "/placeholder.svg"}
                                        alt={courseData.title}
                                        className="w-full h-64 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                        {/* <button className="bg-[#ffd100] text-[#071d49] p-4 rounded-full shadow-lg hover:scale-110 transition-transform">
                                            <Play size={32} className="ml-1" />
                                        </button> */}
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <button
                                            onClick={toggleFavorite}
                                            className={`p-2 rounded-full transition-colors ${isFavorited ? "bg-red-500 text-white" : "bg-white/80 text-gray-600 hover:bg-white"
                                                }`}
                                        >
                                            <Heart size={20} className={isFavorited ? "fill-current" : ""} />
                                        </button>
                                    </div>
                                </div>

                                {/* Pricing and Enrollment */}
                                <div className="p-6 space-y-4">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <span className="text-3xl font-bold text-[#071d49]">${courseData.price}</span>
                                            <span className="text-lg text-gray-500 line-through">${courseData.originalPrice}</span>
                                            <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-bold">30% OFF</span>
                                        </div>
                                        <p className="text-gray-600 text-sm mt-1">One-time payment • Lifetime access</p>
                                    </div>

                                    <button
                                        // onClick={handleEnroll}
                                        // disabled={isEnrolled}
                                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 
                                             bg-[#ffd100] text-[#071d49] hover:bg-[#ffd100]/90 shadow-lg
                                            }`}
                                    >
                                        {/* {isEnrolled ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <CheckCircle size={20} />
                                                Enrolled! 🎉
                                            </span>
                                        ) : (
                                            "Start Learning Now! 🚀"
                                        )} */}
                                    </button>

                                    {/* <div className="flex gap-2">
                                        <button className="flex-1 bg-gray-100 text-[#071d49] py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                            <Share2 size={18} />
                                            Share
                                        </button>
                                        <button className="flex-1 bg-gray-100 text-[#071d49] py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                            <Download size={18} />
                                            Download
                                        </button>
                                    </div> */}

                                    {/* Course Includes Preview */}
                                    <div className="border-t pt-4 space-y-2">
                                        <h4 className="font-bold text-[#071d49] flex items-center gap-2">
                                            <Sparkles size={18} className="text-[#ffd100]" />
                                            This course includes:
                                        </h4>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle size={16} className="text-green-500" />
                                                <span>50+ hours of video content</span>
                                            </div>
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
                                { id: "overview", label: "🌟 Overview", icon: BookOpen },
                                { id: "curriculum", label: "📚 Lessons", icon: Target },
                                { id: "instructor", label: "👩‍🏫 Teacher", icon: User },
                                { id: "reviews", label: "⭐ Reviews", icon: Star },
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
                                    {/* What You'll Learn */}
                                    <div>
                                        <h3 className="text-2xl font-bold text-[#071d49] mb-6 flex items-center gap-2">
                                            <Zap className="text-[#ffd100]" />
                                            What You'll Learn
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {courseData.whatYouWillLearn.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start gap-3 p-4 bg-gradient-to-r from-[#ffd100]/10 to-transparent rounded-xl border border-[#ffd100]/20"
                                                >
                                                    <CheckCircle size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-[#071d49] font-medium">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Course Description */}
                                    <div>
                                        <h3 className="text-2xl font-bold text-[#071d49] mb-4">About This Course</h3>
                                        <div className="prose prose-lg max-w-none text-gray-700">
                                            <p className="leading-relaxed">
                                                Welcome to the most exciting programming adventure for kids! This comprehensive Node.js course
                                                is specially designed to make coding fun, engaging, and accessible for young learners aged 8-14.
                                            </p>
                                            <p className="leading-relaxed">
                                                Through interactive games, colorful animations, and creative projects, your child will discover
                                                the magic of programming while building real applications they can be proud of. Our kid-friendly
                                                approach ensures that complex concepts are broken down into bite-sized, enjoyable lessons.
                                            </p>
                                            <p className="leading-relaxed">
                                                By the end of this course, your child will have created their own games, built interactive
                                                websites, and developed problem-solving skills that will benefit them throughout their
                                                educational journey and beyond.
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

                            {/* {activeTab === "curriculum" && (
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-[#071d49] mb-6 flex items-center gap-2">
                                        <BookOpen className="text-[#ffd100]" />
                                        Course Curriculum
                                    </h3>

                                    <div className="space-y-4">
                                        {courseData.curriculum.map((section, index) => (
                                            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                                                <div className="bg-gradient-to-r from-[#071d49] to-[#0a2555] text-white p-6">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-lg font-bold">{section.title}</h4>
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <span className="bg-[#ffd100] text-[#071d49] px-3 py-1 rounded-full font-medium">
                                                                {section.lessons} lessons
                                                            </span>
                                                            <span className="bg-white/20 px-3 py-1 rounded-full">{section.duration}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-6 bg-gray-50">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {section.topics.map((topic, topicIndex) => (
                                                            <div key={topicIndex} className="flex items-center gap-2 text-gray-700">
                                                                <Play size={14} className="text-[#ffd100]" />
                                                                <span>{topic}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )} */}

                            {activeTab === "instructor" && (
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-[#071d49] mb-6 flex items-center gap-2">
                                        <User className="text-[#ffd100]" />
                                        Meet Your Instructor
                                    </h3>

                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={courseData.instructorAvatar || "/placeholder.svg"}
                                                alt={courseData.instructor}
                                                className="w-32 h-32 rounded-full border-4 border-[#ffd100] shadow-lg"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-xl font-bold text-[#071d49]">{courseData.instructor}</h4>
                                                <p className="text-[#ffd100] font-medium">Kids Programming Specialist</p>
                                            </div>
                                            <p className="text-gray-700 leading-relaxed">{courseData.instructorBio}</p>
                                            <div className="flex flex-wrap gap-4 text-sm">
                                                <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                                                    <Users size={16} className="text-blue-500" />
                                                    <span>1000+ Students Taught</span>
                                                </div>
                                                <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                                                    <Star size={16} className="text-green-500" />
                                                    <span>4.9 Instructor Rating</span>
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

                                    {/* Rating Summary */}
                                    <div className="bg-gradient-to-r from-[#ffd100]/10 to-transparent p-6 rounded-xl border border-[#ffd100]/20">
                                        <div className="flex items-center gap-6">
                                            <div className="text-center">
                                                <div className="text-4xl font-bold text-[#071d49]">{courseData.rating}</div>
                                                <div className="flex text-[#ffd100] justify-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={20}
                                                            className={i < Math.floor(courseData.rating) ? "fill-current" : ""}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="text-gray-600 text-sm">{courseData.totalReviews} reviews</div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="space-y-2">
                                                    {[5, 4, 3, 2, 1].map((rating) => (
                                                        <div key={rating} className="flex items-center gap-3">
                                                            <span className="text-sm w-8">{rating}★</span>
                                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className="bg-[#ffd100] h-2 rounded-full"
                                                                    style={{
                                                                        width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 8 : rating === 2 ? 2 : 0}%`,
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-sm text-gray-600 w-8">
                                                                {rating === 5
                                                                    ? "70%"
                                                                    : rating === 4
                                                                        ? "20%"
                                                                        : rating === 3
                                                                            ? "8%"
                                                                            : rating === 2
                                                                                ? "2%"
                                                                                : "0%"}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sample Reviews */}
                                    <div className="space-y-4">
                                        {[
                                            {
                                                name: "Emma's Mom",
                                                rating: 5,
                                                date: "2 weeks ago",
                                                comment:
                                                    "My 10-year-old daughter absolutely loves this course! She's been coding every day after school and has already built her first game. The instructor explains everything so clearly and makes it fun. Highly recommended! 🌟",
                                            },
                                            {
                                                name: "David's Dad",
                                                rating: 5,
                                                date: "1 month ago",
                                                comment:
                                                    "Amazing course! My son went from knowing nothing about programming to creating his own websites. The projects are engaging and age-appropriate. Worth every penny!",
                                            },
                                            {
                                                name: "Sarah (Age 12)",
                                                rating: 4,
                                                date: "3 weeks ago",
                                                comment:
                                                    "This course is really cool! I learned how to make games and websites. Some parts were a bit hard but the teacher explains everything step by step. I want to learn more programming now! 🚀",
                                            },
                                        ].map((review, index) => (
                                            <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h5 className="font-bold text-[#071d49]">{review.name}</h5>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex text-[#ffd100]">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} size={14} className={i < review.rating ? "fill-current" : ""} />
                                                                ))}
                                                            </div>
                                                            <span className="text-gray-500 text-sm">{review.date}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Course Features */}
                        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
                            <h4 className="font-bold text-[#071d49] mb-4 flex items-center gap-2">
                                <Trophy className="text-[#ffd100]" />
                                Course Features
                            </h4>
                            <div className="space-y-3">
                                {courseData.courseIncludes.map((feature, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700 text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Course Info */}
                        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
                            <h4 className="font-bold text-[#071d49] mb-4">Course Information</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Age Range:</span>
                                    {/* <span className="font-medium text-[#071d49]">{courseData.ageRange}</span> */}
                                    <span className="font-medium text-[#071d49]"> 10 : 18</span>

                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Duration:</span>
                                    <span className="font-medium text-[#071d49]">{courseData.duration} hours</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Level:</span>
                                    <span className="font-medium text-[#071d49]">{courseData.level}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Language:</span>
                                    <span className="font-medium text-[#071d49]">{courseData.language}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Certificate:</span>
                                    <span className="font-medium text-green-600">{courseData.certificate ? "✅ Yes" : "❌ No"}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Students:</span>
                                    <span className="font-medium text-[#071d49]">{courseData.traineesCount}</span>
                                </div>
                            </div>
                        </div>

                        {/* Related Courses */}
                        {/* <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
                            <h4 className="font-bold text-[#071d49] mb-4">More Kids Courses</h4>
                            <div className="space-y-4">
                                {[
                                    {
                                        title: "Python for Young Coders",
                                        price: 65,
                                        image: "/placeholder.svg?height=80&width=80&text=Python",
                                    },
                                    { title: "Web Design for Kids", price: 55, image: "/placeholder.svg?height=80&width=80&text=Web" },
                                    {
                                        title: "Game Development Basics",
                                        price: 75,
                                        image: "/placeholder.svg?height=80&width=80&text=Game",
                                    },
                                ].map((course, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        <img
                                            src={course.image || "/placeholder.svg"}
                                            alt={course.title}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                        <div className="flex-1">
                                            <h5 className="font-medium text-[#071d49] text-sm">{course.title}</h5>
                                            <p className="text-[#ffd100] font-bold">${course.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}
