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
import MapLayout from './Layouts/MapLayout.jsx'
import ParticipatingEvents from './Pages/Events/ParticipatingEvents.jsx'
import ShowEvent from './Pages/Events/Show.jsx'
import Participants from './Pages/Events/Participants.jsx'
import CreatedEvents from './Pages/Events/CreatedEvents.jsx'
import HistoryEvents from './Pages/Events/HistoryEvents.jsx'

export default function App() {

  const { loading } = useContext(AppContext)

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
          <Route path="/events/participating" element={
            <ProtectedRoute>
              <ParticipatingEvents />
            </ProtectedRoute>} />
          <Route path="/events/created" element={
            <ProtectedRoute>
              <CreatedEvents />
            </ProtectedRoute>} />
          <Route path="/events/history" element={
            <ProtectedRoute>
              <HistoryEvents />
            </ProtectedRoute>} />
          <Route path="/events/:id" element={<ShowEvent />} />
          <Route path="/events/:id/participants" element={<Participants />} />
        </Route>
        <Route element={<MapLayout />}>
          <Route path="/map" element={<EventsMap />} />
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
