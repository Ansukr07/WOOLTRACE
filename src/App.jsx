import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GlobalStateProvider } from './context/GlobalStateContext';
import { WoolKartProvider } from './context/WoolKartContext';
import ProtectedRoute from './components/ProtectedRoute';
import WoolCloudLoader from './components/WoolCloudLoader';

// Lazy-loaded pages & modules
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));

// Farmer Module
const FarmerLayout = React.lazy(() => import('./layouts/FarmerLayout'));
const FarmerDashboard = React.lazy(() => import('./pages/farmer/Dashboard'));
const TrackWool = React.lazy(() => import('./pages/farmer/TrackWool'));
const FindWarehouse = React.lazy(() => import('./pages/farmer/FindWarehouse'));
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

// Inspector Module
const InspectorLayout = React.lazy(() => import('./layouts/InspectorLayout'));
const InspectorDashboard = React.lazy(() => import('./pages/inspector/InspectorDashboard'));
const InspectionDetail = React.lazy(() => import('./pages/inspector/InspectionDetail'));
const Certificates = React.lazy(() => import('./pages/inspector/Certificates'));

// Seller Module
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

// Warehouse Module
const WarehouseLayout = React.lazy(() => import('./layouts/WarehouseLayout'));
const WarehouseDashboard = React.lazy(() => import('./pages/warehouse/WarehouseDashboard'));
const WarehouseCheckIn = React.lazy(() => import('./pages/warehouse/WarehouseCheckIn'));
const WarehouseInventory = React.lazy(() => import('./pages/warehouse/WarehouseInventory'));
const WarehouseRequests = React.lazy(() => import('./pages/warehouse/WarehouseRequests'));
const WarehouseReleases = React.lazy(() => import('./pages/warehouse/WarehouseReleases'));

// Processing Module
const ProcessingLayout = React.lazy(() => import('./layouts/ProcessingLayout'));
const ProcessingDashboard = React.lazy(() => import('./pages/processing/ProcessingDashboard'));
const ProcessingBatchDetail = React.lazy(() => import('./pages/processing/ProcessingBatchDetail'));

// Public
const VerifyCertificate = React.lazy(() => import('./pages/public/VerifyCertificate'));
const PublicTrackBatch = React.lazy(() => import('./pages/public/PublicTrackBatch'));

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
            <Suspense fallback={<WoolCloudLoader text="Initializing WoolTrace Ecosystem..." fullScreen={true} />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
              
                {/* Unified Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/farmer/login" element={<Navigate to="/login" replace />} />
                
                {/* Farmer Module */}
                <Route path="/farmer" element={<ProtectedRoute allowedRoles={['FARMER']}><FarmerLayout /></ProtectedRoute>}>
                  <Route index element={<FarmerDashboard />} />
                  <Route path="track" element={<TrackWool />} />
                  <Route path="warehouses" element={<FindWarehouse />} />
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
                  <Route path="wallet" element={<Wallet />} />
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

                {/* Warehouse Partner Module */}
                <Route path="/warehouse" element={<ProtectedRoute allowedRoles={['WAREHOUSE']}><WarehouseLayout /></ProtectedRoute>}>
                  <Route index element={<WarehouseDashboard />} />
                  <Route path="check-in" element={<WarehouseCheckIn />} />
                  <Route path="inventory" element={<WarehouseInventory />} />
                  <Route path="requests" element={<WarehouseRequests />} />
                  <Route path="releases" element={<WarehouseReleases />} />
                </Route>

                {/* Processing Module */}
                <Route path="/processing" element={<ProtectedRoute allowedRoles={['PROCESSING_UNIT']}><ProcessingLayout /></ProtectedRoute>}>
                  <Route index element={<ProcessingDashboard />} />
                  <Route path="batches/:batchId" element={<ProcessingBatchDetail />} />
                </Route>

                {/* Transport MVP */}
                <Route path="/transport" element={<ProtectedRoute allowedRoles={['TRANSPORT']}><DummyDashboard name="Transport" /></ProtectedRoute>} />

                {/* Public Verification & Tracking */}
                <Route path="/verify/:certificateId" element={<VerifyCertificate />} />
                <Route path="/track/:batchId" element={<PublicTrackBatch />} />
                <Route path="/track" element={<PublicTrackBatch />} />
              </Routes>
            </Suspense>
          </Router>
        </WoolKartProvider>
      </GlobalStateProvider>
    </AuthProvider>
  )
}

export default App