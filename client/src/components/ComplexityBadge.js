// ComplexityBadge.js — Shows the complexity result as a colored badge
// Example: O(n²) shown in red, O(n log n) in orange, O(1) in green

import React from 'react';

// ─── COLOR MAP ────────────────────────────────────────────────────────────────

const complexityColors = {
  'O(1)':        { bg: '#00c853', text: '#fff', label: 'Constant' },
  'O(log n)':    { bg: '#64dd17', text: '#fff', label: 'Logarithmic' },
  'O(n)':        { bg: '#ffd600', text: '#000', label: 'Linear' },
  'O(n log n)':  { bg: '#ff6d00', text: '#fff', label: 'Linearithmic' },
  'O(n²)':       { bg: '#dd2c00', text: '#fff', label: 'Quadratic' },
  'O(2ⁿ)':       { bg: '#6200ea', text: '#fff', label: 'Exponential' },
};
// Each complexity has:
//   bg    → background color of the badge
//   text  → text color (white on dark, black on light)
//   label → human readable name shown below the badge

function ComplexityBadge({ complexity, spaceComplexity }) {
  // Props:
  //   complexity      → "O(n²)" etc. from our backend
  //   spaceComplexity → "O(1)" etc. from our backend

  const colorInfo = complexityColors[complexity] || {
    bg: '#455a64',
    text: '#fff',
    label: 'Unknown'
  };
  // Get color for this complexity
  // If complexity not in our map, use grey as fallback

  return (
    <div className="badge-container">

      {/* TIME COMPLEXITY BADGE */}
      <div className="badge-section">
        <p className="badge-label">Time Complexity</p>
        <div
          className="complexity-badge"
          style={{ backgroundColor: colorInfo.bg, color: colorInfo.text }}
          // Inline styles for dynamic colors based on complexity
        >
          <span className="badge-complexity">{complexity}</span>
          {/* Shows "O(n²)" */}

          <span className="badge-name">{colorInfo.label}</span>
          {/* Shows "Quadratic" */}
        </div>
      </div>

      {/* SPACE COMPLEXITY BADGE */}
      <div className="badge-section">
        <p className="badge-label">Space Complexity</p>
        <div
          className="complexity-badge"
          style={{
            backgroundColor: complexityColors[spaceComplexity]?.bg || '#455a64',
            color: complexityColors[spaceComplexity]?.text || '#fff'
          }}
          // Optional chaining (?.) safely accesses nested property
          // If spaceComplexity not in map, falls back to grey
        >
          <span className="badge-complexity">{spaceComplexity}</span>
          <span className="badge-name">
            {complexityColors[spaceComplexity]?.label || 'Unknown'}
          </span>
        </div>
      </div>

    </div>
  );
}

export default ComplexityBadge;
