// ComplexityGuide.js — Sidebar explaining each Big O complexity
// Helps users understand what each badge means
// Great educational feature that makes the app more complete

import React, { useState } from 'react';

const COMPLEXITIES = [
  {
    notation: 'O(1)',
    name: 'Constant',
    color: '#00c853',
    description: 'Always takes the same time regardless of input size.',
    example: 'Accessing array[0], getting HashMap value',
    growth: 'Does not grow at all',
    emoji: '🚀'
  },
  {
    notation: 'O(log n)',
    name: 'Logarithmic',
    color: '#64dd17',
    description: 'Grows very slowly. Doubles input → adds just 1 step.',
    example: 'Binary search, balanced BST operations',
    growth: 'n=1000 → ~10 steps',
    emoji: '⚡'
  },
  {
    notation: 'O(n)',
    name: 'Linear',
    color: '#ffd600',
    description: 'Grows directly with input size.',
    example: 'Linear search, single loop through array',
    growth: 'n=1000 → 1000 steps',
    emoji: '📈'
  },
  {
    notation: 'O(n log n)',
    name: 'Linearithmic',
    color: '#ff6d00',
    description: 'Slightly worse than linear. Best possible for comparison sorts.',
    example: 'Merge sort, Quick sort, Heap sort',
    growth: 'n=1000 → ~10,000 steps',
    emoji: '📊'
  },
  {
    notation: 'O(n²)',
    name: 'Quadratic',
    color: '#dd2c00',
    description: 'Nested loops. Doubles input → quadruples time.',
    example: 'Bubble sort, Selection sort, nested loops',
    growth: 'n=1000 → 1,000,000 steps',
    emoji: '🐌'
  },
  {
    notation: 'O(2ⁿ)',
    name: 'Exponential',
    color: '#6200ea',
    description: 'Doubles with every +1 to input. Avoid at all costs.',
    example: 'Recursive Fibonacci, solving Towers of Hanoi',
    growth: 'n=30 → 1 billion steps!',
    emoji: '💀'
  },
];

function ComplexityGuide() {
  const [expanded, setExpanded] = useState(null);
  // expanded → which complexity card is open (null = none)

  return (
    <div className="complexity-guide">
      <h3 className="guide-title">📖 Big O Reference Guide</h3>
      <p className="guide-subtitle">Click any complexity to learn more</p>

      <div className="guide-list">
        {COMPLEXITIES.map((item) => (
          <div
            key={item.notation}
            className={`guide-item ${expanded === item.notation ? 'expanded' : ''}`}
            onClick={() => setExpanded(
              expanded === item.notation ? null : item.notation
              // Toggle: if already open, close it; otherwise open it
            )}
          >
            <div className="guide-header">
              <span className="guide-emoji">{item.emoji}</span>
              <span
                className="guide-notation"
                style={{ color: item.color }}
              >
                {item.notation}
              </span>
              <span className="guide-name">{item.name}</span>
              <span className="guide-arrow">
                {expanded === item.notation ? '▲' : '▼'}
              </span>
            </div>

            {expanded === item.notation && (
              // Only render details when this item is expanded
              <div className="guide-details">
                <p className="guide-desc">{item.description}</p>
                <div className="guide-row">
                  <span className="guide-label">Example:</span>
                  <span>{item.example}</span>
                </div>
                <div className="guide-row">
                  <span className="guide-label">Growth:</span>
                  <span style={{ color: item.color }}>{item.growth}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComplexityGuide;
