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
const TrackProduce = React.lazy(() => import('./pages/farmer/TrackWool'));
const StorageFinder = React.lazy(() => import('./pages/farmer/FindWarehouse'));
const BuyerLayout = React.lazy(() => import('./layouts/SellerLayout'));
const BuyerWorkspace = React.lazy(() => import('./pages/buyer/BuyerWorkspace'));
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
const TransportRequestDetail = React.lazy(() => import('./pages/transport/RequestDetail'));
const TransportShipmentDetail = React.lazy(() => import('./pages/transport/ShipmentDetail'));
const QualityLayout = React.lazy(() => import('./layouts/InspectorLayout'));
const QualityDashboard = React.lazy(() => import('./pages/inspector/InspectorDashboard'));
const Certificates = React.lazy(() => import('./pages/inspector/Certificates'));

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
      <Route index element={<FarmerDashboard />} /><Route path="market" element={<FarmerMarket />} /><Route path="market/:view" element={<FarmerMarket />} />
      <Route path="storage" element={<StorageFinder />} /><Route path="trust" element={<TrackProduce />} />
      <Route path="produce" element={<Navigate to="/farmer/market/lots" replace />} />
      <Route path="payments" element={<Navigate to="/farmer/market/transactions" replace />} />
      <Route path="track" element={<Navigate to="/farmer/trust" replace />} />
      <Route path="*" element={<Navigate to="/farmer" replace />} />
    </Route>

    <Route path="/buyer" element={secure(['SELLER'], <BuyerLayout />)}>
      <Route index element={<BuyerWorkspace />} /><Route path="demand" element={<BuyerWorkspace />} />
      <Route path="lots" element={<BuyerWorkspace />} /><Route path="offers" element={<BuyerWorkspace />} />
      <Route path="payments" element={<BuyerWorkspace />} /><Route path="marketplace" element={<Navigate to="/buyer/lots" replace />} />
      <Route path="bids" element={<Navigate to="/buyer/offers" replace />} /><Route path="orders" element={<Navigate to="/buyer/payments" replace />} />
      <Route path="*" element={<Navigate to="/buyer" replace />} />
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
      <Route path="requests/:id" element={<TransportRequestDetail />} /><Route path="shipment/:id" element={<TransportShipmentDetail />} />
      <Route path="*" element={<Navigate to="/logistics" replace />} />
    </Route>

    <Route path="/quality" element={secure(['QUALITY_INSPECTOR'], <QualityLayout />)}>
      <Route index element={<QualityDashboard />} /><Route path="certificates" element={<Certificates />} />
      <Route path="*" element={<Navigate to="/quality" replace />} />
    </Route>

    <Route path="/processor/*" element={<Navigate to="/buyer" replace />} />

    <Route path="/seller/*" element={<Navigate to="/buyer" replace />} /><Route path="/warehouse/*" element={<Navigate to="/storage" replace />} />
    <Route path="/transport/*" element={<Navigate to="/logistics" replace />} /><Route path="/inspector/*" element={<Navigate to="/quality" replace />} />
    <Route path="/processing/*" element={<Navigate to="/processor" replace />} /><Route path="*" element={<Navigate to="/" replace />} />
  </Routes></Suspense></Router></GlobalStateProvider></AuthProvider>;
}

export default App;
