// ProtectedRoute.js — Guards pages that require login
// If user is not logged in → redirect to /auth
// If user IS logged in → show the page normally

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // While checking if user is logged in (on app start)
  // show a loading screen — prevents flickering
  if (loading) {
    return (
      <div className="loading-container" style={{ height: '100vh' }}>
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // If not logged in → redirect to login page
  if (!user) {
    return <Navigate to="/auth" replace />;
    // replace → replaces history entry so back button doesn't loop
  }

  // If logged in → render the actual page
  return children;
}

export default ProtectedRoute;
