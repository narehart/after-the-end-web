/* eslint-disable @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
import { forwardRef, type ElementType, type ReactNode } from 'react';
import type { PolymorphicComponent, PolymorphicProps } from '../../types/polymorphic';

interface BoxOwnProps {
  children?: ReactNode;
}

type BoxProps<TComponent extends ElementType = 'div'> = PolymorphicProps<TComponent, BoxOwnProps>;

const Box = forwardRef(
  <TComponent extends ElementType = 'div'>(
    { as, children, ...props }: BoxProps<TComponent>,
    ref: any
  ) => {
    const Component = as ?? 'div';
    return (
      <Component ref={ref} {...props}>
        {children}
      </Component>
    );
  }
) as PolymorphicComponent<'div', BoxOwnProps>;

Box.displayName = 'Box';

export default Box;
