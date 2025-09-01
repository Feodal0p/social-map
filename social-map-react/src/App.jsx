import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Profile from './Pages/Profile.jsx'
import Register from './Pages/Register.jsx'
import Login from './Pages/Login.jsx'

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/profile" element={<Profile/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </BrowserRouter>
  )
}
