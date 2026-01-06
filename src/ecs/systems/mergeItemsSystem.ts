/**
 * Merge Items System
 *
 * Merges all of one item's quantity into another compatible stack.
 */

import type { MergeItemsProps } from '../../types/ecs';
import { getItemEntity } from '../queries/inventoryQueries';
import { destroyItem } from './destroyItemSystem';

export function mergeItems(props: MergeItemsProps): boolean {
  const { sourceEntityId, targetEntityId } = props;

  const sourceEntity = getItemEntity({ entityId: sourceEntityId });
  const targetEntity = getItemEntity({ entityId: targetEntityId });

  if (sourceEntity?.item === undefined || targetEntity?.item === undefined) {
    return false;
  }

  if (sourceEntity.item.templateId !== targetEntity.item.templateId) {
    return false;
  }

  const sourceTemplate = sourceEntity.template?.template;
  if (sourceTemplate === undefined) {
    return false;
  }

  const totalQty = sourceEntity.item.quantity + targetEntity.item.quantity;
  if (totalQty > sourceTemplate.stackLimit) {
    return false;
  }

  targetEntity.item.quantity = totalQty;
  return destroyItem({ entityId: sourceEntityId });
}
