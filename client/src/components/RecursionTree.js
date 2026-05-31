// RecursionTree.js — Visualizes recursive function calls as a tree
// Shows HOW recursion grows exponentially
// Built with pure SVG — no extra libraries needed

import React from 'react';

// ─── TREE NODE GENERATOR ──────────────────────────────────────────────────────

const generateTree = (depth, maxDepth) => {
  // Recursively generates a tree structure
  // depth → current level (starts at 0)
  // maxDepth → how deep to go (we limit to 4 levels for readability)

  if (depth >= maxDepth) return null;

  return {
    depth,
    left: generateTree(depth + 1, maxDepth),
    right: generateTree(depth + 1, maxDepth),
    // Each node has 2 children → binary tree (like recursive fibonacci)
  };
};

// ─── SVG RENDERER ─────────────────────────────────────────────────────────────

const renderNodes = (node, x, y, horizontalSpread, nodes = [], edges = []) => {
  // Converts the tree structure into arrays of SVG elements
  // x, y → position of current node
  // horizontalSpread → how wide to spread children

  if (!node) return;

  nodes.push({ x, y, depth: node.depth });
  // Add this node to our list

  if (node.left) {
    const childX = x - horizontalSpread;
    const childY = y + 60;
    // Left child is to the left and below

    edges.push({ x1: x, y1: y, x2: childX, y2: childY });
    // Add edge (line) from parent to left child

    renderNodes(node.left, childX, childY, horizontalSpread / 2, nodes, edges);
    // Recursively render left subtree with halved spread
  }

  if (node.right) {
    const childX = x + horizontalSpread;
    const childY = y + 60;

    edges.push({ x1: x, y1: y, x2: childX, y2: childY });
    renderNodes(node.right, childX, childY, horizontalSpread / 2, nodes, edges);
  }

  return { nodes, edges };
};

// ─── COLOR BY DEPTH ───────────────────────────────────────────────────────────

const depthColors = ['#58a6ff', '#bc8cff', '#ff7b72', '#ffa657', '#3fb950'];
// Each level gets a different color so depth is visually obvious

// ─── COMPONENT ────────────────────────────────────────────────────────────────

function RecursionTree({ complexity }) {
  // Only show recursion tree for recursive complexities
  if (!complexity?.includes('2ⁿ') && !complexity?.includes('log')) {
    return (
      <div className="recursion-tree">
        <div className="tree-header">
          <h3>🌳 Recursion Tree</h3>
        </div>
        <div className="tree-na">
          <p>Recursion tree is shown for recursive algorithms (O(2ⁿ), O(log n))</p>
          <p>Your algorithm is <strong>{complexity}</strong> — likely iterative (uses loops, not recursion)</p>
        </div>
      </div>
    );
  }

  // For O(2ⁿ) show deeper tree, for O(log n) show shallower
  const maxDepth = complexity?.includes('2ⁿ') ? 4 : 3;

  const tree = generateTree(0, maxDepth);
  const result = renderNodes(tree, 300, 40, 130, [], []);

  if (!result) return null;

  const { nodes, edges } = result;

  // Count nodes at each level to show the exponential growth
  const levelCounts = {};
  nodes.forEach(n => {
    levelCounts[n.depth] = (levelCounts[n.depth] || 0) + 1;
  });

  return (
    <div className="recursion-tree">
      <div className="tree-header">
        <h3>🌳 Recursion Tree</h3>
        <span className="tree-badge">{complexity}</span>
      </div>

      <p className="tree-desc">
        Each node = one function call. Each level doubles the calls → {complexity} growth
      </p>

      {/* SVG Tree */}
      <svg
        width="600"
        height={maxDepth * 70 + 60}
        className="tree-svg"
        viewBox={`0 0 600 ${maxDepth * 70 + 60}`}
      >
        {/* Draw edges (lines between nodes) first so they appear behind nodes */}
        {edges.map((edge, i) => (
          <line
            key={`edge-${i}`}
            x1={edge.x1} y1={edge.y1}
            x2={edge.x2} y2={edge.y2}
            stroke="#30363d"
            strokeWidth="2"
          />
        ))}

        {/* Draw nodes (circles) */}
        {nodes.map((node, i) => (
          <g key={`node-${i}`}>
            <circle
              cx={node.x}
              cy={node.y}
              r={18}
              fill={depthColors[node.depth] || '#58a6ff'}
              opacity={0.9}
            />
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              fill="white"
              fontSize="11"
              fontWeight="bold"
            >
              f({node.depth})
              {/* Shows function call like f(0), f(1), f(2)... */}
            </text>
          </g>
        ))}
      </svg>

      {/* Level statistics */}
      <div className="tree-stats">
        {Object.entries(levelCounts).map(([level, count]) => (
          <div key={level} className="tree-level">
            <span className="level-label" style={{ color: depthColors[level] }}>
              Level {level}:
            </span>
            <span className="level-count">{count} call{count > 1 ? 's' : ''}</span>
            <div className="level-bar">
              <div
                className="level-fill"
                style={{
                  width: `${(count / nodes.length) * 100}%`,
                  backgroundColor: depthColors[level]
                }}
              />
            </div>
          </div>
        ))}
        <div className="tree-total">
          Total calls: <strong>{nodes.length}</strong>
          {complexity?.includes('2ⁿ') && (
            <span> (grows as 2ⁿ — doubles every level!)</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecursionTree;
