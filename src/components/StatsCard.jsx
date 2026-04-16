export default function StatsCard({ icon, value, label, color }) {
  const bgColor = color || 'rgba(99, 102, 241, 0.12)';
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: bgColor }}>{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
