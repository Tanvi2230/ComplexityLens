import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSaved, unsaveAnalysis } from '../services/api';
import { useAuth } from '../context/AuthContext';

const COMPLEXITY_COLORS = {
  'O(1)': '#00c853', 'O(log n)': '#64dd17', 'O(n)': '#ffd600',
  'O(n log n)': '#ff6d00', 'O(n²)': '#dd2c00', 'O(2ⁿ)': '#6200ea',
};

const LANGUAGE_ICONS = {
  python: '🐍', javascript: '⚡', typescript: '🔷', java: '☕',
  cpp: '⚙️', c: '🔧', go: '🐹', rust: '🦀', kotlin: '🟣', ruby: '💎',
};

function SavedPage() {
  const { user }              = useAuth();
  const navigate              = useNavigate();
  const [saved, setSaved]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    const fetch = async () => {
      try {
        const res = await getSaved();
        if (res.success) setSaved(res.data);
      } finally { setLoading(false); }
    };
    fetch();
  }, [user, navigate]);

  const handleUnsave = async (analysisId) => {
    try {
      await unsaveAnalysis(analysisId);
      setSaved(prev => prev.filter(s => s.analysisId !== analysisId));
      // Remove from local state without re-fetching
    } catch (err) {
      console.error('Unsave failed:', err);
    }
  };

  if (loading) return <div className="loading-container" style={{ height: '100vh' }}><div className="spinner"></div></div>;

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <Link to="/" className="auth-logo" style={{ textDecoration: 'none', fontSize: '1.4rem' }}>🔍 ComplexityLens</Link>
        <nav style={{ display: 'flex', gap: '12px' }}>
          <Link to="/dashboard" className="nav-btn btn-green">🏠 Dashboard</Link>
          <Link to="/profile" className="nav-btn btn-teal">👤 Profile</Link>
          <Link to="/" className="nav-btn btn-blue">🔍 Analyzer</Link>
        </nav>
      </header>

      <main className="dashboard-main">
        <h2 className="results-title" style={{ marginBottom: '24px' }}>🔖 Saved Analyses</h2>

        {saved.length === 0 ? (
          <div className="empty-state">
            <p style={{ fontSize: '2rem' }}>🔖</p>
            <p style={{ marginTop: '12px', marginBottom: '16px' }}>No saved analyses yet</p>
            <p style={{ fontSize: '0.9rem', color: '#8b949e' }}>After analyzing code, click the bookmark icon to save it here</p>
            <Link to="/" className="analyze-btn" style={{ display: 'inline-block', width: 'auto', padding: '10px 24px', textDecoration: 'none', marginTop: '16px' }}>
              Start Analyzing →
            </Link>
          </div>
        ) : (
          <div className="saved-grid">
            {saved.map(item => (
              <div key={item.id} className="saved-card">

                {/* Header */}
                <div className="saved-card-header">
                  <span
                    className="history-badge"
                    style={{ backgroundColor: COMPLEXITY_COLORS[item.analysis.complexity] || '#444' }}
                  >
                    {item.analysis.complexity}
                  </span>
                  <span style={{ color: '#8b949e', fontSize: '0.82rem' }}>
                    {LANGUAGE_ICONS[item.analysis.language]} {item.analysis.language}
                  </span>
                  <button
                    className="unsave-btn"
                    onClick={() => handleUnsave(item.analysisId)}
                    title="Remove from saved"
                  >
                    🗑️
                  </button>
                </div>

                {/* Note */}
                {item.note && (
                  <div className="saved-note">📝 {item.note}</div>
                )}

                {/* Code preview */}
                <pre className="history-code">
                  {item.analysis.code?.substring(0, 150)}...
                </pre>

                {/* Space complexity */}
                <div style={{ fontSize: '0.8rem', color: '#8b949e', marginBottom: '8px' }}>
                  Space: {item.analysis.spaceComplexity}
                </div>

                {/* Date */}
                <p className="history-date">
                  Saved {new Date(item.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </p>

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default SavedPage;
