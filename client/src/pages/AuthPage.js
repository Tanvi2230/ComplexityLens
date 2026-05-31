import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { register, login } from '../services/api';
import { useAuth } from '../context/AuthContext';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const { loginUser, user }   = useAuth();
  const navigate              = useNavigate();

  // Already logged in → go to dashboard
  if (user) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;
      if (isLogin) {
        response = await login(form.email, form.password);
      } else {
        if (!form.name.trim()) { setError('Name is required'); setLoading(false); return; }
        response = await register(form.name, form.email, form.password);
      }

      if (response.success) {
        loginUser(response.user, response.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-glow"></div>

      {/* ── LEFT SIDE — App description ── */}
      <div className="auth-left">
        <div className="auth-brand">
          <span className="auth-brand-icon">🔍</span>
          <span className="auth-brand-name">ComplexityLens</span>
        </div>

        <h1 className="auth-headline">
          See your code's<br />
          <span className="hero-accent">complexity in action</span>
        </h1>

        <p className="auth-desc">
          Paste any function, run it on 7 real input sizes,
          and watch the O(n²) curve appear before your eyes.
          No more guessing — just proof.
        </p>

        {/* Feature list */}
        <div className="auth-feature-list">
          {[
            { icon: '⚙️', title: 'Real Execution',    desc: 'Your code actually runs — 7 times, at different sizes' },
            { icon: '📊', title: 'Live Chart',         desc: 'Plot actual timings vs theoretical O(n²) curve' },
            { icon: '🤖', title: 'AI Explanation',     desc: 'Groq AI explains why your code has its complexity' },
            { icon: '⚖️', title: 'Compare Algorithms', desc: 'Paste two functions — see which wins on one chart' },
            { icon: '🎮', title: 'Big O Explorer',     desc: 'Interactive slider showing how n affects every class' },
            { icon: '💻', title: '10 Languages',       desc: 'Python, JS, Java, C++, Go, Rust, Kotlin and more' },
          ].map((f, i) => (
            <div key={i} className="auth-feature-item">
              <span className="auth-feature-icon">{f.icon}</span>
              <div>
                <div className="auth-feature-title">{f.title}</div>
                <div className="auth-feature-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT SIDE — Login / Register form ── */}
      <div className="auth-right">
        <div className="auth-card">

          {/* Tabs */}
          <div className="auth-tabs">
            <button className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(true); setError(null); }}>
              Login
            </button>
            <button className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(false); setError(null); }}>
              Register
            </button>
          </div>

          <h2 className="auth-title">
            {isLogin ? '👋 Welcome back!' : '✨ Create account'}
          </h2>

          <form onSubmit={handleSubmit} className="auth-form">

            {!isLogin && (
              <div className="auth-field">
                <label className="auth-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Tanvi Shrivastava"
                  value={form.name}
                  onChange={handleChange}
                  className="auth-input"
                  required
                />
              </div>
            )}

            <div className="auth-field">
              <label className="auth-label">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="auth-input"
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="auth-input"
                required
                minLength={6}
              />
              {!isLogin && (
                <span style={{ fontSize: '0.75rem', color: '#8b949e', marginTop: '4px' }}>
                  Minimum 6 characters
                </span>
              )}
            </div>

            {error && <div className="auth-error">❌ {error}</div>}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading
                ? '⏳ Please wait...'
                : isLogin ? '🚀 Login' : '✨ Create Account'
              }
            </button>

          </form>

          <p className="auth-switch">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button className="auth-switch-btn"
              onClick={() => { setIsLogin(!isLogin); setError(null); }}>
              {isLogin ? 'Register for free' : 'Login'}
            </button>
          </p>

          {/* What you get after login */}
          <div className="auth-perks">
            <p className="auth-perks-title">What you get:</p>
            <div className="auth-perks-list">
              <span>✅ Personal dashboard</span>
              <span>✅ Save analyses</span>
              <span>✅ Full history</span>
              <span>✅ Leaderboard</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AuthPage;
