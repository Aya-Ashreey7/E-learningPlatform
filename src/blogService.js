import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp,
    Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"

const BLOGS_COLLECTION = "blogs"

// Generate URL-friendly slug
export const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim("-")
}

// Convert Firestore document to blog post object
const convertFirestoreDoc = (doc) => {
    const data = doc.data()
    return {
        id: doc.id,
        ...data,
        publishDate: data.publishDate?.toDate() || new Date(),
        eventDate: data.eventDate?.toDate() || null,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        galleryImages: data.galleryImages || [],
        tags: data.tags || [],
        views: data.views || 0,
        likes: data.likes || 0,
        comments: data.comments || 0,
    }
}

// Get all blog posts (for admin dashboard)
export const getAllBlogs = async () => {
    try {
        const blogsRef = collection(db, BLOGS_COLLECTION)
        const querySnapshot = await getDocs(blogsRef)

        const blogs = querySnapshot.docs.map(convertFirestoreDoc)

        // Sort by createdAt on client side to avoid index requirement
        return blogs.sort((a, b) => b.createdAt - a.createdAt)
    } catch (error) {
        console.error("Error fetching all blogs:", error)
        throw new Error("Failed to fetch blog posts")
    }
}

// Get blogs by status (modified to avoid composite index requirement)
export const getBlogsByStatus = async (status) => {
    try {
        const blogsRef = collection(db, BLOGS_COLLECTION)

        // Simple query with just status filter
        const q = query(blogsRef, where("status", "==", status))
        const querySnapshot = await getDocs(q)

        const blogs = querySnapshot.docs.map(convertFirestoreDoc)

        // Sort by createdAt on client side to avoid composite index requirement
        return blogs.sort((a, b) => b.createdAt - a.createdAt)
    } catch (error) {
        console.error("Error fetching blogs by status:", error)
        throw new Error(`Failed to fetch ${status} blog posts`)
    }
}

// Get published blogs for public view
export const getPublishedBlogs = async () => {
    try {
        const blogsRef = collection(db, BLOGS_COLLECTION)

        // Simple query with just status filter
        const q = query(blogsRef, where("status", "==", "published"))
        const querySnapshot = await getDocs(q)

        const blogs = querySnapshot.docs.map(convertFirestoreDoc)

        // Sort by createdAt on client side and filter out any invalid posts
        return blogs
            .filter((blog) => blog.title && blog.content) // Ensure valid posts
            .sort((a, b) => b.createdAt - a.createdAt)
    } catch (error) {
        console.error("Error fetching published blogs:", error)
        throw new Error("Failed to fetch published blog posts")
    }
}

// Get single blog post
export const getBlogById = async (id) => {
    try {
        const blogRef = doc(db, BLOGS_COLLECTION, id)
        const blogSnap = await getDoc(blogRef)

        if (blogSnap.exists()) {
            return convertFirestoreDoc(blogSnap)
        } else {
            throw new Error("Blog post not found")
        }
    } catch (error) {
        console.error("Error fetching blog:", error)
        throw new Error("Failed to fetch blog post")
    }
}

// Create new blog post
export const createBlog = async (blogData) => {
    try {
        const blogsRef = collection(db, BLOGS_COLLECTION)

        // Ensure required fields are present
        if (!blogData.title || !blogData.content) {
            throw new Error("Title and content are required")
        }

        // Prepare data for Firestore
        const firestoreData = {
            title: blogData.title || "",
            content: blogData.content || "",
            excerpt: blogData.excerpt || "",
            author: blogData.author || "Admin",
            authorAvatar: blogData.authorAvatar || "",
            category: blogData.category || "News",
            tags: Array.isArray(blogData.tags) ? blogData.tags : [],
            status: blogData.status || "draft",
            featured: blogData.featured || false,
            featuredImage: blogData.featuredImage || "",
            galleryImages: Array.isArray(blogData.galleryImages) ? blogData.galleryImages : [],
            slug: blogData.slug || generateSlug(blogData.title),
            readTime: blogData.readTime || "5 min read",
            publishDate: blogData.publishDate ? Timestamp.fromDate(new Date(blogData.publishDate)) : serverTimestamp(),
            eventDate: blogData.eventDate ? Timestamp.fromDate(new Date(blogData.eventDate)) : null,
            eventLocation: blogData.eventLocation || "",
            eventType: blogData.eventType || "",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            views: 0,
            likes: 0,
            comments: 0,
        }

        const docRef = await addDoc(blogsRef, firestoreData)
        return docRef.id
    } catch (error) {
        console.error("Error creating blog:", error)
        throw new Error("Failed to create blog post: " + error.message)
    }
}

// Update blog post
export const updateBlog = async (id, blogData) => {
    try {
        const blogRef = doc(db, BLOGS_COLLECTION, id)

        // Prepare data for Firestore
        const firestoreData = {
            ...blogData,
            publishDate: blogData.publishDate ? Timestamp.fromDate(new Date(blogData.publishDate)) : serverTimestamp(),
            eventDate: blogData.eventDate ? Timestamp.fromDate(new Date(blogData.eventDate)) : null,
            updatedAt: serverTimestamp(),
            tags: Array.isArray(blogData.tags) ? blogData.tags : [],
            galleryImages: Array.isArray(blogData.galleryImages) ? blogData.galleryImages : [],
        }

        await updateDoc(blogRef, firestoreData)
        return id
    } catch (error) {
        console.error("Error updating blog:", error)
        throw new Error("Failed to update blog post")
    }
}

// Delete blog post
export const deleteBlog = async (id) => {
    try {
        const blogRef = doc(db, BLOGS_COLLECTION, id)
        await deleteDoc(blogRef)
        return id
    } catch (error) {
        console.error("Error deleting blog:", error)
        throw new Error("Failed to delete blog post")
    }
}

// Update blog stats (views, likes, comments)
export const updateBlogStats = async (id, stats) => {
    try {
        const blogRef = doc(db, BLOGS_COLLECTION, id)
        await updateDoc(blogRef, {
            ...stats,
            updatedAt: serverTimestamp(),
        })
        return id
    } catch (error) {
        console.error("Error updating blog stats:", error)
        throw new Error("Failed to update blog stats")
    }
}

// Get featured blogs
export const getFeaturedBlogs = async (limitCount = 3) => {
    try {
        const blogsRef = collection(db, BLOGS_COLLECTION)
        const q = query(blogsRef, where("featured", "==", true), where("status", "==", "published"))
        const querySnapshot = await getDocs(q)

        const blogs = querySnapshot.docs.map(convertFirestoreDoc)

        // Sort and limit on client side
        return blogs.sort((a, b) => b.createdAt - a.createdAt).slice(0, limitCount)
    } catch (error) {
        console.error("Error fetching featured blogs:", error)
        // If the composite query fails, fallback to simple query
        try {
            const blogsRef = collection(db, BLOGS_COLLECTION)
            const q = query(blogsRef, where("status", "==", "published"))
            const querySnapshot = await getDocs(q)

            const blogs = querySnapshot.docs.map(convertFirestoreDoc)

            return blogs
                .filter((blog) => blog.featured)
                .sort((a, b) => b.createdAt - a.createdAt)
                .slice(0, limitCount)
        } catch (fallbackError) {
            console.error("Error in fallback featured blogs query:", fallbackError)
            return []
        }
    }
}

// Search blogs
export const searchBlogs = async (searchTerm) => {
    try {
        const blogsRef = collection(db, BLOGS_COLLECTION)
        const q = query(blogsRef, where("status", "==", "published"))
        const querySnapshot = await getDocs(q)

        const allBlogs = querySnapshot.docs.map(convertFirestoreDoc)

        // Client-side filtering for search
        return allBlogs.filter(
            (blog) =>
                blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                blog.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
        )
    } catch (error) {
        console.error("Error searching blogs:", error)
        throw new Error("Failed to search blog posts")
    }
}

// Get blogs by category
export const getBlogsByCategory = async (category) => {
    try {
        const blogsRef = collection(db, BLOGS_COLLECTION)
        const q = query(blogsRef, where("category", "==", category), where("status", "==", "published"))
        const querySnapshot = await getDocs(q)

        const blogs = querySnapshot.docs.map(convertFirestoreDoc)
        return blogs.sort((a, b) => b.createdAt - a.createdAt)
    } catch (error) {
        console.error("Error fetching blogs by category:", error)
        // Fallback to client-side filtering
        try {
            const blogsRef = collection(db, BLOGS_COLLECTION)
            const q = query(blogsRef, where("status", "==", "published"))
            const querySnapshot = await getDocs(q)

            const blogs = querySnapshot.docs.map(convertFirestoreDoc)
            return blogs.filter((blog) => blog.category === category).sort((a, b) => b.createdAt - a.createdAt)
        } catch (fallbackError) {
            console.error("Error in fallback category query:", fallbackError)
            return []
        }
    }
}

// Test connection to Firestore
export const testFirestoreConnection = async () => {
    try {
        const blogsRef = collection(db, BLOGS_COLLECTION)
        const querySnapshot = await getDocs(blogsRef)
        console.log("Firestore connection successful. Documents found:", querySnapshot.size)
        return true
    } catch (error) {
        console.error("Firestore connection failed:", error)
        return false
    }
}
