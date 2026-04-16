import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUser } from '../utils/storage';

export default function Profile() {
  const { user, addToast, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name || '');
  const [linkedin, setLinkedin] = useState(user.linkedin || '');
  const [bio, setBio] = useState(user.bio || '');

  function handleSave(e) {
    e.preventDefault();
    updateUser(user.id, { name, linkedin, bio });
    refreshUser();
    setEditing(false);
    addToast('Profile updated!', 'success');
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>View and manage your account information.</p>
      </div>

      <div className="grid-2">
        {/* Profile Card */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '20px',
              background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem', fontWeight: 700, color: '#fff',
            }}>
              {user.name?.[0]}
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{user.name}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user.email}</p>
              <span className={`badge ${user.role === 'student' ? 'badge-primary' : user.role === 'alumni' ? 'badge-accent' : 'badge-warning'}`}>
                {user.role}
              </span>
            </div>
          </div>

          {editing ? (
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="form-input" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">LinkedIn</label>
                <input className="form-input" value={linkedin} onChange={e => setLinkedin(e.target.value)} />
              </div>
              {user.role === 'alumni' && (
                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea className="form-textarea" value={bio} onChange={e => setBio(e.target.value)} maxLength={500} />
                </div>
              )}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <button className="btn btn-outline" onClick={() => setEditing(true)}>Edit Profile</button>
          )}
        </div>

        {/* Details Card */}
        <div className="glass-card">
          <h3 className="section-title">📋 Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              ['Department', user.department],
              ['Role', user.role],
              ...(user.role === 'student' ? [
                ['Graduation Year', user.graduationYear],
                ['Mentorship Style', user.mentorshipStyle || 'Not set'],
              ] : user.role === 'alumni' ? [
                ['Job Title', user.jobTitle],
                ['Employer', user.employer],
                ['Experience', `${user.experience} years`],
                ['Graduation Year', user.graduationYear],
                ['Meeting Mode', user.meetingMode],
                ['Max Mentees', user.maxMentees],
                ['Verified', user.verified ? '✅ Yes' : '⏳ Pending'],
              ] : []),
              ['Joined', user.createdAt],
            ].map(([label, value], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', padding: '8px 0', borderBottom: '1px solid var(--glass-border)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                <span style={{ fontWeight: 500 }}>{value || '—'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills & Interests */}
      {(user.skills?.length > 0 || user.careerGoals?.length > 0 || user.industry?.length > 0) && (
        <div className="glass-card" style={{ marginTop: '20px' }}>
          <h3 className="section-title">🏷️ Skills & Interests</h3>
          {user.skills?.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Skills</div>
              <div className="tag-container">
                {user.skills.map((s, i) => <span key={i} className="tag">{s}</span>)}
              </div>
            </div>
          )}
          {user.careerGoals?.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Career Goals</div>
              <div className="tag-container">
                {user.careerGoals.map((g, i) => <span key={i} className="tag">{g}</span>)}
              </div>
            </div>
          )}
          {(user.industry?.length > 0 || user.preferredIndustry?.length > 0) && (
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Industry</div>
              <div className="tag-container">
                {(user.industry || user.preferredIndustry || []).map((ind, i) => <span key={i} className="tag">{ind}</span>)}
              </div>
            </div>
          )}
          {user.availability?.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Availability</div>
              <div className="tag-container">
                {user.availability.map((d, i) => <span key={i} className="tag">{d}</span>)}
              </div>
            </div>
          )}
        </div>
      )}

      {user.role === 'alumni' && user.bio && (
        <div className="glass-card" style={{ marginTop: '20px' }}>
          <h3 className="section-title">📝 Bio</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{user.bio}</p>
        </div>
      )}
    </div>
  );
}
