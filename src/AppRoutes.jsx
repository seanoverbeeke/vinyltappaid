import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ArtistList from './pages/ArtistList'
import ArtistForm from './pages/ArtistForm'
import SearchArtist from './pages/SearchArtist'
import ArtistProfile from './pages/ArtistProfile'
import Landing from './pages/Landing'
import Login from './pages/Login'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/artist-form" element={<ArtistForm />} />
      <Route path="/artist-form/:artistId" element={<ArtistForm />} />
      <Route path="/artist-list" element={<ArtistList />} />
      <Route path="/search" element={<SearchArtist />} />
      <Route path="/artist/:id" element={<ArtistProfile />} />
    </Routes>
  )
}

export default AppRoutes 