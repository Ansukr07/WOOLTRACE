import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { GlobalStateProvider } from './context/GlobalStateContext'
import { WoolKartProvider } from './context/WoolKartContext'
import ProtectedRoute from './components/ProtectedRoute'

const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));

const FarmerLayout = React.lazy(() => import('./layouts/FarmerLayout'));
const FarmerDashboard = React.lazy(() => import('./pages/farmer/Dashboard'));
const Market = React.lazy(() => import('./pages/farmer/Market'));
const MyWool = React.lazy(() => import('./pages/farmer/MyWool'));
const BatchDetail = React.lazy(() => import('./pages/farmer/BatchDetail'));
const Services = React.lazy(() => import('./pages/farmer/Services'));
const WoolKartRoot = React.lazy(() => import('./pages/farmer/woolkart/WoolKartRoot'));
const WoolKartHome = React.lazy(() => import('./pages/farmer/woolkart/WoolKartHome'));
const ProductDetail = React.lazy(() => import('./pages/farmer/woolkart/ProductDetail'));
const Cart = React.lazy(() => import('./pages/farmer/woolkart/Cart'));
const Checkout = React.lazy(() => import('./pages/farmer/woolkart/Checkout'));
const OrderConfirmation = React.lazy(() => import('./pages/farmer/woolkart/OrderConfirmation'));
const Academy = React.lazy(() => import('./pages/farmer/Academy'));
const ModuleDetail = React.lazy(() => import('./pages/farmer/components/ModuleDetail'));

const InspectorLayout = React.lazy(() => import('./layouts/InspectorLayout'));
const InspectorDashboard = React.lazy(() => import('./pages/inspector/InspectorDashboard'));
const InspectionDetail = React.lazy(() => import('./pages/inspector/InspectionDetail'));
const Certificates = React.lazy(() => import('./pages/inspector/Certificates'));

const SellerLayout = React.lazy(() => import('./layouts/SellerLayout'));
const SellerDashboard = React.lazy(() => import('./pages/seller/SellerDashboard'));
const Bids = React.lazy(() => import('./pages/seller/Bids'));
const BidDetail = React.lazy(() => import('./pages/seller/BidDetail'));
const Marketplace = React.lazy(() => import('./pages/seller/Marketplace'));
const MarketProductDetail = React.lazy(() => import('./pages/seller/MarketProductDetail'));
const MarketCart = React.lazy(() => import('./pages/seller/MarketCart'));
const MarketCheckout = React.lazy(() => import('./pages/seller/MarketCheckout'));
const Wishlist = React.lazy(() => import('./pages/seller/Wishlist'));
const Wallet = React.lazy(() => import('./pages/seller/Wallet'));
const Orders = React.lazy(() => import('./pages/seller/Orders'));
const OrderDetail = React.lazy(() => import('./pages/seller/OrderDetail'));
const VerifyCertificate = React.lazy(() => import('./pages/public/VerifyCertificate'));

// Processing Lazy Imports
const ProcessingLayout = React.lazy(() => import('./layouts/ProcessingLayout'));
const ProcessingDashboard = React.lazy(() => import('./pages/processing/ProcessingDashboard'));
const ProcessingBatchDetail = React.lazy(() => import('./pages/processing/ProcessingBatchDetail'));

const DummyDashboard = ({ name }) => (
  <div style={{ padding: '40px' }}>
    <h1>{name} Dashboard</h1>
    <p>This module is under construction.</p>
  </div>
);

const FallbackLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: 16 }}>
    <div style={{ width: 40, height: 40, border: '4px solid #F0F0F0', borderTop: '4px solid #16A34A', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    <p style={{ color: '#666', fontWeight: 600 }}>Loading WoolTrace...</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <GlobalStateProvider>
        <WoolKartProvider>
          <Router>
            <Suspense fallback={<FallbackLoader />}>
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
                <Route path="academy/module/:moduleId" element={<ModuleDetail />} />
              </Route>
              
              {/* Inspector Module */}
              <Route path="/inspector" element={<ProtectedRoute allowedRoles={['QUALITY_INSPECTOR']}><InspectorLayout /></ProtectedRoute>}>
                <Route index element={<InspectorDashboard />} />
                <Route path="inspection/:id" element={<InspectionDetail />} />
                <Route path="certificates" element={<Certificates />} />
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

              {/* Processing Module */}
              <Route path="/processing" element={<ProtectedRoute allowedRoles={['PROCESSING_UNIT']}><ProcessingLayout /></ProtectedRoute>}>
                <Route index element={<ProcessingDashboard />} />
                <Route path="batches/:batchId" element={<ProcessingBatchDetail />} />
              </Route>

              {/* Public */}
              <Route path="/verify/:certificateId" element={<VerifyCertificate />} />
            </Routes>
            </Suspense>
          </Router>
        </WoolKartProvider>
      </GlobalStateProvider>
    </AuthProvider>
  )
}

export default App
