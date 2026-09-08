import React, { Suspense } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GlobalStateProvider } from './context/GlobalStateContext';
import WoolCloudLoader from './components/WoolCloudLoader';

const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const MarketIntelligence = React.lazy(() => import('./pages/khetsetu/MarketIntelligence'));
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const VerifyCertificate = React.lazy(() => import('./pages/public/VerifyCertificate'));
const PublicTrackBatch = React.lazy(() => import('./pages/public/PublicTrackBatch'));

function App() {
  return <AuthProvider><GlobalStateProvider><Router><Suspense fallback={<WoolCloudLoader text="Loading KhetSetu market workspace..." fullScreen />}><Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/platform" element={<MarketIntelligence />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* Supporting trust & provenance routes retained from WoolTrace. */}
    <Route path="/verify/:certificateId" element={<VerifyCertificate />} />
    <Route path="/track/:batchId" element={<PublicTrackBatch />} />
    <Route path="/track" element={<PublicTrackBatch />} />

    {/* Legacy role URLs now lead into the unified SIH workspace. */}
    <Route path="/farmer/*" element={<Navigate to="/platform" replace />} />
    <Route path="/seller/*" element={<Navigate to="/platform?view=buyers" replace />} />
    <Route path="/inspector/*" element={<Navigate to="/platform?view=trust" replace />} />
    <Route path="/warehouse/*" element={<Navigate to="/platform?view=logistics" replace />} />
    <Route path="/transport/*" element={<Navigate to="/platform?view=logistics" replace />} />
    <Route path="/processing/*" element={<Navigate to="/platform?view=demand" replace />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></Suspense></Router></GlobalStateProvider></AuthProvider>;
}

export default App;
