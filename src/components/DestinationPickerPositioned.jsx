import DestinationPicker from './DestinationPicker';

export default function DestinationPickerPositioned({
  actionModalRef,
  actionModalPosition,
  actionModalWidth,
  physicalScale,
  destinationPicker,
  items,
  onSelect,
  onClose,
}) {
  const actionBtns = actionModalRef.current?.querySelectorAll('.modal-action-btn');
  const parentBtn = actionBtns
    ? Array.from(actionBtns).find(
        (btn) => btn.textContent.includes('Move to') || btn.textContent.includes('Unequip to')
      )
    : null;
  const parentBtnTop = parentBtn?.getBoundingClientRect().top || 0;

  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const padding = 0.5 * rem;
  const zoom = physicalScale || 1;
  const cssY = (parentBtnTop - padding) / zoom;
  const cssX = actionModalPosition.x + actionModalWidth - 1;

  return (
    <DestinationPicker
      action={destinationPicker.action}
      item={items[destinationPicker.itemId]}
      position={{ x: cssX, y: cssY }}
      onSelect={onSelect}
      onClose={onClose}
    />
  );
}
