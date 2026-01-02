import classNames from 'classnames/bind';
import styles from './ConditionBar.module.css';

const cx = classNames.bind(styles);

interface ConditionBarProps {
  label: string;
  value: number;
  max?: number;
  color: string;
}

export default function ConditionBar({
  label,
  value,
  max = 100,
  color,
}: ConditionBarProps): React.JSX.Element {
  const percentage = (value / max) * 100;
  return (
    <div className={cx('condition-bar')}>
      <span className={cx('condition-label')}>{label}</span>
      <div className={cx('condition-track')}>
        <div
          className={cx('condition-fill')}
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <span className={cx('condition-value')}>{value}</span>
    </div>
  );
}
