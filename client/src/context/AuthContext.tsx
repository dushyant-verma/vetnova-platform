import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { isTokenExpired } from '../lib/axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  refreshToken: () => Promise<string | null>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  const refreshToken = useCallback(async (): Promise<string | null> => {
    try {
      const res = await api.post('/auth/refresh');
      if (res.data?.token) {
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
        if (res.data.user) {
          setUser(res.data.user);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
        return res.data.token;
      }
      return null;
    } catch (e) {
      logout();
      return null;
    }
  }, [logout]);

  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('vetnova-auth-expired', handleAuthExpired);
    return () => window.removeEventListener('vetnova-auth-expired', handleAuthExpired);
  }, []);

  useEffect(() => {
    const verifyInitialSession = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!storedToken || storedToken === 'undefined' || storedToken === 'null' || !storedUser) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
          setIsLoading(false);
          return;
        }

        if (isTokenExpired(storedToken)) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
          setIsLoading(false);
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);

        // Verify session validity with backend /api/auth/me
        try {
          const { data } = await api.get('/auth/me');
          if (data?.user) {
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        } catch (err: any) {
          if (err.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setToken(null);
          }
        }
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyInitialSession();
  }, []);

  const login = (userData: User, jwt: string) => {
    if (!jwt || jwt === 'undefined' || jwt === 'null') return;
    setUser(userData);
    setToken(jwt);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', jwt);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      refreshToken,
      isAuthenticated: !!token && !isTokenExpired(token),
      isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
