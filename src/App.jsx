import { Routes, Route } from "react-router-dom";
import "./App.css";
import "./index.css";
import { Toaster } from "react-hot-toast";

// Pages & Components
import Hero from "./components/Hero/Hero";
import AboutUs from "./pages/AboutUs";
import CoursesPage from "./pages/CoursesPage";
import CartPage from "./pages/CartPage";
import ContactPage from "./pages/ContactPage";
import LoginForm from "./pages/Login";
import RegisterForm from "./pages/Register";
import VerifyEmail from "./components/VerifyEmail";
import VerifiedRedirect from "./components/VerifiedRedirect";
import Overview from "./pages/Overview";
import AddCourse from "./pages/AddCourse";
import ManageCourses from "./pages/ManageCourses";
import Users from "./pages/Users";
import Orders from "./pages/orders";
import ResetPassword from "./pages/ResetPassword";
import Feedback from "./pages/Feedback";

import ProfilePage from "./pages/ProfilePage";
import EditProfile from "./pages/EditProfile";
import NotificationsPage from "./pages/NotificationsPage";

// Checkout
import { CartProvider } from "./context/CartContext";
import AddressForm from "./components/Checkout/AddressForm";
import Checkout from "./components/Checkout/Checkout";
import PaymentModal from "./components/Checkout/PaymentModal";
import PaymentSuccess from "./components/Checkout/PaymentSuccess";
import KidsCourseDetails from "./pages/KidsCourseDetails";
import CourseKids from "./pages/CourseKids";
import Wishlist from "./pages/Wishlist";
import CourseAdults from "./pages/Courseadults";
import CourseDetails from "./pages/CourseDetails";
import BlogDashboard from "./pages/blogDashboard";
import BlogPage from "./pages/blogUser";

function App() {
  return (
    <CartProvider>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Hero />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/kids" element={<CourseKids />} />
        <Route path="/courses/adults" element={<CourseAdults />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route
          path="/Cart"
          element={
            <ProtectedRoute>
              {" "}
              <CartPage />{" "}
            </ProtectedRoute>
          }
        />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verified-redirect" element={<VerifiedRedirect />} />
        <Route path="/forgot-password" element={<ResetPassword />} />
        <Route path="/courses/kids/:id" element={<KidsCourseDetails />} />
        <Route path="/blog" element={<BlogPage />} />

        {/* Dashboard protected*/}
        <Route
          path="/dashboard/overview"
          element={
            <ProtectedRoute adminOnly={true}>
              {" "}
              <Overview />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/overview"
          element={
            <ProtectedRoute adminOnly={true}>
              {" "}
              <Overview />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/add-course"
          element={
            <ProtectedRoute adminOnly={true}>
              {" "}
              <AddCourse />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/manage-courses"
          element={
            <ProtectedRoute adminOnly={true}>
              {" "}
              <ManageCourses />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/users"
          element={
            <ProtectedRoute adminOnly={true}>
              {" "}
              <Users />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/orders"
          element={
            <ProtectedRoute adminOnly={true}>
              {" "}
              <Orders />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/feedback"
          element={
            <ProtectedRoute adminOnly={true}>
              {" "}
              <Feedback />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/addblog"
          element={
            <ProtectedRoute adminOnly={true}>
              {" "}
              <BlogDashboard />{" "}
            </ProtectedRoute>
          }
        />

        {/* Checkout protected*/}
        <Route
          path="/checkout/address"
          element={
            <ProtectedRoute>
              <AddressForm />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout/checkout"
          element={
            <ProtectedRoute>
              {" "}
              <Checkout />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout/payment"
          element={
            <ProtectedRoute>
              {" "}
              <PaymentModal />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/paymentSuccess"
          element={
            <ProtectedRoute>
              {" "}
              <PaymentSuccess />{" "}
            </ProtectedRoute>
          }
        />

        {/* User Profile protected*/}
        <Route
          path="/Notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/ProfilePage"
          element={
            <ProtectedRoute>
              {" "}
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              {" "}
              <EditProfile />{" "}
            </ProtectedRoute>
          }
        />
      </Routes>

      <Toaster position="top-center" reverseOrder={false} />
    </CartProvider>
  );
}

export default App;
