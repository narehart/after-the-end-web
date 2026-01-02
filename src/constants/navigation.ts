export const PANELS = ['equipment', 'inventory', 'world'] as const;
export type PanelName = (typeof PANELS)[number];
