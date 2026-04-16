import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRequests, getSessions, getFeedback, getUsers, getUserById } from '../utils/storage';
import StatsCard from '../components/StatsCard';
import FeedbackForm from '../components/FeedbackForm';
import { addFeedback, updateSession, generateId } from '../utils/storage';

export default function StudentDashboard() {
  const { user, addToast } = useAuth();
  const [tab, setTab] = useState('overview');
  const [feedbackSession, setFeedbackSession] = useState(null);

  const requests = getRequests().filter(r => r.studentId === user.id);
  const sessions = getSessions().filter(s => s.studentId === user.id);
  const feedback = getFeedback().filter(f => sessions.some(s => s.id === f.sessionId));

  const acceptedRequests = requests.filter(r => r.status === 'accepted');
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const upcomingSessions = sessions.filter(s => s.status === 'upcoming');

  function handleFeedbackSubmit(fb) {
    addFeedback({ ...fb, id: generateId(), userId: user.id });
    updateSession(fb.sessionId, { feedbackGiven: true });
    setFeedbackSession(null);
    addToast('Feedback submitted successfully!', 'success');
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Welcome back, {user.name?.split(' ')[0]} 👋</h1>
        <p>Track your mentorship journey and connect with alumni mentors.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatsCard icon="🤝" value={acceptedRequests.length} label="Active Mentors" color="rgba(99,102,241,0.12)" />
        <StatsCard icon="📅" value={upcomingSessions.length} label="Upcoming Sessions" color="rgba(16,185,129,0.12)" />
        <StatsCard icon="✅" value={completedSessions.length} label="Sessions Completed" color="rgba(245,158,11,0.12)" />
        <StatsCard icon="⏳" value={pendingRequests.length} label="Pending Requests" color="rgba(139,92,246,0.12)" />
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>Overview</button>
        <button className={`tab ${tab === 'mentors' ? 'active' : ''}`} onClick={() => setTab('mentors')}>My Mentors</button>
        <button className={`tab ${tab === 'sessions' ? 'active' : ''}`} onClick={() => setTab('sessions')}>Sessions</button>
        <button className={`tab ${tab === 'requests' ? 'active' : ''}`} onClick={() => setTab('requests')}>Requests</button>
      </div>

      {/* Tab Content */}
      {tab === 'overview' && (
        <div>
          {acceptedRequests.length === 0 && pendingRequests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No mentors yet</h3>
              <p>Start by finding your ideal alumni mentor.</p>
              <Link to="/find-mentor" className="btn btn-primary">Find My Mentor</Link>
            </div>
          ) : (
            <div className="grid-2">
              <div className="glass-card">
                <h3 className="section-title">📊 Your Progress</h3>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                    <span>Mentorship Journey</span>
                    <span style={{ color: 'var(--primary-400)' }}>{Math.min(completedSessions.length * 20, 100)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${Math.min(completedSessions.length * 20, 100)}%` }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span>Sessions this month</span>
                  <span style={{ color: 'var(--accent-400)' }}>{sessions.length}</span>
                </div>
              </div>

              <div className="glass-card">
                <h3 className="section-title">⚡ Quick Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link to="/find-mentor" className="btn btn-primary" style={{ width: '100%' }}>Find New Mentor</Link>
                  <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => setTab('sessions')}>View Sessions</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'mentors' && (
        <div>
          {acceptedRequests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎓</div>
              <h3>No active mentors</h3>
              <p>Your accepted mentorship requests will appear here.</p>
            </div>
          ) : (
            <div className="grid-2">
              {acceptedRequests.map(req => {
                const mentor = getUserById(req.alumniId);
                if (!mentor) return null;
                return (
                  <div key={req.id} className="glass-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                      <div className="match-avatar">{mentor.name?.[0]}</div>
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{mentor.name}</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{mentor.jobTitle} at {mentor.employer}</p>
                      </div>
                    </div>
                    <div className="tag-container">
                      {mentor.skills?.slice(0, 3).map((s, i) => <span key={i} className="tag">{s}</span>)}
                    </div>
                    <span className="badge badge-accent" style={{ marginTop: '12px' }}>Active Mentorship</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'sessions' && (
        <div>
          {sessions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <h3>No sessions yet</h3>
              <p>Sessions will appear here once your mentor schedules one.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sessions.map(session => {
                const mentor = getUserById(session.alumniId);
                const date = new Date(session.date);
                return (
                  <div key={session.id} className="session-card">
                    <div className="session-date">
                      <div className="day">{date.getDate()}</div>
                      <div className="month">{date.toLocaleString('default', { month: 'short' })}</div>
                    </div>
                    <div className="session-details">
                      <h4>Session with {mentor?.name || 'Mentor'}</h4>
                      <p>{session.agenda || 'No agenda set'} • {session.mode || 'Online'}</p>
                    </div>
                    <span className={`session-status status-${session.status}`}>{session.status}</span>
                    {session.status === 'completed' && !session.feedbackGiven && (
                      <button className="btn btn-accent btn-sm" onClick={() => setFeedbackSession(session.id)}>
                        Give Feedback
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'requests' && (
        <div>
          {requests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📨</div>
              <h3>No requests</h3>
              <p>Your mentorship requests will appear here.</p>
              <Link to="/find-mentor" className="btn btn-primary">Find Mentor</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {requests.map(req => {
                const mentor = getUserById(req.alumniId);
                return (
                  <div key={req.id} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="match-avatar">{mentor?.name?.[0] || '?'}</div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.95rem' }}>{mentor?.name || 'Alumni'}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{mentor?.jobTitle} at {mentor?.employer}</p>
                    </div>
                    <span className={`badge ${req.status === 'accepted' ? 'badge-accent' : req.status === 'declined' ? 'badge-danger' : 'badge-warning'}`}>
                      {req.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackSession && (
        <div className="modal-overlay" onClick={() => setFeedbackSession(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Session Feedback</h2>
            <FeedbackForm sessionId={feedbackSession} onSubmit={handleFeedbackSubmit} onCancel={() => setFeedbackSession(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
