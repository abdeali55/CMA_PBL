import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getRequests, updateRequest, getSessions, addSession, getFeedback, getUsers, getUserById, generateId } from '../utils/storage';
import StatsCard from '../components/StatsCard';
import FeedbackForm from '../components/FeedbackForm';
import { addFeedback, updateSession, updateUser } from '../utils/storage';

export default function AlumniDashboard() {
  const { user, addToast, refreshUser } = useAuth();
  const [tab, setTab] = useState('overview');
  const [feedbackSession, setFeedbackSession] = useState(null);
  const [scheduleModal, setScheduleModal] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleAgenda, setScheduleAgenda] = useState('');

  const requests = getRequests().filter(r => r.alumniId === user.id);
  const sessions = getSessions().filter(s => s.alumniId === user.id);
  const allFeedback = getFeedback();

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const acceptedRequests = requests.filter(r => r.status === 'accepted');
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const upcomingSessions = sessions.filter(s => s.status === 'upcoming');

  const avgRating = allFeedback.length > 0
    ? (allFeedback.reduce((sum, f) => sum + (f.overall || 0), 0) / allFeedback.length).toFixed(1)
    : 'N/A';

  function handleAccept(reqId) {
    updateRequest(reqId, { status: 'accepted' });
    const req = getRequests().find(r => r.id === reqId);
    if (req) {
      updateUser(user.id, { currentMentees: (user.currentMentees || 0) + 1 });
      refreshUser();
    }
    addToast('Mentorship request accepted!', 'success');
  }

  function handleDecline(reqId) {
    updateRequest(reqId, { status: 'declined' });
    addToast('Request declined.', 'info');
  }

  function handleSchedule(e) {
    e.preventDefault();
    if (!scheduleDate) return;
    const req = getRequests().find(r => r.id === scheduleModal);
    if (!req) return;
    addSession({
      id: generateId(),
      studentId: req.studentId,
      alumniId: user.id,
      requestId: req.id,
      date: scheduleDate,
      agenda: scheduleAgenda || 'General mentorship session',
      mode: 'Online',
      status: 'upcoming',
      feedbackGiven: false,
      createdAt: new Date().toISOString(),
    });
    setScheduleModal(null);
    setScheduleDate('');
    setScheduleAgenda('');
    addToast('Session scheduled!', 'success');
  }

  function markComplete(sessionId) {
    updateSession(sessionId, { status: 'completed' });
    addToast('Session marked as completed.', 'success');
  }

  function handleFeedbackSubmit(fb) {
    addFeedback({ ...fb, id: generateId(), userId: user.id });
    updateSession(fb.sessionId, { feedbackGiven: true });
    setFeedbackSession(null);
    addToast('Feedback submitted!', 'success');
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Mentor Dashboard 💼</h1>
        <p>Manage your mentees, sessions, and track your impact.</p>
      </div>

      {!user.verified && (
        <div style={{ padding: '14px 20px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '12px', marginBottom: '24px', fontSize: '0.875rem', color: 'var(--warning-400)' }}>
          ⏳ Your profile is pending admin verification. You'll be visible to students once approved.
        </div>
      )}

      <div className="stats-grid">
        <StatsCard icon="👥" value={acceptedRequests.length} label="Active Mentees" color="rgba(99,102,241,0.12)" />
        <StatsCard icon="📅" value={upcomingSessions.length} label="Upcoming Sessions" color="rgba(16,185,129,0.12)" />
        <StatsCard icon="✅" value={completedSessions.length} label="Completed Sessions" color="rgba(245,158,11,0.12)" />
        <StatsCard icon="⭐" value={avgRating} label="Avg. Rating" color="rgba(139,92,246,0.12)" />
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>Overview</button>
        <button className={`tab ${tab === 'requests' ? 'active' : ''}`} onClick={() => setTab('requests')}>
          Requests {pendingRequests.length > 0 && <span className="badge badge-warning" style={{ marginLeft: '6px' }}>{pendingRequests.length}</span>}
        </button>
        <button className={`tab ${tab === 'mentees' ? 'active' : ''}`} onClick={() => setTab('mentees')}>Mentees</button>
        <button className={`tab ${tab === 'sessions' ? 'active' : ''}`} onClick={() => setTab('sessions')}>Sessions</button>
      </div>

      {tab === 'overview' && (
        <div className="grid-2">
          <div className="glass-card">
            <h3 className="section-title">📬 Pending Requests</h3>
            {pendingRequests.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No pending requests</p>
            ) : (
              pendingRequests.slice(0, 3).map(req => {
                const student = getUserById(req.studentId);
                return (
                  <div key={req.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--glass-border)' }}>
                    <div className="navbar-avatar">{student?.name?.[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{student?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student?.department}</div>
                    </div>
                    <button className="btn btn-accent btn-sm" onClick={() => handleAccept(req.id)}>Accept</button>
                    <button className="btn btn-outline btn-sm" onClick={() => handleDecline(req.id)}>Decline</button>
                  </div>
                );
              })
            )}
          </div>

          <div className="glass-card">
            <h3 className="section-title">📊 Your Impact</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total mentees mentored</span>
                <span style={{ fontWeight: 600 }}>{acceptedRequests.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total sessions</span>
                <span style={{ fontWeight: 600 }}>{sessions.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Mentee capacity</span>
                <span style={{ fontWeight: 600 }}>{user.currentMentees || 0} / {user.maxMentees || 3}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'requests' && (
        <div>
          {requests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📬</div>
              <h3>No requests yet</h3>
              <p>You'll see mentorship requests from students here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {requests.map(req => {
                const student = getUserById(req.studentId);
                return (
                  <div key={req.id} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="match-avatar">{student?.name?.[0] || '?'}</div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.95rem' }}>{student?.name}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{student?.department} • Class of {student?.graduationYear}</p>
                      {student?.careerGoals?.length > 0 && (
                        <div className="tag-container" style={{ marginTop: '6px' }}>
                          {student.careerGoals.slice(0, 3).map((g, i) => <span key={i} className="tag">{g}</span>)}
                        </div>
                      )}
                    </div>
                    {req.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-accent btn-sm" onClick={() => handleAccept(req.id)}>Accept</button>
                        <button className="btn btn-outline btn-sm" onClick={() => handleDecline(req.id)}>Decline</button>
                      </div>
                    ) : (
                      <span className={`badge ${req.status === 'accepted' ? 'badge-accent' : 'badge-danger'}`}>{req.status}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'mentees' && (
        <div>
          {acceptedRequests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No active mentees</h3>
              <p>Accept mentorship requests to start mentoring.</p>
            </div>
          ) : (
            <div className="grid-2">
              {acceptedRequests.map(req => {
                const student = getUserById(req.studentId);
                if (!student) return null;
                const pairSessions = sessions.filter(s => s.studentId === student.id);
                return (
                  <div key={req.id} className="glass-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                      <div className="match-avatar">{student.name?.[0]}</div>
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{student.name}</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{student.department} • {student.graduationYear}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                      <span>{pairSessions.length} session(s)</span>
                      <span className="badge badge-accent">Active</span>
                    </div>
                    <button className="btn btn-primary btn-sm" style={{ width: '100%' }} onClick={() => setScheduleModal(req.id)}>
                      Schedule Session
                    </button>
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
              <p>Schedule sessions with your mentees from the Mentees tab.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sessions.map(session => {
                const student = getUserById(session.studentId);
                const date = new Date(session.date);
                return (
                  <div key={session.id} className="session-card">
                    <div className="session-date">
                      <div className="day">{date.getDate()}</div>
                      <div className="month">{date.toLocaleString('default', { month: 'short' })}</div>
                    </div>
                    <div className="session-details">
                      <h4>Session with {student?.name || 'Student'}</h4>
                      <p>{session.agenda} • {session.mode}</p>
                    </div>
                    <span className={`session-status status-${session.status}`}>{session.status}</span>
                    {session.status === 'upcoming' && (
                      <button className="btn btn-accent btn-sm" onClick={() => markComplete(session.id)}>Mark Complete</button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Schedule Modal */}
      {scheduleModal && (
        <div className="modal-overlay" onClick={() => setScheduleModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Schedule Session</h2>
            <form onSubmit={handleSchedule}>
              <div className="form-group">
                <label className="form-label">Date & Time</label>
                <input type="datetime-local" className="form-input" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Agenda</label>
                <textarea className="form-textarea" value={scheduleAgenda} onChange={e => setScheduleAgenda(e.target.value)} placeholder="Topics to discuss..." />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary">Schedule</button>
                <button type="button" className="btn btn-outline" onClick={() => setScheduleModal(null)}>Cancel</button>
              </div>
            </form>
          </div>
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
