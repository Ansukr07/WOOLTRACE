import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { GlobalStateProvider } from './context/GlobalStateContext'
import { WoolKartProvider } from './context/WoolKartContext'
import ProtectedRoute from './components/ProtectedRoute'

import LandingPage from './pages/LandingPage'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

import FarmerLayout from './layouts/FarmerLayout'
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

// Placeholder Layouts/Dashboards for new roles
import SellerLayout from './layouts/SellerLayout'
import SellerDashboard from './pages/seller/SellerDashboard'
import Bids from './pages/seller/Bids'
import BidDetail from './pages/seller/BidDetail'
import Marketplace from './pages/seller/Marketplace'
import MarketProductDetail from './pages/seller/MarketProductDetail'
import MarketCart from './pages/seller/MarketCart'
import MarketCheckout from './pages/seller/MarketCheckout'
import Wishlist from './pages/seller/Wishlist'
import Wallet from './pages/seller/Wallet'
import Orders from './pages/seller/Orders'
import OrderDetail from './pages/seller/OrderDetail'
import VerifyCertificate from './pages/public/VerifyCertificate'

const DummyDashboard = ({ name }) => (
  <div style={{ padding: '40px' }}>
    <h1>{name} Dashboard</h1>
    <p>This module is under construction.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <GlobalStateProvider>
        <WoolKartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
            
            {/* Unified Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/farmer/login" element={<Navigate to="/login" replace />} />
            
            {/* Farmer Module */}
            <Route path="/farmer" element={<ProtectedRoute allowedRoles={['FARMER']}><FarmerLayout /></ProtectedRoute>}>
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
            
            {/* Inspector Module */}
            <Route path="/inspector" element={<ProtectedRoute allowedRoles={['QUALITY_INSPECTOR']}><InspectorLayout /></ProtectedRoute>}>
              <Route index element={<InspectorDashboard />} />
              <Route path="inspection/:id" element={<InspectionDetail />} />
            </Route>

            {/* Seller Module */}
            <Route path="/seller" element={<ProtectedRoute allowedRoles={['SELLER']}><SellerLayout /></ProtectedRoute>}>
              <Route index element={<SellerDashboard />} />
              <Route path="market" element={<Marketplace />} />
              <Route path="product/:id" element={<MarketProductDetail />} />
              <Route path="cart" element={<MarketCart />} />
              <Route path="checkout" element={<MarketCheckout />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="bids" element={<Bids />} />
              <Route path="bids/:id" element={<BidDetail />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              <Route path="wallet" element={<Wallet />} />
            </Route>

            {/* Transport & Warehouse MVPs */}
            <Route path="/transport" element={<ProtectedRoute allowedRoles={['TRANSPORT']}><DummyDashboard name="Transport" /></ProtectedRoute>} />
            <Route path="/warehouse" element={<ProtectedRoute allowedRoles={['WAREHOUSE']}><DummyDashboard name="Warehouse" /></ProtectedRoute>} />

            {/* Public */}
            <Route path="/verify/:certificateId" element={<VerifyCertificate />} />
          </Routes>
          </Router>
        </WoolKartProvider>
      </GlobalStateProvider>
    </AuthProvider>
  )
}

export default App
