import ListItem from '../ListItem';

export default function MenuItem({
  item,
  context,
  isFocused,
  isSelected,
  onSelect,
  onMouseEnter,
}) {
  const isDisabled = typeof item.disabled === 'function' ? item.disabled(context) : item.disabled;
  const label = typeof item.label === 'function' ? item.label(context) : item.label;

  const handleClick = () => {
    if (!isDisabled) {
      onSelect(item);
    }
  };

  const state = { isFocused, isSelected, isDisabled };

  return (
    <ListItem
      icon={item.icon}
      label={label}
      meta={item.meta}
      hasArrow={item.hasChildren}
      state={state}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      className="menu-item"
    />
  );
}
