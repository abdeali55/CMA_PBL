export default function MatchCard({ match, onRequest, requested }) {
  const { alumni, total, breakdown } = match;

  const initials = alumni.name?.split(' ').map(n => n[0]).join('') || '?';

  return (
    <div className="match-card">
      <div className="match-card-header">
        <div className="match-avatar">{initials}</div>
        <div className="match-info">
          <h3>{alumni.name}</h3>
          <p>{alumni.jobTitle} at {alumni.employer}</p>
        </div>
        <div className="match-score">
          <div className="score-value">{total}%</div>
          <div className="score-label">Match</div>
        </div>
      </div>

      <div className="match-tags">
        <div className="tag-container">
          {alumni.skills?.slice(0, 4).map((s, i) => (
            <span key={i} className="tag">{s}</span>
          ))}
          {alumni.skills?.length > 4 && <span className="tag">+{alumni.skills.length - 4}</span>}
        </div>
      </div>

      <div className="match-breakdown">
        {Object.entries(breakdown).map(([key, val]) => (
          <div key={key} className="breakdown-item">
            <span>{key}</span>
            <span>{val}%</span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
        {alumni.bio}
      </p>

      <div className="match-actions">
        {requested ? (
          <button className="btn btn-outline btn-sm" disabled>✓ Request Sent</button>
        ) : (
          <button className="btn btn-primary" onClick={() => onRequest(alumni.id)}>
            Send Mentorship Request
          </button>
        )}
        <span className="badge badge-primary" style={{ marginLeft: 'auto' }}>
          {alumni.meetingMode}
        </span>
      </div>
    </div>
  );
}
