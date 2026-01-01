export default function DestinationOptions({
  destinations,
  path,
  currentCanFit,
  focusedIndex,
  setFocusedIndex,
  onPlaceHere,
  onSelect,
}) {
  const hasPlaceHere = path.length > 0;

  return (
    <div className="destination-options">
      {hasPlaceHere && (
        <button
          className={`destination-option place-here ${focusedIndex === 0 ? 'focused' : ''} ${!currentCanFit ? 'disabled' : ''}`}
          onClick={onPlaceHere}
          onMouseEnter={() => setFocusedIndex(0)}
          disabled={!currentCanFit}
        >
          Place here
        </button>
      )}

      {destinations.map((dest, index) => {
        const itemIndex = hasPlaceHere ? index + 1 : index;
        const isDisabled = !dest.canFit;
        return (
          <button
            key={dest.id}
            className={`destination-option ${itemIndex === focusedIndex ? 'focused' : ''} ${isDisabled ? 'disabled' : ''}`}
            onClick={() => onSelect(dest)}
            onMouseEnter={() => setFocusedIndex(itemIndex)}
            disabled={isDisabled}
          >
            <span className="option-label">{dest.name}</span>
            {dest.capacity && <span className="option-capacity">{dest.capacity}</span>}
            <span className="option-arrow">›</span>
          </button>
        );
      })}

      {destinations.length === 0 && hasPlaceHere && (
        <div className="no-containers">No containers inside</div>
      )}
    </div>
  );
}
