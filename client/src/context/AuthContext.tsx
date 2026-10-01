import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';
import { User } from '../types.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    avatar?: string;
    bio?: string;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('chronicle_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('chronicle_token');
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Validate token on mount
  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('chronicle_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('chronicle_user', JSON.stringify(res.data.user));
          }
        } catch {
          // Token is invalid/expired
          localStorage.removeItem('chronicle_token');
          localStorage.removeItem('chronicle_user');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('chronicle_token', newToken);
      localStorage.setItem('chronicle_user', JSON.stringify(newUser));
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    avatar?: string;
    bio?: string;
  }) => {
    const res = await api.post('/auth/register', data);
    if (res.data.success) {
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('chronicle_token', newToken);
      localStorage.setItem('chronicle_user', JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('chronicle_token');
    localStorage.removeItem('chronicle_user');
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (user) {
      const merged = { ...user, ...updatedUser };
      setUser(merged);
      localStorage.setItem('chronicle_user', JSON.stringify(merged));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
