import classNames from 'classnames/bind';
import useGridPanelCell from '../hooks/useGridPanelCell';
import GridItemDisplay from './GridItemDisplay';
import styles from './GridPanelCell.module.css';

const cx = classNames.bind(styles);

export default function GridPanelCell({ gridId, x, y, itemId, isOrigin, item, isFocused, onNavigate, cellRef }) {
  const { cellState, handleClick, openModal, handleFocus, setSelectedItem } = useGridPanelCell({
    gridId, x, y, itemId, item, onNavigate,
  });
  const { isSelected, hasGrid } = cellState;

  const handleDoubleClick = (e) => openModal(e.currentTarget);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && itemId) {
      setSelectedItem(itemId);
      openModal(e.currentTarget);
    }
  };

  const cellClasses = cx('grid-cell', {
    'occupied': itemId,
    'empty': !itemId,
    'selected': isSelected,
    'origin': isOrigin,
    'keyboard-focused': isFocused,
  });

  return (
    <div
      ref={cellRef}
      className={cellClasses}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      tabIndex={isFocused ? 0 : -1}
      role="gridcell"
      aria-selected={isFocused}
    >
      {isOrigin && item && <GridItemDisplay item={item} hasGrid={hasGrid} />}
    </div>
  );
}
