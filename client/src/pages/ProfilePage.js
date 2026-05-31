import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';

function ProfilePage() {
  const { user, logoutUser, setUser } = useAuth();
  const navigate                      = useNavigate();
  const [profile, setProfile]         = useState(null);
  const [editing, setEditing]         = useState(false);
  const [form, setForm]               = useState({ name: '', avatar: '' });
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [success, setSuccess]         = useState(false);

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    const fetch = async () => {
      try {
        const res = await getProfile();
        if (res.success) {
          setProfile(res.data);
          setForm({ name: res.data.name, avatar: res.data.avatar || '' });
        }
      } finally { setLoading(false); }
    };
    fetch();
  }, [user, navigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateProfile(form);
      if (res.success) {
        setProfile(prev => ({ ...prev, ...res.data }));
        setUser(prev => ({ ...prev, ...res.data }));
        setEditing(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } finally { setSaving(false); }
  };

  if (loading) return <div className="loading-container" style={{ height: '100vh' }}><div className="spinner"></div></div>;

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <Link to="/" className="auth-logo" style={{ textDecoration: 'none', fontSize: '1.4rem' }}>🔍 ComplexityLens</Link>
        <nav style={{ display: 'flex', gap: '12px' }}>
          <Link to="/dashboard" className="nav-btn btn-green">🏠 Dashboard</Link>
          <Link to="/saved" className="nav-btn btn-gold">🔖 Saved</Link>
          <button className="nav-btn btn-red" onClick={() => { logoutUser(); navigate('/auth'); }}>🚪 Logout</button>
        </nav>
      </header>

      <main className="dashboard-main">
        <div className="profile-container">

          {/* Avatar */}
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              {profile?.avatar
                ? <img src={profile.avatar} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                : <span>{profile?.name?.charAt(0).toUpperCase()}</span>
              }
            </div>
            <h2 className="profile-name">{profile?.name}</h2>
            <p className="profile-email">{profile?.email}</p>
            <p className="profile-joined">
              Member since {new Date(profile?.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Stats */}
          <div className="profile-stats">
            <div className="profile-stat-item">
              <div className="profile-stat-number">{profile?.totalAnalyses}</div>
              <div className="profile-stat-label">Analyses</div>
            </div>
            <div className="profile-stat-item">
              <div className="profile-stat-number">{profile?.totalSaved}</div>
              <div className="profile-stat-label">Saved</div>
            </div>
            <div className="profile-stat-item">
              <div className="profile-stat-number" style={{ fontSize: '1.1rem' }}>{profile?.topComplexity}</div>
              <div className="profile-stat-label">Top Complexity</div>
            </div>
            <div className="profile-stat-item">
              <div className="profile-stat-number" style={{ fontSize: '1.1rem', textTransform: 'capitalize' }}>{profile?.topLanguage}</div>
              <div className="profile-stat-label">Top Language</div>
            </div>
          </div>

          {/* Edit form */}
          <div className="profile-edit-section">
            <div className="dashboard-card-header">
              <h3>Edit Profile</h3>
              {!editing && (
                <button className="action-btn" onClick={() => setEditing(true)}>✏️ Edit</button>
              )}
            </div>

            {success && <div style={{ color: '#3fb950', padding: '10px', background: 'rgba(63,185,80,0.1)', borderRadius: '8px', marginBottom: '12px' }}>✅ Profile updated!</div>}

            <div className="auth-field">
              <label className="auth-label">Full Name</label>
              <input
                type="text"
                className="auth-input"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                disabled={!editing}
              />
            </div>

            <div className="auth-field" style={{ marginTop: '12px' }}>
              <label className="auth-label">Avatar URL (optional)</label>
              <input
                type="url"
                className="auth-input"
                placeholder="https://example.com/avatar.jpg"
                value={form.avatar}
                onChange={e => setForm({ ...form, avatar: e.target.value })}
                disabled={!editing}
              />
            </div>

            <div className="auth-field" style={{ marginTop: '12px' }}>
              <label className="auth-label">Email</label>
              <input type="email" className="auth-input" value={profile?.email || ''} disabled />
            </div>

            {editing && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button className="analyze-btn" style={{ flex: 1 }} onClick={handleSave} disabled={saving}>
                  {saving ? '⏳ Saving...' : '💾 Save Changes'}
                </button>
                <button className="action-btn" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
