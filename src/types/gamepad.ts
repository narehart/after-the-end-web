export type NavigationDirection = 'up' | 'down' | 'left' | 'right';

export type ButtonHandler = (buttonIndex: number, onPress: () => void, key?: string) => void;
