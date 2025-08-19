import {  Routes, Route } from "react-router-dom";
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
        <Route path="/cart" element={<CartPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verified-redirect" element={<VerifiedRedirect />} />
        <Route path="/forgot-password" element={<ResetPassword />} />
        <Route path="/courses/kids/:id" element={<KidsCourseDetails />} />

        {/* Dashboard */}
        <Route path="/dashboard/overview" element={<Overview />} />
        <Route path="/dashboard/add-course" element={<AddCourse />} />
        <Route path="/dashboard/manage-courses" element={<ManageCourses />} />
        <Route path="/dashboard/users" element={<Users />} />
        <Route path="/dashboard/orders" element={<Orders />} />
        <Route path="/dashboard/feedback" element={<Feedback />} />

        {/* Checkout */}
        <Route path="/checkout/address" element={<AddressForm />} />
        <Route path="/checkout/checkout" element={<Checkout />} />
        <Route path="/checkout/payment" element={<PaymentModal />} />
        <Route path="/paymentSuccess" element={<PaymentSuccess />} />

        {/* User Profile */}
        <Route path="/ProfilePage" element={<ProfilePage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>

      <Toaster position="top-center" reverseOrder={false} />
    </CartProvider>
  );
}

export default App;
