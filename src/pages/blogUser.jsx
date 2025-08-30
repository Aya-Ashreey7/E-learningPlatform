import { useState, useEffect } from "react"
import {
    Calendar,
    Clock,
    Eye,
    Heart,
    MessageCircle,
    Share2,
    Search,
    ChevronRight,
    MapPin,
    Star,
    BookOpen,
    ArrowRight,
    Tag,
} from "lucide-react"
import Navbar from "../components/Navbar/Navbar"

// Mock blog posts data (same as admin dashboard)
const mockBlogPosts = [
    {
        id: "blog_001",
        title: "New Programming Course for Kids Launched!",
        slug: "new-programming-course-kids-launched",
        content: `
      <p>We're excited to announce the launch of our brand new programming course designed specifically for children aged 8-14!</p>
      <p>This comprehensive course covers:</p>
      <ul>
        <li>Basic programming concepts</li>
        <li>Interactive game development</li>
        <li>Creative coding projects</li>
        <li>Problem-solving skills</li>
      </ul>
      <p>Join us on this amazing coding adventure!</p>
    `,
        excerpt:
            "We're excited to announce the launch of our brand new programming course designed specifically for children aged 8-14!",
        featuredImage: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=400&fit=crop",
        author: "Sarah Johnson",
        authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        category: "Announcements",
        tags: ["programming", "kids", "education", "courses"],
        status: "published",
        publishDate: new Date("2025-08-15T10:00:00Z"),
        views: 1250,
        likes: 89,
        comments: 23,
        featured: true,
        eventDate: new Date("2025-09-01T09:00:00Z"),
        eventLocation: "Online",
        eventType: "course_launch",
        readTime: "5 min read",
    },
    {
        id: "blog_002",
        title: "Tips for Parents: Supporting Your Child's Coding Journey",
        slug: "tips-parents-supporting-child-coding-journey",
        content: `
      <p>As a parent, you play a crucial role in your child's learning journey. Here are some practical tips to support your young coder:</p>
      <h3>1. Create a Dedicated Learning Space</h3>
      <p>Set up a quiet, comfortable area where your child can focus on coding without distractions.</p>
      <h3>2. Celebrate Small Wins</h3>
      <p>Acknowledge every milestone, no matter how small. This builds confidence and motivation.</p>
    `,
        excerpt:
            "As a parent, you play a crucial role in your child's learning journey. Here are some practical tips to support your young coder.",
        featuredImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
        author: "Michael Chen",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        category: "Parenting",
        tags: ["parenting", "coding", "tips", "support"],
        status: "published",
        publishDate: new Date("2025-08-12T08:00:00Z"),
        views: 890,
        likes: 67,
        comments: 15,
        featured: false,
        eventDate: null,
        eventLocation: null,
        eventType: "article",
        readTime: "8 min read",
    },
    {
        id: "blog_003",
        title: "Upcoming Coding Workshop: Build Your First Game",
        slug: "upcoming-coding-workshop-build-first-game",
        content: `
      <p>Join us for an exciting hands-on workshop where kids will learn to build their very first video game!</p>
      <p><strong>What you'll learn:</strong></p>
      <ul>
        <li>Game design basics</li>
        <li>Character creation</li>
        <li>Level design</li>
        <li>Sound effects and music</li>
      </ul>
      <p>Limited spots available - register now!</p>
    `,
        excerpt: "Join us for an exciting hands-on workshop where kids will learn to build their very first video game!",
        featuredImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop",
        author: "Emma Wilson",
        authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        category: "Events",
        tags: ["workshop", "game development", "kids", "event"],
        status: "published",
        publishDate: new Date("2025-08-10T12:00:00Z"),
        views: 456,
        likes: 34,
        comments: 8,
        featured: true,
        eventDate: new Date("2025-09-15T14:00:00Z"),
        eventLocation: "Virtual Classroom",
        eventType: "workshop",
        readTime: "3 min read",
    },
    {
        id: "blog_004",
        title: "Success Story: 12-Year-Old Creates Amazing Mobile App",
        slug: "success-story-12-year-old-creates-mobile-app",
        content: `
      <p>Meet Alex, one of our amazing students who just completed our mobile app development course and created something incredible!</p>
      <p>Alex's app "Study Buddy" helps kids organize their homework and track their progress. The app features:</p>
      <ul>
        <li>Task management system</li>
        <li>Progress tracking</li>
        <li>Reward system</li>
        <li>Parent notifications</li>
      </ul>
      <p>We're so proud of Alex's achievement and can't wait to see what our students create next!</p>
    `,
        excerpt:
            "Meet Alex, one of our amazing students who just completed our mobile app development course and created something incredible!",
        featuredImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop",
        author: "Lisa Rodriguez",
        authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        category: "Success Stories",
        tags: ["success story", "mobile app", "student achievement", "inspiration"],
        status: "published",
        publishDate: new Date("2025-08-08T15:30:00Z"),
        views: 2100,
        likes: 156,
        comments: 42,
        featured: false,
        eventDate: null,
        eventLocation: null,
        eventType: "article",
        readTime: "6 min read",
    },
    {
        id: "blog_005",
        title: "Free Coding Bootcamp for Beginners - Register Now!",
        slug: "free-coding-bootcamp-beginners-register-now",
        content: `
      <p>We're excited to offer a completely FREE 3-day coding bootcamp for absolute beginners!</p>
      <p>This intensive bootcamp will cover:</p>
      <ul>
        <li>Introduction to programming</li>
        <li>HTML & CSS basics</li>
        <li>JavaScript fundamentals</li>
        <li>Building your first website</li>
      </ul>
      <p>Perfect for kids aged 10-16 who want to get started with coding. No experience required!</p>
    `,
        excerpt:
            "We're excited to offer a completely FREE 3-day coding bootcamp for absolute beginners! Perfect for kids aged 10-16.",
        featuredImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
        author: "David Kim",
        authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        category: "Events",
        tags: ["bootcamp", "free", "beginners", "web development"],
        status: "published",
        publishDate: new Date("2025-08-05T09:00:00Z"),
        views: 3200,
        likes: 245,
        comments: 67,
        featured: true,
        eventDate: new Date("2025-08-25T10:00:00Z"),
        eventLocation: "EduLearn Campus & Online",
        eventType: "bootcamp",
        readTime: "4 min read",
    },
]

const categories = ["All", "Announcements", "Parenting", "Events", "Tutorials", "Success Stories", "News"]

export default function BlogPage() {
    const [blogPosts] = useState(mockBlogPosts.filter((post) => post.status === "published"))
    const [filteredPosts, setFilteredPosts] = useState(mockBlogPosts.filter((post) => post.status === "published"))
    const [selectedPost, setSelectedPost] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("All")
    const [showFullPost, setShowFullPost] = useState(false)
    const [likedPosts, setLikedPosts] = useState(new Set())

    // Filter posts
    useEffect(() => {
        let filtered = blogPosts

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (post) =>
                    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
            )
        }

        // Category filter
        if (categoryFilter !== "All") {
            filtered = filtered.filter((post) => post.category === categoryFilter)
        }

        setFilteredPosts(filtered)
    }, [searchTerm, categoryFilter, blogPosts])

    const featuredPosts = filteredPosts.filter((post) => post.featured)
    const regularPosts = filteredPosts.filter((post) => !post.featured)

    const formatDate = (date) => {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(date)
    }

    const formatEventDate = (date) => {
        return new Intl.DateTimeFormat("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    const handleLike = (postId) => {
        setLikedPosts((prev) => {
            const newLiked = new Set(prev)
            if (newLiked.has(postId)) {
                newLiked.delete(postId)
            } else {
                newLiked.add(postId)
            }
            return newLiked
        })
    }

    const handleReadMore = (post) => {
        setSelectedPost(post)
        setShowFullPost(true)
    }

    const getCategoryIcon = (category) => {
        switch (category) {
            case "Announcements":
                return "📢"
            case "Parenting":
                return "👨‍👩‍👧‍👦"
            case "Events":
                return "🎉"
            case "Tutorials":
                return "📚"
            case "Success Stories":
                return "🏆"
            case "News":
                return "📰"
            default:
                return "📝"
        }
    }

    const getEventTypeIcon = (eventType) => {
        switch (eventType) {
            case "course_launch":
                return "🚀"
            case "workshop":
                return "🛠️"
            case "bootcamp":
                return "⚡"
            case "webinar":
                return "💻"
            case "competition":
                return "🏆"
            default:
                return "📅"
        }
    }

    // Full Post Modal
    const FullPostModal = ({ post, onClose }) => {
        if (!post) return null

        return (


            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
                    {/* Header */}
                    <div className="relative">
                        <img
                            src={post.featuredImage || "/placeholder.svg"}
                            alt={post.title}
                            className="w-full h-64 object-cover rounded-t-xl"
                        />
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        >
                            ✕
                        </button>
                        <div className="absolute bottom-4 left-4">
                            <span className="bg-[#071d49] text-white px-3 py-1 rounded-full text-sm font-medium">
                                {getCategoryIcon(post.category)} {post.category}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {/* Title and Meta */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-[#071d49] mb-4 leading-tight">{post.title}</h1>

                            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={post.authorAvatar || "/placeholder.svg"}
                                        alt={post.author}
                                        className="w-8 h-8 rounded-full border-2 border-[#ffd100]"
                                    />
                                    <span className="font-medium">{post.author}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar size={16} />
                                    <span>{formatDate(post.publishDate)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock size={16} />
                                    <span>{post.readTime}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <Eye size={16} />
                                        {post.views}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Heart size={16} />
                                        {post.likes}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageCircle size={16} />
                                        {post.comments}
                                    </span>
                                </div>
                            </div>

                            {/* Event Info */}
                            {post.eventDate && (
                                <div className="bg-gradient-to-r from-[#ffd100]/20 to-transparent p-4 rounded-lg border-l-4 border-[#ffd100] mb-6">
                                    <div className="flex items-center gap-2 text-[#071d49] font-bold mb-2">
                                        {getEventTypeIcon(post.eventType)}
                                        <span>Upcoming Event</span>
                                    </div>
                                    <div className="text-gray-700">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Calendar size={16} />
                                            <span>{formatEventDate(post.eventDate)}</span>
                                        </div>
                                        {post.eventLocation && (
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} />
                                                <span>{post.eventLocation}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {post.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                                    >
                                        <Tag size={12} />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Article Content */}
                        <div
                            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-8 border-t border-gray-200 mt-8">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleLike(post.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${likedPosts.has(post.id)
                                        ? "bg-red-100 text-red-600 border border-red-200"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                                        }`}
                                >
                                    <Heart size={18} className={likedPosts.has(post.id) ? "fill-current" : ""} />
                                    <span>{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200">
                                    <MessageCircle size={18} />
                                    <span>Comment</span>
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200">
                                    <Share2 size={18} />
                                    <span>Share</span>
                                </button>
                            </div>

                            {post.eventDate && (
                                <button className="bg-[#ffd100] text-[#071d49] px-6 py-3 rounded-lg font-bold hover:bg-[#ffd100]/90 transition-colors shadow-lg">
                                    Register for Event
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        )
    }

    return (
        <>

            <Navbar />
            <div className="min-h-screen bg-white">
                {/* Hero Section */}
                <div className="relative bg-gradient-to-br from-[#071d49] via-[#0a2555] to-[#071d49] overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-20 w-32 h-32 bg-[#ffd100]/10 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-20 right-20 w-24 h-24 bg-[#ffd100]/15 rounded-full animate-bounce"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#ffd100]/5 rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative z-10 container mx-auto px-4 py-16">
                        <div className="text-center max-w-4xl mx-auto">
                            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                Our Learning
                                <span className="text-[#ffd100]"> Blog</span>
                            </h1>
                            <p className="text-xl text-white/90 mb-8 leading-relaxed">
                                Discover the latest updates, educational tips, success stories, and upcoming events from our learning
                                community. Stay informed and inspired on your coding journey!
                            </p>

                            {/* Search Bar */}
                            <div className="max-w-2xl mx-auto relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search articles, events, and more..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white/95 backdrop-blur-sm border-2 border-white/20 rounded-xl text-[#071d49] placeholder-gray-500 focus:border-[#ffd100] focus:outline-none focus:ring-2 focus:ring-[#ffd100]/20 transition-all shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-12">
                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setCategoryFilter(category)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${categoryFilter === category
                                    ? "bg-[#071d49] text-white shadow-lg"
                                    : "bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200 hover:border-[#ffd100]"
                                    }`}
                            >
                                <span>{getCategoryIcon(category)}</span>
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Featured Posts */}
                    {featuredPosts.length > 0 && (
                        <div className="mb-16">
                            <div className="flex items-center gap-3 mb-8">
                                <Star className="text-[#ffd100]" size={24} />
                                <h2 className="text-3xl font-bold text-[#071d49]">Featured Posts</h2>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {featuredPosts.slice(0, 2).map((post) => (
                                    <div
                                        key={post.id}
                                        className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                                    >
                                        {/* Image */}
                                        <div className="relative h-64 overflow-hidden">
                                            <img
                                                src={post.featuredImage || "/placeholder.svg"}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-[#071d49] text-white px-3 py-1 rounded-full text-sm font-medium">
                                                    {getCategoryIcon(post.category)} {post.category}
                                                </span>
                                            </div>
                                            {post.featured && (
                                                <div className="absolute top-4 right-4">
                                                    <span className="bg-[#ffd100] text-[#071d49] px-3 py-1 rounded-full text-sm font-bold">
                                                        ⭐ Featured
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 space-y-4">
                                            {/* Event Info */}
                                            {post.eventDate && (
                                                <div className="bg-gradient-to-r from-[#ffd100]/20 to-transparent p-3 rounded-lg border-l-4 border-[#ffd100]">
                                                    <div className="flex items-center gap-2 text-[#071d49] font-bold text-sm">
                                                        {getEventTypeIcon(post.eventType)}
                                                        <span>Event: {formatEventDate(post.eventDate)}</span>
                                                    </div>
                                                    {post.eventLocation && (
                                                        <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                                                            <MapPin size={14} />
                                                            <span>{post.eventLocation}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Title */}
                                            <h3 className="text-xl font-bold text-[#071d49] leading-tight group-hover:text-[#ffd100] transition-colors">
                                                {post.title}
                                            </h3>

                                            {/* Excerpt */}
                                            <p className="text-gray-600 leading-relaxed">{post.excerpt}</p>

                                            {/* Meta Info */}
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                            src={post.authorAvatar || "/placeholder.svg"}
                                                            alt={post.author}
                                                            className="w-6 h-6 rounded-full border border-[#ffd100]"
                                                        />
                                                        <span>{post.author}</span>
                                                    </div>
                                                    <span>{formatDate(post.publishDate)}</span>
                                                    <span>{post.readTime}</span>
                                                </div>
                                            </div>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-2">
                                                {post.tags.slice(0, 3).map((tag, index) => (
                                                    <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <button
                                                        onClick={() => handleLike(post.id)}
                                                        className={`flex items-center gap-1 hover:text-red-500 transition-colors ${likedPosts.has(post.id) ? "text-red-500" : ""
                                                            }`}
                                                    >
                                                        <Heart size={16} className={likedPosts.has(post.id) ? "fill-current" : ""} />
                                                        {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                                                    </button>
                                                    <span className="flex items-center gap-1">
                                                        <Eye size={16} />
                                                        {post.views}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MessageCircle size={16} />
                                                        {post.comments}
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={() => handleReadMore(post)}
                                                    className="flex items-center gap-2 text-[#071d49] hover:text-[#ffd100] font-medium transition-colors"
                                                >
                                                    Read More
                                                    <ArrowRight size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Regular Posts */}
                    {regularPosts.length > 0 && (
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <BookOpen className="text-[#071d49]" size={24} />
                                <h2 className="text-3xl font-bold text-[#071d49]">Latest Articles</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {regularPosts.map((post) => (
                                    <div
                                        key={post.id}
                                        className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                                    >
                                        {/* Image */}
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={post.featuredImage || "/placeholder.svg"}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute top-3 left-3">
                                                <span className="bg-[#071d49] text-white px-2 py-1 rounded-full text-xs font-medium">
                                                    {getCategoryIcon(post.category)} {post.category}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5 space-y-3">
                                            {/* Event Info */}
                                            {post.eventDate && (
                                                <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
                                                    <div className="flex items-center gap-1 text-blue-700 font-medium text-xs">
                                                        {getEventTypeIcon(post.eventType)}
                                                        <span>{formatDate(post.eventDate)}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Title */}
                                            <h3 className="text-lg font-bold text-[#071d49] leading-tight group-hover:text-[#ffd100] transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>

                                            {/* Excerpt */}
                                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>

                                            {/* Meta */}
                                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <img
                                                        src={post.authorAvatar || "/placeholder.svg"}
                                                        alt={post.author}
                                                        className="w-5 h-5 rounded-full border border-[#ffd100]"
                                                    />
                                                    <span>{post.author}</span>
                                                </div>
                                                <span>{formatDate(post.publishDate)}</span>
                                                <span>{post.readTime}</span>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                                    <button
                                                        onClick={() => handleLike(post.id)}
                                                        className={`flex items-center gap-1 hover:text-red-500 transition-colors ${likedPosts.has(post.id) ? "text-red-500" : ""
                                                            }`}
                                                    >
                                                        <Heart size={14} className={likedPosts.has(post.id) ? "fill-current" : ""} />
                                                        {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                                                    </button>
                                                    <span className="flex items-center gap-1">
                                                        <Eye size={14} />
                                                        {post.views}
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={() => handleReadMore(post)}
                                                    className="text-[#071d49] hover:text-[#ffd100] font-medium text-sm transition-colors flex items-center gap-1"
                                                >
                                                    Read More
                                                    <ChevronRight size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {filteredPosts.length === 0 && (
                        <div className="text-center py-16">
                            <div className="max-w-md mx-auto">
                                <div className="text-6xl mb-4">📝</div>
                                <h3 className="text-2xl font-bold text-[#071d49] mb-4">No posts found</h3>
                                <p className="text-gray-600 mb-6">
                                    We couldn't find any posts matching your search criteria. Try adjusting your filters or search terms.
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchTerm("")
                                        setCategoryFilter("All")
                                    }}
                                    className="bg-[#ffd100] text-[#071d49] px-6 py-3 rounded-lg font-bold hover:bg-[#ffd100]/90 transition-colors"
                                >
                                    Show All Posts
                                </button>
                            </div>
                        </div>
                    )}
                    {/* Newsletter Signup */}
                    <div className="mt-20 bg-gradient-to-r from-[#071d49] to-[#0a2555] rounded-2xl p-8 text-center text-white">
                        <h3 className="text-2xl font-bold mb-4">Stay Updated!</h3>
                        <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                            Subscribe to our newsletter to get the latest blog posts, event announcements, and educational tips
                            delivered straight to your inbox.
                        </p>
                        {/* <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 rounded-lg text-[#071d49] focus:outline-none focus:ring-2 focus:ring-[#ffd100]"
                        />
                        <button className="bg-[#ffd100] text-[#071d49] px-6 py-3 rounded-lg font-bold hover:bg-[#ffd100]/90 transition-colors">
                            Subscribe
                        </button>
                    </div> */}
                    </div>
                </div>

                {/* Full Post Modal */}
                {showFullPost && <FullPostModal post={selectedPost} onClose={() => setShowFullPost(false)} />}
            </div>
        </>
    )
}
