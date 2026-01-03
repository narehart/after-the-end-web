import type { ReactNode } from 'react';
import classNames from 'classnames/bind';
import styles from './EmptyState.module.css';
import { Box, Text } from './index';

const cx = classNames.bind(styles);

interface EmptyStateProps {
  message: string;
  icon?: ReactNode;
  description?: ReactNode;
  className?: string;
}

export default function EmptyState({
  message,
  icon,
  description,
  className,
}: EmptyStateProps): React.JSX.Element {
  return (
    <Box
      className={className !== undefined ? `${cx('empty-state')} ${className}` : cx('empty-state')}
    >
      {icon !== undefined ? <Text className={cx('empty-icon')}>{icon}</Text> : null}
      <Text className={cx('empty-message')}>{message}</Text>
      {description !== undefined ? (
        <Text className={cx('empty-description')}>{description}</Text>
      ) : null}
    </Box>
  );
}
