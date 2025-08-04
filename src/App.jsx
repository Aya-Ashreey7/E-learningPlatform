
import { Routes, Route } from 'react-router-dom'
import './App.css'
import './index.css'
import LoginForm from './pages/Login'
import RegisterForm from './pages/Register'

function App() {

  return (
    <>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>

    </>
  )
}

export default App
