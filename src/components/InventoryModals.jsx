import ItemActionModal from './ItemActionModal';
import DestinationPickerPositioned from './DestinationPickerPositioned';

export default function InventoryModals({
  actionModal,
  destinationPicker,
  items,
  actionModalRef,
  actionModalWidth,
  physicalScale,
  closeActionModal,
  closeDestinationPicker,
  closeAllModals,
  handleDestinationPick,
  handleDestinationSelect,
}) {
  return (
    <>
      {actionModal.isOpen && (
        <div
          className="modal-overlay"
          onClick={closeAllModals}
          onKeyDown={(e) => e.key === 'Escape' && closeAllModals()}
          role="button"
          tabIndex={0}
          aria-label="Close modal"
        />
      )}

      {actionModal.isOpen && actionModal.itemId && (
        <ItemActionModal
          ref={actionModalRef}
          item={items[actionModal.itemId]}
          position={actionModal.position}
          context={actionModal.context}
          onClose={closeActionModal}
          onDestinationPick={handleDestinationPick}
          isActive={!destinationPicker.isOpen}
          activeSubmenuAction={destinationPicker.isOpen ? destinationPicker.action : null}
        />
      )}

      {destinationPicker.isOpen && destinationPicker.itemId && (
        <DestinationPickerPositioned
          actionModalRef={actionModalRef}
          actionModalPosition={actionModal.position}
          actionModalWidth={actionModalWidth}
          physicalScale={physicalScale}
          destinationPicker={destinationPicker}
          items={items}
          onSelect={handleDestinationSelect}
          onClose={closeDestinationPicker}
        />
      )}
    </>
  );
}
