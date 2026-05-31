import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStats } from '../services/api';

const COMPLEXITY_COLORS = {
  'O(1)': '#00c853', 'O(log n)': '#64dd17', 'O(n)': '#ffd600',
  'O(n log n)': '#ff6d00', 'O(n²)': '#dd2c00', 'O(2ⁿ)': '#6200ea',
};

const LANGUAGE_ICONS = {
  python: '🐍', javascript: '⚡', typescript: '🔷', java: '☕',
  cpp: '⚙️', c: '🔧', go: '🐹', rust: '🦀', kotlin: '🟣', ruby: '💎',
};

function LeaderboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getStats();
        if (response.success) setStats(response.data);
      } catch (err) {
        setError('Could not load stats. Is the server running?');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="leaderboard-page">
      <header className="hero-header">
        <div className="hero-content" style={{ paddingBottom: '16px' }}>
          <h1 className="hero-title">🏆 <span className="hero-accent">Leaderboard</span></h1>
          <p className="hero-subtitle">Community-wide analysis statistics — most common complexities, languages, and recent analyses</p>
        </div>
        <nav className="hero-nav">
          <Link to="/dashboard" className="nav-btn btn-green">🏠 Dashboard</Link>
          <Link to="/" className="nav-btn btn-blue">🔍 Analyzer</Link>
          <Link to="/compare" className="nav-btn btn-purple">⚖️ Compare</Link>
          <Link to="/explorer" className="nav-btn btn-orange">🎮 Explorer</Link>
          <Link to="/history" className="nav-btn btn-teal">📊 History</Link>
        </nav>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading leaderboard...</p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {stats && (
          <>
            {/* Total analyses hero number */}
            <div className="leaderboard-hero">
              <div className="lb-hero-number">{stats.totalAnalyses}</div>
              <div className="lb-hero-label">Total Analyses Run</div>
            </div>

            <div className="leaderboard-grid">

              {/* Most Common Complexities */}
              <div className="lb-card">
                <h3 className="lb-card-title">📊 Most Common Complexities</h3>
                {stats.complexityCounts.length === 0 ? (
                  <p style={{ color: '#8b949e' }}>No data yet — start analyzing!</p>
                ) : (
                  <div className="lb-list">
                    {stats.complexityCounts.map((item, i) => {
                      const total = stats.complexityCounts.reduce((s, c) => s + c._count.complexity, 0);
                      const pct = total ? Math.round((item._count.complexity / total) * 100) : 0;
                      return (
                        <div key={item.complexity} className="lb-row">
                          <span className="lb-rank">#{i + 1}</span>
                          <span className="lb-badge" style={{ backgroundColor: COMPLEXITY_COLORS[item.complexity] || '#444' }}>
                            {item.complexity}
                          </span>
                          <div className="lb-bar-container">
                            <div className="lb-bar" style={{ width: `${pct}%`, backgroundColor: COMPLEXITY_COLORS[item.complexity] || '#444' }} />
                          </div>
                          <span className="lb-count">{item._count.complexity}x</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Most Used Languages */}
              <div className="lb-card">
                <h3 className="lb-card-title">💻 Most Used Languages</h3>
                {stats.languageCounts.length === 0 ? (
                  <p style={{ color: '#8b949e' }}>No data yet — start analyzing!</p>
                ) : (
                  <div className="lb-list">
                    {stats.languageCounts.map((item, i) => {
                      const total = stats.languageCounts.reduce((s, c) => s + c._count.language, 0);
                      const pct = total ? Math.round((item._count.language / total) * 100) : 0;
                      return (
                        <div key={item.language} className="lb-row">
                          <span className="lb-rank">#{i + 1}</span>
                          <span className="lb-lang-icon">{LANGUAGE_ICONS[item.language] || '💻'}</span>
                          <span className="lb-lang-name">{item.language}</span>
                          <div className="lb-bar-container">
                            <div className="lb-bar" style={{ width: `${pct}%`, backgroundColor: '#58a6ff' }} />
                          </div>
                          <span className="lb-count">{item._count.language}x</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* Recent Analyses */}
            <div className="lb-card" style={{ marginTop: '24px' }}>
              <h3 className="lb-card-title">🕐 Recent Analyses</h3>
              {stats.recentAnalyses.length === 0 ? (
                <p style={{ color: '#8b949e' }}>No analyses yet!</p>
              ) : (
                <div className="recent-grid">
                  {stats.recentAnalyses.map(item => (
                    <div key={item.id} className="recent-card">
                      <div className="recent-top">
                        <span className="lb-badge" style={{ backgroundColor: COMPLEXITY_COLORS[item.complexity] || '#444' }}>
                          {item.complexity}
                        </span>
                        <span style={{ color: '#8b949e', fontSize: '0.8rem' }}>
                          {LANGUAGE_ICONS[item.language]} {item.language}
                        </span>
                      </div>
                      <pre className="history-code">{item.code?.substring(0, 80)}...</pre>
                      <p className="history-date">
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default LeaderboardPage;
