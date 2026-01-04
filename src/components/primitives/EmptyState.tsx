import type { ReactNode } from 'react';
import classNames from 'classnames/bind';
import styles from './EmptyState.module.css';
import { Flex, Text } from './index';

const cx = classNames.bind(styles);

interface EmptyStateProps {
  message: string;
  description?: ReactNode;
  className?: string;
}

export default function EmptyState({
  message,
  description,
  className,
}: EmptyStateProps): React.JSX.Element {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      className={className !== undefined ? `${cx('empty-state')} ${className}` : cx('empty-state')}
    >
      <Text type="muted">{message}</Text>
      {description !== undefined ? (
        <Text type="muted" size="xs" className={cx('empty-description')}>
          {description}
        </Text>
      ) : null}
    </Flex>
  );
}
