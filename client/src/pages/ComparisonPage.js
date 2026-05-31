// ComparisonPage.js — Compare two algorithms side by side
// Both run at 7 input sizes, both curves appear on ONE chart
// Users can instantly see which algorithm is faster

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import CodeEditor from '../components/CodeEditor';
import LoadingSteps from '../components/LoadingSteps';
import { LANGUAGE_INFO } from '../components/ExampleLibrary';
import { analyzeCode } from '../services/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const COLORS = {
  A: { border: '#58a6ff', bg: 'rgba(88,166,255,0.1)' },
  B: { border: '#ff7b72', bg: 'rgba(255,123,114,0.1)' },
};

// eslint-disable-next-line no-unused-vars
const normalize = (values) => {
  const max = Math.max(...values);
  if (max === 0) return values.map(() => 0);
  return values.map(v => v / max);
};

function ComparisonPage() {
  const [language, setLanguage] = useState('python');
  const [codeA, setCodeA] = useState('');
  const [codeB, setCodeB] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resultA, setResultA] = useState(null);
  const [resultB, setResultB] = useState(null);

  const handleCompare = async () => {
    if (!codeA.trim() || !codeB.trim()) {
      setError('Please paste code in both editors!');
      return;
    }
    setLoading(true);
    setError(null);
    setResultA(null);
    setResultB(null);

    try {
      // Run both analyses in parallel using Promise.all
      // Promise.all waits for BOTH to finish before continuing
      const [responseA, responseB] = await Promise.all([
        analyzeCode(codeA, language),
        analyzeCode(codeB, language),
      ]);

      if (responseA.success) setResultA(responseA.data);
      if (responseB.success) setResultB(responseB.data);

    } catch (err) {
      setError(err.response?.data?.error || 'Comparison failed. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  // Build combined chart data when both results are ready
  const buildChartData = () => {
    if (!resultA || !resultB) return null;

    const ns = resultA.timings.map(t => t.n);
    const msA = resultA.timings.map(t => t.ms);
    const msB = resultB.timings.map(t => t.ms);

    // Normalize together so they're on the same scale
    const allValues = [...msA, ...msB];
    const max = Math.max(...allValues);
    const normA = msA.map(v => max ? v / max : 0);
    const normB = msB.map(v => max ? v / max : 0);

    return {
      labels: ns.map(n => `n=${n}`),
      datasets: [
        {
          label: `Algorithm A — ${resultA.complexity}`,
          data: normA,
          borderColor: COLORS.A.border,
          backgroundColor: COLORS.A.bg,
          borderWidth: 3,
          pointRadius: 6,
          tension: 0.4,
        },
        {
          label: `Algorithm B — ${resultB.complexity}`,
          data: normB,
          borderColor: COLORS.B.border,
          backgroundColor: COLORS.B.bg,
          borderWidth: 3,
          pointRadius: 6,
          tension: 0.4,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#e0e0e0', font: { size: 13 } } },
      title: {
        display: true,
        text: 'Algorithm A vs Algorithm B — Runtime Comparison',
        color: '#ffffff',
        font: { size: 16, weight: 'bold' },
      },
    },
    scales: {
      x: { ticks: { color: '#b0bec5' }, grid: { color: 'rgba(255,255,255,0.1)' } },
      y: { ticks: { color: '#b0bec5' }, grid: { color: 'rgba(255,255,255,0.1)' },
           title: { display: true, text: 'Normalized Time', color: '#b0bec5' } },
    },
  };

  const chartData = buildChartData();

  // Determine winner
  const getWinner = () => {
    if (!resultA || !resultB) return null;
    const totalA = resultA.timings.reduce((s, t) => s + t.ms, 0);
    const totalB = resultB.timings.reduce((s, t) => s + t.ms, 0);
    if (totalA < totalB) return 'A';
    if (totalB < totalA) return 'B';
    return 'tie';
  };

  const winner = getWinner();

  return (
    <div className="comparison-page">
      <header className="hero-header">
        <div className="hero-content" style={{ paddingBottom: '16px' }}>
          <h1 className="hero-title">Algorithm <span className="hero-accent">Comparison</span></h1>
          <p className="hero-subtitle">Paste two algorithms — see both curves on one chart — instantly see which is faster</p>
        </div>
        <nav className="hero-nav">
          <Link to="/dashboard" className="nav-btn btn-green">🏠 Dashboard</Link>
          <Link to="/" className="nav-btn btn-blue">🔍 Analyzer</Link>
          <Link to="/explorer" className="nav-btn btn-orange">🎮 Explorer</Link>
          <Link to="/leaderboard" className="nav-btn btn-gold">🏆 Leaderboard</Link>
          <Link to="/history" className="nav-btn btn-teal">📊 History</Link>
        </nav>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>

        {/* Language Selector */}
        <div className="language-grid" style={{ marginBottom: '24px' }}>
          {Object.entries(LANGUAGE_INFO).map(([lang, info]) => (
            <button
              key={lang}
              className={`lang-tile ${language === lang ? 'active' : ''}`}
              onClick={() => setLanguage(lang)}
            >
              <span className="lang-tile-icon">{info.icon}</span>
              <span className="lang-tile-label">{info.label}</span>
            </button>
          ))}
        </div>

        {/* Two editors side by side */}
        <div className="comparison-grid">
          <div className="comparison-editor">
            <div className="comparison-label algo-a">Algorithm A</div>
            <CodeEditor code={codeA} language={language} onChange={setCodeA} />
          </div>
          <div className="comparison-editor">
            <div className="comparison-label algo-b">Algorithm B</div>
            <CodeEditor code={codeB} language={language} onChange={setCodeB} />
          </div>
        </div>

        <button
          className="analyze-btn"
          onClick={handleCompare}
          disabled={loading}
          style={{ marginTop: '16px' }}
        >
          {loading ? '⏳ Running Both Algorithms...' : '⚖️ Compare Algorithms'}
        </button>

        {error && <div className="error-message" style={{ marginTop: '12px' }}>❌ {error}</div>}
        {loading && <LoadingSteps />}

        {/* Results */}
        {resultA && resultB && (
          <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Winner Banner */}
            <div className={`winner-banner ${winner}`}>
              {winner === 'tie' ? (
                <span>🤝 It's a Tie! Both have similar performance</span>
              ) : (
                <span>
                  🏆 Algorithm {winner} wins!
                  {winner === 'A' ? ` (${resultA.complexity})` : ` (${resultB.complexity})`} is faster
                </span>
              )}
            </div>

            {/* Comparison badges */}
            <div className="comparison-results">
              <div className="comparison-result-card algo-a-card">
                <div className="comparison-result-label">Algorithm A</div>
                <div className="comparison-complexity">{resultA.complexity}</div>
                <div className="comparison-space">Space: {resultA.spaceComplexity}</div>
              </div>
              <div className="vs-divider">VS</div>
              <div className="comparison-result-card algo-b-card">
                <div className="comparison-result-label">Algorithm B</div>
                <div className="comparison-complexity">{resultB.complexity}</div>
                <div className="comparison-space">Space: {resultB.spaceComplexity}</div>
              </div>
            </div>

            {/* Combined Chart */}
            {chartData && (
              <div className="chart-container">
                <Line data={chartData} options={chartOptions} />
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}

export default ComparisonPage;
