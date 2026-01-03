/* eslint-disable @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
import { forwardRef, type ReactNode } from 'react';
import type { PolymorphicComponent, PolymorphicProps } from '../../types/polymorphic';
import type { TextElement } from '../../types/ui';

interface TextOwnProps {
  children?: ReactNode;
}

type TextProps<TComponent extends TextElement = 'span'> = PolymorphicProps<
  TComponent,
  TextOwnProps
>;

const Text = forwardRef(
  <TComponent extends TextElement = 'span'>(
    { as, children, ...props }: TextProps<TComponent>,
    ref: any
  ) => {
    const Component: any = as ?? 'span';
    return (
      <Component ref={ref} {...props}>
        {children}
      </Component>
    );
  }
) as PolymorphicComponent<'span', TextOwnProps>;

Text.displayName = 'Text';

export default Text;
