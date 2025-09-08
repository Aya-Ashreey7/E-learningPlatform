import {
    collection,
    doc,
    getDocs,
    getDoc,
    query,
    where,
    orderBy,
    addDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
} from "firebase/firestore"
import { db } from "./firebase"

const COLLECTION_NAME = "Courses"

// Get all courses
export const getAllCourses = async () => {
    try {
        const coursesRef = collection(db, COLLECTION_NAME)
        const q = query(coursesRef, orderBy("createdAt", "desc"))
        const querySnapshot = await getDocs(q)

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))
    } catch (error) {
        console.error("Error fetching courses:", error)
        throw error
    }
}

// Get courses by audience (Kids/Adults)
export const getCoursesByAudience = async (audience) => {
    try {
        const coursesRef = collection(db, COLLECTION_NAME)
        const q = query(coursesRef, where("audience", "==", audience), orderBy("createdAt", "desc"))
        const querySnapshot = await getDocs(q)

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))
    } catch (error) {
        console.error(`Error fetching ${audience} courses:`, error)
        throw error
    }
}

// Get single course by ID
export const getCourseById = async (courseId) => {
    try {
        const courseRef = doc(db, COLLECTION_NAME, courseId)
        const courseSnap = await getDoc(courseRef)

        if (courseSnap.exists()) {
            return {
                id: courseSnap.id,
                ...courseSnap.data(),
            }
        } else {
            throw new Error("Course not found")
        }
    } catch (error) {
        console.error("Error fetching course:", error)
        throw error
    }
}

// Add new course
export const addCourse = async (courseData) => {
    try {
        const coursesRef = collection(db, COLLECTION_NAME)
        const docRef = await addDoc(coursesRef, {
            ...courseData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        })
        return docRef.id
    } catch (error) {
        console.error("Error adding course:", error)
        throw error
    }
}

// Update course
export const updateCourse = async (courseId, courseData) => {
    try {
        const courseRef = doc(db, COLLECTION_NAME, courseId)
        await updateDoc(courseRef, {
            ...courseData,
            updatedAt: serverTimestamp(),
        })
    } catch (error) {
        console.error("Error updating course:", error)
        throw error
    }
}

// Delete course
export const deleteCourse = async (courseId) => {
    try {
        const courseRef = doc(db, COLLECTION_NAME, courseId)
        await deleteDoc(courseRef)
    } catch (error) {
        console.error("Error deleting course:", error)
        throw error
    }
}

// Test connection
export const testCourseConnection = async () => {
    try {
        const coursesRef = collection(db, COLLECTION_NAME)
        await getDocs(query(coursesRef, orderBy("createdAt", "desc")))
        return true
    } catch (error) {
        console.error("Course connection test failed:", error)
        return false
    }
}
