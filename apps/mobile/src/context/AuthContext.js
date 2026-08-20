// apps/mobile/src/context/AuthContext.js
// Auth state: token + user profile, persisted in AsyncStorage
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setToken } from '../api';

const AuthContext = createContext(null);
const USER_KEY = 'alumni_user';

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  const setUser = useCallback((u) => {
    setUserState(u);
    if (u) AsyncStorage.setItem(USER_KEY, JSON.stringify(u)).catch(() => {});
    else AsyncStorage.removeItem(USER_KEY).catch(() => {});
  }, []);

  // Restore session on launch
  useEffect(() => {
    (async () => {
      try {
        const [token, storedUser] = await Promise.all([
          AsyncStorage.getItem('alumni_token'),
          AsyncStorage.getItem(USER_KEY),
        ]);
        if (token) {
          const parsed = storedUser ? JSON.parse(storedUser) : null;
          setUserState(parsed);
          // Refresh the profile in the background
          api.get('/api/users/me').then((d) => setUser(d.user)).catch(() => {});
        }
      } catch (_) {
        // corrupted storage — force login
      } finally {
        setLoading(false);
      }
    })();
  }, [setUser]);

  async function login(email, password) {
    const data = await api.post('/api/auth/login', { email, password });
    await setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function register(payload) {
    const data = await api.post('/api/auth/register', payload);
    await setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    await setToken(null);
    setUser(null);
  }

  async function refreshUser() {
    const data = await api.get('/api/users/me');
    setUser(data.user);
    return data.user;
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
