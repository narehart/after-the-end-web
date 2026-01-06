---
name: ui-components
description: Create React components with CSS Modules and design tokens
---

# UI Components

Write React components in `src/ui/` following the project's component philosophy.

## Requirements

- **File naming:** PascalCase (e.g., `ItemCell.tsx`)
- **CSS file:** Paired `.module.css` file (e.g., `ItemCell.module.css`)
- **Delegate logic** to hooks and utils

## Pattern

```tsx
import classNames from 'classnames/bind';
import type { ReactNode } from 'react';

import styles from './ComponentName.module.css';

const cx = classNames.bind(styles);

interface ComponentNameProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | undefined;
  isActive?: boolean | undefined;
}

export function ComponentName(props: ComponentNameProps): ReactNode {
  const { children, variant = 'primary', isActive = false } = props;

  return (
    <div className={cx('component', `component--${variant}`, { 'component--active': isActive })}>
      {children}
    </div>
  );
}
```

## CSS Module Pattern

```css
/* ComponentName.module.css */
.component {
  padding: var(--space-md);
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
}

.component--primary {
  color: var(--text-primary);
}

.component--secondary {
  color: var(--text-secondary);
}

.component--active {
  border-color: var(--accent-primary);
}
```

## Rules

1. **Check existing components first** - Look for Button, Panel, Text, Flex, Icon before creating new ones
2. **Use primitive components** - Compose with Box, Flex, Text, Button, Panel, Icon
3. **CSS variables only** - Use design tokens, not hardcoded values
4. **BEM naming** - `.block-element--modifier` in CSS
5. **Delegate logic** - Complex logic goes in hooks/utils, not components
6. **No helper functions** - Extract to utils if needed

## classnames Binding

Always use `classnames/bind` for conditional classes:

```tsx
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

// Good
<div className={cx('cell', { 'cell--selected': isSelected })} />

// Bad - plain string literals forbidden
<div className="cell" />
<div className={styles.cell} />
```

## Design Token Prefixes

| Prefix    | Usage                   |
| --------- | ----------------------- |
| `font-`   | Typography              |
| `space-`  | Spacing/padding/margins |
| `z-`      | Z-index layers          |
| `shadow-` | Box shadows             |
| `size-`   | Fixed sizes             |
| `bg-`     | Background colors       |
| `text-`   | Text colors             |
| `border-` | Border colors           |
| `accent-` | Accent/highlight colors |
