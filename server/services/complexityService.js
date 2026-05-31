// complexityService.js — Detects time complexity from real timing data
// This is the most unique part of ComplexityLens
// Instead of just guessing, we use REAL timing data to detect complexity
// We compare how the actual timings grow vs how each complexity class should grow

// ─── 1. COMPLEXITY CLASSES ────────────────────────────────────────────────────

// Each complexity class has a theoretical growth function
// For example O(n²) means: if n doubles, time should quadruple
// We use these functions to generate "expected" timings
// Then compare them to actual timings to find the best match

const complexityFunctions = {
  'O(1)':        (n) => 1,
  // Constant — doesn't grow with n at all
  // Example: accessing array[0]

  'O(log n)':    (n) => Math.log2(n),
  // Logarithmic — grows very slowly
  // Example: binary search

  'O(n)':        (n) => n,
  // Linear — doubles when n doubles
  // Example: simple loop through array

  'O(n log n)':  (n) => n * Math.log2(n),
  // Linearithmic — slightly faster than quadratic
  // Example: merge sort, quick sort

  'O(n²)':       (n) => n * n,
  // Quadratic — quadruples when n doubles
  // Example: bubble sort, nested loops

  'O(2ⁿ)':       (n) => Math.pow(2, Math.min(n, 20))
  // Exponential — doubles with every increase in n
  // We cap at n=20 to avoid Infinity
  // Example: recursive fibonacci without memoization
};

// ─── 2. NORMALIZE FUNCTION ────────────────────────────────────────────────────

const normalize = (values) => {
  // Normalization scales all values between 0 and 1
  // This is needed because actual timings (in ms) and theoretical values
  // are on completely different scales
  // Example: actual timings [2, 45, 890] vs theoretical [100, 10000, 1000000]
  // After normalization both become [0, 0.05, 1] — now we can compare them

  const max = Math.max(...values);
  // Find the largest value using spread operator

  if (max === 0) return values.map(() => 0);
  // Avoid division by zero — if all values are 0, return all 0s

  return values.map(v => v / max);
  // Divide each value by the max → all values now between 0 and 1
};

// ─── 3. CALCULATE ERROR ───────────────────────────────────────────────────────

const calculateError = (actual, theoretical) => {
  // Calculates how different two arrays are from each other
  // We use "Mean Squared Error" (MSE) — a standard statistical measure
  // Lower error = better match = more likely to be this complexity class

  const normalizedActual = normalize(actual);
  const normalizedTheoretical = normalize(theoretical);
  // Normalize both arrays first so they're on the same scale

  const squaredDiffs = normalizedActual.map((val, i) => {
    const diff = val - normalizedTheoretical[i];
    // Difference between actual and theoretical at each point
    return diff * diff;
    // Square it — this penalizes large differences more than small ones
  });

  return squaredDiffs.reduce((sum, val) => sum + val, 0) / squaredDiffs.length;
  // Average of all squared differences = Mean Squared Error
  // .reduce() adds all values together, then we divide by count
};

// ─── 4. DETECT COMPLEXITY ─────────────────────────────────────────────────────

const detectComplexity = (timings) => {
  // Main function — takes timing data and returns the best matching complexity
  // Parameters:
  //   timings → array of { n, ms } objects from Judge0
  //             Example: [{ n: 10, ms: 2 }, { n: 100, ms: 45 }, ...]

  const ns = timings.map(t => t.n);
  // Extract just the input sizes: [10, 50, 100, 500, 1000, 2000, 5000]

  const actualMs = timings.map(t => t.ms);
  // Extract just the timing values: [2, 5, 45, 234, 890, 3200, 18000]

  let bestMatch = 'O(n)';
  // Default to O(n) if nothing else matches clearly
  let lowestError = Infinity;
  // Start with infinity so the first comparison always wins

  for (const [complexity, fn] of Object.entries(complexityFunctions)) {
    // Loop through each complexity class
    // complexity → "O(n²)", "O(n log n)" etc.
    // fn        → the mathematical function for that class

    const theoretical = ns.map(n => fn(n));
    // Generate theoretical values for each n
    // Example for O(n²): [100, 2500, 10000, 250000, ...]

    const error = calculateError(actualMs, theoretical);
    // Compare actual timings vs theoretical — get the error score

    if (error < lowestError) {
      lowestError = error;
      bestMatch = complexity;
      // If this complexity has lower error than previous best, update best match
    }
  }

  return bestMatch;
  // Return the complexity class with lowest error = best match
};

// ─── 5. DETECT SPACE COMPLEXITY ───────────────────────────────────────────────

const detectSpaceComplexity = (code) => {
  // Space complexity is harder to measure empirically
  // So we use static analysis — we look at the code patterns
  // This is a simplified heuristic (educated guess based on code structure)

  const codeStr = code.toLowerCase();
  // Convert to lowercase for easier matching

  // Check for exponential space (recursive calls building up call stack)
  if (codeStr.includes('return') &&
      (codeStr.includes('(n-1)') || codeStr.includes('(n - 1)'))) {
    return 'O(n)';
    // Recursive functions use O(n) stack space
  }

  // Check for 2D arrays (matrix operations)
  if (codeStr.includes('[][]') ||
      codeStr.includes('[[') ||
      codeStr.includes('matrix')) {
    return 'O(n²)';
    // 2D data structures use O(n²) space
  }

  // Check for data structures that grow with input
  if (codeStr.includes('map') ||
      codeStr.includes('set') ||
      codeStr.includes('dict') ||
      codeStr.includes('hash') ||
      codeStr.includes('{}') ||
      codeStr.includes('[]')) {
    return 'O(n)';
    // Dynamic data structures that store n elements = O(n) space
  }

  return 'O(1)';
  // If none of the above patterns found = constant space
  // The algorithm only uses a fixed number of variables
};

// ─── 6. EXPORT ────────────────────────────────────────────────────────────────

module.exports = { detectComplexity, detectSpaceComplexity };
