import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('landshield_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (userData) => {
    const userObj = userData || {
      name: 'Nitish Tripathi',
      email: 'nitishtripathi54@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop'
    };
    setUser(userObj);
    localStorage.setItem('landshield_user', JSON.stringify(userObj));
    return userObj;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('landshield_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
