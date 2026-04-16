import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUsers, getRequests, getSessions, getFeedback, updateUser } from '../utils/storage';
import StatsCard from '../components/StatsCard';

export default function AdminDashboard() {
  const { user, addToast } = useAuth();
  const [tab, setTab] = useState('overview');

  const users = getUsers();
  const students = users.filter(u => u.role === 'student');
  const alumni = users.filter(u => u.role === 'alumni');
  const unverifiedAlumni = alumni.filter(a => !a.verified);
  const requests = getRequests();
  const sessions = getSessions();
  const feedback = getFeedback();

  const activePairs = requests.filter(r => r.status === 'accepted').length;
  const completedSessions = sessions.filter(s => s.status === 'completed').length;
  const avgRating = feedback.length > 0
    ? (feedback.reduce((s, f) => s + (f.overall || 0), 0) / feedback.length).toFixed(1)
    : 'N/A';

  function verifyAlumni(id) {
    updateUser(id, { verified: true });
    addToast('Alumni verified successfully!', 'success');
  }

  function rejectAlumni(id) {
    updateUser(id, { verified: false, rejected: true });
    addToast('Alumni registration rejected.', 'info');
  }

  // Department distribution
  const deptDistribution = {};
  students.forEach(s => {
    deptDistribution[s.department] = (deptDistribution[s.department] || 0) + 1;
  });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Admin Dashboard 🛡️</h1>
        <p>Platform-wide analytics and management.</p>
      </div>

      <div className="stats-grid">
        <StatsCard icon="🎓" value={students.length} label="Total Students" color="rgba(99,102,241,0.12)" />
        <StatsCard icon="💼" value={alumni.length} label="Total Alumni" color="rgba(16,185,129,0.12)" />
        <StatsCard icon="🤝" value={activePairs} label="Active Pairs" color="rgba(245,158,11,0.12)" />
        <StatsCard icon="📅" value={completedSessions} label="Sessions Completed" color="rgba(139,92,246,0.12)" />
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>Overview</button>
        <button className={`tab ${tab === 'verification' ? 'active' : ''}`} onClick={() => setTab('verification')}>
          Verification {unverifiedAlumni.length > 0 && <span className="badge badge-warning" style={{ marginLeft: '6px' }}>{unverifiedAlumni.length}</span>}
        </button>
        <button className={`tab ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>All Users</button>
        <button className={`tab ${tab === 'analytics' ? 'active' : ''}`} onClick={() => setTab('analytics')}>Analytics</button>
      </div>

      {tab === 'overview' && (
        <div className="grid-2">
          <div className="glass-card">
            <h3 className="section-title">📊 Platform Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                ['Total Users', users.length - 1],
                ['Active Mentorship Pairs', activePairs],
                ['Pending Requests', requests.filter(r => r.status === 'pending').length],
                ['Sessions Completed', completedSessions],
                ['Average Rating', avgRating],
                ['Unverified Alumni', unverifiedAlumni.length],
              ].map(([label, value], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', padding: '8px 0', borderBottom: '1px solid var(--glass-border)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                  <span style={{ fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card">
            <h3 className="section-title">🏫 Department Distribution</h3>
            {Object.keys(deptDistribution).length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No students registered yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Object.entries(deptDistribution).sort((a, b) => b[1] - a[1]).map(([dept, count]) => (
                  <div key={dept}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{dept}</span>
                      <span style={{ fontWeight: 600, color: 'var(--primary-400)' }}>{count}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${(count / students.length) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'verification' && (
        <div>
          {unverifiedAlumni.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✅</div>
              <h3>All alumni verified</h3>
              <p>No pending verification requests.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {unverifiedAlumni.map(a => (
                <div key={a.id} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div className="match-avatar">{a.name?.[0]}</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.95rem' }}>{a.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {a.jobTitle} at {a.employer} • {a.department} • Class of {a.graduationYear}
                    </p>
                    <div className="tag-container" style={{ marginTop: '6px' }}>
                      {a.skills?.slice(0, 4).map((s, i) => <span key={i} className="tag">{s}</span>)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-accent btn-sm" onClick={() => verifyAlumni(a.id)}>Verify</button>
                    <button className="btn btn-outline btn-sm" onClick={() => rejectAlumni(a.id)}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'users' && (
        <div className="glass-card" style={{ overflow: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(u => u.role !== 'admin').map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge ${u.role === 'student' ? 'badge-primary' : 'badge-accent'}`}>{u.role}</span></td>
                  <td>{u.department}</td>
                  <td>
                    {u.role === 'alumni' ? (
                      <span className={`badge ${u.verified ? 'badge-accent' : 'badge-warning'}`}>
                        {u.verified ? 'Verified' : 'Pending'}
                      </span>
                    ) : (
                      <span className="badge badge-accent">Active</span>
                    )}
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>{u.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'analytics' && (
        <div className="grid-2">
          <div className="glass-card">
            <h3 className="section-title">🏆 Top Mentors</h3>
            {alumni.filter(a => a.verified).length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No verified mentors yet</p>
            ) : (
              alumni.filter(a => a.verified).slice(0, 5).map((a, i) => {
                const mentorSessions = sessions.filter(s => s.alumniId === a.id && s.status === 'completed').length;
                return (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--glass-border)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary-400)', width: '24px' }}>#{i + 1}</span>
                    <div className="navbar-avatar">{a.name?.[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{a.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.employer}</div>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-400)' }}>{mentorSessions} sessions</span>
                  </div>
                );
              })
            )}
          </div>

          <div className="glass-card">
            <h3 className="section-title">📈 Engagement Metrics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Match Rate</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary-400)' }}>
                    {requests.length > 0 ? Math.round((requests.filter(r => r.status === 'accepted').length / requests.length) * 100) : 0}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${requests.length > 0 ? Math.round((requests.filter(r => r.status === 'accepted').length / requests.length) * 100) : 0}%` }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Session Completion</span>
                  <span style={{ fontWeight: 600, color: 'var(--accent-400)' }}>
                    {sessions.length > 0 ? Math.round((completedSessions / sessions.length) * 100) : 0}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${sessions.length > 0 ? Math.round((completedSessions / sessions.length) * 100) : 0}%` }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Feedback Response Rate</span>
                  <span style={{ fontWeight: 600, color: 'var(--warning-400)' }}>
                    {completedSessions > 0 ? Math.round((feedback.length / completedSessions) * 100) : 0}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${completedSessions > 0 ? Math.round((feedback.length / completedSessions) * 100) : 0}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
