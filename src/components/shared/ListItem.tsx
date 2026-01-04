import type { ReactNode } from 'react';
import classNames from 'classnames/bind';
import styles from './ListItem.module.css';

const cx = classNames.bind(styles);

interface ListItemProps {
  children: ReactNode;
  selected?: boolean;
  focused?: boolean;
  active?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function ListItem({
  children,
  selected,
  focused,
  active,
  disabled,
  className,
}: ListItemProps): React.JSX.Element {
  const itemClass = cx('list-item', {
    'list-item--selected': selected,
    'list-item--focused': focused,
    'list-item--active': active,
    'list-item--disabled': disabled,
  });
  const fullClassName = className !== undefined ? `${itemClass} ${className}` : itemClass;

  return <div className={fullClassName}>{children}</div>;
}
