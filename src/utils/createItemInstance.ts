import type { CreateItemInstanceProps, CreateItemInstanceReturn } from '../types/utils';
import { generateRandomDurability } from './generateRandomDurability';

export function createItemInstance(props: CreateItemInstanceProps): CreateItemInstanceReturn {
  const { template, instanceId } = props;
  return {
    ...template,
    id: instanceId,
    durability: generateRandomDurability(),
  };
}
