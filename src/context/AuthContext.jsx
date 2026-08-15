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
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsLoading(false);
        return { success: true, user: data.user };
      } else {
        const data = await response.json().catch(() => ({}));
        if (data.message) {
          setIsLoading(false);
          return { success: false, message: data.message };
        }
      }
    } catch (error) {
      console.warn('Backend serverless API unavailable. Using local Login fallback:', error);
    }

    // Local fallback for dev/prototype mode
    try {
      const usersList = JSON.parse(localStorage.getItem('wt_registered_users') || '[]');
      const found = usersList.find(u => 
        u.email.toLowerCase() === identifier.toLowerCase() || 
        (u.mobile && u.mobile === identifier)
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

      if (identifier.endsWith('@wooltrace.com')) {
        let role = 'FARMER';
        if (identifier.includes('seller')) role = 'SELLER';
        if (identifier.includes('inspector')) role = 'QUALITY_INSPECTOR';
        if (identifier.includes('warehouse')) role = 'WAREHOUSE';
        if (identifier.includes('transport')) role = 'TRANSPORT';
        if (identifier.includes('processing')) role = 'PROCESSING_UNIT';

        const demoUser = {
          id: `DEMO-${Date.now()}`,
          name: identifier.split('@')[0].toUpperCase(),
          email: identifier,
          role: role,
          preferredLanguage: 'en'
        };
        setUser(demoUser);
        setIsLoading(false);
        return { success: true, user: demoUser };
      }

      setIsLoading(false);
      return { success: false, message: 'Account not found. Please register first.' };
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
        setUser(data.user);
        setIsLoading(false);
        return { success: true, user: data.user };
      } else {
        const data = await response.json().catch(() => ({}));
        if (data.message) {
          setIsLoading(false);
          return { success: false, message: data.message };
        }
      }
    } catch (error) {
      console.warn('Backend serverless API unavailable. Using local Auth fallback:', error);
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
