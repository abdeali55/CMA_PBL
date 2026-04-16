/* Matching Algorithm — weighted multi-criteria scoring */

/**
 * Jaccard similarity between two arrays of strings
 * Returns value between 0 and 1
 */
function jaccard(a, b) {
  if (!a?.length || !b?.length) return 0;
  const setA = new Set(a.map(s => s.toLowerCase().trim()));
  const setB = new Set(b.map(s => s.toLowerCase().trim()));
  const intersection = [...setA].filter(x => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Check if department/major matches
 * Same = 1.0, adjacent (same faculty) = 0.5, else 0
 */
const ADJACENT_DEPTS = {
  'Computer Science': ['Information Technology', 'Data Science', 'Software Engineering', 'AI & ML'],
  'Information Technology': ['Computer Science', 'Data Science', 'Software Engineering'],
  'Data Science': ['Computer Science', 'Information Technology', 'AI & ML', 'Mathematics'],
  'AI & ML': ['Computer Science', 'Data Science'],
  'Electrical Engineering': ['Electronics', 'Instrumentation'],
  'Electronics': ['Electrical Engineering', 'Instrumentation'],
  'Mechanical Engineering': ['Automobile Engineering', 'Industrial Engineering'],
  'Civil Engineering': ['Architecture', 'Environmental Engineering'],
  'Business Administration': ['Finance', 'Marketing', 'Human Resources'],
  'Finance': ['Business Administration', 'Economics'],
  'Marketing': ['Business Administration', 'Communications'],
};

function departmentScore(studentDept, alumniDept) {
  if (!studentDept || !alumniDept) return 0;
  const s = studentDept.trim();
  const a = alumniDept.trim();
  if (s.toLowerCase() === a.toLowerCase()) return 1.0;
  const adj = ADJACENT_DEPTS[s] || [];
  return adj.some(d => d.toLowerCase() === a.toLowerCase()) ? 0.5 : 0;
}

/**
 * Availability overlap — simple count of overlapping day slots
 */
function availabilityScore(studentAvail, alumniAvail) {
  if (!studentAvail?.length || !alumniAvail?.length) return 0;
  const sSet = new Set(studentAvail.map(s => s.toLowerCase()));
  const overlap = alumniAvail.filter(a => sSet.has(a.toLowerCase())).length;
  const maxPossible = Math.max(studentAvail.length, alumniAvail.length);
  return maxPossible === 0 ? 0 : overlap / maxPossible;
}

/**
 * Mentorship style fit
 */
function styleFitScore(studentStyle, alumniStyle) {
  if (!studentStyle || !alumniStyle) return 0.5;
  return studentStyle.toLowerCase() === alumniStyle.toLowerCase() ? 1.0 : 0.3;
}

/**
 * Capacity penalty — penalise if alumni is near mentee limit
 */
function capacityScore(currentMentees, maxMentees) {
  if (!maxMentees || maxMentees <= 0) return 0;
  if (currentMentees >= maxMentees) return 0;
  const ratio = currentMentees / maxMentees;
  return 1.0 - (ratio * 0.8); // Light penalty
}

/**
 * Compute compatibility score between a student and an alumni
 * Returns { total, breakdown } where total is 0-100
 */
export function computeMatch(student, alumni) {
  const careerGoal = jaccard(student.careerGoals || [], alumni.areasToMentor || []);
  const industry = jaccard(student.preferredIndustry || [], alumni.industry || []);
  const skills = jaccard(student.skills || [], alumni.skills || []);
  const dept = departmentScore(student.department, alumni.department);
  const avail = availabilityScore(student.availability || [], alumni.availability || []);
  const style = styleFitScore(student.mentorshipStyle, alumni.mentorshipStyle);
  const capacity = capacityScore(alumni.currentMentees || 0, alumni.maxMentees || 3);

  const total = (
    0.30 * careerGoal +
    0.20 * industry +
    0.20 * skills +
    0.10 * dept +
    0.10 * avail +
    0.05 * style +
    0.05 * capacity
  ) * 100;

  return {
    total: Math.round(total),
    breakdown: {
      'Career Goals': Math.round(careerGoal * 100),
      'Industry': Math.round(industry * 100),
      'Skills': Math.round(skills * 100),
      'Department': Math.round(dept * 100),
      'Availability': Math.round(avail * 100),
      'Style Fit': Math.round(style * 100),
      'Capacity': Math.round(capacity * 100),
    }
  };
}

/**
 * Find top N matches for a student from available alumni
 */
export function findMatches(student, alumniList, topN = 5) {
  const results = alumniList
    .filter(a => a.verified !== false && (a.currentMentees || 0) < (a.maxMentees || 3))
    .map(alumni => ({
      alumni,
      ...computeMatch(student, alumni),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, topN);

  return results;
}
