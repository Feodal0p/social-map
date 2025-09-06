import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import ShowProfile from './Pages/Profile/Show.jsx'
import UpdateProfile from './Pages/Profile/Update.jsx'
import Register from './Pages/Auth/Register.jsx'
import Login from './Pages/Auth/Login.jsx'
import Home from './Pages/Home.jsx'
import ProtectedRoute from './Routes/ProtectedRoute.jsx'
import GuestRoute from './Routes/GuestRoute.jsx'
import MainLayout from './Layouts/MainLayout.jsx'
import { useContext } from 'react'
import { AppContext } from '@context/AppContext'
import Loader from './Components/Loader.jsx'
import EventsMap from './Pages/EventsMap.jsx'

export default function App() {

  const {loading} = useContext(AppContext)

  if (loading) return <Loader />;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/profile/:id" element={<ShowProfile />} />
          <Route path="/profile/edit/:id" element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>} />
          <Route index element={<Home />} />
        </Route>
        <Route path="/map" element={<EventsMap />} />
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
