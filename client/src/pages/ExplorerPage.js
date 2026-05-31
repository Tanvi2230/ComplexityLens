// ExplorerPage.js — Interactive Big O Explorer
// Drag the slider to change n → see how each complexity grows in real time
// Pure frontend math — no backend needed
// Best for learning and demonstrating Big O to others

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// ─── COMPLEXITY DEFINITIONS ───────────────────────────────────────────────────

const COMPLEXITIES = [
  { label: 'O(1)',       fn: () => 1,                  color: '#00c853', enabled: true },
  { label: 'O(log n)',   fn: n => Math.log2(n),         color: '#64dd17', enabled: true },
  { label: 'O(n)',       fn: n => n,                    color: '#ffd600', enabled: true },
  { label: 'O(n log n)', fn: n => n * Math.log2(n),     color: '#ff6d00', enabled: true },
  { label: 'O(n²)',      fn: n => n * n,                color: '#dd2c00', enabled: true },
  { label: 'O(2ⁿ)',      fn: n => Math.pow(2, Math.min(n, 20)), color: '#6200ea', enabled: false },
];

// ─── FACTS ABOUT EACH COMPLEXITY ─────────────────────────────────────────────

const FACTS = {
  'O(1)':       'No matter how big your input, it always takes the same time. Example: getting the first element of an array.',
  'O(log n)':   'Every time n doubles, only 1 step is added. For n=1,000,000 it only takes ~20 steps!',
  'O(n)':       'Time grows directly with input. 2x input = 2x time. Very common and usually acceptable.',
  'O(n log n)': 'Best possible for comparison-based sorting. Merge sort and Quick sort live here.',
  'O(n²)':      'Nested loops territory. 2x input = 4x time. Avoid for large inputs.',
  'O(2ⁿ)':      'Catastrophic growth. n=30 means over 1 BILLION operations. Only practical for tiny inputs.',
};

function ExplorerPage() {
  const [maxN, setMaxN] = useState(100);
  // maxN → the current slider value (n = 1 to maxN)

  const [enabled, setEnabled] = useState(
    Object.fromEntries(COMPLEXITIES.map(c => [c.label, c.enabled]))
  );
  // enabled → which complexity lines are shown
  // Object.fromEntries converts [['O(1)', true], ['O(n)', true]...] to { 'O(1)': true, ... }

  const [hoveredComplexity, setHoveredComplexity] = useState(null);

  // Generate n values from 1 to maxN
  const nValues = Array.from({ length: Math.min(maxN, 50) }, (_, i) =>
    Math.round(1 + (i * (maxN - 1)) / (Math.min(maxN, 50) - 1))
  );
  // We limit to 50 points for performance — evenly spaced from 1 to maxN

  // Build chart datasets
  const datasets = COMPLEXITIES
    .filter(c => enabled[c.label])
    .map(c => {
      const values = nValues.map(n => c.fn(n));
      return {
        label: c.label,
        data: values,
        borderColor: c.color,
        backgroundColor: c.color + '20',
        borderWidth: hoveredComplexity === c.label ? 4 : 2,
        pointRadius: hoveredComplexity === c.label ? 4 : 0,
        tension: 0.4,
      };
    });

  const chartData = {
    labels: nValues.map(n => `n=${n}`),
    datasets,
  };

  const chartOptions = {
    responsive: true,
    animation: { duration: 200 },
    // Fast animation so slider feels responsive
    plugins: {
      legend: { position: 'top', labels: { color: '#e0e0e0', font: { size: 12 } } },
      title: {
        display: true,
        text: `Big O Growth Comparison — n = 1 to ${maxN}`,
        color: '#ffffff',
        font: { size: 16, weight: 'bold' },
      },
    },
    scales: {
      x: {
        ticks: { color: '#b0bec5', maxTicksLimit: 8 },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
      y: {
        ticks: { color: '#b0bec5' },
        grid: { color: 'rgba(255,255,255,0.05)' },
        title: { display: true, text: 'Operations', color: '#b0bec5' },
      },
    },
  };

  // Calculate actual operations at current maxN for comparison table
  const operationsAtN = COMPLEXITIES.map(c => ({
    label: c.label,
    color: c.color,
    ops: c.fn(maxN),
  }));

  return (
    <div className="explorer-page">
      <header className="hero-header">
        <div className="hero-content" style={{ paddingBottom: '16px' }}>
          <h1 className="hero-title">Complexity <span className="hero-accent">Explorer</span></h1>
          <p className="hero-subtitle">
            Drag the slider to change n — watch how each complexity class grows in real time
          </p>
        </div>
        <nav className="hero-nav">
          <Link to="/dashboard" className="nav-btn btn-green">🏠 Dashboard</Link>
          <Link to="/" className="nav-btn btn-blue">🔍 Analyzer</Link>
          <Link to="/compare" className="nav-btn btn-purple">⚖️ Compare</Link>
          <Link to="/leaderboard" className="nav-btn btn-gold">🏆 Leaderboard</Link>
          <Link to="/history" className="nav-btn btn-teal">📊 History</Link>
        </nav>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>

        {/* Slider */}
        <div className="explorer-slider-section">
          <div className="slider-label">
            <span>Input Size (n)</span>
            <span className="slider-value">n = {maxN}</span>
          </div>
          <input
            type="range"
            min="10"
            max="1000"
            step="10"
            value={maxN}
            onChange={e => setMaxN(Number(e.target.value))}
            className="explorer-slider"
          />
          <div className="slider-ticks">
            <span>10</span>
            <span>250</span>
            <span>500</span>
            <span>750</span>
            <span>1000</span>
          </div>
        </div>

        {/* Toggle buttons */}
        <div className="complexity-toggles">
          {COMPLEXITIES.map(c => (
            <button
              key={c.label}
              className={`complexity-toggle ${enabled[c.label] ? 'on' : 'off'}`}
              style={{ '--toggle-color': c.color }}
              onClick={() => setEnabled(prev => ({ ...prev, [c.label]: !prev[c.label] }))}
              onMouseEnter={() => setHoveredComplexity(c.label)}
              onMouseLeave={() => setHoveredComplexity(null)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="chart-container" style={{ marginBottom: '24px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Operations comparison table */}
        <div className="operations-table">
          <h3 style={{ color: '#e6edf3', marginBottom: '16px' }}>
            Operations at n = {maxN}
          </h3>
          <div className="ops-grid">
            {operationsAtN.map(item => (
              <div key={item.label} className="ops-card">
                <div className="ops-notation" style={{ color: item.color }}>
                  {item.label}
                </div>
                <div className="ops-value">
                  {item.ops > 1e12
                    ? '∞ (too large)'
                    : item.ops > 1e9
                    ? `${(item.ops / 1e9).toFixed(1)}B ops`
                    : item.ops > 1e6
                    ? `${(item.ops / 1e6).toFixed(1)}M ops`
                    : item.ops > 1e3
                    ? `${(item.ops / 1e3).toFixed(1)}K ops`
                    : `${Math.round(item.ops)} ops`
                  }
                </div>
                {/* Show fact when hovered */}
                {hoveredComplexity === item.label && (
                  <div className="ops-fact">{FACTS[item.label]}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Hover tip */}
        {hoveredComplexity && FACTS[hoveredComplexity] && (
          <div className="explorer-fact">
            <strong style={{ color: COMPLEXITIES.find(c => c.label === hoveredComplexity)?.color }}>
              {hoveredComplexity}:
            </strong>{' '}
            {FACTS[hoveredComplexity]}
          </div>
        )}

      </main>
    </div>
  );
}

export default ExplorerPage;
