import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Globe, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const DEMO_BUTTONS = [
  { label: 'Farmer', email: 'farmer@wooltrace.com', role: 'FARMER', color: '#166534', bg: '#DCFCE7' },
  { label: 'Warehouse Partner', email: 'warehouse@wooltrace.com', role: 'WAREHOUSE', color: '#0B120D', bg: '#DDFF86' },
  { label: 'Seller / Buyer', email: 'seller@wooltrace.com', role: 'SELLER', color: '#0B120D', bg: '#EDEDCE' },
  { label: 'Quality Inspector', email: 'inspector@wooltrace.com', role: 'QUALITY_INSPECTOR', color: '#0B120D', bg: '#BED5E5' },
  { label: 'Transport Operator', email: 'transport@wooltrace.com', role: 'TRANSPORT', color: '#92400E', bg: '#FEF3C7' },
  { label: 'Processing Partner', email: 'processing@wooltrace.com', role: 'PROCESSING_UNIT', color: '#1E3A8A', bg: '#DBEAFE' },
];

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [identifier, setIdentifier] = useState('farmer@wooltrace.com');
  const [password, setPassword] = useState('password123');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState('English');
  const languages = ['English', 'Hindi', 'Kannada', 'Tamil', 'Telugu', 'Marathi', 'Punjabi'];

  const executeLogin = async (idToUse, passToUse) => {
    setErrorMessage('');
    const result = await login(idToUse, passToUse);
    if (result.success) {
      if (result.user.role === 'FARMER') navigate('/farmer');
      else if (result.user.role === 'SELLER') navigate('/seller');
      else if (result.user.role === 'QUALITY_INSPECTOR') navigate('/inspector');
      else if (result.user.role === 'WAREHOUSE') navigate('/warehouse');
      else if (result.user.role === 'TRANSPORT') navigate('/transport');
      else if (result.user.role === 'PROCESSING_UNIT') navigate('/processing');
      else navigate('/farmer');
    } else {
      setErrorMessage(result.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    await executeLogin(identifier, password);
  };

  const handleQuickDemoClick = async (demo) => {
    setIdentifier(demo.email);
    setPassword('password123');
    await executeLogin(demo.email, 'password123');
  };

  return (
    <div className="login-page">
      {/* Top Left Home Back Button */}
      <Link to="/" className="top-left-brand-link">
        <ArrowLeft size={16} />
        <span>WOOL<span className="logo-badge">TRACE</span> Home</span>
      </Link>

      <div className="login-container">
        <div className="language-selector">
          <Globe size={18} />
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            {languages.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
          </select>
        </div>

        <div className="login-header">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="logo">WOOL<span>TRACE</span></div>
          </Link>
          <h2 style={{marginTop: '8px', fontSize: '20px'}}>One ecosystem. Every role connected.</h2>
          <p>Sign in to your WoolTrace account.</p>
        </div>

        {errorMessage && (
          <div style={{
            backgroundColor: '#FEE2E2',
            color: '#991B1B',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email / Mobile Number</label>
            <input 
              type="text" 
              placeholder="e.g. farmer@wooltrace.com" 
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Enter your password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required 
                style={{ paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#666',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px'
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" defaultChecked />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'SIGNING IN...' : 'LOGIN'} <ArrowRight size={18} />
          </button>
          
          <div className="form-footer">
            <p>Don't have an account? <Link to="/register" className="link-btn">CREATE ACCOUNT</Link></p>
          </div>
          
          {/* Quick 1-Click Demo Login Panel */}
          <div style={{ marginTop: '28px', padding: '18px', backgroundColor: '#F8F8F3', borderRadius: '12px', border: '1px solid rgba(11, 18, 13, 0.08)' }}>
            <div style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: '#777', marginBottom: '10px' }}>
              ⚡ 1-Click Demo Logins:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {DEMO_BUTTONS.map((demo) => (
                <button
                  key={demo.email}
                  type="button"
                  onClick={() => handleQuickDemoClick(demo)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: demo.bg,
                    color: demo.color,
                    border: '1px solid rgba(11, 18, 13, 0.10)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    transition: 'transform 0.15s'
                  }}
                >
                  <span>{demo.label}</span>
                  <span style={{ fontSize: '11px', fontWeight: '600', opacity: 0.8 }}>{demo.email} →</span>
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
