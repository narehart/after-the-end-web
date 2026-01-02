import MenuItem from './MenuItem';

export default function MenuList({
  items,
  context,
  focusIndex,
  selectedId,
  onSelect,
  onSetFocusIndex,
  onHoverItem,
  emptyMessage = 'No options available',
}) {
  if (!items || items.length === 0) {
    return <div className="menu-empty">{emptyMessage}</div>;
  }

  const getMouseEnterHandler = (index) => {
    if (onSetFocusIndex) return () => onSetFocusIndex(index);
    if (onHoverItem) return () => onHoverItem(index);
    return undefined;
  };

  return (
    <div className="menu-list">
      {items.map((item, index) => (
        <MenuItem
          key={item.id}
          item={item}
          context={context}
          isFocused={index === focusIndex}
          isSelected={item.id === selectedId}
          onSelect={onSelect}
          onMouseEnter={getMouseEnterHandler(index)}
        />
      ))}
    </div>
  );
}
