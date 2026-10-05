import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import bcrypt from 'bcryptjs';
import { api } from '../services/api';

const AuthContext = createContext();

const DEFAULT_DEMO_USER = {
  id: 'usr_demo_123',
  name: 'Alex Morgan',
  email: 'alex@finora.io',
  password: bcrypt.hashSync('password123', 10),
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  currency: 'USD',
  createdAt: '2026-01-15T08:00:00.000Z',
  role: 'Pro Member'
};

export const AuthProvider = ({ children }) => {
  // Registered users list in localStorage
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('finora_users_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved users', e);
      }
    }
    return [DEFAULT_DEMO_USER];
  });

  // Logged-in user state in localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('finora_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    return null; // Prompt login on first visit
  });

  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Persist users DB
  useEffect(() => {
    localStorage.setItem('finora_users_db', JSON.stringify(users));
  }, [users]);

  // Persist logged-in user
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('finora_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('finora_current_user');
    }
  }, [currentUser]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore if confetti fails
    }
  };

  const login = async (email, password, rememberMe = true) => {
    setAuthError('');
    setAuthSuccess('');

    const cleanEmail = email.trim().toLowerCase();

    // Try MongoDB backend login first
    try {
      const res = await api.loginUser({ email: cleanEmail, password });
      if (res && res.user) {
        const mongoUser = {
          id: res.user.id || `usr_${Date.now()}`,
          name: res.user.name,
          email: res.user.email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(res.user.name)}`,
          currency: res.user.currency || 'USD',
          role: 'Standard Member'
        };
        setCurrentUser(mongoUser);
        setAuthSuccess(`Welcome back, ${mongoUser.name}!`);
        triggerConfetti();
        return true;
      }
    } catch (err) {
      console.log('MongoDB login fallback to local:', err.message);
    }

    // Local fallback check
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      setAuthError('No account found with this email address.');
      return false;
    }

    const isMatch = bcrypt.compareSync(password, user.password) || user.password === password;

    if (!isMatch) {
      setAuthError('Incorrect password. Please try again.');
      return false;
    }

    setCurrentUser(user);
    setAuthSuccess(`Welcome back, ${user.name}!`);
    triggerConfetti();
    return true;
  };

  const signup = async (userData) => {
    setAuthError('');
    setAuthSuccess('');

    const { name, email, password, currency = 'USD' } = userData;
    const cleanEmail = email.trim().toLowerCase();

    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      setAuthError('An account with this email already exists. Please log in.');
      return false;
    }

    let mongoUserId = `usr_${Date.now()}`;

    // Try registering in MongoDB database first to create collection and store document
    try {
      const res = await api.registerUser({ name: name.trim(), email: cleanEmail, password });
      if (res && res.user && res.user.id) {
        mongoUserId = res.user.id;
      }
    } catch (err) {
      console.log('MongoDB registration fallback to local storage:', err.message);
    }

    // Hash password before saving to local users DB
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = {
      id: mongoUserId,
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      currency: currency,
      createdAt: new Date().toISOString(),
      role: 'Standard Member'
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setAuthSuccess(`Account created successfully! Please sign in with your password.`);
    triggerConfetti();
    return true;
  };

  const demoLogin = () => {
    setAuthError('');
    setAuthSuccess('');
    setCurrentUser(DEFAULT_DEMO_USER);
    setAuthSuccess('Logged in as Demo User (Alex Morgan)!');
    triggerConfetti();
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthError('');
    setAuthSuccess('');
  };

  const updateProfile = (updatedFields) => {
    if (!currentUser) return false;

    const updatedUser = { ...currentUser, ...updatedFields };
    setCurrentUser(updatedUser);

    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? updatedUser : u))
    );

    setAuthSuccess('Profile updated successfully!');
    return true;
  };

  const resetPassword = (email, newPassword) => {
    setAuthError('');
    setAuthSuccess('');

    const cleanEmail = email.trim().toLowerCase();
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === cleanEmail);

    if (userIndex === -1) {
      setAuthError('No account registered with this email.');
      return false;
    }

    const updatedUsers = [...users];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      password: newPassword
    };

    setUsers(updatedUsers);
    setAuthSuccess('Password reset successfully! You can now log in with your new password.');
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        authError,
        authSuccess,
        setAuthError,
        setAuthSuccess,
        login,
        signup,
        demoLogin,
        logout,
        updateProfile,
        resetPassword,
        DEFAULT_DEMO_USER
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
