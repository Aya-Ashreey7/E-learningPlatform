import { useState, useEffect } from "react"
import DashboardLayout from "../components/DashboardLayout/DashboardLayout"
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    Search,
    Calendar,
    User,
    ImageIcon,
    Save,
    X,
    FileText,
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
} from "lucide-react"

// Mock blog posts data
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
        status: "published", // draft, published, scheduled
        publishDate: new Date("2025-08-15T10:00:00Z"),
        createdAt: new Date("2025-08-10T14:30:00Z"),
        updatedAt: new Date("2025-08-12T16:45:00Z"),
        views: 1250,
        likes: 89,
        comments: 23,
        featured: true,
        eventDate: new Date("2025-09-01T09:00:00Z"), // For events
        eventLocation: "Online",
        eventType: "course_launch",
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
        createdAt: new Date("2025-08-08T11:20:00Z"),
        updatedAt: new Date("2025-08-10T09:15:00Z"),
        views: 890,
        likes: 67,
        comments: 15,
        featured: false,
        eventDate: null,
        eventLocation: null,
        eventType: "article",
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
        status: "scheduled",
        publishDate: new Date("2025-08-20T12:00:00Z"),
        createdAt: new Date("2025-08-14T13:45:00Z"),
        updatedAt: new Date("2025-08-14T13:45:00Z"),
        views: 0,
        likes: 0,
        comments: 0,
        featured: true,
        eventDate: new Date("2025-09-15T14:00:00Z"),
        eventLocation: "Virtual Classroom",
        eventType: "workshop",
    },
]

const categories = ["All", "Announcements", "Parenting", "Events", "Tutorials", "News"]
const eventTypes = ["article", "course_launch", "workshop", "webinar", "competition", "announcement"]

export default function BlogDashboard() {
    const [blogPosts, setBlogPosts] = useState(mockBlogPosts)
    const [filteredPosts, setFilteredPosts] = useState(mockBlogPosts)
    const [selectedPost, setSelectedPost] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("All")
    const [statusFilter, setStatusFilter] = useState("all")
    const [showEditor, setShowEditor] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    // Editor state
    const [editorData, setEditorData] = useState({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        featuredImage: "",
        category: "Announcements",
        tags: [],
        status: "draft",
        publishDate: new Date().toISOString().slice(0, 16),
        featured: false,
        eventDate: "",
        eventLocation: "",
        eventType: "article",
    })

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

        // Status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter((post) => post.status === statusFilter)
        }

        setFilteredPosts(filtered)
    }, [searchTerm, categoryFilter, statusFilter, blogPosts])

    const handleCreateNew = () => {
        setEditorData({
            title: "",
            slug: "",
            content: "",
            excerpt: "",
            featuredImage: "",
            category: "Announcements",
            tags: [],
            status: "draft",
            publishDate: new Date().toISOString().slice(0, 16),
            featured: false,
            eventDate: "",
            eventLocation: "",
            eventType: "article",
        })
        setIsEditing(false)
        setShowEditor(true)
    }

    const handleEdit = (post) => {
        setEditorData({
            ...post,
            publishDate: post.publishDate.toISOString().slice(0, 16),
            eventDate: post.eventDate ? post.eventDate.toISOString().slice(0, 16) : "",
        })
        setSelectedPost(post)
        setIsEditing(true)
        setShowEditor(true)
    }

    const handleSave = () => {
        const postData = {
            ...editorData,
            id: isEditing ? selectedPost.id : `blog_${Date.now()}`,
            author: "Admin User",
            authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            publishDate: new Date(editorData.publishDate),
            eventDate: editorData.eventDate ? new Date(editorData.eventDate) : null,
            createdAt: isEditing ? selectedPost.createdAt : new Date(),
            updatedAt: new Date(),
            views: isEditing ? selectedPost.views : 0,
            likes: isEditing ? selectedPost.likes : 0,
            comments: isEditing ? selectedPost.comments : 0,
            tags: typeof editorData.tags === "string" ? editorData.tags.split(",").map((tag) => tag.trim()) : editorData.tags,
        }

        if (isEditing) {
            setBlogPosts((prev) => prev.map((post) => (post.id === selectedPost.id ? postData : post)))
        } else {
            setBlogPosts((prev) => [postData, ...prev])
        }

        setShowEditor(false)
        setSelectedPost(null)
    }

    const handleDelete = (postId) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            setBlogPosts((prev) => prev.filter((post) => post.id !== postId))
        }
    }

    const handleStatusChange = (postId, newStatus) => {
        setBlogPosts((prev) =>
            prev.map((post) => (post.id === postId ? { ...post, status: newStatus, updatedAt: new Date() } : post)),
        )
    }

    const getStatusColor = (status) => {
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

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim("-")
    }

    // Blog Editor Component
    const BlogEditor = () => (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-200">
                {/* Editor Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-[#071d49]">
                    <h2 className="text-xl font-bold text-white">{isEditing ? "Edit Blog Post" : "Create New Blog Post"}</h2>
                    <button onClick={() => setShowEditor(false)} className="text-white/70 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

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
                                    onChange={(e) => {
                                        const title = e.target.value
                                        setEditorData((prev) => ({
                                            ...prev,
                                            title,
                                            slug: generateSlug(title),
                                        }))
                                    }}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#ffd100] focus:outline-none text-[#071d49] font-medium"
                                    placeholder="Enter an engaging title..."
                                />
                            </div>

                            {/* Slug */}
                            <div>
                                <label className="block text-sm font-bold text-[#071d49] mb-2">URL Slug</label>
                                <input
                                    type="text"
                                    value={editorData.slug}
                                    onChange={(e) => setEditorData((prev) => ({ ...prev, slug: e.target.value }))}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#ffd100] focus:outline-none text-[#071d49]"
                                    placeholder="url-friendly-slug"
                                />
                            </div>

                            {/* Content Editor */}
                            <div>
                                <label className="block text-sm font-bold text-[#071d49] mb-2">Content *</label>

                                {/* Toolbar */}
                                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-t-lg">
                                    <button className="p-2 hover:bg-gray-200 rounded transition-colors" title="Bold">
                                        <Bold size={16} />
                                    </button>
                                    <button className="p-2 hover:bg-gray-200 rounded transition-colors" title="Italic">
                                        <Italic size={16} />
                                    </button>
                                    <div className="w-px h-6 bg-gray-300 mx-1"></div>
                                    <button className="p-2 hover:bg-gray-200 rounded transition-colors" title="Link">
                                        <Link size={16} />
                                    </button>
                                    <button className="p-2 hover:bg-gray-200 rounded transition-colors" title="List">
                                        <List size={16} />
                                    </button>
                                    <div className="w-px h-6 bg-gray-300 mx-1"></div>
                                    <button className="p-2 hover:bg-gray-200 rounded transition-colors" title="Align Left">
                                        <AlignLeft size={16} />
                                    </button>
                                    <button className="p-2 hover:bg-gray-200 rounded transition-colors" title="Align Center">
                                        <AlignCenter size={16} />
                                    </button>
                                    <button className="p-2 hover:bg-gray-200 rounded transition-colors" title="Align Right">
                                        <AlignRight size={16} />
                                    </button>
                                </div>

                                <textarea
                                    value={editorData.content}
                                    onChange={(e) => setEditorData((prev) => ({ ...prev, content: e.target.value }))}
                                    className="w-full px-4 py-3 border-2 border-gray-200 border-t-0 rounded-b-lg focus:border-[#ffd100] focus:outline-none text-[#071d49] min-h-[300px] font-mono text-sm"
                                    placeholder="Write your blog content here... You can use HTML tags for formatting."
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
                                    onChange={(e) => setEditorData((prev) => ({ ...prev, excerpt: e.target.value }))}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#ffd100] focus:outline-none text-[#071d49] h-24"
                                    placeholder="Brief description for preview..."
                                />
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
                                            onChange={(e) => setEditorData((prev) => ({ ...prev, status: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#ffd100] focus:outline-none text-[#071d49]"
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
                                            onChange={(e) => setEditorData((prev) => ({ ...prev, publishDate: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#ffd100] focus:outline-none text-[#071d49]"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="featured"
                                            checked={editorData.featured}
                                            onChange={(e) => setEditorData((prev) => ({ ...prev, featured: e.target.checked }))}
                                            className="rounded border-gray-300 text-[#ffd100] focus:ring-[#ffd100]"
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
                                            onChange={(e) => setEditorData((prev) => ({ ...prev, category: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#ffd100] focus:outline-none text-[#071d49]"
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
                                            onChange={(e) => setEditorData((prev) => ({ ...prev, tags: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#ffd100] focus:outline-none text-[#071d49]"
                                            placeholder="tag1, tag2, tag3"
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
                                        onChange={(e) => setEditorData((prev) => ({ ...prev, featuredImage: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#ffd100] focus:outline-none text-[#071d49]"
                                        placeholder="Image URL"
                                    />

                                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-[#ffd100] transition-colors text-[#071d49]">
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
                                            onChange={(e) => setEditorData((prev) => ({ ...prev, eventType: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#ffd100] focus:outline-none text-[#071d49]"
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
                                                    onChange={(e) => setEditorData((prev) => ({ ...prev, eventDate: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#ffd100] focus:outline-none text-[#071d49]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-[#071d49] mb-2">Event Location</label>
                                                <input
                                                    type="text"
                                                    value={editorData.eventLocation}
                                                    onChange={(e) => setEditorData((prev) => ({ ...prev, eventLocation: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#ffd100] focus:outline-none text-[#071d49]"
                                                    placeholder="Online, Classroom, etc."
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
                            className="flex items-center gap-2 bg-[#ffd100] text-[#071d49] px-6 py-3 rounded-lg font-bold hover:bg-[#ffd100]/90 transition-colors shadow-lg"
                        >
                            <Save size={20} />
                            {isEditing ? "Update Post" : "Create Post"}
                        </button>
                        <button
                            onClick={() => setShowEditor(false)}
                            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#071d49]">Blog Management</h1>
                        <p className="text-gray-600 mt-1">Create and manage blog posts and events</p>
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
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1">
                                            <Eye size={14} />
                                            {post.views}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Heart size={14} />
                                            {post.likes}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageCircle size={14} />
                                            {post.comments}
                                        </span>
                                    </div>
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
                                        <button
                                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
                                            title="Preview"
                                        >
                                            <Eye size={16} />
                                        </button>
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
                {filteredPosts.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border-2 border-gray-200">
                        <FileText className="mx-auto text-gray-300 mb-4" size={48} />
                        <h3 className="text-[#071d49] text-lg font-bold mb-2">No blog posts found</h3>
                        <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
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
            {showEditor && <BlogEditor />}
        </DashboardLayout>
    )
}
