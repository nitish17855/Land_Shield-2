import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInUser, signUpUser, googleAuthenticate, fetchCurrentProfile } from '../services/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('landshield_token') || null;
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('landshield_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Validate existing token with server on initial application mount
  useEffect(() => {
    async function verifyExistingSession() {
      const savedToken = localStorage.getItem('landshield_token');
      if (savedToken) {
        try {
          const res = await fetchCurrentProfile(savedToken);
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('landshield_user', JSON.stringify(res.user));
          } else {
            // Token is expired or invalid
            localStorage.removeItem('landshield_token');
            localStorage.removeItem('landshield_user');
            setToken(null);
            setUser(null);
          }
        } catch {
          // In case of network error, keep existing user for offline resilience
        }
      }
      setLoading(false);
    }

    verifyExistingSession();
  }, []);

  const saveAuthSession = (authToken, userData) => {
    setToken(authToken);
    setUser(userData);
    localStorage.setItem('landshield_token', authToken);
    localStorage.setItem('landshield_user', JSON.stringify(userData));
  };

  /**
   * Real Email & Password Login
   */
  const login = async (email, password) => {
    const res = await signInUser({ email, password });
    if (res.success && res.token && res.user) {
      saveAuthSession(res.token, res.user);
      return { success: true, user: res.user };
    }
    return { success: false, error: res.error || 'Failed to sign in.' };
  };

  /**
   * Real Email & Password Registration
   */
  const register = async (name, email, password) => {
    const res = await signUpUser({ name, email, password });
    if (res.success && res.token && res.user) {
      saveAuthSession(res.token, res.user);
      return { success: true, user: res.user };
    }
    return { success: false, error: res.error || 'Failed to create account.' };
  };

  /**
   * Real Google OAuth Login / Registration
   */
  const googleLogin = async (credential) => {
    const res = await googleAuthenticate(credential);
    if (res.success && res.token && res.user) {
      saveAuthSession(res.token, res.user);
      return { success: true, user: res.user };
    }
    return { success: false, error: res.error || 'Google authentication failed.' };
  };

  /**
   * Quick Demo Login for instant preview
   */
  const quickDemoLogin = () => {
    const demoUser = {
      id: 999,
      name: 'Nitish Tripathi (Demo)',
      email: 'nitishtripathi547@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop',
      role: 'demo_admin',
      authProvider: 'demo',
    };
    saveAuthSession('demo-jwt-token-preview', demoUser);
    return demoUser;
  };

  /**
   * Logout user
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('landshield_token');
    localStorage.removeItem('landshield_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        login,
        register,
        googleLogin,
        quickDemoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
