import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUsers, getRequests, addRequest, generateId } from '../utils/storage';
import { findMatches } from '../utils/matching';
import MatchCard from '../components/MatchCard';

export default function FindMentor() {
  const { user, addToast } = useAuth();
  const [matches, setMatches] = useState([]);
  const [requestedIds, setRequestedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const existing = getRequests().filter(r => r.studentId === user.id).map(r => r.alumniId);
    setRequestedIds(existing);
  }, [user.id]);

  function handleFindMentor() {
    setLoading(true);
    const allUsers = getUsers();
    const alumni = allUsers.filter(u => u.role === 'alumni' && u.verified);

    // Simulate brief loading
    setTimeout(() => {
      const results = findMatches(user, alumni, 5);
      setMatches(results);
      setHasSearched(true);
      setLoading(false);
      if (results.length === 0) {
        addToast('No matching mentors found. Try updating your profile.', 'info');
      } else {
        addToast(`Found ${results.length} mentor matches!`, 'success');
      }
    }, 800);
  }

  function handleRequest(alumniId) {
    addRequest({
      id: generateId(),
      studentId: user.id,
      alumniId,
      status: 'pending',
      score: matches.find(m => m.alumni.id === alumniId)?.total || 0,
      createdAt: new Date().toISOString(),
    });
    setRequestedIds(prev => [...prev, alumniId]);
    addToast('Mentorship request sent!', 'success');
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Find Your Mentor 🔍</h1>
        <p>Our algorithm analyzes 7 key criteria to find your best alumni mentor matches.</p>
      </div>

      {/* Algorithm Info */}
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '6px' }}>🤖 Smart Matching Engine</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Matches based on: Career Goals (30%) • Industry (20%) • Skills (20%) • Department (10%) • Availability (10%) • Style (5%) • Capacity (5%)
            </p>
          </div>
          <button className="btn btn-primary btn-lg" onClick={handleFindMentor} disabled={loading}>
            {loading ? '⏳ Analyzing...' : '🚀 Find My Mentor'}
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px', animation: 'pulse 1.5s infinite' }}>🤖</div>
          <p style={{ color: 'var(--text-secondary)' }}>Running matching algorithm...</p>
          <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
        </div>
      )}

      {/* Results */}
      {!loading && hasSearched && (
        <div>
          {matches.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">😔</div>
              <h3>No matches found</h3>
              <p>Try updating your profile with more career goals and skills to improve match quality.</p>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>
                Top {matches.length} Matches
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {matches.map((match, i) => (
                  <MatchCard
                    key={match.alumni.id}
                    match={match}
                    onRequest={handleRequest}
                    requested={requestedIds.includes(match.alumni.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Initial State */}
      {!loading && !hasSearched && (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <h3>Ready to find your mentor?</h3>
          <p>Click "Find My Mentor" to run the matching algorithm and discover your top alumni matches.</p>
        </div>
      )}
    </div>
  );
}
