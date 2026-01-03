import { DEFAULT_QUANTITY } from '../constants/numbers';
import type { CreateItemInstanceProps, CreateItemInstanceReturn } from '../types/utils';
import { generateRandomDurability } from './generateRandomDurability';

export function createItemInstance(props: CreateItemInstanceProps): CreateItemInstanceReturn {
  const { template, instanceId, quantity } = props;
  return {
    ...template,
    id: instanceId,
    durability: generateRandomDurability(),
    quantity: quantity ?? DEFAULT_QUANTITY,
  };
}
