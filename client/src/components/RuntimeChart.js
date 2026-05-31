// RuntimeChart.js — Plots the real runtime curve + theoretical overlay
// This is the most unique visual feature of ComplexityLens
// It shows ACTUAL measured timings vs THEORETICAL complexity curve
// Side by side so users can SEE the match

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
// We import only what we need from Chart.js
// This is called "tree shaking" — reduces bundle size
// Each import is a specific Chart.js module that needs to be registered

import { Line } from 'react-chartjs-2';
// Line → the line chart component from react-chartjs-2

// ─── REGISTER CHART.JS MODULES ────────────────────────────────────────────────

ChartJS.register(
  CategoryScale,  // X axis with category labels (our n values)
  LinearScale,    // Y axis with numerical scale (milliseconds)
  PointElement,   // The dots on the line
  LineElement,    // The line connecting dots
  Title,          // Chart title
  Tooltip,        // Hover tooltips
  Legend          // The legend (which line is which)
);
// Chart.js requires you to register components before using them
// This is a one-time setup at the top of the file

// ─── THEORETICAL CURVES ───────────────────────────────────────────────────────

const theoreticalFunctions = {
  'O(1)':       (n) => 1,
  'O(log n)':   (n) => Math.log2(n),
  'O(n)':       (n) => n,
  'O(n log n)': (n) => n * Math.log2(n),
  'O(n²)':      (n) => n * n,
  'O(2ⁿ)':      (n) => Math.pow(2, Math.min(n, 20)),
};
// Same functions as in complexityService.js on the backend
// We use these to generate the theoretical curve for the detected complexity

const normalize = (values) => {
  // Scale values between 0 and 1
  // So actual ms and theoretical values can be on the same chart
  const max = Math.max(...values);
  if (max === 0) return values.map(() => 0);
  return values.map(v => v / max);
};

// ─── CHART COMPONENT ──────────────────────────────────────────────────────────

function RuntimeChart({ timings, complexity }) {
  // Props:
  //   timings    → [{n: 10, ms: 2}, {n: 100, ms: 45}...] from backend
  //   complexity → "O(n²)" etc. from backend

  const ns = timings.map(t => t.n);
  // Extract input sizes for X axis: [10, 50, 100, 500, 1000, 2000, 5000]

  const actualMs = timings.map(t => t.ms);
  // Extract actual timings for the real curve: [2, 5, 45, 234, 890...]

  // Generate theoretical values for the detected complexity
  const theoreticalFn = theoreticalFunctions[complexity] || ((n) => n);
  const theoreticalValues = ns.map(n => theoreticalFn(n));
  // Example for O(n²): [100, 2500, 10000, 250000, 1000000, 4000000, 25000000]

  // Normalize both so they fit on the same scale
  const normalizedActual = normalize(actualMs);
  const normalizedTheoretical = normalize(theoreticalValues);

  // ─── CHART DATA ─────────────────────────────────────────────────────────────

  const chartData = {
    labels: ns.map(n => `n=${n}`),
    // X axis labels: ["n=10", "n=50", "n=100", ...]

    datasets: [
      {
        label: 'Actual Runtime',
        // Name shown in the legend

        data: normalizedActual,
        // The real measured timing data (normalized)

        borderColor: '#4fc3f7',
        // Line color — light blue

        backgroundColor: 'rgba(79, 195, 247, 0.1)',
        // Fill color under the line — transparent blue

        borderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
        // tension → how curved the line is (0 = straight, 1 = very curved)
      },
      {
        label: `Theoretical ${complexity}`,
        // Name shown in legend: "Theoretical O(n²)"

        data: normalizedTheoretical,
        // The mathematical curve for this complexity

        borderColor: '#ff7043',
        // Line color — orange/red

        backgroundColor: 'rgba(255, 112, 67, 0.1)',
        borderWidth: 3,
        borderDash: [8, 4],
        // Dashed line to distinguish from actual runtime
        // [8, 4] means: 8px line, 4px gap, repeating

        pointRadius: 4,
        tension: 0.4,
      }
    ]
  };

  // ─── CHART OPTIONS ──────────────────────────────────────────────────────────

  const options = {
    responsive: true,
    // Chart resizes with the container

    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#e0e0e0', font: { size: 13 } }
        // Legend at top with light colored text (for dark background)
      },
      title: {
        display: true,
        text: `Runtime Curve — Detected: ${complexity}`,
        color: '#ffffff',
        font: { size: 16, weight: 'bold' }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            // Custom tooltip text when hovering over a point
            if (context.datasetIndex === 0) {
              const originalMs = actualMs[context.dataIndex];
              return `Actual: ${originalMs}ms`;
              // Show real milliseconds in tooltip, not normalized value
            }
            return `Theoretical ${complexity}`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#b0bec5' },
        // X axis label color
        grid: { color: 'rgba(255,255,255,0.1)' }
        // Subtle grid lines
      },
      y: {
        ticks: { color: '#b0bec5' },
        grid: { color: 'rgba(255,255,255,0.1)' },
        title: {
          display: true,
          text: 'Normalized Time',
          color: '#b0bec5'
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
      {/* Line renders the actual Chart.js chart with our data and options */}
    </div>
  );
}

export default RuntimeChart;
