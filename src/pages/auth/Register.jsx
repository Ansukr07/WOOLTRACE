import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Box, Store, ShieldCheck, Warehouse, Truck, Combine, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const ROLES = [
  { id: 'FARMER', label: 'FARMER', desc: 'Produce and sell wool', icon: <Box size={24} /> },
  { id: 'SELLER', label: 'SELLER / BUYER', desc: 'Buy, sell and trade wool', icon: <Store size={24} /> },
  { id: 'QUALITY_INSPECTOR', label: 'QUALITY INSPECTOR', desc: 'Inspect and certify wool', icon: <ShieldCheck size={24} /> },
  { id: 'WAREHOUSE', label: 'WAREHOUSE PARTNER', desc: 'Store and manage wool', icon: <Warehouse size={24} /> },
  { id: 'TRANSPORT', label: 'TRANSPORT PARTNER', desc: 'Transport wool batches', icon: <Truck size={24} /> },
  { id: 'PROCESSING', label: 'PROCESSING PARTNER', desc: 'Process wool', icon: <Combine size={24} /> },
  { id: 'EDUCATOR', label: 'EDUCATOR', desc: 'Provide training resources', icon: <BookOpen size={24} /> }
];

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    preferredLanguage: 'en'
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    const result = await register({ ...formData, role: selectedRole });
    if (result.success) {
      alert('Registration successful! Please sign in.');
      navigate('/login');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container" style={{maxWidth: '600px'}}>
        <div className="login-header">
          <div className="logo">WOOL<span>TRACE</span></div>
          <h2>Create Account</h2>
          <p>Join the WoolTrace ecosystem.</p>
        </div>

        {step === 1 ? (
          <div>
            <h3 style={{marginBottom: '16px', textAlign: 'center'}}>What do you use WoolTrace for?</h3>
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
              <input 
                type="password" 
                required 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
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
