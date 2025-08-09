import { Routes, Route } from "react-router-dom";
import "./App.css";
import "./index.css";
import LoginForm from "./pages/Login";
import RegisterForm from "./pages/Register";
import { Toaster } from "react-hot-toast";
import VerifiedRedirect from "./components/VerifiedRedirect";
import VerifyEmail from "./components/VerifyEmail";
import Home from "./pages/Home";
import Overview from "./pages/Overview";
import AddCourse from "./pages/AddCourse";
import ManageCourses from "./pages/ManageCourses";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verified-redirect" element={<VerifiedRedirect />} />

        <Route path="/dashboard/overview" element={<Overview />} />
        <Route path="/dashboard/add-course" element={<AddCourse />} />
        <Route path="/dashboard/manage-courses" element={<ManageCourses />} />
      </Routes>

      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
