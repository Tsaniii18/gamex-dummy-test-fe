import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getProfile } from '../api/users';
import { refreshToken, login as loginAPI, logout as logoutAPI, register as registerAPI } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await refreshToken(); 
        const accessToken = response.data.accessToken;
        localStorage.setItem('accessToken', accessToken);
        const decoded = jwtDecode(accessToken);
        const res = await getProfile(decoded.userId);
        setUser(res.data);
      } catch (error) {
        console.warn('User not logged in or token expired');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginAPI({ email, password });
      const accessToken = response.data.accessToken;
      localStorage.setItem('accessToken', accessToken);
      const decoded = jwtDecode(accessToken);
      const res = await getProfile(decoded.userId);
      setUser(res.data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.msg || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await logoutAPI(); // pakai cookie, ga perlu token lagi
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  const register = async (username, email, password) => {
    try {
      await registerAPI({ username, email, password });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.msg || 'Registration failed' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
