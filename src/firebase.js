import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA8KJThwuJ7ugPzPAc0fs_7ETFQvKEaYUo",
  authDomain: "e-learning-7c960.firebaseapp.com",
  projectId: "e-learning-7c960",
  storageBucket: "e-learning-7c960.firebasestorage.app",
  messagingSenderId: "993249353778",
  appId: "1:993249353778:web:1c46a9cf3f571165c81c2b",
  measurementId: "G-48NB2K9JX8",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);

export default app;
