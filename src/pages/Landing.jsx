import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="landing-hero">
        <div className="hero-content">
          <div className="hero-badge">🚀 Intelligent Mentor Matching</div>
          <h1 className="hero-title">
            Find Your Perfect <br />
            <span className="gradient-text">Alumni Mentor</span>
          </h1>
          <p className="hero-subtitle">
            Our smart matching algorithm connects final-year students with experienced alumni mentors 
            based on career goals, skills, and interests. Start your career journey with expert guidance.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
            <Link to="/login" className="btn btn-outline btn-lg">Sign In</Link>
          </div>
          <div className="hero-stats">
            <div>
              <div className="hero-stat-value">500+</div>
              <div className="hero-stat-label">Active Mentors</div>
            </div>
            <div>
              <div className="hero-stat-value">2,000+</div>
              <div className="hero-stat-label">Students Matched</div>
            </div>
            <div>
              <div className="hero-stat-value">95%</div>
              <div className="hero-stat-label">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2>How It Works</h2>
        <div className="grid-3">
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'rgba(99, 102, 241, 0.12)' }}>📝</div>
            <h3>Create Your Profile</h3>
            <p>Sign up and tell us about your career goals, skills, and interests. Our platform builds your mentorship profile.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'rgba(16, 185, 129, 0.12)' }}>🤖</div>
            <h3>Smart Matching</h3>
            <p>Our algorithm analyzes 7 key criteria including career goals, skills overlap, and availability to find your best matches.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'rgba(245, 158, 11, 0.12)' }}>🤝</div>
            <h3>Connect & Grow</h3>
            <p>Schedule sessions, set goals, track progress, and build lasting professional relationships with your mentor.</p>
          </div>
        </div>
      </section>

      {/* Matching Criteria */}
      <section className="features-section">
        <h2>Intelligent Matching Criteria</h2>
        <div className="grid-4" style={{ maxWidth: '900px', margin: '0 auto' }}>
          {[
            { label: 'Career Goals', weight: '30%', icon: '🎯' },
            { label: 'Industry Match', weight: '20%', icon: '🏢' },
            { label: 'Skills Overlap', weight: '20%', icon: '💡' },
            { label: 'Department', weight: '10%', icon: '🏫' },
            { label: 'Availability', weight: '10%', icon: '📅' },
            { label: 'Style Fit', weight: '5%', icon: '🎨' },
            { label: 'Capacity', weight: '5%', icon: '📊' },
          ].map((item, i) => (
            <div key={i} className="glass-card" style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{item.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary-400)' }}>{item.weight}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '40px 24px', borderTop: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <p>MentorConnect — Alumni Mentorship Matching Platform © 2026</p>
        <p style={{ marginTop: '8px' }}>Built for connecting students with the right mentors.</p>
      </footer>
    </div>
  );
}
