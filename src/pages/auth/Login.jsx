import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Globe, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState('English');
  const languages = ['English', 'Hindi', 'Kannada', 'Tamil', 'Telugu', 'Marathi', 'Punjabi'];

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const result = await login(identifier, password);
    if (result.success) {
      if (result.user.role === 'FARMER') navigate('/farmer');
      else if (result.user.role === 'SELLER') navigate('/seller');
      else if (result.user.role === 'QUALITY_INSPECTOR') navigate('/inspector');
      else if (result.user.role === 'WAREHOUSE') navigate('/warehouse');
      else if (result.user.role === 'TRANSPORT') navigate('/transport');
      else if (result.user.role === 'PROCESSING_UNIT') navigate('/processing');
      else navigate('/');
    } else {
      setErrorMessage(result.message || 'Login failed. Please check your credentials.');
    }
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
              <input type="checkbox" />
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
          
          <div style={{marginTop: '32px', padding: '16px', backgroundColor: '#F8F8F3', borderRadius: '8px', fontSize: '13px', color: '#666'}}>
            <strong>Demo Accounts:</strong><br/>
            farmer@wooltrace.com<br/>
            seller@wooltrace.com<br/>
            inspector@wooltrace.com<br/>
            warehouse@wooltrace.com<br/>
            transport@wooltrace.com<br/>
            processing@wooltrace.com
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
