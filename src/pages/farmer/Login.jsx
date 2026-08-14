import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, ArrowRight } from 'lucide-react';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [language, setLanguage] = useState('English');

  const languages = ['English', 'Hindi', 'Kannada', 'Tamil', 'Telugu', 'Marathi', 'Punjabi'];

  const handleLogin = async (e) => {
    e.preventDefault();
    const identifier = e.target.elements[0].value;
    const password = e.target.elements[1].value;

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('wooltrace_user', JSON.stringify(data.user));
        navigate('/farmer');
      } else {
        const data = await response.json();
        alert(`Login failed: ${data.message}`);
      }
    } catch (error) {
      alert('Network error. Please try again later.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    const name = e.target.elements[0].value;
    const mobile = e.target.elements[1].value;
    const state = e.target.elements[2].value;
    const numberOfSheep = e.target.elements[3].value;
    const woolProduction = e.target.elements[4].value;
    const password = e.target.elements[5].value;

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mobile, state, numberOfSheep, woolProduction, password }),
      });

      if (response.ok) {
        alert('Account created successfully! Please sign in.');
        setIsRegistering(false);
      } else {
        const data = await response.json();
        alert(`Registration failed: ${data.message}`);
      }
    } catch (error) {
      alert('Network error. Please try again later.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        
        {/* Language Selector */}
        <div className="language-selector">
          <Globe size={18} />
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            {languages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="login-header">
          <div className="logo">
            WOOL<span>TRACE</span>
          </div>
          <h2>{isRegistering ? 'Create Farmer Account' : 'Welcome Back'}</h2>
          <p>{isRegistering ? 'Join the WoolTrace network today.' : 'Sign in to manage your wool batches.'}</p>
        </div>

        {!isRegistering ? (
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Mobile Number or Email</label>
              <input type="text" placeholder="Enter your mobile or email" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" required />
            </div>
            
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>

            <button type="submit" className="btn-primary">
              Sign In <ArrowRight size={18} />
            </button>
            
            <div className="form-footer">
              <p>Don't have an account? <button type="button" onClick={() => setIsRegistering(true)} className="link-btn">Register here</button></p>
            </div>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleRegister}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Enter your name" required />
            </div>
            <div className="form-group">
              <label>Mobile Number</label>
              <input type="tel" placeholder="Enter your 10-digit mobile number" required />
            </div>
            <div className="form-group">
              <label>State</label>
              <select required>
                <option value="">Select State</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jammu & Kashmir">Jammu & Kashmir</option>
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Number of Sheep</label>
                <input type="number" placeholder="e.g. 150" required />
              </div>
              <div className="form-group">
                <label>Wool Production (KG)</label>
                <input type="number" placeholder="Approx. yearly" required />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Create a password" required />
            </div>

            <button type="submit" className="btn-primary">
              Create Account <ArrowRight size={18} />
            </button>
            
            <div className="form-footer">
              <p>Already have an account? <button type="button" onClick={() => setIsRegistering(false)} className="link-btn">Sign in</button></p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
