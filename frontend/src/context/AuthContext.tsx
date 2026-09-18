'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { api } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('ember_token');
    const savedUser = localStorage.getItem('ember_user');

    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error('Failed to parse user', e);
        }
      }
      // Refresh from API
      api.getUserProfile()
        .then((res) => {
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('ember_user', JSON.stringify(res.data));
          }
        })
        .catch(() => {
          // Token expired or invalid
          localStorage.removeItem('ember_token');
          localStorage.removeItem('ember_user');
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('ember_token', newToken);
    localStorage.setItem('ember_user', JSON.stringify(newUser));
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.error('Logout error', e);
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('ember_token');
    localStorage.removeItem('ember_user');
  };

  const refreshUser = async () => {
    try {
      const res = await api.getUserProfile();
      if (res.success && res.data) {
        setUser(res.data);
        localStorage.setItem('ember_user', JSON.stringify(res.data));
      }
    } catch (e) {
      console.error('Failed to refresh user', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
