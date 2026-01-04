export default function getListItemKey<TItem>(
  item: TItem,
  index: number,
  rowKey?: keyof TItem | ((item: TItem) => string)
): string {
  if (rowKey === undefined) {
    return String(index);
  }
  if (typeof rowKey === 'function') {
    return rowKey(item);
  }
  return String(item[rowKey]);
}
