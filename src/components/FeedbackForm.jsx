import { useState } from 'react';

export default function FeedbackForm({ sessionId, onSubmit, onCancel }) {
  const [overall, setOverall] = useState(0);
  const [goalProgress, setGoalProgress] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [recommend, setRecommend] = useState('');
  const [comments, setComments] = useState('');

  function StarRow({ label, value, onChange }) {
    return (
      <div className="form-group">
        <label className="form-label">{label}</label>
        <div className="stars">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              className={`star ${n <= value ? 'filled' : ''}`}
              onClick={() => onChange(n)}
            >
              ★
            </button>
          ))}
        </div>
      </div>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (overall === 0) return;
    onSubmit({
      sessionId,
      overall,
      goalProgress,
      communication,
      recommend,
      comments,
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <StarRow label="Overall Session Rating" value={overall} onChange={setOverall} />
      <StarRow label="Goal Progress" value={goalProgress} onChange={setGoalProgress} />
      <StarRow label="Communication Quality" value={communication} onChange={setCommunication} />

      <div className="form-group">
        <label className="form-label">Would you recommend?</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          {['Yes', 'No', 'Maybe'].map(opt => (
            <button
              key={opt}
              type="button"
              className={`btn btn-sm ${recommend === opt ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setRecommend(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Comments</label>
        <textarea
          className="form-textarea"
          value={comments}
          onChange={e => setComments(e.target.value)}
          placeholder="Share your thoughts about this session..."
          maxLength={300}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
        <button type="submit" className="btn btn-accent" disabled={overall === 0}>Submit Feedback</button>
        {onCancel && <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
