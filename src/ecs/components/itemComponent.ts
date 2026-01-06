/**
 * Item Component
 *
 * Item instance data (references a template, tracks instance-specific state)
 */

export interface ItemComponent {
  templateId: string;
  quantity: number;
  durability: number | null;
  maxDurability: number | null;
}
