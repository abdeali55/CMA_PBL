import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DEPARTMENTS = ['Computer Science', 'Information Technology', 'Data Science', 'AI & ML', 'Electronics', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Business Administration', 'Finance', 'Marketing'];
const INDUSTRIES = ['Software Development', 'Data Science', 'AI & ML', 'Cloud Computing', 'FinTech', 'E-Commerce', 'Product Management', 'Marketing', 'Digital Marketing', 'Manufacturing', 'Automotive', 'Operations', 'Semiconductors', 'Embedded Systems', 'IoT', 'Finance', 'Investment Banking', 'Consulting', 'Healthcare', 'Education', 'Startups', 'Research'];
const SKILLS_OPTIONS = ['Python', 'JavaScript', 'React', 'Node.js', 'Java', 'C++', 'SQL', 'Machine Learning', 'Data Analytics', 'System Design', 'Cloud Architecture', 'Docker', 'TypeScript', 'MongoDB', 'TensorFlow', 'Excel', 'Agile', 'Project Management', 'Communication', 'Leadership', 'AutoCAD', 'Digital Marketing', 'Financial Modeling', 'Statistics'];
const CAREER_GOALS = ['Software Development', 'Data Science', 'Machine Learning', 'Product Management', 'Career Growth', 'Interview Preparation', 'Higher Education', 'Research', 'Entrepreneurship', 'Career Transition', 'Leadership', 'Tech Industry', 'Core Engineering', 'Web Development', 'Finance', 'Marketing', 'Consulting'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const STYLES = ['Structured', 'Casual', 'Goal-Oriented'];

function TagSelector({ options, selected, onChange, label }) {
  function toggle(item) {
    onChange(selected.includes(item) ? selected.filter(s => s !== item) : [...selected, item]);
  }
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="tag-container">
        {options.map(opt => (
          <button key={opt} type="button" className={`tag ${selected.includes(opt) ? '' : ''}`}
            style={{
              background: selected.includes(opt) ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)',
              borderColor: selected.includes(opt) ? 'var(--primary-500)' : 'var(--glass-border)',
              color: selected.includes(opt) ? 'var(--primary-300)' : 'var(--text-muted)',
              cursor: 'pointer',
            }}
            onClick={() => toggle(opt)}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Register() {
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  // Shared
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [skills, setSkills] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [mentorshipStyle, setMentorshipStyle] = useState('');
  const [linkedin, setLinkedin] = useState('');

  // Student
  const [gradYear, setGradYear] = useState('2026');
  const [careerGoals, setCareerGoals] = useState([]);
  const [preferredIndustry, setPreferredIndustry] = useState([]);

  // Alumni
  const [alumniGradYear, setAlumniGradYear] = useState('2020');
  const [jobTitle, setJobTitle] = useState('');
  const [employer, setEmployer] = useState('');
  const [industry, setIndustry] = useState([]);
  const [experience, setExperience] = useState('');
  const [areasToMentor, setAreasToMentor] = useState([]);
  const [maxMentees, setMaxMentees] = useState('3');
  const [meetingMode, setMeetingMode] = useState('Online');
  const [bio, setBio] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !department) {
      setError('Please fill all required fields.');
      return;
    }

    const userData = { name, email, password, role, department, skills, availability, mentorshipStyle, linkedin };

    if (role === 'student') {
      Object.assign(userData, { graduationYear: parseInt(gradYear), careerGoals, preferredIndustry });
    } else {
      if (!jobTitle || !employer) { setError('Please fill job title and employer.'); return; }
      Object.assign(userData, {
        graduationYear: parseInt(alumniGradYear), jobTitle, employer, industry, experience: parseInt(experience),
        areasToMentor, maxMentees: parseInt(maxMentees), meetingMode, bio,
      });
    }

    const result = register(userData);
    if (result.success) {
      navigate(role === 'student' ? '/dashboard/student' : '/dashboard/alumni');
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join MentorConnect and start your mentorship journey</p>

        <div className="role-selector">
          <button className={`role-option ${role === 'student' ? 'active' : ''}`} onClick={() => setRole('student')}>
            🎓 Student
          </button>
          <button className={`role-option ${role === 'alumni' ? 'active' : ''}`} onClick={() => setRole('alumni')}>
            💼 Alumni
          </button>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: 'var(--danger-400)', fontSize: '0.85rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@college.edu" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" required />
            </div>
            <div className="form-group">
              <label className="form-label">Department *</label>
              <select className="form-select" value={department} onChange={e => setDepartment(e.target.value)} required>
                <option value="">Select department</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {role === 'student' ? (
            <>
              <div className="form-group">
                <label className="form-label">Expected Graduation Year</label>
                <select className="form-select" value={gradYear} onChange={e => setGradYear(e.target.value)}>
                  {[2025, 2026, 2027, 2028].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <TagSelector options={CAREER_GOALS} selected={careerGoals} onChange={setCareerGoals} label="Career Goals (select multiple)" />
              <TagSelector options={INDUSTRIES} selected={preferredIndustry} onChange={setPreferredIndustry} label="Preferred Industries" />
            </>
          ) : (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Graduation Year</label>
                  <select className="form-select" value={alumniGradYear} onChange={e => setAlumniGradYear(e.target.value)}>
                    {Array.from({ length: 15 }, (_, i) => 2026 - i).map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Years of Experience</label>
                  <input type="number" className="form-input" value={experience} onChange={e => setExperience(e.target.value)} min="0" max="30" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Current Job Title *</label>
                  <input className="form-input" value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g. Software Engineer" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Current Employer *</label>
                  <input className="form-input" value={employer} onChange={e => setEmployer(e.target.value)} placeholder="e.g. Google" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Max Mentees per Semester</label>
                  <select className="form-select" value={maxMentees} onChange={e => setMaxMentees(e.target.value)}>
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Meeting Mode</label>
                  <select className="form-select" value={meetingMode} onChange={e => setMeetingMode(e.target.value)}>
                    <option value="Online">Online</option>
                    <option value="In-person">In-person</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
              </div>
              <TagSelector options={INDUSTRIES} selected={industry} onChange={setIndustry} label="Your Industry / Domain" />
              <TagSelector options={CAREER_GOALS} selected={areasToMentor} onChange={setAreasToMentor} label="Areas Willing to Mentor" />
              <div className="form-group">
                <label className="form-label">Bio / Mentorship Philosophy</label>
                <textarea className="form-textarea" value={bio} onChange={e => setBio(e.target.value)} maxLength={500} placeholder="Tell students about yourself and your mentoring approach..." />
              </div>
            </>
          )}

          <TagSelector options={SKILLS_OPTIONS} selected={skills} onChange={setSkills} label="Skills & Technologies" />

          <div className="form-group">
            <label className="form-label">Mentorship Style</label>
            <select className="form-select" value={mentorshipStyle} onChange={e => setMentorshipStyle(e.target.value)}>
              <option value="">Select style</option>
              {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <TagSelector options={DAYS} selected={availability} onChange={setAvailability} label="Availability (select days)" />

          <div className="form-group">
            <label className="form-label">LinkedIn URL (optional)</label>
            <input className="form-input" value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>Create Account</button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
