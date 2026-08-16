import React, { createContext, useContext, useState, useEffect } from 'react';
import WoolCloudLoader from '../components/WoolCloudLoader';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Demo Users Mapping
const DEMO_USERS = {
  'farmer@wooltrace.com': {
    id: 'FARMER-01',
    name: 'Rajesh Gowda',
    email: 'farmer@wooltrace.com',
    mobile: '9845012345',
    role: 'FARMER',
    state: 'Karnataka',
    preferredLanguage: 'en'
  },
  'seller@wooltrace.com': {
    id: 'SELLER-01',
    name: 'Anand Kumar',
    email: 'seller@wooltrace.com',
    mobile: '9845098765',
    role: 'SELLER',
    state: 'Karnataka',
    preferredLanguage: 'en'
  },
  'inspector@wooltrace.com': {
    id: 'INS-01',
    name: 'Suresh Verma',
    email: 'inspector@wooltrace.com',
    mobile: '9811223344',
    role: 'QUALITY_INSPECTOR',
    state: 'Karnataka',
    preferredLanguage: 'en'
  },
  'warehouse@wooltrace.com': {
    id: 'WH-01',
    name: 'Mysuru Wool Storage Centre',
    email: 'warehouse@wooltrace.com',
    mobile: '9855667788',
    role: 'WAREHOUSE',
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
  'educator@wooltrace.com': {
    id: 'EDU-01',
    name: 'WoolTrace Educator',
    email: 'educator@wooltrace.com',
    mobile: '9800011122',
    role: 'EDUCATOR',
    state: 'All India',
    preferredLanguage: 'en'
  },
  'processing@wooltrace.com': {
    id: 'PR-01',
    name: 'WoolCraft Processing Centre',
    email: 'processing@wooltrace.com',
    mobile: '9866778899',
    role: 'PROCESSING_UNIT',
    state: 'Karnataka',
    preferredLanguage: 'en'
  }
};

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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [loadingText, setLoadingText] = useState('Authenticating WoolTrace Session...');

  useEffect(() => {
    if (user) {
      localStorage.setItem('wooltrace_user', JSON.stringify(user));
      
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
    setLoadingText('Authenticating WoolTrace Credentials...');
    const cleanId = (identifier || '').trim().toLowerCase();

    try {
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
          setTimeout(() => setIsLoading(false), 400);
          return { success: true, user: data.user };
        }
      }
    } catch (error) {
      console.warn('API login fetch bypassed, attempting demo/client authentication:', error);
    }

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
          setTimeout(() => setIsLoading(false), 400);
          return { success: true, user: userObj };
        } else {
          setIsLoading(false);
          return { success: false, message: 'Incorrect password.' };
        }
      }

      if (DEMO_USERS[cleanId]) {
        const demoUser = DEMO_USERS[cleanId];
        setUser(demoUser);
        setTimeout(() => setIsLoading(false), 400);
        return { success: true, user: demoUser };
      }

      if (cleanId.endsWith('@wooltrace.com')) {
        let role = 'FARMER';
        if (cleanId.includes('seller')) role = 'SELLER';
        if (cleanId.includes('inspector')) role = 'QUALITY_INSPECTOR';
        if (cleanId.includes('warehouse')) role = 'WAREHOUSE';
        if (cleanId.includes('transport')) role = 'TRANSPORT';
        if (cleanId.includes('processing')) role = 'PROCESSING_UNIT';
        if (cleanId.includes('educator') || cleanId.includes('teacher')) role = 'EDUCATOR';

        const demoUser = {
          id: `DEMO-${Date.now()}`,
          name: cleanId.split('@')[0].toUpperCase(),
          email: cleanId,
          role: role,
          preferredLanguage: 'en'
        };
        setUser(demoUser);
        setTimeout(() => setIsLoading(false), 400);
        return { success: true, user: demoUser };
      }

      let inferredRole = 'FARMER';
      if (cleanId.includes('warehouse')) inferredRole = 'WAREHOUSE';
      else if (cleanId.includes('inspector') || cleanId.includes('qa')) inferredRole = 'QUALITY_INSPECTOR';
      else if (cleanId.includes('seller') || cleanId.includes('buyer')) inferredRole = 'SELLER';
      else if (cleanId.includes('transport')) inferredRole = 'TRANSPORT';
      else if (cleanId.includes('processing')) inferredRole = 'PROCESSING_UNIT';
      else if (cleanId.includes('educator') || cleanId.includes('teacher')) inferredRole = 'EDUCATOR';

      const fallbackUser = {
        id: `USER-${Date.now().toString().slice(-4)}`,
        name: cleanId.split('@')[0].toUpperCase(),
        email: cleanId.includes('@') ? cleanId : `${cleanId}@wooltrace.com`,
        role: inferredRole,
        state: 'Karnataka',
        preferredLanguage: 'en'
      };

      setUser(fallbackUser);
      setTimeout(() => setIsLoading(false), 400);
      return { success: true, user: fallbackUser };
    } catch (e) {
      setIsLoading(false);
      return { success: false, message: 'Login error' };
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    setLoadingText('Creating WoolTrace Profile & Digital Identity...');
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
          setTimeout(() => setIsLoading(false), 400);
          return { success: true, user: data.user };
        }
      }
    } catch (error) {
      console.warn('API register fetch bypassed, creating local user profile:', error);
    }

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
      setTimeout(() => setIsLoading(false), 400);
      return { success: true, user: mockUser };
    } catch (e) {
      setIsLoading(false);
      return { success: false, message: 'Registration failed' };
    }
  };

  const logout = () => {
    setIsLoggingOut(true);
    setLoadingText('Logging out of WoolTrace Session...');
    setTimeout(() => {
      setUser(null);
      localStorage.removeItem('wooltrace_user');
      const host = window.location.hostname;
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${host};`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${host};`;
      window.location.href = '/';
    }, 750);
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
      isLoggingOut,
      login,
      register,
      logout,
      switchRole,
      hasRole
    }}>
      {(isLoading || isLoggingOut) && (
        <WoolCloudLoader 
          text={isLoggingOut ? 'Logging Out of WoolTrace Session...' : loadingText} 
          fullScreen={true} 
        />
      )}
      {children}
    </AuthContext.Provider>
  );
};
