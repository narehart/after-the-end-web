/* eslint-disable @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
import { forwardRef, type ReactNode } from 'react';
import classNames from 'classnames/bind';
import type { PolymorphicComponent, PolymorphicProps } from '../../types/polymorphic';
import type { TextElement, TextType } from '../../types/ui';
import styles from './Text.module.css';

const cx = classNames.bind(styles);

interface TextOwnProps {
  children?: ReactNode;
  type?: TextType | undefined;
}

type TextProps<TComponent extends TextElement = 'span'> = PolymorphicProps<
  TComponent,
  TextOwnProps
>;

const Text = forwardRef(
  <TComponent extends TextElement = 'span'>(
    { as, children, type, className, ...props }: TextProps<TComponent>,
    ref: any
  ) => {
    const Component: any = as ?? 'span';
    const typeClass = type !== undefined ? cx(`text--${type}`) : undefined;
    const fullClassName =
      typeClass !== undefined && className !== undefined
        ? `${typeClass} ${className}`
        : (typeClass ?? className);

    return (
      <Component ref={ref} className={fullClassName} {...props}>
        {children}
      </Component>
    );
  }
) as PolymorphicComponent<'span', TextOwnProps>;

Text.displayName = 'Text';

export default Text;
