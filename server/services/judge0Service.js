// judge0Service.js — Runs user code at multiple input sizes
// Now supports 10 languages!

const axios = require('axios');

const JUDGE0_URL = process.env.JUDGE0_API_URL || 'https://ce.judge0.com';

// ─── LANGUAGE IDs ─────────────────────────────────────────────────────────────
// Judge0 identifies each language by a number

const LANGUAGE_IDS = {
  python:     71,   // Python 3
  javascript: 63,   // Node.js
  typescript: 74,   // TypeScript
  java:       62,   // Java
  cpp:        54,   // C++
  c:          50,   // C
  go:         95,   // Go
  rust:       73,   // Rust
  kotlin:     78,   // Kotlin
  ruby:       72,   // Ruby
};

// ─── INPUT SIZES ──────────────────────────────────────────────────────────────
const INPUT_SIZES = [10, 50, 100, 500, 1000, 2000, 5000];

// ─── CODE WRAPPER ─────────────────────────────────────────────────────────────
// For each language, we wrap the user's code with:
// 1. Test input generation (array of size n, reverse sorted = worst case)
// 2. Timer start
// 3. Function call
// 4. Timer end
// 5. Print milliseconds

const wrapCode = (code, language, n) => {

  if (language === 'python') {
    return `
import time, random, re

${code}

# Auto-detect first function defined
import inspect, sys
funcs = [(name, obj) for name, obj in list(vars().items()) if callable(obj) and not name.startswith('_')]
test_input = list(range(${n}, 0, -1))

start = time.time()
try:
    for name, func in funcs:
        try:
            func(test_input[:])
            break
        except: continue
except: pass
end = time.time()
print(round((end - start) * 1000, 4))
`;
  }

  if (language === 'javascript') {
    return `
${code}

const testInput = Array.from({ length: ${n} }, (_, i) => ${n} - i);
const src = \`${code.replace(/`/g, '\\`')}\`;
const match = src.match(/function\\s+(\\w+)|const\\s+(\\w+)\\s*=|let\\s+(\\w+)\\s*=/);
const funcName = match ? (match[1] || match[2] || match[3]) : null;

const start = Date.now();
try {
  if (funcName && typeof eval(funcName) === 'function') {
    eval(funcName + '([...testInput])');
  }
} catch(e) {}
const end = Date.now();
console.log(end - start);
`;
  }

  if (language === 'typescript') {
    // TypeScript compiled to JS by Judge0
    return `
${code}

const testInput: number[] = Array.from({ length: ${n} }, (_, i) => ${n} - i);
const src = \`${code.replace(/`/g, '\\`')}\`;
const match = src.match(/function\\s+(\\w+)/);
const funcName = match ? match[1] : null;

const start = Date.now();
try {
  if (funcName) {
    (eval(funcName) as Function)([...testInput]);
  }
} catch(e) {}
const end = Date.now();
console.log(end - start);
`;
  }

  if (language === 'java') {
    // Java needs a complete class with main method
    // We wrap the user's static method inside Main class
    return `
import java.util.*;

public class Main {

    // ── USER CODE ──
    ${code}
    // ──────────────

    public static void main(String[] args) {
        int n = ${n};
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = n - i;

        long start = System.currentTimeMillis();

        // Try common function names
        try { sort(arr.clone()); }
        catch (Exception e1) {
            try { bubbleSort(arr.clone()); }
            catch (Exception e2) {
                try { mergeSort(arr.clone()); }
                catch (Exception e3) {
                    try { selectionSort(arr.clone()); }
                    catch (Exception e4) {}
                }
            }
        }

        long end = System.currentTimeMillis();
        System.out.println(end - start);
    }
}
`;
  }

  if (language === 'cpp') {
    return `
#include <iostream>
#include <vector>
#include <chrono>
#include <algorithm>
using namespace std;
using namespace chrono;

// ── USER CODE ──
${code}
// ──────────────

int main() {
    int n = ${n};
    vector<int> arr(n);
    for (int i = 0; i < n; i++) arr[i] = n - i;

    auto start = high_resolution_clock::now();

    // Try to call user function — common names
    try { sort(arr); } catch(...) {}

    auto end = high_resolution_clock::now();
    double ms = duration<double, milli>(end - start).count();
    cout << ms << endl;
    return 0;
}
`;
  }

  if (language === 'c') {
    return `
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <string.h>

// ── USER CODE ──
${code}
// ──────────────

int main() {
    int n = ${n};
    int* arr = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) arr[i] = n - i;

    clock_t start = clock();

    // Call sort function (user must define sort or bubbleSort)
    sort(arr, n);

    clock_t end = clock();
    double ms = ((double)(end - start)) / CLOCKS_PER_SEC * 1000.0;
    printf("%.4f\\n", ms);
    free(arr);
    return 0;
}
`;
  }

  if (language === 'go') {
    return `
package main

import (
    "fmt"
    "time"
)

// ── USER CODE ──
${code}
// ──────────────

func main() {
    n := ${n}
    arr := make([]int, n)
    for i := 0; i < n; i++ {
        arr[i] = n - i
    }

    start := time.Now()
    sort(arr)
    elapsed := time.Since(start)

    fmt.Printf("%.4f\\n", float64(elapsed.Nanoseconds())/1e6)
}
`;
  }

  if (language === 'rust') {
    return `
use std::time::Instant;

// ── USER CODE ──
${code}
// ──────────────

fn main() {
    let n: usize = ${n};
    let mut arr: Vec<i64> = (0..n).map(|i| (n - i) as i64).collect();

    let start = Instant::now();
    sort(&mut arr);
    let duration = start.elapsed();

    println!("{:.4}", duration.as_secs_f64() * 1000.0);
}
`;
  }

  if (language === 'kotlin') {
    return `
// ── USER CODE ──
${code}
// ──────────────

fun main() {
    val n = ${n}
    val arr = IntArray(n) { n - it }

    val start = System.currentTimeMillis()
    sort(arr)
    val end = System.currentTimeMillis()

    println(end - start)
}
`;
  }

  if (language === 'ruby') {
    return `
${code}

test_input = Array.new(${n}) { |i| ${n} - i }

# Detect and call first method
methods_before = Object.private_methods
start_time = Time.now.to_f

begin
  arr = test_input.dup
  # Try common method names
  if respond_to?(:sort_array, true)
    sort_array(arr)
  elsif respond_to?(:bubble_sort, true)
    bubble_sort(arr)
  elsif respond_to?(:merge_sort, true)
    merge_sort(arr)
  end
rescue => e
end

end_time = Time.now.to_f
puts ((end_time - start_time) * 1000).round(4)
`;
  }

  throw new Error(`Unsupported language: ${language}`);
};

// ─── SUBMIT TO JUDGE0 ─────────────────────────────────────────────────────────

const submitCode = async (code, languageId) => {
  const response = await axios.post(
    `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
    {
      source_code: code,
      language_id: languageId,
      cpu_time_limit: 10,
      memory_limit: 256000,
    },
    {
      timeout: 30000,
      // 30 second timeout per request
    }
  );
  return response.data;
};

// ─── RUN AT ALL SIZES ─────────────────────────────────────────────────────────

const runAtAllSizes = async (code, language) => {
  const languageId = LANGUAGE_IDS[language];

  if (!languageId) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const timings = [];

  for (const n of INPUT_SIZES) {
    try {
      const wrappedCode = wrapCode(code, language, n);
      const result = await submitCode(wrappedCode, languageId);

      // result.stdout = what the code printed = our timing in ms
      const ms = parseFloat(result.stdout) || 0;
      timings.push({ n, ms });

    } catch (error) {
      console.error(`Error at n=${n}:`, error.message);
      timings.push({ n, ms: 0 });
    }
  }

  return timings;
};

// ─── EXPORT ───────────────────────────────────────────────────────────────────

module.exports = { runAtAllSizes, INPUT_SIZES, LANGUAGE_IDS };
