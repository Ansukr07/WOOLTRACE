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
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        
        // Set Google Translate Cookie
        if (data.user.preferredLanguage && data.user.preferredLanguage !== 'en') {
          document.cookie = `googtrans=/en/${data.user.preferredLanguage}; path=/`;
          setTimeout(() => {
            window.location.reload(); // Reload to apply translation fully
          }, 100);
        } else {
          document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }

        setIsLoading(false);
        return { success: true, user: data.user };
      } else {
        setIsLoading(false);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return { success: false, message: 'An error occurred during login' };
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

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setIsLoading(false);
        return { success: true, user: data.user };
      } else {
        setIsLoading(false);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return { success: false, message: 'An error occurred during registration' };
    }
  };

  const logout = () => {
    setUser(null);
    const host = window.location.hostname;
    // Aggressively wipe the cookie from all possible domains and paths
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${host};`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${host};`;
    
    window.location.reload(); // Reload to remove translations
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
