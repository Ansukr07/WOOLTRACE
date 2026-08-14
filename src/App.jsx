import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import FarmerLayout from './layouts/FarmerLayout'
import FarmerLogin from './pages/farmer/Login'
import FarmerDashboard from './pages/farmer/Dashboard'
import Market from './pages/farmer/Market'
import MyWool from './pages/farmer/MyWool'
import BatchDetail from './pages/farmer/BatchDetail'
import Services from './pages/farmer/Services'
import WoolKart from './pages/farmer/WoolKart'
import Academy from './pages/farmer/Academy'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/farmer/login" element={<FarmerLogin />} />
        <Route path="/farmer" element={<FarmerLayout />}>
          <Route index element={<FarmerDashboard />} />
          <Route path="market" element={<Market />} />
          <Route path="my-wool" element={<MyWool />} />
          <Route path="batch/:id" element={<BatchDetail />} />
          <Route path="services" element={<Services />} />
          <Route path="woolkart" element={<WoolKart />} />
          <Route path="academy" element={<Academy />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
