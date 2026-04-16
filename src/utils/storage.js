/* localStorage CRUD helpers */

const KEYS = {
  USERS: 'mc_users',
  CURRENT_USER: 'mc_current_user',
  MATCHES: 'mc_matches',
  SESSIONS: 'mc_sessions',
  FEEDBACK: 'mc_feedback',
  REQUESTS: 'mc_requests',
};

function get(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

function set(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Users
export function getUsers() { return get(KEYS.USERS) || []; }
export function setUsers(users) { set(KEYS.USERS, users); }
export function getUserById(id) { return getUsers().find(u => u.id === id); }

export function addUser(user) {
  const users = getUsers();
  users.push(user);
  setUsers(users);
}

export function updateUser(id, updates) {
  const users = getUsers().map(u => u.id === id ? { ...u, ...updates } : u);
  setUsers(users);
  const cur = getCurrentUser();
  if (cur && cur.id === id) setCurrentUser({ ...cur, ...updates });
}

// Auth
export function getCurrentUser() { return get(KEYS.CURRENT_USER); }
export function setCurrentUser(user) { set(KEYS.CURRENT_USER, user); }
export function logout() { localStorage.removeItem(KEYS.CURRENT_USER); }

// Requests
export function getRequests() { return get(KEYS.REQUESTS) || []; }
export function setRequests(reqs) { set(KEYS.REQUESTS, reqs); }
export function addRequest(req) {
  const reqs = getRequests();
  reqs.push(req);
  setRequests(reqs);
}
export function updateRequest(id, updates) {
  const reqs = getRequests().map(r => r.id === id ? { ...r, ...updates } : r);
  setRequests(reqs);
}

// Sessions
export function getSessions() { return get(KEYS.SESSIONS) || []; }
export function setSessions(sessions) { set(KEYS.SESSIONS, sessions); }
export function addSession(session) {
  const sessions = getSessions();
  sessions.push(session);
  setSessions(sessions);
}
export function updateSession(id, updates) {
  const sessions = getSessions().map(s => s.id === id ? { ...s, ...updates } : s);
  setSessions(sessions);
}

// Feedback
export function getFeedback() { return get(KEYS.FEEDBACK) || []; }
export function addFeedback(fb) {
  const list = getFeedback();
  list.push(fb);
  set(KEYS.FEEDBACK, list);
}

// Utility
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
