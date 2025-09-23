import { useState, useEffect } from "react"
import {
    Search, Calendar, User, Heart, MessageCircle, Eye, BookOpen, Filter, X, ChevronLeft, ChevronRight, ImageIcon, Mail,
    ArrowRight, Clock, MapPin, Tag, TrendingUp, Star, Users, Award, Target, Zap, Globe, Plus,
} from "lucide-react"
import { getPublishedBlogs, updateBlogStats } from "../blogService"
import Navbar from "../components/Navbar/Navbar"
import Footer from "../components/Footer/Footer"

const categories = [
    { name: "All", icon: Globe, color: "bg-blue-500" },
    { name: "Announcements", icon: TrendingUp, color: "bg-green-500" },
    { name: "Events", icon: Calendar, color: "bg-purple-500" },
    { name: "Tutorials", icon: BookOpen, color: "bg-orange-500" },
    { name: "Success Stories", icon: Award, color: "bg-yellow-500" },
    { name: "News", icon: Zap, color: "bg-red-500" },
]
export default function BlogPage() {
    const [blogPosts, setBlogPosts] = useState([])
    const [filteredPosts, setFilteredPosts] = useState([])
    const [featuredPosts, setFeaturedPosts] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [showFilters, setShowFilters] = useState(false)
    const [selectedPost, setSelectedPost] = useState(null)
    const [showGallery, setShowGallery] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [error, setError] = useState(null)
    // const [email, setEmail] = useState("")
    // const [subscribed, setSubscribed] = useState(false)

    // Load published blog posts from Firestore
    useEffect(() => {
        const loadBlogPosts = async () => {
            try {
                setError(null)
                const posts = await getPublishedBlogs()
                setBlogPosts(posts)
                setFilteredPosts(posts)
                setFeaturedPosts(posts.filter((post) => post.featured).slice(0, 3))
            } catch (err) {
                console.error("Error loading blog posts:", err)
                setError("Failed to load blog posts. Please try again later.")
            }

        }

        loadBlogPosts()
    }, [])

    // Filter posts based on search and category
    useEffect(() => {
        let filtered = blogPosts

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (post) =>
                    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
            )
        }

        // Category filter
        if (selectedCategory !== "All") {
            filtered = filtered.filter((post) => post.category === selectedCategory)
        }

        setFilteredPosts(filtered)
    }, [searchTerm, selectedCategory, blogPosts])

    const handlePostClick = async (post) => {
        setSelectedPost(post)
        try {
            await updateBlogStats(post.id, { views: post.views + 1 })
            setBlogPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, views: p.views + 1 } : p)))
        } catch (err) {
            console.error("Error updating view count:", err)
        }
    }

    const handleLike = async (postId) => {
        try {
            const post = blogPosts.find((p) => p.id === postId)
            if (post) {
                await updateBlogStats(postId, { likes: post.likes + 1 })
                setBlogPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p)))
            }
        } catch (err) {
            console.error("Error updating like count:", err)
        }
    }

    const openGallery = (post, imageIndex = 0) => {
        setSelectedPost(post)
        setCurrentImageIndex(imageIndex)
        setShowGallery(true)
    }

    const closeGallery = () => {
        setShowGallery(false)
        setSelectedPost(null)
        setCurrentImageIndex(0)
    }

    const nextImage = () => {
        if (selectedPost && selectedPost.galleryImages) {
            setCurrentImageIndex((prev) => (prev + 1) % selectedPost.galleryImages.length)
        }
    }

    const prevImage = () => {
        if (selectedPost && selectedPost.galleryImages) {
            setCurrentImageIndex((prev) => (prev - 1 + selectedPost.galleryImages.length) % selectedPost.galleryImages.length)
        }
    }

    // const handleNewsletterSubmit = (e) => {
    //     e.preventDefault()
    //     if (email) {
    //         setSubscribed(true)
    //         setEmail("")
    //         setTimeout(() => setSubscribed(false), 3000)
    //     }
    // }

    const formatDate = (date) => {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(date)
    }

    const stripHtml = (html) => {
        const tmp = document.createElement("div")
        tmp.innerHTML = html
        return tmp.textContent || tmp.innerText || ""
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="text-red-500 mb-4">
                            <X size={48} className="mx-auto" />
                        </div>
                        <h3 className="text-xl font-bold text-[#071d49] mb-2">Error Loading Content</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-[#ffd100] text-[#071d49] px-6 py-3 rounded-lg font-bold hover:bg-[#ffd100]/90 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
                {/* Hero Section */}
                <div className="relative bg-gradient-to-r from-[#071d49] to-[#0a2557] text-white py-20 overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffd100]/10 rounded-full -translate-y-48 translate-x-48"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ffd100]/10 rounded-full translate-y-32 -translate-x-32"></div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-[#ffd100] bg-clip-text text-transparent">
                            Our Blog & Events
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Stay updated with the latest news, educational tips, and exciting events from our learning community
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search articles, events, and tips..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/95 backdrop-blur-sm border-0 rounded-2xl text-[#071d49] placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-[#ffd100]/30 shadow-xl text-lg"
                            />
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Category Filter */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-[#071d49]">Browse by Category</h2>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="lg:hidden flex items-center gap-2 bg-white border-2 border-gray-200 rounded-lg px-4 py-2 text-[#071d49] hover:border-[#ffd100] transition-colors"
                            >
                                <Filter size={16} />
                                Filters
                            </button>
                        </div>

                        <div className={`${showFilters ? "block" : "hidden lg:block"}`}>
                            <div className="flex flex-wrap gap-3">
                                {categories.map((category) => {
                                    const Icon = category.icon
                                    const isSelected = selectedCategory === category.name
                                    return (
                                        <button
                                            key={category.name}
                                            onClick={() => setSelectedCategory(category.name)}
                                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${isSelected
                                                ? "bg-[#071d49] text-white shadow-lg scale-105"
                                                : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-[#ffd100] hover:scale-105"
                                                }`}
                                        >
                                            <Icon size={16} />
                                            {category.name}
                                            {category.name !== "All" && (
                                                <span
                                                    className={`ml-1 px-2 py-1 rounded-full text-xs ${isSelected ? "bg-white/20" : "bg-gray-100"}`}
                                                >
                                                    {blogPosts.filter((post) => post.category === category.name).length}
                                                </span>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Featured Posts */}
                    {featuredPosts.length > 0 && selectedCategory === "All" && (
                        <div className="mb-16">
                            <div className="flex items-center gap-2 mb-8">
                                <Star className="text-[#ffd100]" size={24} />
                                <h2 className="text-3xl font-bold text-[#071d49]">Featured Posts</h2>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {featuredPosts.map((post, index) => (
                                    <div
                                        key={post.id}
                                        className={`group cursor-pointer ${index === 0 ? "lg:col-span-2 lg:row-span-2" : ""
                                            } bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-[#ffd100]`}
                                        onClick={() => handlePostClick(post)}
                                    >
                                        <div className={`relative ${index === 0 ? "h-80" : "h-48"} overflow-hidden`}>
                                            {post.featuredImage ? (
                                                <img
                                                    src={post.featuredImage || "/placeholder.svg"}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#071d49] to-[#0a2557] flex items-center justify-center">
                                                    <BookOpen size={48} className="text-white/50" />
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                            {/* Featured Badge */}
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-[#ffd100] text-[#071d49] px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                                    <Star size={14} />
                                                    Featured
                                                </span>
                                            </div>

                                            {/* Gallery Indicator */}
                                            {post.galleryImages && post.galleryImages.length > 0 && (
                                                <div className="absolute top-4 right-4">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            openGallery(post, 0)
                                                        }}
                                                        className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 hover:bg-black/90 transition-colors"
                                                    >
                                                        <ImageIcon size={14} />
                                                        {post.galleryImages.length}
                                                    </button>
                                                </div>
                                            )}

                                            {/* Category */}
                                            <div className="absolute bottom-4 left-4">
                                                <span className="bg-white/90 text-[#071d49] px-3 py-1 rounded-full text-sm font-medium">
                                                    {post.category}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={`p-6 ${index === 0 ? "lg:p-8" : ""}`}>
                                            <h3
                                                className={`font-bold text-[#071d49] mb-3 group-hover:text-[#ffd100] transition-colors ${index === 0 ? "text-2xl lg:text-3xl" : "text-xl"
                                                    } line-clamp-2`}
                                            >
                                                {post.title}
                                            </h3>

                                            <p
                                                className={`text-gray-600 mb-4 leading-relaxed ${index === 0 ? "text-lg line-clamp-3" : "text-sm line-clamp-2"
                                                    }`}
                                            >
                                                {stripHtml(post.excerpt)}
                                            </p>

                                            {/* Event Info */}
                                            {post.eventDate && (
                                                <div className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200">
                                                    <div className="flex items-center gap-2 text-sm text-blue-700">
                                                        <Calendar size={14} />
                                                        <span className="font-medium">Event: {formatDate(post.eventDate)}</span>
                                                    </div>
                                                    {post.eventLocation && (
                                                        <div className="flex items-center gap-2 text-xs text-blue-600 mt-1">
                                                            <MapPin size={12} />
                                                            {post.eventLocation}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {post.tags.slice(0, 3).map((tag, tagIndex) => (
                                                    <span
                                                        key={tagIndex}
                                                        className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                                                    >
                                                        <Tag size={10} />
                                                        {tag}
                                                    </span>
                                                ))}
                                                {post.tags.length > 3 && (
                                                    <span className="text-gray-400 text-xs">+{post.tags.length - 3} more</span>
                                                )}
                                            </div>

                                            {/* Meta Info */}
                                            <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                                                <div className="flex items-center gap-4">
                                                    <span className="flex items-center gap-1">
                                                        <Eye size={14} />
                                                        {post.views}
                                                    </span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleLike(post.id)
                                                        }}
                                                        className="flex items-center gap-1 hover:text-red-500 transition-colors"
                                                    >
                                                        <Heart size={14} />
                                                        {post.likes}
                                                    </button>
                                                    <span className="flex items-center gap-1">
                                                        <MessageCircle size={14} />
                                                        {post.comments}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <User size={14} />
                                                    <span>{post.author}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Regular Posts Grid */}
                    <div className="mb-16">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-[#071d49]">
                                {selectedCategory === "All" ? "Latest Posts" : `${selectedCategory} Posts`}
                            </h2>
                            <div className="text-sm text-gray-500">
                                {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"} found
                            </div>
                        </div>

                        {filteredPosts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredPosts
                                    .filter((post) => selectedCategory === "All" || !post.featured)
                                    .map((post) => (
                                        <article
                                            key={post.id}
                                            className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-[#ffd100]"
                                            onClick={() => handlePostClick(post)}
                                        >
                                            {/* Featured Image */}
                                            <div className="relative h-48 overflow-hidden">
                                                {post.featuredImage ? (
                                                    <img
                                                        src={post.featuredImage || "/placeholder.svg"}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                        <BookOpen size={32} className="text-gray-400" />
                                                    </div>
                                                )}

                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                                                {/* Gallery Indicator */}
                                                {post.galleryImages && post.galleryImages.length > 0 && (
                                                    <div className="absolute top-3 right-3">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                openGallery(post, 0)
                                                            }}
                                                            className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 hover:bg-black/90 transition-colors"
                                                        >
                                                            <ImageIcon size={12} />
                                                            {post.galleryImages.length}
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Category Badge */}
                                                <div className="absolute bottom-3 left-3">
                                                    <span className="bg-white/90 text-[#071d49] px-2 py-1 rounded-full text-xs font-medium">
                                                        {post.category}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-6">
                                                {/* Date */}
                                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                                    <Clock size={14} />
                                                    {formatDate(post.publishDate)}
                                                </div>

                                                {/* Title */}
                                                <h3 className="text-xl font-bold text-[#071d49] mb-3 line-clamp-2 group-hover:text-[#ffd100] transition-colors">
                                                    {post.title}
                                                </h3>

                                                {/* Excerpt */}
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                                                    {stripHtml(post.excerpt)}
                                                </p>

                                                {/* Event Info */}
                                                {post.eventDate && (
                                                    <div className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200">
                                                        <div className="flex items-center gap-2 text-sm text-blue-700">
                                                            <Calendar size={14} />
                                                            <span className="font-medium">Event: {formatDate(post.eventDate)}</span>
                                                        </div>
                                                        {post.eventLocation && (
                                                            <div className="flex items-center gap-2 text-xs text-blue-600 mt-1">
                                                                <MapPin size={12} />
                                                                {post.eventLocation}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Tags */}
                                                <div className="flex flex-wrap gap-1 mb-4">
                                                    {post.tags.slice(0, 3).map((tag, index) => (
                                                        <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                    {post.tags.length > 3 && (
                                                        <span className="text-gray-400 text-xs">+{post.tags.length - 3} more</span>
                                                    )}
                                                </div>

                                                {/* Meta Info */}
                                                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                                                    <div className="flex items-center gap-3">
                                                        <span className="flex items-center gap-1">
                                                            <Eye size={14} />
                                                            {post.views}
                                                        </span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleLike(post.id)
                                                            }}
                                                            className="flex items-center gap-1 hover:text-red-500 transition-colors"
                                                        >
                                                            <Heart size={14} />
                                                            {post.likes}
                                                        </button>
                                                        {/* <span className="flex items-center gap-1">
                                                            <MessageCircle size={14} />
                                                            {post.comments}
                                                        </span> */}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <User size={14} />
                                                        <span className="truncate max-w-20">{post.author}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                                <Search className="mx-auto text-gray-300 mb-4" size={48} />
                                <h3 className="text-xl font-bold text-[#071d49] mb-2">No posts found</h3>
                                <p className="text-gray-600 mb-6">
                                    {searchTerm
                                        ? `No posts match "${searchTerm}" in ${selectedCategory === "All" ? "any category" : selectedCategory}`
                                        : `No posts available in ${selectedCategory}`}
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchTerm("")
                                        setSelectedCategory("All")
                                    }}
                                    className="bg-[#ffd100] text-[#071d49] px-6 py-3 rounded-lg font-bold hover:bg-[#ffd100]/90 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Newsletter Signup */}
                    {/* <div className="bg-gradient-to-r from-[#071d49] to-[#0a2557] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffd100]/10 rounded-full -translate-y-32 translate-x-32"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#ffd100]/10 rounded-full translate-y-24 -translate-x-24"></div>

                        <div className="relative max-w-4xl mx-auto text-center">
                            <div className="flex items-center justify-center gap-2 mb-6">
                                <Mail className="text-[#ffd100]" size={32} />
                                <h2 className="text-3xl md:text-4xl font-bold">Stay Updated!</h2>
                            </div>

                            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                                Subscribe to our newsletter and never miss the latest educational content, events, and special
                                announcements.
                            </p>

                            {!subscribed ? (
                                <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-4">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        className="flex-1 px-6 py-4 bg-white/95 backdrop-blur-sm border-0 rounded-xl text-[#071d49] placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-[#ffd100]/30"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="bg-[#ffd100] text-[#071d49] px-8 py-4 rounded-xl font-bold hover:bg-[#ffd100]/90 transition-colors flex items-center gap-2 whitespace-nowrap"
                                    >
                                        Subscribe
                                        <ArrowRight size={16} />
                                    </button>
                                </form>
                            ) : (
                                <div className="max-w-md mx-auto bg-green-500/20 border border-green-400/30 rounded-xl p-6">
                                    <div className="flex items-center justify-center gap-2 text-green-300">
                                        <Users size={20} />
                                        <span className="font-bold">Thank you for subscribing!</span>
                                    </div>
                                    <p className="text-green-200 mt-2">You'll receive our latest updates soon.</p>
                                </div>
                            )}

                            <div className="flex items-center justify-center gap-8 mt-8 text-blue-200">
                                <div className="flex items-center gap-2">
                                    <Target size={16} />
                                    <span className="text-sm">Weekly Updates</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap size={16} />
                                    <span className="text-sm">Exclusive Content</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Award size={16} />
                                    <span className="text-sm">Event Invites</span>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>

                {/* Full Post Modal */}
                {selectedPost && !showGallery && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                            {/* Header */}
                            <div className="relative">
                                {selectedPost.featuredImage && (
                                    <div className="h-64 md:h-80 overflow-hidden rounded-t-2xl">
                                        <img
                                            src={selectedPost.featuredImage || "/placeholder.svg"}
                                            alt={selectedPost.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    </div>
                                )}

                                <button
                                    onClick={() => setSelectedPost(null)}
                                    className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                                >
                                    <X size={20} />
                                </button>

                                {selectedPost.featuredImage && (
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <span className="bg-white/90 text-[#071d49] px-3 py-1 rounded-full text-sm font-medium">
                                            {selectedPost.category}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6 md:p-8">
                                {!selectedPost.featuredImage && (
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="bg-[#071d49]/10 text-[#071d49] px-3 py-1 rounded-full text-sm font-medium">
                                            {selectedPost.category}
                                        </span>
                                    </div>
                                )}

                                <h1 className="text-3xl md:text-4xl font-bold text-[#071d49] mb-4">{selectedPost.title}</h1>

                                <div className="flex items-center gap-6 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <User size={16} />
                                        <span>{selectedPost.author}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        <span>{formatDate(selectedPost.publishDate)}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1">
                                            <Eye size={16} />
                                            {selectedPost.views}
                                        </span>
                                        <button
                                            onClick={() => handleLike(selectedPost.id)}
                                            className="flex items-center gap-1 hover:text-red-500 transition-colors"
                                        >
                                            <Heart size={16} />
                                            {selectedPost.likes}
                                        </button>
                                    </div>
                                </div>

                                {/* Event Info */}
                                {selectedPost.eventDate && (
                                    <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-200">
                                        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                                            <Calendar size={20} />
                                            Event Information
                                        </h3>
                                        <div className="space-y-2 text-blue-700">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} />
                                                <span className="font-medium">{formatDate(selectedPost.eventDate)}</span>
                                            </div>
                                            {selectedPost.eventLocation && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={16} />
                                                    <span>{selectedPost.eventLocation}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <Tag size={16} />
                                                <span className="capitalize">{selectedPost.eventType.replace("_", " ")}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Gallery Images */}
                                {selectedPost.galleryImages && selectedPost.galleryImages.length > 0 && (
                                    <div className="mb-8">
                                        <h3 className="font-bold text-[#071d49] mb-4 flex items-center gap-2">
                                            <ImageIcon size={20} />
                                            Gallery ({selectedPost.galleryImages.length} images)
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {selectedPost.galleryImages.slice(0, 6).map((image, index) => (
                                                <div
                                                    key={image.id}
                                                    className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
                                                    onClick={() => openGallery(selectedPost, index)}
                                                >
                                                    <img
                                                        src={image.url || "/placeholder.svg"}
                                                        alt={image.alt || `Gallery image ${index + 1}`}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                        <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                                                    </div>
                                                </div>
                                            ))}
                                            {selectedPost.galleryImages.length > 6 && (
                                                <div
                                                    className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden cursor-pointer flex items-center justify-center"
                                                    onClick={() => openGallery(selectedPost, 6)}
                                                >
                                                    <div className="text-white text-center">
                                                        <Plus size={32} className="mx-auto mb-2" />
                                                        <span className="text-sm font-medium">+{selectedPost.galleryImages.length - 6} more</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Content */}
                                <div
                                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-8"
                                    dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                                />

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {selectedPost.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                                        >
                                            <Tag size={12} />
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => handleLike(selectedPost.id)}
                                            className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            <Heart size={16} />
                                            Like ({selectedPost.likes})
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Gallery Modal */}
                {showGallery && selectedPost && selectedPost.galleryImages && (
                    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="relative max-w-6xl w-full h-full flex items-center justify-center">
                            {/* Close Button */}
                            <button
                                onClick={closeGallery}
                                className="absolute top-4 right-4 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors z-10"
                            >
                                <X size={24} />
                            </button>

                            {/* Navigation Buttons */}
                            {selectedPost.galleryImages.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors z-10"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors z-10"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}

                            {/* Image */}
                            <div className="relative max-w-full max-h-full">
                                <img
                                    src={selectedPost.galleryImages[currentImageIndex]?.url || "/placeholder.svg"}
                                    alt={selectedPost.galleryImages[currentImageIndex]?.alt || `Gallery image ${currentImageIndex + 1}`}
                                    className="max-w-full max-h-full object-contain rounded-lg"
                                />

                                {/* Image Info */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                                    <div className="text-white">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm opacity-75">
                                                {currentImageIndex + 1} of {selectedPost.galleryImages.length}
                                            </span>
                                        </div>
                                        {selectedPost.galleryImages[currentImageIndex]?.caption && (
                                            <p className="text-lg font-medium">{selectedPost.galleryImages[currentImageIndex].caption}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Thumbnails */}
                            {selectedPost.galleryImages.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg">
                                    {selectedPost.galleryImages.map((image, index) => (
                                        <button
                                            key={image.id}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`w-12 h-12 rounded overflow-hidden border-2 transition-all ${index === currentImageIndex ? "border-[#ffd100] scale-110" : "border-transparent opacity-70"
                                                }`}
                                        >
                                            <img
                                                src={image.url || "/placeholder.svg"}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </>
    )
}
