// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [user, loading] = useAuthState(auth);

 
  if (loading) return <p className="text-center mt-20">Loading...</p>;


  if (!user) return <Navigate to="/login" replace />;

 
  if (adminOnly) {
    const role = localStorage.getItem("role"); 
    if (role !== "admin") return <Navigate to="/" replace />;
  }


  return children;
};

export default ProtectedRoute;
