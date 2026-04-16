import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, setCurrentUser, logout as storageLogout, getUsers, addUser, generateId } from '../utils/storage';
import { seedDataIfNeeded } from '../utils/seedData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    seedDataIfNeeded();
    const saved = getCurrentUser();
    if (saved) setUser(saved);
    setLoading(false);
  }, []);

  function login(email, password) {
    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      setCurrentUser(found);
      setUser(found);
      addToast('Welcome back, ' + found.name + '!', 'success');
      return { success: true, user: found };
    }
    return { success: false, error: 'Invalid email or password' };
  }

  function register(userData) {
    const users = getUsers();
    if (users.find(u => u.email === userData.email)) {
      return { success: false, error: 'Email already registered' };
    }
    const newUser = {
      id: generateId(),
      ...userData,
      profileComplete: true,
      verified: userData.role === 'student' ? true : false,
      currentMentees: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    addUser(newUser);
    setCurrentUser(newUser);
    setUser(newUser);
    addToast('Account created successfully!', 'success');
    return { success: true, user: newUser };
  }

  function logout() {
    storageLogout();
    setUser(null);
    addToast('Logged out successfully', 'info');
  }

  function refreshUser() {
    const saved = getCurrentUser();
    if (saved) setUser(saved);
  }

  function addToast(message, type = 'info') {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }

  function removeToast(id) {
    setToasts(prev => prev.filter(t => t.id !== id));
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, toasts, addToast, removeToast }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
