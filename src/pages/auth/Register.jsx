import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Box, Store, ShieldCheck, Warehouse, Truck, BookOpen, AlertCircle, CheckCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getRoleHome } from '../../utils/roleRoutes';
import './Login.css';

const ROLES = [
  { id: 'FARMER', label: 'Farmer / FPO', desc: 'Discover markets and sell produce', icon: <Box size={24} /> },
  { id: 'SELLER', label: 'Buyer', desc: 'Source produce at scale', icon: <Store size={24} /> },
  { id: 'QUALITY_INSPECTOR', label: 'Quality partner', desc: 'Grade produce and issue certificates', icon: <ShieldCheck size={24} /> },
  { id: 'WAREHOUSE', label: 'Storage partner', desc: 'Offer storage capacity', icon: <Warehouse size={24} /> },
  { id: 'TRANSPORT', label: 'Logistics partner', desc: 'Coordinate farm-gate collection', icon: <Truck size={24} /> },
  { id: 'EDUCATOR', label: 'Market facilitator', desc: 'Support farmer market readiness', icon: <BookOpen size={24} /> }
];

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    preferredLanguage: 'en'
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!selectedRole) {
      setErrorMessage('Please select a role before registering.');
      setStep(1);
      return;
    }

    const result = await register({ ...formData, role: selectedRole });
    
    if (result.success) {
      setSuccessMessage('Account created successfully! Redirecting to your dashboard...');
      setTimeout(() => {
        navigate(getRoleHome(result.user?.role));
      }, 1000);
    } else {
      setErrorMessage(result.message || 'Registration failed. Please check your information.');
    }
  };

  return (
    <div className="login-page">
      {/* Top Left Home Back Button */}
      <Link to="/" className="top-left-brand-link">
        <ArrowLeft size={16} />
        <span>KHET<span className="logo-badge">SETU</span> Home</span>
      </Link>

      <div className="login-container" style={{maxWidth: '600px'}}>
        <div className="login-header">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="logo">KHET<span>SETU</span></div>
          </Link>
          <h2>Create Account</h2>
          <p>Join the KhetSetu market network.</p>
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

        {successMessage && (
          <div style={{
            backgroundColor: '#DCFCE7',
            color: '#166534',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle size={18} style={{ flexShrink: 0 }} />
            <span>{successMessage}</span>
          </div>
        )}

        {step === 1 ? (
          <div>
            <h3 style={{marginBottom: '16px', textAlign: 'center'}}>How will you use KhetSetu?</h3>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px'}}>
              {ROLES.map(role => (
                <div 
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  style={{
                    border: `2px solid ${selectedRole === role.id ? '#0B120D' : '#E5E5E5'}`,
                    backgroundColor: selectedRole === role.id ? '#F8F8F3' : '#FFFFFF',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{color: selectedRole === role.id ? '#16A34A' : '#666', marginBottom: '8px'}}>
                    {role.icon}
                  </div>
                  <div style={{fontWeight: '700', fontSize: '14px', marginBottom: '4px'}}>{role.label}</div>
                  <div style={{fontSize: '12px', color: '#666'}}>{role.desc}</div>
                </div>
              ))}
            </div>
            
            <button 
              className="btn-primary w-100" 
              disabled={!selectedRole}
              onClick={() => setStep(2)}
            >
              CONTINUE <ArrowRight size={18} />
            </button>
            
            <div className="form-footer" style={{marginTop: '24px'}}>
              <p>Already have an account? <Link to="/login" className="link-btn">SIGN IN</Link></p>
            </div>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleRegister}>
            <div style={{marginBottom: '24px', padding: '12px', backgroundColor: '#F8F8F3', borderRadius: '8px', fontSize: '14px', textAlign: 'center'}}>
              Registering as: <strong>{ROLES.find(r => r.id === selectedRole)?.label}</strong>
              <button type="button" onClick={() => setStep(1)} className="link-btn" style={{marginLeft: '8px'}}>Change</button>
            </div>

            <div className="form-group">
              <label>Full Name / Company Name</label>
              <input 
                type="text" 
                required 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                required 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Preferred Language</label>
              <select
                required
                value={formData.preferredLanguage}
                onChange={e => setFormData({...formData, preferredLanguage: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid #E5E5E5',
                  backgroundColor: '#FFFFFF',
                  fontSize: '15px',
                  color: '#0B120D',
                  outline: 'none'
                }}
              >
                <option value="en">English</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="kn">Kannada (ಕನ್ನಡ)</option>
                <option value="te">Telugu (తెలుగు)</option>
                <option value="mr">Marathi (मराठी)</option>
                <option value="ta">Tamil (தமிழ்)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
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

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'} <ArrowRight size={18} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
