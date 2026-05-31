// AuthContext.js — Global state for authentication
// Context allows ANY component to access the logged-in user
// without passing props through every level of the component tree

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from '../services/api';

// ─── CREATE CONTEXT ───────────────────────────────────────────────────────────

const AuthContext = createContext(null);
// Creates a "container" that holds the auth state
// Any component wrapped in AuthProvider can read from this container

// ─── AUTH PROVIDER ────────────────────────────────────────────────────────────

export function AuthProvider({ children }) {
  // This component PROVIDES auth state to all children
  // Wrap the entire app in this so every page has access

  const [user, setUser]       = useState(null);
  // user → the logged-in user object { id, name, email, avatar }
  // null = not logged in

  const [loading, setLoading] = useState(true);
  // loading → true while we check if user is already logged in
  // Prevents flickering between logged-in and logged-out state

  // ── Check if already logged in on app start ──
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      // Check if a token exists from a previous session

      if (token) {
        try {
          const response = await getProfile();
          // Verify the token is still valid by calling the profile endpoint
          if (response.success) {
            setUser(response.data);
            // Restore the logged-in state
          }
        } catch {
          localStorage.removeItem('token');
          // Token is invalid/expired — clear it
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // ── Login function ──
  const loginUser = (userData, token) => {
    localStorage.setItem('token', token);
    // Store token in localStorage — persists across browser refreshes
    setUser(userData);
    // Update global user state → all components re-render with new user
  };

  // ── Logout function ──
  const logoutUser = () => {
    localStorage.removeItem('token');
    // Remove token from browser
    setUser(null);
    // Clear user state → all components re-render as logged-out
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser, setUser }}>
      {/* value → what we share with all children */}
      {/* Any child can call useAuth() to get: user, loading, loginUser, logoutUser */}
      {children}
    </AuthContext.Provider>
  );
}

// ─── HOOK ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  // Custom hook — makes using AuthContext easier
  // Instead of: const auth = useContext(AuthContext)
  // We write:   const { user, loginUser } = useAuth()
  return useContext(AuthContext);
}
