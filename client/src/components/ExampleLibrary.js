import React, { useState } from 'react';

const EXAMPLES = {
  python: [
    { name: 'Bubble Sort — O(n²)',    complexity: 'O(n²)',      code: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr` },
    { name: 'Binary Search — O(log n)', complexity: 'O(log n)', code: `def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1` },
    { name: 'Linear Search — O(n)',   complexity: 'O(n)',       code: `def linear_search(arr, target):\n    for i in range(len(arr)):\n        if arr[i] == target:\n            return i\n    return -1` },
    { name: 'Merge Sort — O(n log n)',complexity: 'O(n log n)', code: `def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i]); i += 1\n        else:\n            result.append(right[j]); j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result` },
    { name: 'Fibonacci — O(2ⁿ)',      complexity: 'O(2ⁿ)',     code: `def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n - 1) + fibonacci(n - 2)` },
  ],
  javascript: [
    { name: 'Bubble Sort — O(n²)',    complexity: 'O(n²)',      code: `function bubbleSort(arr) {\n    const n = arr.length;\n    for (let i = 0; i < n; i++) {\n        for (let j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n            }\n        }\n    }\n    return arr;\n}` },
    { name: 'Binary Search — O(log n)', complexity: 'O(log n)', code: `function binarySearch(arr, target) {\n    let left = 0, right = arr.length - 1;\n    while (left <= right) {\n        const mid = Math.floor((left + right) / 2);\n        if (arr[mid] === target) return mid;\n        else if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}` },
    { name: 'Merge Sort — O(n log n)',complexity: 'O(n log n)', code: `function mergeSort(arr) {\n    if (arr.length <= 1) return arr;\n    const mid = Math.floor(arr.length / 2);\n    const left = mergeSort(arr.slice(0, mid));\n    const right = mergeSort(arr.slice(mid));\n    return merge(left, right);\n}\n\nfunction merge(left, right) {\n    const result = [];\n    let i = 0, j = 0;\n    while (i < left.length && j < right.length) {\n        if (left[i] <= right[j]) result.push(left[i++]);\n        else result.push(right[j++]);\n    }\n    return result.concat(left.slice(i)).concat(right.slice(j));\n}` },
    { name: 'Linear Search — O(n)',   complexity: 'O(n)',       code: `function linearSearch(arr, target) {\n    for (let i = 0; i < arr.length; i++) {\n        if (arr[i] === target) return i;\n    }\n    return -1;\n}` },
  ],
  typescript: [
    { name: 'Bubble Sort — O(n²)',    complexity: 'O(n²)',      code: `function bubbleSort(arr: number[]): number[] {\n    const n = arr.length;\n    for (let i = 0; i < n; i++) {\n        for (let j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n            }\n        }\n    }\n    return arr;\n}` },
    { name: 'Binary Search — O(log n)', complexity: 'O(log n)', code: `function binarySearch(arr: number[], target: number): number {\n    let left = 0, right = arr.length - 1;\n    while (left <= right) {\n        const mid = Math.floor((left + right) / 2);\n        if (arr[mid] === target) return mid;\n        else if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}` },
  ],
  java: [
    { name: 'Bubble Sort — O(n²)',    complexity: 'O(n²)',      code: `static void sort(int[] arr) {\n    int n = arr.length;\n    for (int i = 0; i < n - 1; i++) {\n        for (int j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                int temp = arr[j];\n                arr[j] = arr[j + 1];\n                arr[j + 1] = temp;\n            }\n        }\n    }\n}` },
    { name: 'Binary Search — O(log n)', complexity: 'O(log n)', code: `static int sort(int[] arr) {\n    int left = 0, right = arr.length - 1;\n    int target = arr[arr.length / 2];\n    while (left <= right) {\n        int mid = (left + right) / 2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}` },
    { name: 'Selection Sort — O(n²)', complexity: 'O(n²)',      code: `static void sort(int[] arr) {\n    int n = arr.length;\n    for (int i = 0; i < n - 1; i++) {\n        int minIdx = i;\n        for (int j = i + 1; j < n; j++)\n            if (arr[j] < arr[minIdx]) minIdx = j;\n        int temp = arr[minIdx];\n        arr[minIdx] = arr[i];\n        arr[i] = temp;\n    }\n}` },
  ],
  cpp: [
    { name: 'Bubble Sort — O(n²)',    complexity: 'O(n²)',      code: `void sort(vector<int>& arr) {\n    int n = arr.size();\n    for (int i = 0; i < n - 1; i++)\n        for (int j = 0; j < n - i - 1; j++)\n            if (arr[j] > arr[j + 1])\n                swap(arr[j], arr[j + 1]);\n}` },
    { name: 'Binary Search — O(log n)', complexity: 'O(log n)', code: `int binarySearch(vector<int>& arr, int target) {\n    int left = 0, right = arr.size() - 1;\n    while (left <= right) {\n        int mid = (left + right) / 2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}\n\nvoid sort(vector<int>& arr) { binarySearch(arr, arr[0]); }` },
    { name: 'Selection Sort — O(n²)', complexity: 'O(n²)',      code: `void sort(vector<int>& arr) {\n    int n = arr.size();\n    for (int i = 0; i < n - 1; i++) {\n        int minIdx = i;\n        for (int j = i + 1; j < n; j++)\n            if (arr[j] < arr[minIdx]) minIdx = j;\n        swap(arr[i], arr[minIdx]);\n    }\n}` },
  ],
  c: [
    { name: 'Bubble Sort — O(n²)',    complexity: 'O(n²)',      code: `void sort(int* arr, int n) {\n    for (int i = 0; i < n - 1; i++)\n        for (int j = 0; j < n - i - 1; j++)\n            if (arr[j] > arr[j + 1]) {\n                int temp = arr[j];\n                arr[j] = arr[j + 1];\n                arr[j + 1] = temp;\n            }\n}` },
    { name: 'Selection Sort — O(n²)', complexity: 'O(n²)',      code: `void sort(int* arr, int n) {\n    for (int i = 0; i < n - 1; i++) {\n        int minIdx = i;\n        for (int j = i + 1; j < n; j++)\n            if (arr[j] < arr[minIdx]) minIdx = j;\n        int temp = arr[minIdx];\n        arr[minIdx] = arr[i];\n        arr[i] = temp;\n    }\n}` },
  ],
  go: [
    { name: 'Bubble Sort — O(n²)',    complexity: 'O(n²)',      code: `func sort(arr []int) {\n    n := len(arr)\n    for i := 0; i < n-1; i++ {\n        for j := 0; j < n-i-1; j++ {\n            if arr[j] > arr[j+1] {\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n            }\n        }\n    }\n}` },
    { name: 'Linear Search — O(n)',   complexity: 'O(n)',       code: `func sort(arr []int) int {\n    target := arr[len(arr)/2]\n    for i, v := range arr {\n        if v == target {\n            return i\n        }\n    }\n    return -1\n}` },
  ],
  rust: [
    { name: 'Bubble Sort — O(n²)',    complexity: 'O(n²)',      code: `fn sort(arr: &mut Vec<i64>) {\n    let n = arr.len();\n    for i in 0..n {\n        for j in 0..n - i - 1 {\n            if arr[j] > arr[j + 1] {\n                arr.swap(j, j + 1);\n            }\n        }\n    }\n}` },
    { name: 'Linear Search — O(n)',   complexity: 'O(n)',       code: `fn sort(arr: &mut Vec<i64>) -> i64 {\n    let target = arr[arr.len() / 2];\n    for (i, &val) in arr.iter().enumerate() {\n        if val == target { return i as i64; }\n    }\n    -1\n}` },
  ],
  kotlin: [
    { name: 'Bubble Sort — O(n²)',    complexity: 'O(n²)',      code: `fun sort(arr: IntArray) {\n    val n = arr.size\n    for (i in 0 until n - 1) {\n        for (j in 0 until n - i - 1) {\n            if (arr[j] > arr[j + 1]) {\n                val temp = arr[j]\n                arr[j] = arr[j + 1]\n                arr[j + 1] = temp\n            }\n        }\n    }\n}` },
    { name: 'Linear Search — O(n)',   complexity: 'O(n)',       code: `fun sort(arr: IntArray): Int {\n    val target = arr[arr.size / 2]\n    for (i in arr.indices) {\n        if (arr[i] == target) return i\n    }\n    return -1\n}` },
  ],
  ruby: [
    { name: 'Bubble Sort — O(n²)',    complexity: 'O(n²)',      code: `def bubble_sort(arr)\n    n = arr.length\n    (0...n).each do |i|\n        (0...n - i - 1).each do |j|\n            if arr[j] > arr[j + 1]\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n            end\n        end\n    end\n    arr\nend` },
    { name: 'Linear Search — O(n)',   complexity: 'O(n)',       code: `def sort_array(arr)\n    target = arr[arr.length / 2]\n    arr.each_with_index do |val, i|\n        return i if val == target\n    end\n    -1\nend` },
  ],
};

const LANGUAGE_INFO = {
  python:     { label: 'Python',     icon: '🐍' },
  javascript: { label: 'JavaScript', icon: '⚡' },
  typescript: { label: 'TypeScript', icon: '🔷' },
  java:       { label: 'Java',       icon: '☕' },
  cpp:        { label: 'C++',        icon: '⚙️' },
  c:          { label: 'C',          icon: '🔧' },
  go:         { label: 'Go',         icon: '🐹' },
  rust:       { label: 'Rust',       icon: '🦀' },
  kotlin:     { label: 'Kotlin',     icon: '🟣' },
  ruby:       { label: 'Ruby',       icon: '💎' },
};

function ExampleLibrary({ language, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const examples = EXAMPLES[language] || [];

  return (
    <div className="example-library">
      <button className="example-btn" onClick={() => setIsOpen(!isOpen)}>
        📚 Load Example
        <span className={`arrow ${isOpen ? 'up' : 'down'}`}>▾</span>
      </button>

      {isOpen && (
        <div className="example-dropdown">
          {examples.length === 0 && (
            <div className="example-item" style={{ cursor: 'default', color: '#8b949e' }}>
              No examples yet for this language
            </div>
          )}
          {examples.map((ex, i) => (
            <button key={i} className="example-item" onClick={() => { onSelect(ex.code); setIsOpen(false); }}>
              <span className="example-name">{ex.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export { LANGUAGE_INFO, EXAMPLES };
export default ExampleLibrary;
