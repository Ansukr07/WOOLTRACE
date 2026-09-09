import React, { createContext, useContext, useState, useEffect } from 'react';
import WoolCloudLoader from '../components/WoolCloudLoader';
import { applyPageLanguage, getSavedLanguage, saveLanguage } from '../utils/languagePreference';

const AuthContext = createContext();
const normalizeRole = (role) => role === 'PROCESSING_UNIT' ? 'SELLER' : role;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Local fallback profiles. The API is the primary source of authentication.
const DEMO_USERS = {
  'farmer@khetsetu.in': {
    id: 'FARMER-01',
    name: 'Rajesh Gowda',
    email: 'farmer@khetsetu.in',
    mobile: '9845012345',
    role: 'FARMER',
    state: 'Karnataka',
    preferredLanguage: 'en'
  },
  'buyer@khetsetu.in': {
    id: 'SELLER-01',
    name: 'Anand Kumar',
    email: 'buyer@khetsetu.in',
    mobile: '9845098765',
    role: 'SELLER',
    state: 'Karnataka',
    preferredLanguage: 'en'
  },
  'quality@khetsetu.in': {
    id: 'INS-01',
    name: 'Suresh Verma',
    email: 'quality@khetsetu.in',
    mobile: '9811223344',
    role: 'QUALITY_INSPECTOR',
    state: 'Karnataka',
    preferredLanguage: 'en'
  },
  'storage@khetsetu.in': {
    id: 'WH-01',
    name: 'Mysuru Produce Storage Centre',
    email: 'storage@khetsetu.in',
    mobile: '9855667788',
    role: 'WAREHOUSE',
    state: 'Karnataka',
    preferredLanguage: 'en'
  },
  'logistics@khetsetu.in': {
    id: 'TR-01',
    name: 'Rapid Farm Logistics',
    email: 'logistics@khetsetu.in',
    mobile: '9877889900',
    role: 'TRANSPORT',
    state: 'Karnataka',
    preferredLanguage: 'en'
  },
  'facilitator@khetsetu.in': {
    id: 'EDU-01',
    name: 'KhetSetu Market Facilitator',
    email: 'facilitator@khetsetu.in',
    mobile: '9800011122',
    role: 'EDUCATOR',
    state: 'All India',
    preferredLanguage: 'en'
  },
  'processor@khetsetu.in': { id: 'BUYER-02', name: 'Kota Agro Foods', email: 'processor@khetsetu.in', mobile: '9866778899', role: 'SELLER', state: 'Karnataka', preferredLanguage: 'en' }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('khetsetu_user') || localStorage.getItem('wooltrace_user');
      const parsed = stored ? JSON.parse(stored) : null;
      return parsed ? { ...parsed, role: normalizeRole(parsed.role) } : null;
    } catch (e) {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [loadingText, setLoadingText] = useState('Authenticating KhetSetu session...');

  useEffect(() => {
    if (user) {
      localStorage.setItem('khetsetu_user', JSON.stringify(user));
      
      applyPageLanguage(user.preferredLanguage || 'en');
    } else {
      localStorage.removeItem('khetsetu_user');
    }
  }, [user]);

  const login = async (identifier, password) => {
    setIsLoading(true);
    setLoadingText('Authenticating KhetSetu credentials...');
    const cleanId = (identifier || '').trim().toLowerCase();
    const accountLanguage = getSavedLanguage(cleanId, 'en');

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
          data.user.preferredLanguage = accountLanguage || data.user.preferredLanguage || 'en';
          setUser({ ...data.user, role: normalizeRole(data.user.role) });
          setTimeout(() => setIsLoading(false), 400);
          return { success: true, user: { ...data.user, role: normalizeRole(data.user.role) } };
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
          const userObj = { id: found.id, name: found.name, email: found.email, role: normalizeRole(found.role), preferredLanguage: accountLanguage || found.preferredLanguage || 'en' };
          setUser(userObj);
          setTimeout(() => setIsLoading(false), 400);
          return { success: true, user: userObj };
        } else {
          setIsLoading(false);
          return { success: false, message: 'Incorrect password.' };
        }
      }

      if (DEMO_USERS[cleanId]) {
        const demoUser = { ...DEMO_USERS[cleanId], preferredLanguage: accountLanguage };
        setUser(demoUser);
        setTimeout(() => setIsLoading(false), 400);
        return { success: true, user: demoUser };
      }

      if (cleanId.endsWith('@khetsetu.in')) {
        let role = 'FARMER';
        if (cleanId.includes('seller')) role = 'SELLER';
        if (cleanId.includes('inspector') || cleanId.includes('quality')) role = 'QUALITY_INSPECTOR';
        if (cleanId.includes('warehouse') || cleanId.includes('storage')) role = 'WAREHOUSE';
        if (cleanId.includes('transport') || cleanId.includes('logistics')) role = 'TRANSPORT';
        if (cleanId.includes('processing') || cleanId.includes('processor')) role = 'SELLER';
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
      if (cleanId.includes('warehouse') || cleanId.includes('storage')) inferredRole = 'WAREHOUSE';
      else if (cleanId.includes('inspector') || cleanId.includes('qa') || cleanId.includes('quality')) inferredRole = 'QUALITY_INSPECTOR';
      else if (cleanId.includes('seller') || cleanId.includes('buyer')) inferredRole = 'SELLER';
      else if (cleanId.includes('transport') || cleanId.includes('logistics')) inferredRole = 'TRANSPORT';
      else if (cleanId.includes('processing') || cleanId.includes('processor')) inferredRole = 'SELLER';
      else if (cleanId.includes('educator') || cleanId.includes('teacher')) inferredRole = 'EDUCATOR';

      const fallbackUser = {
        id: `USER-${Date.now().toString().slice(-4)}`,
        name: cleanId.split('@')[0].toUpperCase(),
        email: cleanId.includes('@') ? cleanId : `${cleanId}@khetsetu.in`,
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
    setLoadingText('Creating KhetSetu market profile...');
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
          setUser({ ...data.user, role: normalizeRole(data.user.role) });
          setTimeout(() => setIsLoading(false), 400);
          return { success: true, user: { ...data.user, role: normalizeRole(data.user.role) } };
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
    setLoadingText('Logging out of KhetSetu...');
    setTimeout(() => {
      setUser(null);
      localStorage.removeItem('khetsetu_user');
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

  const updatePreferredLanguage = (language) => {
    if (!user) return;
    saveLanguage(user.email || user.mobile || user.id, language);
    applyPageLanguage(language);
    setUser({ ...user, preferredLanguage: language });
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
      updatePreferredLanguage,
      hasRole
    }}>
      {(isLoading || isLoggingOut) && (
        <WoolCloudLoader 
          text={isLoggingOut ? 'Logging out of KhetSetu...' : loadingText} 
          fullScreen={true} 
        />
      )}
      {children}
    </AuthContext.Provider>
  );
};
