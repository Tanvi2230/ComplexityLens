import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';

import CodeEditor from '../components/CodeEditor';
import ComplexityBadge from '../components/ComplexityBadge';
import RuntimeChart from '../components/RuntimeChart';
import AIExplanation from '../components/AIExplanation';
import LoadingSteps from '../components/LoadingSteps';
import ExampleLibrary, { LANGUAGE_INFO } from '../components/ExampleLibrary';
import ComplexityGuide from '../components/ComplexityGuide';
import RecursionTree from '../components/RecursionTree';
import { analyzeCode } from '../services/api';
import { useAuth } from '../context/AuthContext';

const DEFAULT_CODE = {
  python:     `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr`,
  javascript: `function bubbleSort(arr) {\n    const n = arr.length;\n    for (let i = 0; i < n; i++) {\n        for (let j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n            }\n        }\n    }\n    return arr;\n}`,
  typescript: `function bubbleSort(arr: number[]): number[] {\n    const n = arr.length;\n    for (let i = 0; i < n; i++) {\n        for (let j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n            }\n        }\n    }\n    return arr;\n}`,
  java:       `static void sort(int[] arr) {\n    int n = arr.length;\n    for (int i = 0; i < n - 1; i++) {\n        for (int j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                int temp = arr[j];\n                arr[j] = arr[j + 1];\n                arr[j + 1] = temp;\n            }\n        }\n    }\n}`,
  cpp:        `void sort(vector<int>& arr) {\n    int n = arr.size();\n    for (int i = 0; i < n - 1; i++)\n        for (int j = 0; j < n - i - 1; j++)\n            if (arr[j] > arr[j + 1])\n                swap(arr[j], arr[j + 1]);\n}`,
  c:          `void sort(int* arr, int n) {\n    for (int i = 0; i < n - 1; i++)\n        for (int j = 0; j < n - i - 1; j++)\n            if (arr[j] > arr[j + 1]) {\n                int temp = arr[j];\n                arr[j] = arr[j + 1];\n                arr[j + 1] = temp;\n            }\n}`,
  go:         `func sort(arr []int) {\n    n := len(arr)\n    for i := 0; i < n-1; i++ {\n        for j := 0; j < n-i-1; j++ {\n            if arr[j] > arr[j+1] {\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n            }\n        }\n    }\n}`,
  rust:       `fn sort(arr: &mut Vec<i64>) {\n    let n = arr.len();\n    for i in 0..n {\n        for j in 0..n - i - 1 {\n            if arr[j] > arr[j + 1] {\n                arr.swap(j, j + 1);\n            }\n        }\n    }\n}`,
  kotlin:     `fun sort(arr: IntArray) {\n    val n = arr.size\n    for (i in 0 until n - 1) {\n        for (j in 0 until n - i - 1) {\n            if (arr[j] > arr[j + 1]) {\n                val temp = arr[j]\n                arr[j] = arr[j + 1]\n                arr[j + 1] = temp\n            }\n        }\n    }\n}`,
  ruby:       `def bubble_sort(arr)\n    n = arr.length\n    (0...n).each do |i|\n        (0...n - i - 1).each do |j|\n            if arr[j] > arr[j + 1]\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n            end\n        end\n    end\n    arr\nend`,
};

function HomePage() {
  const [language, setLanguage]   = useState('python');
  const [code, setCode]           = useState(DEFAULT_CODE.python);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [result, setResult]       = useState(null);
  const [copied, setCopied]       = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const resultsRef = useRef(null);
  const { user } = useAuth();

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang] || '');
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!code.trim()) { setError('Please paste some code first!'); return; }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await analyzeCode(code, language);
      if (response.success) {
        setResult(response.data);
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Is the server running on port 5000?');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!resultsRef.current) return;
    const canvas = await html2canvas(resultsRef.current, { backgroundColor: '#0d1117', scale: 2 });
    const link = document.createElement('a');
    link.download = `complexity-${result.complexity}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="home-page">

      {/* ── HERO ── */}
      <header className="hero-header">
        <div className="hero-content">
          <div className="hero-badge">🔬 Algorithm Analysis Tool</div>
          <h1 className="hero-title">Complexity<span className="hero-accent">Lens</span></h1>
          <p className="hero-subtitle">
            Paste any function → Run it on 7 input sizes → See the real runtime curve →
            Understand <em>exactly</em> why it's O(n²)
          </p>
          <div className="hero-stats">
            <div className="hero-stat"><span className="stat-number">10</span><span className="stat-label">Languages</span></div>
            <div className="hero-divider"></div>
            <div className="hero-stat"><span className="stat-number">7</span><span className="stat-label">Input sizes tested</span></div>
            <div className="hero-divider"></div>
            <div className="hero-stat"><span className="stat-number">6</span><span className="stat-label">Complexity classes</span></div>
          </div>
        </div>
        <nav className="hero-nav">
          <button className="nav-btn btn-purple" onClick={() => setShowGuide(!showGuide)}>📖 Big O Guide</button>
          <Link to="/compare" className="nav-btn btn-purple">⚖️ Compare</Link>
          <Link to="/explorer" className="nav-btn btn-orange">🎮 Explorer</Link>
          <Link to="/leaderboard" className="nav-btn btn-gold">🏆 Leaderboard</Link>
          <Link to="/history" className="nav-btn btn-teal">📊 History</Link>
          {user
            ? <Link to="/dashboard" className="nav-btn btn-green">🏠 {user.name?.split(' ')[0]}</Link>
            : <Link to="/auth" className="nav-btn btn-blue">🔑 Login</Link>
          }
        </nav>
      </header>

      {showGuide && <div className="guide-panel"><ComplexityGuide /></div>}

      <main className="main-layout">

        {/* ── EDITOR PANEL ── */}
        <section className="editor-panel">
          <div className="panel-header">
            <h2 className="panel-title">Your Code</h2>
            <ExampleLibrary language={language} onSelect={(c) => { setCode(c); setResult(null); }} />
          </div>

          {/* Language Grid — all 10 languages */}
          <div className="language-grid">
            {Object.entries(LANGUAGE_INFO).map(([lang, info]) => (
              <button
                key={lang}
                className={`lang-tile ${language === lang ? 'active' : ''}`}
                onClick={() => handleLanguageChange(lang)}
              >
                <span className="lang-tile-icon">{info.icon}</span>
                <span className="lang-tile-label">{info.label}</span>
              </button>
            ))}
          </div>

          <CodeEditor code={code} language={language === 'cpp' ? 'cpp' : language === 'typescript' ? 'typescript' : language} onChange={(v) => setCode(v)} />

          <button className={`analyze-btn ${loading ? 'loading' : ''}`} onClick={handleAnalyze} disabled={loading}>
            {loading ? '⏳ Analyzing...' : '🚀 Analyze Complexity'}
          </button>

          {error && <div className="error-message">❌ {error}</div>}
          {loading && <LoadingSteps />}
        </section>

        {/* ── RESULTS PANEL ── */}
        <section className="results-panel" ref={resultsRef}>
          {!result && !loading && (
            <div className="empty-results">
              <div className="empty-icon">🔍</div>
              <h3>Results will appear here</h3>
              <p>Pick a language, paste your code, and click Analyze</p>
              <div className="empty-hints">
                <div className="hint">📊 Real runtime chart</div>
                <div className="hint">🏷️ Complexity badge</div>
                <div className="hint">🤖 AI explanation</div>
                <div className="hint">🌳 Recursion tree</div>
              </div>
            </div>
          )}

          {result && (
            <>
              <div className="result-actions">
                <h2 className="results-title">Analysis Results</h2>
                <div className="action-buttons">
                  <button className="action-btn btn-orange" onClick={handleExport}>📥 Export PNG</button>
                  <button className="action-btn btn-blue" onClick={handleShare}>{copied ? '✅ Copied!' : '🔗 Share'}</button>
                </div>
              </div>
              <ComplexityBadge complexity={result.complexity} spaceComplexity={result.spaceComplexity} />
              <RuntimeChart timings={result.timings} complexity={result.complexity} />
              <RecursionTree complexity={result.complexity} />
              <AIExplanation explanation={result.aiExplanation} />
            </>
          )}
        </section>

      </main>
    </div>
  );
}

export default HomePage;
