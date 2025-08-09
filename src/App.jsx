import './App.css';
import './index.css';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';


import Home from './pages/Home';
import CoursesPage from './pages/CoursesPage';
import CartPage from './pages/CartPage';
import ContactPage from './pages/ContactPage';

//
import LoginForm from './pages/Login';
import RegisterForm from './pages/Register';
import VerifyEmail from './components/VerifyEmail';
import VerifiedRedirect from './components/VerifiedRedirect';

// Dashboard
import Overview from './pages/Overview';
import AddCourse from './pages/AddCourse';
import ManageCourses from './pages/ManageCourses';

// Checkout
import { CartProvider } from './context/CartContext';
import AddressForm from './components/Checkout/AddressForm';
import Checkout from './components/Checkout/Checkout';
import PaymentModal from './components/Checkout/PaymentModal';
import PaymentSuccess from './components/Checkout/PaymentSuccess';

function App() {
  return (
    <>
      <CartProvider>
        <Routes>
        
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/contact" element={<ContactPage />} />

          
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verified-redirect" element={<VerifiedRedirect />} />

          {/* Dashboard */}
          <Route path="/dashboard/overview" element={<Overview />} />
          <Route path="/dashboard/add-course" element={<AddCourse />} />
          <Route path="/dashboard/manage-courses" element={<ManageCourses />} />

          {/* Checkout */}
          <Route path="/checkout/address" element={<AddressForm />} />
          <Route path="/checkout/checkout" element={<Checkout />} />
          <Route path="/checkout/payment" element={<PaymentModal />} />
          <Route path="/paymentSuccess" element={<PaymentSuccess />} />
        </Routes>
      </CartProvider>

      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
