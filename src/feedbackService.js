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
} from "firebase/firestore"
import { db } from "./firebase"

const FEEDBACKS_COLLECTION = "feedbacks"

// Convert Firestore document to feedback object
const convertFirestoreDoc = (doc) => {
    const data = doc.data()
    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        helpfulVotes: data.helpfulVotes || 0,
        isPublic: data.isPublic || false,
    }
}

// Test connection to Firestore
export const testFeedbackConnection = async () => {
    try {
        const feedbacksRef = collection(db, FEEDBACKS_COLLECTION)
        const querySnapshot = await getDocs(feedbacksRef)
        console.log("Feedback Firestore connection successful. Documents found:", querySnapshot.size)
        return true
    } catch (error) {
        console.error("Feedback Firestore connection failed:", error)
        return false
    }
}

// Get all feedbacks (for admin dashboard)
export const getAllFeedbacks = async () => {
    try {
        const feedbacksRef = collection(db, FEEDBACKS_COLLECTION)
        const querySnapshot = await getDocs(feedbacksRef)

        const feedbacks = querySnapshot.docs.map(convertFirestoreDoc)

        // Sort by createdAt on client side to avoid index requirement
        return feedbacks.sort((a, b) => b.createdAt - a.createdAt)
    } catch (error) {
        console.error("Error fetching all feedbacks:", error)
        throw new Error("Failed to fetch feedback posts")
    }
}

// Get feedbacks by status (modified to avoid composite index requirement)
export const getFeedbacksByStatus = async (status) => {
    try {
        const feedbacksRef = collection(db, FEEDBACKS_COLLECTION)

        // Simple query with just status filter
        const q = query(feedbacksRef, where("status", "==", status))
        const querySnapshot = await getDocs(q)

        const feedbacks = querySnapshot.docs.map(convertFirestoreDoc)

        // Sort by createdAt on client side to avoid composite index requirement
        return feedbacks.sort((a, b) => b.createdAt - a.createdAt)
    } catch (error) {
        console.error("Error fetching feedbacks by status:", error)
        throw new Error(`Failed to fetch ${status} feedback posts`)
    }
}

// Get approved feedbacks for public view
export const getApprovedFeedbacks = async () => {
    try {
        const feedbacksRef = collection(db, FEEDBACKS_COLLECTION)

        // Simple query with just status filter
        const q = query(feedbacksRef, where("status", "==", "approved"))
        const querySnapshot = await getDocs(q)

        const feedbacks = querySnapshot.docs.map(convertFirestoreDoc)

        // Sort by createdAt on client side and filter out any invalid posts
        return feedbacks
            .filter((feedback) => feedback.title && feedback.message && feedback.userName) // Ensure valid posts
            .sort((a, b) => b.createdAt - a.createdAt)
    } catch (error) {
        console.error("Error fetching approved feedbacks:", error)
        throw new Error("Failed to fetch approved feedback posts")
    }
}

// Get single feedback post
export const getFeedbackById = async (id) => {
    try {
        const feedbackRef = doc(db, FEEDBACKS_COLLECTION, id)
        const feedbackSnap = await getDoc(feedbackRef)

        if (feedbackSnap.exists()) {
            return convertFirestoreDoc(feedbackSnap)
        } else {
            throw new Error("Feedback post not found")
        }
    } catch (error) {
        console.error("Error fetching feedback:", error)
        throw new Error("Failed to fetch feedback post")
    }
}

// Create new feedback post
export const createFeedback = async (feedbackData) => {
    try {
        const feedbacksRef = collection(db, FEEDBACKS_COLLECTION)

        // Ensure required fields are present
        if (!feedbackData.userName || !feedbackData.message || !feedbackData.title) {
            throw new Error("User name, title, and message are required")
        }

        // Prepare data for Firestore
        const firestoreData = {
            userId: feedbackData.userId || "",
            userName: feedbackData.userName || "",
            userEmail: feedbackData.userEmail || "",
            userAvatar: feedbackData.userAvatar || "",
            courseId: feedbackData.courseId || null,
            courseName: feedbackData.courseName || null,
            rating: feedbackData.rating || 5,
            title: feedbackData.title || "",
            message: feedbackData.message || "",
            status: feedbackData.status || "pending", // pending, approved, rejected
            isPublic: feedbackData.isPublic || false,
            helpfulVotes: feedbackData.helpfulVotes || 0,
            category: feedbackData.category || "course", // course, website, general
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }

        const docRef = await addDoc(feedbacksRef, firestoreData)
        return docRef.id
    } catch (error) {
        console.error("Error creating feedback:", error)
        throw new Error("Failed to create feedback post: " + error.message)
    }
}

// Update feedback post
export const updateFeedback = async (id, feedbackData) => {
    try {
        const feedbackRef = doc(db, FEEDBACKS_COLLECTION, id)

        // Prepare data for Firestore
        const firestoreData = {
            ...feedbackData,
            updatedAt: serverTimestamp(),
        }

        await updateDoc(feedbackRef, firestoreData)
        return id
    } catch (error) {
        console.error("Error updating feedback:", error)
        throw new Error("Failed to update feedback post")
    }
}

// Delete feedback post
export const deleteFeedback = async (id) => {
    try {
        const feedbackRef = doc(db, FEEDBACKS_COLLECTION, id)
        await deleteDoc(feedbackRef)
        return id
    } catch (error) {
        console.error("Error deleting feedback:", error)
        throw new Error("Failed to delete feedback post")
    }
}

// Update feedback status (approve/reject)
export const updateFeedbackStatus = async (id, status) => {
    try {
        const feedbackRef = doc(db, FEEDBACKS_COLLECTION, id)
        await updateDoc(feedbackRef, {
            status: status,
            isPublic: status === "approved",
            updatedAt: serverTimestamp(),
        })
        return id
    } catch (error) {
        console.error("Error updating feedback status:", error)
        throw new Error("Failed to update feedback status")
    }
}

// Update feedback helpful votes
export const updateFeedbackVotes = async (id, votes) => {
    try {
        const feedbackRef = doc(db, FEEDBACKS_COLLECTION, id)
        await updateDoc(feedbackRef, {
            helpfulVotes: votes,
            updatedAt: serverTimestamp(),
        })
        return id
    } catch (error) {
        console.error("Error updating feedback votes:", error)
        throw new Error("Failed to update feedback votes")
    }
}

// Get feedbacks by category
export const getFeedbacksByCategory = async (category) => {
    try {
        const feedbacksRef = collection(db, FEEDBACKS_COLLECTION)
        const q = query(feedbacksRef, where("category", "==", category), where("status", "==", "approved"))
        const querySnapshot = await getDocs(q)

        const feedbacks = querySnapshot.docs.map(convertFirestoreDoc)
        return feedbacks.sort((a, b) => b.createdAt - a.createdAt)
    } catch (error) {
        console.error("Error fetching feedbacks by category:", error)
        // Fallback to client-side filtering
        try {
            const feedbacksRef = collection(db, FEEDBACKS_COLLECTION)
            const q = query(feedbacksRef, where("status", "==", "approved"))
            const querySnapshot = await getDocs(q)

            const feedbacks = querySnapshot.docs.map(convertFirestoreDoc)
            return feedbacks.filter((feedback) => feedback.category === category).sort((a, b) => b.createdAt - a.createdAt)
        } catch (fallbackError) {
            console.error("Error in fallback category query:", fallbackError)
            return []
        }
    }
}

// Get feedbacks by course
export const getFeedbacksByCourse = async (courseId) => {
    try {
        const feedbacksRef = collection(db, FEEDBACKS_COLLECTION)
        const q = query(feedbacksRef, where("courseId", "==", courseId), where("status", "==", "approved"))
        const querySnapshot = await getDocs(q)

        const feedbacks = querySnapshot.docs.map(convertFirestoreDoc)
        return feedbacks.sort((a, b) => b.createdAt - a.createdAt)
    } catch (error) {
        console.error("Error fetching feedbacks by course:", error)
        return []
    }
}

// Search feedbacks
export const searchFeedbacks = async (searchTerm) => {
    try {
        const feedbacksRef = collection(db, FEEDBACKS_COLLECTION)
        const querySnapshot = await getDocs(feedbacksRef)

        const allFeedbacks = querySnapshot.docs.map(convertFirestoreDoc)

        // Client-side filtering for search
        return allFeedbacks.filter(
            (feedback) =>
                feedback.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                feedback.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                feedback.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                feedback.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()),
        )
    } catch (error) {
        console.error("Error searching feedbacks:", error)
        throw new Error("Failed to search feedback posts")
    }
}

// Seed initial feedback data (for development/testing)
export const seedFeedbackData = async () => {
    try {
        const initialFeedbacks = [
            {
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
                status: "approved",
                isPublic: true,
                helpfulVotes: 15,
                category: "course",
            },
            {
                userId: "user_456",
                userName: "Sara Ali",
                userEmail: "sara.ali@email.com",
                userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                courseId: "course_002",
                courseName: "JavaScript Mastery",
                rating: 5,
                title: "Amazing learning experience!",
                message:
                    "The course content is really good and comprehensive. The instructor explains everything clearly and the practical examples helped me understand complex concepts easily.",
                status: "approved",
                isPublic: true,
                helpfulVotes: 12,
                category: "course",
            },
            {
                userId: "user_789",
                userName: "Mohamed Hassan",
                userEmail: "mohamed.hassan@email.com",
                userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                courseId: "course_001",
                courseName: "React Fundamentals",
                rating: 5,
                title: "Perfect for beginners",
                message:
                    "As someone new to React, this course was exactly what I needed. Step-by-step explanations and practical examples made learning enjoyable and effective.",
                status: "approved",
                isPublic: true,
                helpfulVotes: 8,
                category: "course",
            },
            {
                userId: "user_202",
                userName: "Omar Khaled",
                userEmail: "omar.khaled@email.com",
                userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
                courseId: "course_003",
                courseName: "Python for Beginners",
                rating: 5,
                title: "Excellent teaching method",
                message:
                    "The instructor's teaching method is outstanding. Complex topics are broken down into simple, understandable parts. Highly recommended!",
                status: "approved",
                isPublic: true,
                helpfulVotes: 15,
                category: "course",
            },
            {
                userId: "user_303",
                userName: "Fatima Ahmed",
                userEmail: "fatima.ahmed@email.com",
                userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                courseId: "course_004",
                courseName: "Web Development Bootcamp",
                rating: 5,
                title: "Life-changing course",
                message:
                    "This course completely changed my career path. The comprehensive curriculum and hands-on projects gave me the confidence to pursue web development professionally.",
                status: "approved",
                isPublic: true,
                helpfulVotes: 22,
                category: "course",
            },
            {
                userId: "user_404",
                userName: "Ahmed Mahmoud",
                userEmail: "ahmed.mahmoud@email.com",
                userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                courseId: "course_005",
                courseName: "Data Science Fundamentals",
                rating: 4,
                title: "Great content and support",
                message:
                    "Excellent course with great content. The support team is very responsive and helpful. The practical exercises really helped solidify my understanding.",
                status: "approved",
                isPublic: true,
                helpfulVotes: 9,
                category: "course",
            },
        ]

        const promises = initialFeedbacks.map((feedback) => createFeedback(feedback))
        await Promise.all(promises)

        console.log("Feedback data seeded successfully!")
        return true
    } catch (error) {
        console.error("Error seeding feedback data:", error)
        return false
    }
}
