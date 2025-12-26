import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthChange, logout } from '../services/auth';
import { showError } from '../components/common/Toast';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        // TODO: Fetch user data from backend
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
          role: 'employee', // TODO: Get from backend
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      showError('Logout failed');
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isHR: user?.role === 'hr',
    isEmployee: user?.role === 'employee',
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};