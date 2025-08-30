"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import DashboardLayout from "../components/DashboardLayout/DashboardLayout"
import {
    Plus, Edit,
    Trash2,
    Eye,
    Search,
    Calendar,
    User,
    ImageIcon,
    Save,
    X,
    Heart,
    MessageCircle,
    ChevronDown,
    Upload,
    Bold,
    Italic,
    Link,
    List,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Move,
    Trash,
    Loader2,
    AlertCircle,
} from "lucide-react"
import { getAllBlogs, createBlog, updateBlog, deleteBlog, generateSlug } from "../blogService"
import toast from "react-hot-toast"

const categories = ["All", "Announcements", "Events", "Tutorials", "News"]
const eventTypes = ["article", "course_launch", "workshop", "webinar", "competition", "announcement"]

export default function BlogDashboard() {
    const [blogPosts, setBlogPosts] = useState([])
    const [filteredPosts, setFilteredPosts] = useState([])
    const [selectedPost, setSelectedPost] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("All")
    const [statusFilter, setStatusFilter] = useState("all")
    const [showEditor, setShowEditor] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)

    // Editor state - using useMemo to prevent unnecessary re-renders
    const [editorData, setEditorData] = useState({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        featuredImage: "",
        galleryImages: [],
        category: "Announcements",
        tags: [],
        status: "draft",
        publishDate: new Date().toISOString().slice(0, 16),
        featured: false,
        eventDate: "",
        eventLocation: "",
        eventType: "article",
        author: "Admin",
        authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    })

    // Load blog posts from Firestore
    const loadBlogPosts = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const posts = await getAllBlogs()
            setBlogPosts(posts)
            setFilteredPosts(posts)
        } catch (err) {
            console.error("Error loading blog posts:", err)
            setError("Failed to load blog posts. Please try again.")
        } finally {
            setLoading(false)
        }
    }, [])

    // Load posts on component mount
    useEffect(() => {
        loadBlogPosts()
    }, [loadBlogPosts])

    // Filter posts - memoized to prevent unnecessary recalculations
    const filteredPostsMemo = useMemo(() => {
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

        // Status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter((post) => post.status === statusFilter)
        }

        return filtered
    }, [searchTerm, categoryFilter, statusFilter, blogPosts])

    // Update filtered posts when memo changes
    useEffect(() => {
        setFilteredPosts(filteredPostsMemo)
    }, [filteredPostsMemo])

    const handleCreateNew = useCallback(() => {
        setEditorData({
            title: "",
            slug: "",
            content: "",
            excerpt: "",
            featuredImage: "",
            galleryImages: [],
            category: "Announcements",
            tags: [],
            status: "draft",
            publishDate: new Date().toISOString().slice(0, 16),
            featured: false,
            eventDate: "",
            eventLocation: "",
            eventType: "article",
            author: "Admin",
            authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        })
        setIsEditing(false)
        setShowEditor(true)
    }, [])

    const handleEdit = useCallback((post) => {
        setEditorData({
            ...post,
            publishDate: post.publishDate.toISOString().slice(0, 16),
            eventDate: post.eventDate ? post.eventDate.toISOString().slice(0, 16) : "",
        })
        setSelectedPost(post)
        setIsEditing(true)
        setShowEditor(true)
    }, [])

    const handleSave = useCallback(async () => {
        try {
            setSaving(true)
            setError(null)

            // Prepare data for saving
            const postData = {
                ...editorData,
                tags:
                    typeof editorData.tags === "string"
                        ? editorData.tags
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter((tag) => tag.length > 0)
                        : editorData.tags,
                galleryImages: editorData.galleryImages || [],
            }

            if (isEditing && selectedPost) {
                // Update existing post
                await updateBlog(selectedPost.id, postData)

                // Update local state
                setBlogPosts((prev) =>
                    prev.map((post) =>
                        post.id === selectedPost.id
                            ? {
                                ...postData,
                                id: selectedPost.id,
                                publishDate: new Date(postData.publishDate),
                                eventDate: postData.eventDate ? new Date(postData.eventDate) : null,
                                createdAt: selectedPost.createdAt,
                                updatedAt: new Date(),
                            }
                            : post,
                    ),
                )
            } else {
                // Create new post
                const newPostId = await createBlog(postData)

                // Add to local state
                const newPost = {
                    ...postData,
                    id: newPostId,
                    publishDate: new Date(postData.publishDate),
                    eventDate: postData.eventDate ? new Date(postData.eventDate) : null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }

                setBlogPosts((prev) => [newPost, ...prev])
            }

            setShowEditor(false)
            setSelectedPost(null)
        } catch (err) {
            console.error("Error saving blog post:", err)
            setError("Failed to save blog post. Please try again.")
        } finally {
            setSaving(false)
        }
    }, [editorData, isEditing, selectedPost])

    const handleDelete = useCallback((postId) => {
        toast((t) => (
            <span> Are you sure you want to delete this post?
                <div className="mt-3 flex justify-end">
                    <button className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                        onClick={async () => {
                            try {
                                setError(null);
                                await deleteBlog(postId);
                                setBlogPosts((prev) => prev.filter((post) => post.id !== postId));
                                toast.dismiss(t.id);
                                toast.success("Post deleted successfully!");
                            } catch (err) {
                                console.error("Error deleting blog post:", err);
                                setError("Failed to delete blog post. Please try again.");
                                toast.dismiss(t.id);
                            }
                        }} >  Yes</button>
                    <button className="ml-2 px-2 py-1 border rounded" onClick={() => toast.dismiss(t.id)}> Cancel </button>
                </div>

            </span>
        ));
    }, []);

    const handleStatusChange = useCallback(
        async (postId, newStatus) => {
            try {
                setError(null)
                const post = blogPosts.find((p) => p.id === postId)
                if (post) {
                    await updateBlog(postId, { ...post, status: newStatus })
                    setBlogPosts((prev) =>
                        prev.map((post) => (post.id === postId ? { ...post, status: newStatus, updatedAt: new Date() } : post)),
                    )
                }
            } catch (err) {
                console.error("Error updating blog status:", err)
                setError("Failed to update blog status. Please try again.")
            }
        },
        [blogPosts],
    )

    // Gallery image functions - all memoized to prevent re-renders
    const addGalleryImage = useCallback(() => {
        const newImage = {
            id: `img_${Date.now()}`,
            url: "",
            caption: "",
            alt: "",
        }
        setEditorData((prev) => ({
            ...prev,
            galleryImages: [...prev.galleryImages, newImage],
        }))
    }, [])

    const updateGalleryImage = useCallback((imageId, field, value) => {
        setEditorData((prev) => ({
            ...prev,
            galleryImages: prev.galleryImages.map((img) => (img.id === imageId ? { ...img, [field]: value } : img)),
        }))
    }, [])

    const removeGalleryImage = useCallback((imageId) => {
        setEditorData((prev) => ({
            ...prev,
            galleryImages: prev.galleryImages.filter((img) => img.id !== imageId),
        }))
    }, [])

    const moveGalleryImage = useCallback((imageId, direction) => {
        setEditorData((prev) => {
            const images = [...prev.galleryImages]
            const currentIndex = images.findIndex((img) => img.id === imageId)
            const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

            if (newIndex >= 0 && newIndex < images.length) {
                ;[images[currentIndex], images[newIndex]] = [images[newIndex], images[currentIndex]]
            }

            return { ...prev, galleryImages: images }
        })
    }, [])

    // Optimized input handlers to prevent re-renders
    const handleTitleChange = useCallback((e) => {
        const title = e.target.value
        setEditorData((prev) => ({
            ...prev,
            title,
            slug: generateSlug(title),
        }))
    }, [])

    const handleSlugChange = useCallback((e) => {
        setEditorData((prev) => ({ ...prev, slug: e.target.value }))
    }, [])

    const handleContentChange = useCallback((e) => {
        setEditorData((prev) => ({ ...prev, content: e.target.value }))
    }, [])

    const handleExcerptChange = useCallback((e) => {
        setEditorData((prev) => ({ ...prev, excerpt: e.target.value }))
    }, [])

    const handleFeaturedImageChange = useCallback((e) => {
        setEditorData((prev) => ({ ...prev, featuredImage: e.target.value }))
    }, [])

    const handleCategoryChange = useCallback((e) => {
        setEditorData((prev) => ({ ...prev, category: e.target.value }))
    }, [])

    const handleTagsChange = useCallback((e) => {
        setEditorData((prev) => ({ ...prev, tags: e.target.value }))
    }, [])

    const handleStatusChange2 = useCallback((e) => {
        setEditorData((prev) => ({ ...prev, status: e.target.value }))
    }, [])

    const handlePublishDateChange = useCallback((e) => {
        setEditorData((prev) => ({ ...prev, publishDate: e.target.value }))
    }, [])

    const handleFeaturedChange = useCallback((e) => {
        setEditorData((prev) => ({ ...prev, featured: e.target.checked }))
    }, [])

    const handleEventTypeChange = useCallback((e) => {
        setEditorData((prev) => ({ ...prev, eventType: e.target.value }))
    }, [])

    const handleEventDateChange = useCallback((e) => {
        setEditorData((prev) => ({ ...prev, eventDate: e.target.value }))
    }, [])

    const handleEventLocationChange = useCallback((e) => {
        setEditorData((prev) => ({ ...prev, eventLocation: e.target.value }))
    }, [])

    const getStatusColor = useCallback((status) => {
        switch (status) {
            case "draft":
                return "bg-gray-100 text-gray-800 border-gray-300"
            case "published":
                return "bg-green-100 text-green-800 border-green-300"
            case "scheduled":
                return "bg-blue-100 text-blue-800 border-blue-300"
            default:
                return "bg-gray-100 text-gray-800 border-gray-300"
        }
    }, [])

    const formatDate = useCallback((date) => {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }, [])

    // Blog Editor Component - Memoized to prevent unnecessary re-renders
    const BlogEditor = useMemo(() => {
        if (!showEditor) return null

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl max-w-7xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-200">
                    {/* Editor Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-[#071d49]">
                        <h2 className="text-xl font-bold text-white">{isEditing ? "Edit Blog Post" : "Create New Blog Post"}</h2>
                        <button
                            onClick={() => setShowEditor(false)}
                            className="text-white/70 hover:text-white transition-colors"
                            disabled={saving}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Editor Content */}
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-bold text-[#071d49] mb-2">Post Title *</label>
                                    <input
                                        type="text"
                                        value={editorData.title}
                                        onChange={handleTitleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#ffd100] focus:outline-none text-[#071d49] font-medium"
                                        placeholder="Enter an engaging title..."
                                        disabled={saving}
                                    />
                                </div>

                                {/* Slug */}
                                <div>
                                    <label className="block text-sm font-bold text-[#071d49] mb-2">URL Slug</label>
                                    <input
                                        type="text"
                                        value={editorData.slug}
                                        onChange={handleSlugChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#ffd100] focus:outline-none text-[#071d49]"
                                        placeholder="url-friendly-slug"
                                        disabled={saving}
                                    />
                                </div>

                                {/* Content Editor */}
                                <div>
                                    <label className="block text-sm font-bold text-[#071d49] mb-2">Content *</label>

                                    {/* Toolbar */}
                                    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-t-lg">
                                        <button className="p-2 hover:bg-gray-200 rounded transition-colors" title="Bold" disabled={saving}>
                                            <Bold size={16} />
                                        </button>
                                        <button
                                            className="p-2 hover:bg-gray-200 rounded transition-colors"
                                            title="Italic"
                                            disabled={saving}
                                        >
                                            <Italic size={16} />
                                        </button>
                                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                                        <button className="p-2 hover:bg-gray-200 rounded transition-colors" title="Link" disabled={saving}>
                                            <Link size={16} />
                                        </button>
                                        <button className="p-2 hover:bg-gray-200 rounded transition-colors" title="List" disabled={saving}>
                                            <List size={16} />
                                        </button>
                                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                                        <button
                                            className="p-2 hover:bg-gray-200 rounded transition-colors"
                                            title="Align Left"
                                            disabled={saving}
                                        >
                                            <AlignLeft size={16} />
                                        </button>
                                        <button
                                            className="p-2 hover:bg-gray-200 rounded transition-colors"
                                            title="Align Center"
                                            disabled={saving}
                                        >
                                            <AlignCenter size={16} />
                                        </button>
                                        <button
                                            className="p-2 hover:bg-gray-200 rounded transition-colors"
                                            title="Align Right"
                                            disabled={saving}
                                        >
                                            <AlignRight size={16} />
                                        </button>
                                    </div>

                                    <textarea
                                        value={editorData.content}
                                        onChange={handleContentChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 border-t-0 rounded-b-lg focus:border-[#ffd100] focus:outline-none text-[#071d49] min-h-[300px] font-mono text-sm"
                                        placeholder="Write your blog content here... You can use HTML tags for formatting."
                                        disabled={saving}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        You can use HTML tags like &lt;p&gt;, &lt;h3&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, etc.
                                    </p>
                                </div>

                                {/* Excerpt */}
                                <div>
                                    <label className="block text-sm font-bold text-[#071d49] mb-2">Excerpt</label>
                                    <textarea
                                        value={editorData.excerpt}
                                        onChange={handleExcerptChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#ffd100] focus:outline-none text-[#071d49] h-24"
                                        placeholder="Brief description for preview..."
                                        disabled={saving}
                                    />
                                </div>

                                {/* Gallery Images Section */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="block text-sm font-bold text-[#071d49]">Gallery Images</label>
                                        <button
                                            onClick={addGalleryImage}
                                            className="flex items-center gap-2 bg-[#ffd100] text-[#071d49] px-4 py-2 rounded-lg font-medium hover:bg-[#ffd100]/90 transition-colors disabled:opacity-50"
                                            disabled={saving}
                                        >
                                            <Plus size={16} />
                                            Add Image
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {editorData.galleryImages.map((image, index) => (
                                            <div key={image.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-medium text-[#071d49]">Image {index + 1}</h4>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => moveGalleryImage(image.id, "up")}
                                                            disabled={index === 0 || saving}
                                                            className="p-1 text-gray-500 hover:text-[#071d49] disabled:opacity-50 disabled:cursor-not-allowed"
                                                            title="Move Up"
                                                        >
                                                            <Move size={16} className="rotate-180" />
                                                        </button>
                                                        <button
                                                            onClick={() => moveGalleryImage(image.id, "down")}
                                                            disabled={index === editorData.galleryImages.length - 1 || saving}
                                                            className="p-1 text-gray-500 hover:text-[#071d49] disabled:opacity-50 disabled:cursor-not-allowed"
                                                            title="Move Down"
                                                        >
                                                            <Move size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => removeGalleryImage(image.id)}
                                                            className="p-1 text-red-500 hover:text-red-700 disabled:opacity-50"
                                                            title="Remove Image"
                                                            disabled={saving}
                                                        >
                                                            <Trash size={16} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-3">
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700 mb-1">Image URL *</label>
                                                            <input
                                                                type="url"
                                                                value={image.url}
                                                                onChange={(e) => updateGalleryImage(image.id, "url", e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#ffd100] focus:outline-none text-sm"
                                                                placeholder="https://example.com/image.jpg"
                                                                disabled={saving}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700 mb-1">Caption</label>
                                                            <input
                                                                type="text"
                                                                value={image.caption}
                                                                onChange={(e) => updateGalleryImage(image.id, "caption", e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#ffd100] focus:outline-none text-sm"
                                                                placeholder="Image caption..."
                                                                disabled={saving}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700 mb-1">Alt Text</label>
                                                            <input
                                                                type="text"
                                                                value={image.alt}
                                                                onChange={(e) => updateGalleryImage(image.id, "alt", e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#ffd100] focus:outline-none text-sm"
                                                                placeholder="Alt text for accessibility..."
                                                                disabled={saving}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-center">
                                                        {image.url ? (
                                                            <img
                                                                src={image.url || "/placeholder.svg"}
                                                                alt={image.alt || "Preview"}
                                                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                                                                <div className="text-center text-gray-500">
                                                                    <ImageIcon size={24} className="mx-auto mb-2" />
                                                                    <p className="text-sm">Image Preview</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {editorData.galleryImages.length === 0 && (
                                            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                                <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
                                                <p className="text-gray-500 mb-4">No gallery images added yet</p>
                                                <button
                                                    onClick={addGalleryImage}
                                                    className="bg-[#ffd100] text-[#071d49] px-4 py-2 rounded-lg font-medium hover:bg-[#ffd100]/90 transition-colors disabled:opacity-50"
                                                    disabled={saving}
                                                >
                                                    Add Your First Image
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Publish Settings */}
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <h4 className="font-bold text-[#071d49] mb-4">Publish Settings</h4>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#071d49] mb-2">Status</label>
                                            <select
                                                value={editorData.status}
                                                onChange={handleStatusChange2}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#ffd100] focus:outline-none text-[#071d49]"
                                                disabled={saving}
                                            >
                                                <option value="draft">Draft</option>
                                                <option value="published">Published</option>
                                                <option value="scheduled">Scheduled</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[#071d49] mb-2">Publish Date</label>
                                            <input
                                                type="datetime-local"
                                                value={editorData.publishDate}
                                                onChange={handlePublishDateChange}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#ffd100] focus:outline-none text-[#071d49]"
                                                disabled={saving}
                                            />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="featured"
                                                checked={editorData.featured}
                                                onChange={handleFeaturedChange}
                                                className="rounded border-gray-300 text-[#ffd100] focus:ring-[#ffd100]"
                                                disabled={saving}
                                            />
                                            <label htmlFor="featured" className="text-sm font-medium text-[#071d49]">
                                                Featured Post
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Category & Tags */}
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <h4 className="font-bold text-[#071d49] mb-4">Categories & Tags</h4>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#071d49] mb-2">Category</label>
                                            <select
                                                value={editorData.category}
                                                onChange={handleCategoryChange}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#ffd100] focus:outline-none text-[#071d49]"
                                                disabled={saving}
                                            >
                                                {categories
                                                    .filter((cat) => cat !== "All")
                                                    .map((category) => (
                                                        <option key={category} value={category}>
                                                            {category}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[#071d49] mb-2">Tags</label>
                                            <input
                                                type="text"
                                                value={Array.isArray(editorData.tags) ? editorData.tags.join(", ") : editorData.tags}
                                                onChange={handleTagsChange}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#ffd100] focus:outline-none text-[#071d49]"
                                                placeholder="tag1, tag2, tag3"
                                                disabled={saving}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Featured Image */}
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <h4 className="font-bold text-[#071d49] mb-4">Featured Image</h4>

                                    <div className="space-y-3">
                                        <input
                                            type="url"
                                            value={editorData.featuredImage}
                                            onChange={handleFeaturedImageChange}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#ffd100] focus:outline-none text-[#071d49]"
                                            placeholder="Featured image URL"
                                            disabled={saving}
                                        />

                                        <button
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-[#ffd100] transition-colors text-[#071d49] disabled:opacity-50"
                                            disabled={saving}
                                        >
                                            <Upload size={16} />
                                            Upload Image
                                        </button>

                                        {editorData.featuredImage && (
                                            <div className="mt-3">
                                                <img
                                                    src={editorData.featuredImage || "/placeholder.svg"}
                                                    alt="Preview"
                                                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Event Settings */}
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <h4 className="font-bold text-[#071d49] mb-4">Event Settings</h4>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#071d49] mb-2">Event Type</label>
                                            <select
                                                value={editorData.eventType}
                                                onChange={handleEventTypeChange}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#ffd100] focus:outline-none text-[#071d49]"
                                                disabled={saving}
                                            >
                                                {eventTypes.map((type) => (
                                                    <option key={type} value={type}>
                                                        {type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {editorData.eventType !== "article" && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-[#071d49] mb-2">Event Date</label>
                                                    <input
                                                        type="datetime-local"
                                                        value={editorData.eventDate}
                                                        onChange={handleEventDateChange}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#ffd100] focus:outline-none text-[#071d49]"
                                                        disabled={saving}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-[#071d49] mb-2">Event Location</label>
                                                    <input
                                                        type="text"
                                                        value={editorData.eventLocation}
                                                        onChange={handleEventLocationChange}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#ffd100] focus:outline-none text-[#071d49]"
                                                        placeholder="Online, Classroom, etc."
                                                        disabled={saving}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-6 border-t border-gray-200">
                            <button
                                onClick={handleSave}
                                disabled={saving || !editorData.title.trim() || !editorData.content.trim()}
                                className="flex items-center gap-2 bg-[#ffd100] text-[#071d49] px-6 py-3 rounded-lg font-bold hover:bg-[#ffd100]/90 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                {saving ? "Saving..." : isEditing ? "Update Post" : "Create Post"}
                            </button>
                            <button
                                onClick={() => setShowEditor(false)}
                                disabled={saving}
                                className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }, [
        showEditor,
        isEditing,
        saving,
        error,
        editorData,
        handleTitleChange,
        handleSlugChange,
        handleContentChange,
        handleExcerptChange,
        handleFeaturedImageChange,
        handleCategoryChange,
        handleTagsChange,
        handleStatusChange2,
        handlePublishDateChange,
        handleFeaturedChange,
        handleEventTypeChange,
        handleEventDateChange,
        handleEventLocationChange,
        addGalleryImage,
        updateGalleryImage,
        removeGalleryImage,
        moveGalleryImage,
        handleSave,
    ])

    // Loading state
    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <Loader2 className="mx-auto text-[#071d49] mb-4 animate-spin" size={48} />
                        <h3 className="text-xl font-bold text-[#071d49] mb-2">Loading Blog Posts...</h3>
                        <p className="text-gray-600">Please wait while we fetch your content</p>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Error Display */}
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                        <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#071d49]">Blog Management</h1>
                        <p className="text-gray-600 mt-1">Create and manage blog posts with Firestore integration</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Stats */}
                        <div className="flex gap-4">
                            <div className="bg-white rounded-lg p-4 border-2 border-[#071d49] shadow-lg">
                                <div className="text-[#ffd100] text-sm font-bold">Total Posts</div>
                                <div className="text-[#071d49] text-2xl font-bold text-center">{blogPosts.length}</div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border-2 border-[#071d49] shadow-lg">
                                <div className="text-[#ffd100] text-sm font-bold">Published</div>
                                <div className="text-[#071d49] text-2xl font-bold text-center">
                                    {blogPosts.filter((p) => p.status === "published").length}
                                </div>
                            </div>
                        </div>

                        {/* Create Button */}
                        <button
                            onClick={handleCreateNew}
                            className="flex items-center gap-2 bg-[#ffd100] text-[#071d49] px-6 py-3 rounded-lg font-bold hover:bg-[#ffd100]/90 transition-colors shadow-lg"
                        >
                            <Plus size={20} />
                            New Post
                        </button>
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
                                placeholder="Search posts by title, content, author, or tags..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-[#071d49] placeholder-gray-500 focus:border-[#ffd100] focus:outline-none focus:ring-2 focus:ring-[#ffd100]/20 transition-all"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex gap-4">
                            <div className="relative">
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="appearance-none bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 pr-10 text-[#071d49] focus:border-[#ffd100] focus:outline-none focus:ring-2 focus:ring-[#ffd100]/20 transition-all font-medium"
                                >
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            </div>

                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="appearance-none bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 pr-10 text-[#071d49] focus:border-[#ffd100] focus:outline-none focus:ring-2 focus:ring-[#ffd100]/20 transition-all font-medium"
                                >
                                    <option value="all">All Status</option>
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="scheduled">Scheduled</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Blog Posts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredPosts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white rounded-lg border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden"
                        >
                            {/* Featured Image */}
                            <div className="relative h-48 bg-gray-200">
                                {post.featuredImage ? (
                                    <img
                                        src={post.featuredImage || "/placeholder.svg"}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <ImageIcon size={48} className="text-gray-400" />
                                    </div>
                                )}

                                {/* Status Badge */}
                                <div className="absolute top-3 left-3">
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(post.status)}`}
                                    >
                                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                                    </span>
                                </div>

                                {/* Featured Badge */}
                                {post.featured && (
                                    <div className="absolute top-3 right-3">
                                        <span className="bg-[#ffd100] text-[#071d49] px-2 py-1 rounded-full text-xs font-bold">
                                            ⭐ Featured
                                        </span>
                                    </div>
                                )}

                                {/* Gallery Indicator */}
                                {post.galleryImages && post.galleryImages.length > 0 && (
                                    <div className="absolute bottom-3 right-3">
                                        <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                            <ImageIcon size={12} />
                                            {post.galleryImages.length}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-4 space-y-3">
                                {/* Category & Date */}
                                <div className="flex items-center justify-between text-sm">
                                    <span className="bg-[#071d49]/10 text-[#071d49] px-2 py-1 rounded-full font-medium">
                                        {post.category}
                                    </span>
                                    <span className="text-gray-500 flex items-center gap-1">
                                        <Calendar size={14} />
                                        {formatDate(post.publishDate)}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-bold text-[#071d49] line-clamp-2 leading-tight">{post.title}</h3>

                                {/* Excerpt */}
                                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{post.excerpt}</p>

                                {/* Event Info */}
                                {post.eventDate && (
                                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                        <div className="flex items-center gap-2 text-sm text-blue-700">
                                            <Calendar size={14} />
                                            <span className="font-medium">Event: {formatDate(post.eventDate)}</span>
                                        </div>
                                        {post.eventLocation && <div className="text-xs text-blue-600 mt-1">📍 {post.eventLocation}</div>}
                                    </div>
                                )}

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1">
                                    {post.tags.slice(0, 3).map((tag, index) => (
                                        <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                            #{tag}
                                        </span>
                                    ))}
                                    {post.tags.length > 3 && <span className="text-gray-400 text-xs">+{post.tags.length - 3} more</span>}
                                </div>

                                {/* Stats */}
                                <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
                                    <div className="flex items-center gap-1">
                                        <User size={14} />
                                        <span>{post.author}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-4 border-t border-gray-100 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(post)}
                                            className="p-2 text-[#071d49] hover:text-[#ffd100] hover:bg-[#ffd100]/10 rounded-lg transition-colors border border-gray-200 hover:border-[#ffd100]"
                                            title="Edit"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        {/* <button
                                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
                                            title="Preview"
                                        >
                                            <Eye size={16} />
                                        </button> */}
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    {/* Quick Status Change */}
                                    <div className="flex gap-1">
                                        {post.status !== "published" && (
                                            <button
                                                onClick={() => handleStatusChange(post.id, "published")}
                                                className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200 transition-colors"
                                            >
                                                Publish
                                            </button>
                                        )}
                                        {post.status !== "draft" && (
                                            <button
                                                onClick={() => handleStatusChange(post.id, "draft")}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200 transition-colors"
                                            >
                                                Draft
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredPosts.length === 0 && !loading && (
                    <div className="text-center py-12 bg-white rounded-lg border-2 border-gray-200">
                        <ImageIcon className="mx-auto text-gray-300 mb-4" size={48} />
                        <h3 className="text-[#071d49] text-lg font-bold mb-2">No blog posts found</h3>
                        <p className="text-gray-600 mb-4">
                            {blogPosts.length === 0
                                ? "Get started by creating your first blog post"
                                : "Try adjusting your search or filter criteria"}
                        </p>
                        <button
                            onClick={handleCreateNew}
                            className="bg-[#ffd100] text-[#071d49] px-6 py-3 rounded-lg font-bold hover:bg-[#ffd100]/90 transition-colors"
                        >
                            Create Your First Post
                        </button>
                    </div>
                )}
            </div>

            {/* Blog Editor Modal */}
            {BlogEditor}
        </DashboardLayout>
    )
}
