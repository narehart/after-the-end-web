import type { RefObject, ReactNode, MouseEvent, KeyboardEvent } from 'react';
import classNames from 'classnames/bind';
import type { ListItemState } from '../../types/ui';
import styles from './ListItem.module.css';
import { Flex, Text } from './index';

const cx = classNames.bind(styles);

interface ListItemProps {
  icon?: ReactNode | undefined;
  label: ReactNode;
  meta?: ReactNode | undefined;
  hasArrow?: boolean | undefined;
  state?: ListItemState | undefined;
  onClick?: (() => void) | undefined;
  onDoubleClick?: (() => void) | undefined;
  onContextMenu?: ((e: MouseEvent<HTMLButtonElement>) => void) | undefined;
  onKeyDown?: ((e: KeyboardEvent<HTMLButtonElement>) => void) | undefined;
  onMouseEnter?: (() => void) | undefined;
  className?: string | undefined;
  itemRef?: RefObject<HTMLButtonElement | null> | undefined;
}

export default function ListItem({
  icon,
  label,
  meta,
  hasArrow,
  state = {},
  onClick,
  onDoubleClick,
  onContextMenu,
  onKeyDown,
  onMouseEnter,
  className: extraClassName,
  itemRef,
}: ListItemProps): React.JSX.Element {
  const buttonClasses = cx('list-item', {
    focused: state.isFocused,
    active: state.isActive,
    selected: state.isSelected,
    disabled: state.isDisabled,
    empty: state.isEmpty,
  });

  return (
    <Flex
      as="button"
      ref={itemRef}
      align="center"
      gap="8"
      className={
        extraClassName !== undefined ? `${buttonClasses} ${extraClassName}` : buttonClasses
      }
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      disabled={state.isDisabled}
      tabIndex={0}
      role="option"
      aria-selected={state.isFocused}
    >
      {icon !== null && icon !== undefined ? (
        <Flex align="center" justify="center" className={cx('list-item-icon')}>
          {icon}
        </Flex>
      ) : null}
      <Text ellipsis className={cx('list-item-label')}>
        {label}
      </Text>
      {meta !== null && meta !== undefined ? (
        <Text type="muted" code className={cx('list-item-meta')}>
          {meta}
        </Text>
      ) : null}
      {hasArrow === true ? (
        <Text type="muted" className={cx('list-item-arrow')}>
          ›
        </Text>
      ) : null}
    </Flex>
  );
}
