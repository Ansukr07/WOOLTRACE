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
import WoolKartRoot from './pages/farmer/woolkart/WoolKartRoot'
import WoolKartHome from './pages/farmer/woolkart/WoolKartHome'
import ProductDetail from './pages/farmer/woolkart/ProductDetail'
import Cart from './pages/farmer/woolkart/Cart'
import Checkout from './pages/farmer/woolkart/Checkout'
import OrderConfirmation from './pages/farmer/woolkart/OrderConfirmation'
import Academy from './pages/farmer/Academy'

import InspectorLayout from './layouts/InspectorLayout'
import InspectorDashboard from './pages/inspector/InspectorDashboard'
import InspectionDetail from './pages/inspector/InspectionDetail'
import VerifyCertificate from './pages/public/VerifyCertificate'

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
          
          <Route path="woolkart" element={<WoolKartRoot />}>
            <Route index element={<WoolKartHome />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-confirmation/:id" element={<OrderConfirmation />} />
          </Route>
          
          <Route path="academy" element={<Academy />} />
        </Route>
        
        <Route path="/inspector" element={<InspectorLayout />}>
          <Route index element={<InspectorDashboard />} />
          <Route path="inspection/:id" element={<InspectionDetail />} />
        </Route>

        <Route path="/verify/:certificateId" element={<VerifyCertificate />} />
      </Routes>
    </Router>
  )
}

export default App
