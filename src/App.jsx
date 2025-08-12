import { Routes, Route } from 'react-router-dom'
import './App.css'
import './index.css'
import LoginForm from './pages/Login'
import RegisterForm from './pages/Register'
import { Toaster } from 'react-hot-toast'
import VerifiedRedirect from './components/VerifiedRedirect'
import VerifyEmail from './components/VerifyEmail'
import Home from './pages/Home'
import Hero from './components/Hero/Hero' // Import Hero
import AboutUs from './pages/AboutUs' // Import AboutUs page
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Hero />} /> {/* Use Hero as the home page */}
        <Route path="/aboutus" element={<AboutUs />} />

        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verified-redirect" element={<VerifiedRedirect />} />


      </Routes>

      <Toaster position="top-center" reverseOrder={false} />


    </>
  )
}

export default App
