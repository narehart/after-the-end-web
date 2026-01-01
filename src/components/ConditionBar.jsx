import './ConditionBar.css';

export default function ConditionBar({ label, value, max = 100, color }) {
  const percentage = (value / max) * 100;
  return (
    <div className="condition-bar">
      <span className="condition-label">{label}</span>
      <div className="condition-track">
        <div
          className="condition-fill"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <span className="condition-value">{value}</span>
    </div>
  );
}
