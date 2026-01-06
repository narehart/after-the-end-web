import { DEFAULT_QUANTITY } from '../constants/items';
import type { Item } from '../types/inventory';
import { generateRandomDurability } from './generateRandomDurability';

interface CreateItemInstanceProps {
  template: Item;
  instanceId: string;
  quantity?: number;
}

type CreateItemInstanceReturn = Item;

export function createItemInstance(props: CreateItemInstanceProps): CreateItemInstanceReturn {
  const { template, instanceId, quantity } = props;
  return {
    ...template,
    id: instanceId,
    durability: generateRandomDurability(),
    quantity: quantity ?? DEFAULT_QUANTITY,
  };
}
