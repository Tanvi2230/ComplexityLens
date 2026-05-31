import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDashboard } from '../services/api';
import { useAuth } from '../context/AuthContext';

const COMPLEXITY_COLORS = {
  'O(1)': '#00c853', 'O(log n)': '#64dd17', 'O(n)': '#ffd600',
  'O(n log n)': '#ff6d00', 'O(n²)': '#dd2c00', 'O(2ⁿ)': '#6200ea',
};

const LANGUAGE_ICONS = {
  python: '🐍', javascript: '⚡', typescript: '🔷', java: '☕',
  cpp: '⚙️', c: '🔧', go: '🐹', rust: '🦀', kotlin: '🟣', ruby: '💎',
};

function DashboardPage() {
  const { user, logoutUser }  = useAuth();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate              = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    // Redirect to login if not logged in

    const fetchDashboard = async () => {
      try {
        const response = await getDashboard();
        if (response.success) setData(response.data);
      } catch (err) {
        console.error('Dashboard fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user, navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate('/auth');
  };

  if (loading) return (
    <div className="loading-container" style={{ height: '100vh' }}>
      <div className="spinner"></div>
      <p>Loading your dashboard...</p>
    </div>
  );

  return (
    <div className="dashboard-page">

      {/* Header */}
      <header className="dashboard-header">
        <Link to="/" className="auth-logo" style={{ textDecoration: 'none', fontSize: '1.4rem' }}>
          🔍 ComplexityLens
        </Link>
        <nav style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link to="/" className="nav-btn btn-blue">🔍 Analyzer</Link>
          <Link to="/compare" className="nav-btn btn-purple">⚖️ Compare</Link>
          <Link to="/explorer" className="nav-btn btn-orange">🎮 Explorer</Link>
          <Link to="/profile" className="nav-btn btn-teal">👤 Profile</Link>
          <Link to="/saved" className="nav-btn btn-gold">🔖 Saved</Link>
          <button className="nav-btn btn-red" onClick={handleLogout} style={{ cursor: 'pointer' }}>
            🚪 Logout
          </button>
        </nav>
      </header>

      <main className="dashboard-main">

        {/* Welcome section */}
        <div className="dashboard-welcome">
          <div className="welcome-avatar">
            {user?.avatar
              ? <img src={user.avatar} alt="avatar" />
              : <span>{user?.name?.charAt(0).toUpperCase()}</span>
            }
          </div>
          <div>
            <h1 className="welcome-title">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="welcome-sub">Here's your complexity analysis overview</p>
          </div>
        </div>

        {/* Stats cards */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-card-icon">📊</div>
            <div className="stat-card-number">{data?.totalAnalyses || 0}</div>
            <div className="stat-card-label">Total Analyses</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon">🔖</div>
            <div className="stat-card-number">{data?.savedCount || 0}</div>
            <div className="stat-card-label">Saved Analyses</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon">🏷️</div>
            <div className="stat-card-number" style={{ fontSize: '1.4rem' }}>
              {data?.topComplexity || 'N/A'}
            </div>
            <div className="stat-card-label">Top Complexity</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon">💻</div>
            <div className="stat-card-number" style={{ fontSize: '1.4rem', textTransform: 'capitalize' }}>
              {LANGUAGE_ICONS[data?.topLanguage]} {data?.topLanguage || 'N/A'}
            </div>
            <div className="stat-card-label">Favourite Language</div>
          </div>
        </div>

        <div className="dashboard-grid">

          {/* Recent analyses */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3>🕐 Recent Analyses</h3>
              <Link to="/history" className="card-link">View all →</Link>
            </div>
            {!data?.recentAnalyses?.length ? (
              <div className="dashboard-empty">
                <p>No analyses yet!</p>
                <Link to="/" className="analyze-btn" style={{ display: 'inline-block', width: 'auto', padding: '8px 20px', textDecoration: 'none', marginTop: '8px' }}>
                  Start Analyzing
                </Link>
              </div>
            ) : (
              <div className="recent-list">
                {data.recentAnalyses.map(item => (
                  <div key={item.id} className="recent-item">
                    <div
                      className="recent-complexity"
                      style={{ backgroundColor: COMPLEXITY_COLORS[item.complexity] || '#444' }}
                    >
                      {item.complexity}
                    </div>
                    <div className="recent-info">
                      <span className="recent-lang">{LANGUAGE_ICONS[item.language]} {item.language}</span>
                      <pre className="recent-preview">{item.code?.substring(0, 50)}...</pre>
                    </div>
                    <span className="recent-date">
                      {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Complexity breakdown */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3>📈 Complexity Breakdown</h3>
            </div>
            {!data?.complexityCounts?.length ? (
              <div className="dashboard-empty"><p>Run some analyses to see your breakdown!</p></div>
            ) : (
              <div className="breakdown-list">
                {data.complexityCounts.map(item => {
                  const total = data.complexityCounts.reduce((s, c) => s + c._count.complexity, 0);
                  const pct = total ? Math.round((item._count.complexity / total) * 100) : 0;
                  return (
                    <div key={item.complexity} className="breakdown-row">
                      <span className="breakdown-badge" style={{ backgroundColor: COMPLEXITY_COLORS[item.complexity] || '#444' }}>
                        {item.complexity}
                      </span>
                      <div className="lb-bar-container">
                        <div className="lb-bar" style={{ width: `${pct}%`, backgroundColor: COMPLEXITY_COLORS[item.complexity] || '#444' }} />
                      </div>
                      <span className="breakdown-pct">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Quick actions */}
        <div className="dashboard-actions">
          <h3 style={{ color: '#8b949e', marginBottom: '16px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quick Actions</h3>
          <div className="quick-actions-grid">
            <Link to="/" className="quick-action btn-green">
              <span>🔍</span>
              <span>Analyze Code</span>
            </Link>
            <Link to="/compare" className="quick-action btn-purple">
              <span>⚖️</span>
              <span>Compare Algorithms</span>
            </Link>
            <Link to="/explorer" className="quick-action btn-orange">
              <span>🎮</span>
              <span>Complexity Explorer</span>
            </Link>
            <Link to="/saved" className="quick-action btn-gold">
              <span>🔖</span>
              <span>Saved Analyses</span>
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}

export default DashboardPage;
