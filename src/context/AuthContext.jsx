import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('wooltrace_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('wooltrace_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('wooltrace_user');
    }
  }, [user]);

  const login = async (identifier, password) => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 600));
    
    // DEMO LOGIC: Detect role based on email or password for SIH demo
    let role = 'FARMER';
    let name = 'Demo Farmer';
    let id = 'FARMER-01';
    
    const lowerIdentifier = identifier.toLowerCase();
    
    if (lowerIdentifier.includes('seller') || lowerIdentifier.includes('buyer')) {
      role = 'SELLER';
      name = 'Himalayan Wool Co.';
      id = 'SELLER-01';
    } else if (lowerIdentifier.includes('inspector') || lowerIdentifier.includes('qa')) {
      role = 'QUALITY_INSPECTOR';
      name = 'QA Officer Ramesh';
      id = 'QA-01';
    } else if (lowerIdentifier.includes('warehouse')) {
      role = 'WAREHOUSE';
      name = 'Central Storage Hub';
      id = 'WH-01';
    } else if (lowerIdentifier.includes('transport')) {
      role = 'TRANSPORT';
      name = 'Express Logistics';
      id = 'TR-01';
    } else if (lowerIdentifier.includes('processing')) {
      role = 'PROCESSING';
      name = 'ABC Textiles Mill';
      id = 'PR-01';
    } else if (lowerIdentifier.includes('educator')) {
      role = 'EDUCATOR';
      name = 'Dr. Sharma';
      id = 'ED-01';
    }

    const userData = {
      id,
      name,
      email: lowerIdentifier,
      role,
      verified: true,
      location: 'Karnataka, India'
    };
    
    setUser(userData);
    setIsLoading(false);
    return { success: true, user: userData };
  };

  const register = async (userData) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600));
    
    const newUser = {
      ...userData,
      id: `${userData.role}-${Math.floor(Math.random() * 1000)}`,
      verified: false
    };
    
    setUser(newUser);
    setIsLoading(false);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole) => {
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  const hasRole = (allowedRoles) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      switchRole,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};
