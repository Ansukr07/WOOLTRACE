import React, { Suspense } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GlobalStateProvider } from './context/GlobalStateContext';
import ProtectedRoute from './components/ProtectedRoute';
import WoolCloudLoader from './components/WoolCloudLoader';
import { getRoleHome } from './utils/roleRoutes';

const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const VerifyCertificate = React.lazy(() => import('./pages/public/VerifyCertificate'));
const PublicTrackBatch = React.lazy(() => import('./pages/public/PublicTrackBatch'));
const FarmerLayout = React.lazy(() => import('./layouts/FarmerLayout'));
const FarmerDashboard = React.lazy(() => import('./pages/farmer/Dashboard'));
const FarmerMarket = React.lazy(() => import('./pages/farmer/Market'));
const MyProduce = React.lazy(() => import('./pages/farmer/MyWool'));
const TrackProduce = React.lazy(() => import('./pages/farmer/TrackWool'));
const StorageFinder = React.lazy(() => import('./pages/farmer/FindWarehouse'));
const FarmerServices = React.lazy(() => import('./pages/farmer/Services'));
const Academy = React.lazy(() => import('./pages/farmer/Academy'));
const BuyerLayout = React.lazy(() => import('./layouts/SellerLayout'));
const BuyerDashboard = React.lazy(() => import('./pages/seller/SellerDashboard'));
const BuyerMarketplace = React.lazy(() => import('./pages/seller/Marketplace'));
const BuyerBids = React.lazy(() => import('./pages/seller/Bids'));
const BuyerOrders = React.lazy(() => import('./pages/seller/Orders'));
const BuyerWallet = React.lazy(() => import('./pages/seller/Wallet'));
const StorageLayout = React.lazy(() => import('./layouts/WarehouseLayout'));
const StorageDashboard = React.lazy(() => import('./pages/warehouse/WarehouseDashboard'));
const StorageCheckIn = React.lazy(() => import('./pages/warehouse/WarehouseCheckIn'));
const StorageInventory = React.lazy(() => import('./pages/warehouse/WarehouseInventory'));
const StorageRequests = React.lazy(() => import('./pages/warehouse/WarehouseRequests'));
const StorageReleases = React.lazy(() => import('./pages/warehouse/WarehouseReleases'));
const LogisticsLayout = React.lazy(() => import('./layouts/TransportLayout'));
const LogisticsDashboard = React.lazy(() => import('./pages/transport/TransportDashboard'));
const LogisticsRequests = React.lazy(() => import('./pages/transport/TransportRequests'));
const ActiveShipments = React.lazy(() => import('./pages/transport/ActiveShipments'));
const LogisticsHistory = React.lazy(() => import('./pages/transport/TransportHistory'));
const LogisticsVehicles = React.lazy(() => import('./pages/transport/Vehicles'));
const LogisticsEarnings = React.lazy(() => import('./pages/transport/TransportEarnings'));
const QualityLayout = React.lazy(() => import('./layouts/InspectorLayout'));
const QualityDashboard = React.lazy(() => import('./pages/inspector/InspectorDashboard'));
const Certificates = React.lazy(() => import('./pages/inspector/Certificates'));
const ProcessorLayout = React.lazy(() => import('./layouts/ProcessingLayout'));
const ProcessorDashboard = React.lazy(() => import('./pages/processing/ProcessingDashboard'));
const ProcessorSustainability = React.lazy(() => import('./pages/processing/ResourceSustainabilityView'));

function RoleHomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? getRoleHome(user.role) : '/login'} replace />;
}

const secure = (roles, element) => <ProtectedRoute allowedRoles={roles}>{element}</ProtectedRoute>;

function App() {
  return <AuthProvider><GlobalStateProvider><Router><Suspense fallback={<WoolCloudLoader text="Loading your KhetSetu workspace..." fullScreen />}><Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/platform" element={<RoleHomeRedirect />} />
    <Route path="/verify/:certificateId" element={<VerifyCertificate />} />
    <Route path="/track/:batchId" element={<PublicTrackBatch />} />
    <Route path="/track" element={<PublicTrackBatch />} />

    <Route path="/farmer" element={secure(['FARMER'], <FarmerLayout />)}>
      <Route index element={<FarmerDashboard />} /><Route path="market" element={<FarmerMarket />} />
      <Route path="produce" element={<MyProduce />} /><Route path="track" element={<TrackProduce />} />
      <Route path="storage" element={<StorageFinder />} /><Route path="services" element={<FarmerServices />} />
      <Route path="academy" element={<Academy />} /><Route path="payments" element={<Navigate to="/farmer/market?tab=transactions" replace />} />
      <Route path="*" element={<Navigate to="/farmer" replace />} />
    </Route>

    <Route path="/buyer" element={secure(['SELLER'], <BuyerLayout />)}>
      <Route index element={<BuyerDashboard />} /><Route path="marketplace" element={<BuyerMarketplace />} />
      <Route path="bids" element={<BuyerBids />} /><Route path="orders" element={<BuyerOrders />} />
      <Route path="payments" element={<BuyerWallet />} /><Route path="*" element={<Navigate to="/buyer" replace />} />
    </Route>

    <Route path="/storage" element={secure(['WAREHOUSE'], <StorageLayout />)}>
      <Route index element={<StorageDashboard />} /><Route path="check-in" element={<StorageCheckIn />} />
      <Route path="inventory" element={<StorageInventory />} /><Route path="requests" element={<StorageRequests />} />
      <Route path="releases" element={<StorageReleases />} /><Route path="*" element={<Navigate to="/storage" replace />} />
    </Route>

    <Route path="/logistics" element={secure(['TRANSPORT'], <LogisticsLayout />)}>
      <Route index element={<LogisticsDashboard />} /><Route path="requests" element={<LogisticsRequests />} />
      <Route path="active" element={<ActiveShipments />} /><Route path="history" element={<LogisticsHistory />} />
      <Route path="vehicles" element={<LogisticsVehicles />} /><Route path="earnings" element={<LogisticsEarnings />} />
      <Route path="*" element={<Navigate to="/logistics" replace />} />
    </Route>

    <Route path="/quality" element={secure(['QUALITY_INSPECTOR'], <QualityLayout />)}>
      <Route index element={<QualityDashboard />} /><Route path="certificates" element={<Certificates />} />
      <Route path="*" element={<Navigate to="/quality" replace />} />
    </Route>

    <Route path="/processor" element={secure(['PROCESSING_UNIT'], <ProcessorLayout />)}>
      <Route index element={<ProcessorDashboard />} /><Route path="sustainability" element={<ProcessorSustainability />} />
      <Route path="*" element={<Navigate to="/processor" replace />} />
    </Route>

    <Route path="/seller/*" element={<Navigate to="/buyer" replace />} /><Route path="/warehouse/*" element={<Navigate to="/storage" replace />} />
    <Route path="/transport/*" element={<Navigate to="/logistics" replace />} /><Route path="/inspector/*" element={<Navigate to="/quality" replace />} />
    <Route path="/processing/*" element={<Navigate to="/processor" replace />} /><Route path="*" element={<Navigate to="/" replace />} />
  </Routes></Suspense></Router></GlobalStateProvider></AuthProvider>;
}

export default App;
