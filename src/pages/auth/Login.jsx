import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Globe, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getRoleHome } from '../../utils/roleRoutes';
import './Login.css';
import { applyPageLanguage, getSavedLanguage, saveLanguage, SUPPORTED_LANGUAGES } from '../../utils/languagePreference';

const DEMO_BUTTONS = [
  { label: 'Farmer / FPO', email: 'farmer@khetsetu.in', role: 'FARMER', color: '#166534', bg: '#DCFCE7' },
  { label: 'Buyer', email: 'buyer@khetsetu.in', role: 'SELLER', color: '#0B120D', bg: '#EDEDCE' },
  { label: 'Quality Partner', email: 'quality@khetsetu.in', role: 'QUALITY_INSPECTOR', color: '#0B120D', bg: '#BED5E5' },
  { label: 'Storage Partner', email: 'storage@khetsetu.in', role: 'WAREHOUSE', color: '#0B120D', bg: '#DDFF86' },
  { label: 'Logistics Partner', email: 'logistics@khetsetu.in', role: 'TRANSPORT', color: '#92400E', bg: '#FEF3C7' },
];

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [identifier, setIdentifier] = useState('farmer@khetsetu.in');
  const [password, setPassword] = useState('password123');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState(() => getSavedLanguage('farmer@khetsetu.in', localStorage.getItem('khetsetu_language_guest') || 'en'));

  useEffect(() => {
    setLanguage(getSavedLanguage(identifier, localStorage.getItem('khetsetu_language_guest') || 'en'));
  }, [identifier]);

  const handleLanguageChange = (nextLanguage) => {
    setLanguage(nextLanguage);
    saveLanguage(identifier, nextLanguage);
    applyPageLanguage(nextLanguage);
  };

  const executeLogin = async (idToUse, passToUse) => {
    setErrorMessage('');
    const result = await login(idToUse, passToUse);
    if (result.success) {
      navigate(getRoleHome(result.user?.role));
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
        <span>Home</span>
      </Link>

      <div className="login-container">
        <div className="language-selector">
          <Globe size={18} />
          <select value={language} onChange={(e) => handleLanguageChange(e.target.value)}>
            {SUPPORTED_LANGUAGES.map((lang) => <option key={lang.code} value={lang.code}>{lang.label}</option>)}
          </select>
        </div>

        <div className="login-header">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="logo">KHET<span>SETU</span></div>
          </Link>
          <h2 style={{marginTop: '8px', fontSize: '20px'}}>One market. Every decision connected.</h2>
          <p>Sign in to your KhetSetu market workspace.</p>
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
              placeholder="e.g. farmer@khetsetu.in" 
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
          
        </form>
      </div>

      <aside className="workspace-previews">
        <span className="workspace-previews-label">Preview a workspace</span>
        <div className="workspace-preview-links">
          {DEMO_BUTTONS.map((demo) => (
            <button key={demo.email} type="button" onClick={() => handleQuickDemoClick(demo)}>
              {demo.label}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default Login;
