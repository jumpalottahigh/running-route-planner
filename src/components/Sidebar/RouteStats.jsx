import { formatDistance, estimateDuration, estimateCalories } from '../../utils/formatUtils';

export default function RouteStats({ route, unit, pace }) {
  if (!route) return null;

  const dist = formatDistance(route.distanceMeters, unit);
  const duration = estimateDuration(route.distanceMeters, pace);
  const cals = estimateCalories(route.distanceMeters);

  return (
    <div className="card stats-card">
      <span className="section-label">Route Stats</span>
      <div className="stats-grid">
        <div className="stat">
          <span className="stat-icon">📏</span>
          <span className="stat-value">{dist}</span>
          <span className="stat-label">{unit}</span>
        </div>
        <div className="stat">
          <span className="stat-icon">⏱️</span>
          <span className="stat-value">{duration}</span>
          <span className="stat-label">est. time</span>
        </div>
        <div className="stat">
          <span className="stat-icon">🔥</span>
          <span className="stat-value">{cals}</span>
          <span className="stat-label">kcal</span>
        </div>
      </div>
    </div>
  );
}
