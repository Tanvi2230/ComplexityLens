import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import AuthPage        from './pages/AuthPage';
import HomePage        from './pages/HomePage';
import DashboardPage   from './pages/DashboardPage';
import ProfilePage     from './pages/ProfilePage';
import SavedPage       from './pages/SavedPage';
import HistoryPage     from './pages/HistoryPage';
import ComparisonPage  from './pages/ComparisonPage';
import ExplorerPage    from './pages/ExplorerPage';
import LeaderboardPage from './pages/LeaderboardPage';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ── PUBLIC ROUTE — only page without login ── */}
          <Route path="/auth" element={<AuthPage />} />

          {/* ── ROOT — redirect to dashboard if logged in, else to auth ── */}
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />

          {/* ── ALL PROTECTED ROUTES ── */}
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />

          <Route path="/saved" element={
            <ProtectedRoute><SavedPage /></ProtectedRoute>
          } />

          <Route path="/history" element={
            <ProtectedRoute><HistoryPage /></ProtectedRoute>
          } />

          <Route path="/compare" element={
            <ProtectedRoute><ComparisonPage /></ProtectedRoute>
          } />

          <Route path="/explorer" element={
            <ProtectedRoute><ExplorerPage /></ProtectedRoute>
          } />

          <Route path="/leaderboard" element={
            <ProtectedRoute><LeaderboardPage /></ProtectedRoute>
          } />

          {/* ── FALLBACK — any unknown URL goes to auth ── */}
          <Route path="*" element={<Navigate to="/auth" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
