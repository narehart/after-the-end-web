/**
 * Is Stack Compatible
 *
 * Checks if an item can be stacked with another based on template and quantity limits.
 */

interface IsStackCompatibleProps {
  itemTemplateId: string;
  itemQuantity: number;
  targetTemplateId: string;
  stackLimit: number;
  addQuantity: number;
}

export function isStackCompatible(props: IsStackCompatibleProps): boolean {
  const { itemTemplateId, itemQuantity, targetTemplateId, stackLimit, addQuantity } = props;
  const isMatch = itemTemplateId === targetTemplateId;
  const hasRoom = itemQuantity + addQuantity <= stackLimit;
  return isMatch && hasRoom;
}
