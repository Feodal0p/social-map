import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Profile from './Pages/Profile.jsx'
import Register from './Pages/Register.jsx'
import Login from './Pages/Login.jsx'
import Home from './Pages/Home.jsx'
import ProtectedRoute from './Routes/ProtectedRoute.jsx'
import GuestRoute from './Routes/GuestRoute.jsx'
import MainLayout from './Layouts/MainLayout.jsx'

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>} />
          <Route index element={<Home />} />
        </Route>
        <Route path="/register" element={
          <GuestRoute>
            <Register />
          </GuestRoute>} />
        <Route path="/login" element={
          <GuestRoute>
            <Login />
          </GuestRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
