import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Pre-configured Demo Accounts for instant, frictionless evaluation
const DEMO_USERS = {
  'farmer@wooltrace.com': {
    id: 'FARMER-01',
    name: 'Rajesh Gowda',
    email: 'farmer@wooltrace.com',
    mobile: '9876543210',
    role: 'FARMER',
    state: 'Karnataka',
    preferredLanguage: 'en'
  },
  'warehouse@wooltrace.com': {
    id: 'WH-USER-01',
    name: 'K. Somanna',
    email: 'warehouse@wooltrace.com',
    mobile: '9822334455',
    role: 'WAREHOUSE',
    state: 'Karnataka',
    preferredLanguage: 'en'
  },
  'seller@wooltrace.com': {
    id: 'SELLER-01',
    name: 'Himalayan Wool Co.',
    email: 'seller@wooltrace.com',
    mobile: '9811223344',
    role: 'SELLER',
    state: 'Himachal Pradesh',
    preferredLanguage: 'en'
  },
  'inspector@wooltrace.com': {
    id: 'QA-01',
    name: 'Dr. Anita Desai',
    email: 'inspector@wooltrace.com',
    mobile: '9844556677',
    role: 'QUALITY_INSPECTOR',
    state: 'Karnataka',
    preferredLanguage: 'en'
  },
  'transport@wooltrace.com': {
    id: 'TR-01',
    name: 'Rapid Farm Logistics',
    email: 'transport@wooltrace.com',
    mobile: '9877889900',
    role: 'TRANSPORT',
    state: 'Karnataka',
    preferredLanguage: 'en'
  },
  'processing@wooltrace.com': {
    id: 'PR-01',
    name: 'Bikaner Wool Mill',
    email: 'processing@wooltrace.com',
    mobile: '9866778899',
    role: 'PROCESSING_UNIT',
    state: 'Rajasthan',
    preferredLanguage: 'en'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('wooltrace_user');
      return stored ? JSON.parse(stored) : DEMO_USERS['farmer@wooltrace.com'];
    } catch (e) {
      return DEMO_USERS['farmer@wooltrace.com'];
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('wooltrace_user', JSON.stringify(user));
      
      // Dynamically inject Google Translate script only for non-English users
      if (user.preferredLanguage && user.preferredLanguage !== 'en') {
        document.cookie = `googtrans=/en/${user.preferredLanguage}; path=/`;
        if (!document.getElementById('google-translate-script')) {
          window.googleTranslateElementInit = function() {
            new window.google.translate.TranslateElement({pageLanguage: 'en', autoDisplay: false}, 'google_translate_element');
          };
          const script = document.createElement('script');
          script.id = 'google-translate-script';
          script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
          document.body.appendChild(script);
        }
      }
    } else {
      localStorage.removeItem('wooltrace_user');
    }
  }, [user]);

  const login = async (identifier, password) => {
    setIsLoading(true);
    const cleanId = (identifier || '').trim().toLowerCase();

    try {
      // First attempt backend API request
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier: cleanId, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
          setIsLoading(false);
          return { success: true, user: data.user };
        }
      }
    } catch (error) {
      console.warn('API login fetch bypassed, attempting demo/client authentication:', error);
    }

    // Local fallback for dev/prototype mode
    try {
      const usersList = JSON.parse(localStorage.getItem('wt_registered_users') || '[]');
      const found = usersList.find(u => 
        u.email.toLowerCase() === cleanId || 
        (u.mobile && u.mobile === cleanId)
      );

      if (found) {
        if (found.password === password) {
          const userObj = { id: found.id, name: found.name, email: found.email, role: found.role, preferredLanguage: found.preferredLanguage };
          setUser(userObj);
          setIsLoading(false);
          return { success: true, user: userObj };
        } else {
          setIsLoading(false);
          return { success: false, message: 'Incorrect password.' };
        }
      }

      // Check Demo Accounts mapping
      if (DEMO_USERS[cleanId]) {
        const demoUser = DEMO_USERS[cleanId];
        setUser(demoUser);
        setIsLoading(false);
        return { success: true, user: demoUser };
      }

      // Wildcard mapping for *@wooltrace.com
      if (cleanId.endsWith('@wooltrace.com')) {
        let role = 'FARMER';
        if (cleanId.includes('seller')) role = 'SELLER';
        if (cleanId.includes('inspector')) role = 'QUALITY_INSPECTOR';
        if (cleanId.includes('warehouse')) role = 'WAREHOUSE';
        if (cleanId.includes('transport')) role = 'TRANSPORT';
        if (cleanId.includes('processing')) role = 'PROCESSING_UNIT';

        const demoUser = {
          id: `DEMO-${Date.now()}`,
          name: cleanId.split('@')[0].toUpperCase(),
          email: cleanId,
          role: role,
          preferredLanguage: 'en'
        };
        setUser(demoUser);
        setIsLoading(false);
        return { success: true, user: demoUser };
      }

      // Role-inferred fallback if using custom username like "farmer", "warehouse", "inspector", "seller"
      let inferredRole = 'FARMER';
      if (cleanId.includes('warehouse')) inferredRole = 'WAREHOUSE';
      else if (cleanId.includes('inspector') || cleanId.includes('qa')) inferredRole = 'QUALITY_INSPECTOR';
      else if (cleanId.includes('seller') || cleanId.includes('buyer')) inferredRole = 'SELLER';
      else if (cleanId.includes('transport')) inferredRole = 'TRANSPORT';
      else if (cleanId.includes('processing')) inferredRole = 'PROCESSING_UNIT';

      const fallbackUser = {
        id: `USER-${Date.now().toString().slice(-4)}`,
        name: cleanId.split('@')[0].toUpperCase(),
        email: cleanId.includes('@') ? cleanId : `${cleanId}@wooltrace.com`,
        role: inferredRole,
        state: 'Karnataka',
        preferredLanguage: 'en'
      };

      setUser(fallbackUser);
      setIsLoading(false);
      return { success: true, user: fallbackUser };
    } catch (e) {
      setIsLoading(false);
      return { success: false, message: 'Login error' };
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
          setIsLoading(false);
          return { success: true, user: data.user };
        }
      }
    } catch (error) {
      console.warn('API register fetch bypassed, creating local user profile:', error);
    }

    // Local fallback for dev/prototype mode
    try {
      const { name, email, password, role, preferredLanguage } = userData;
      const mockUser = {
        id: `USR-${Date.now()}`,
        name: name || 'User',
        email: email,
        role: role || 'FARMER',
        preferredLanguage: preferredLanguage || 'en'
      };

      const usersList = JSON.parse(localStorage.getItem('wt_registered_users') || '[]');
      const existing = usersList.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        setIsLoading(false);
        return { success: false, message: 'User with this email already exists' };
      }

      usersList.push({ ...mockUser, password });
      localStorage.setItem('wt_registered_users', JSON.stringify(usersList));
      setUser(mockUser);
      setIsLoading(false);
      return { success: true, user: mockUser };
    } catch (e) {
      setIsLoading(false);
      return { success: false, message: 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    const host = window.location.hostname;
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${host};`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${host};`;
    window.location.reload();
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
