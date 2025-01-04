import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import ArtistList from './pages/authenticated/ArtistList'
import ArtistForm from './pages/authenticated/ArtistForm'
import ArtistProfile from './pages/authenticated/ArtistProfile'
import ProtectedRoute from './components/ProtectedRoute'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route 
        path="/artist-list" 
        element={
          <ProtectedRoute>
            <ArtistList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/artist-form/:artistId?" 
        element={
          <ProtectedRoute>
            <ArtistForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/artist-profile/:artistId" 
        element={
          <ProtectedRoute>
            <ArtistProfile />
          </ProtectedRoute>
        } 
      />
    </Routes>
  )
}

export default AppRoutes 