import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHistory } from '../services/api';

const complexityColors = {
  'O(1)':       '#00c853',
  'O(log n)':   '#64dd17',
  'O(n)':       '#ffd600',
  'O(n log n)': '#ff6d00',
  'O(n²)':      '#dd2c00',
  'O(2ⁿ)':      '#6200ea',
};

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getHistory();
        if (response.success) setHistory(response.data);
      } catch (err) {
        setError('Could not load history. Is the server running?');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="history-page">

      <header className="history-header">
        <span className="history-logo">🔍 ComplexityLens</span>
        <nav style={{ display: 'flex', gap: '12px' }}>
          <Link to="/dashboard" className="nav-btn btn-green">🏠 Dashboard</Link>
          <Link to="/" className="nav-btn btn-blue">🔍 Analyzer</Link>
        </nav>
      </header>

      <main className="history-main">
        <h2 className="results-title">Analysis History</h2>

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading history...</p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {!loading && !error && history.length === 0 && (
          <div className="empty-state">
            <p style={{ fontSize: '2rem' }}>📭</p>
            <p style={{ marginTop: '12px' }}>No analyses yet. Go analyze some code!</p>
            <Link to="/" className="back-btn">Start Analyzing →</Link>
          </div>
        )}

        {!loading && history.length > 0 && (
          <div className="history-grid">
            {history.map((item) => (
              <div key={item.id} className="history-card">
                <div
                  className="history-badge"
                  style={{ backgroundColor: complexityColors[item.complexity] || '#455a64' }}
                >
                  {item.complexity}
                </div>
                <span className="history-language">
                  {item.language === 'python' ? '🐍' : '⚡'} {item.language}
                </span>
                <pre className="history-code">
                  {item.code.substring(0, 120)}...
                </pre>
                <p className="history-date">
                  {new Date(item.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
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

export default HistoryPage;
