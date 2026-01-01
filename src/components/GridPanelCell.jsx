import useGridPanelCell from '../hooks/useGridPanelCell';
import GridItemDisplay from './GridItemDisplay';
import './GridPanelCell.css';

function buildClassName(itemId, isSelected, isOrigin, isFocused) {
  const classes = ['grid-cell'];
  classes.push(itemId ? 'occupied' : 'empty');
  if (isSelected) classes.push('selected');
  if (isOrigin) classes.push('origin');
  if (isFocused) classes.push('keyboard-focused');
  return classes.join(' ');
}

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

  return (
    <div
      ref={cellRef}
      className={buildClassName(itemId, isSelected, isOrigin, isFocused)}
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
