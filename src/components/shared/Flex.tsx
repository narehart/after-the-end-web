/* eslint-disable @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { forwardRef, type ElementType, type ReactNode } from 'react';
import classNames from 'classnames/bind';
import type { PolymorphicComponent, PolymorphicProps } from '../../types/polymorphic';
import type { FlexDirection, FlexJustify, FlexAlign, FlexWrap, FlexGap } from '../../types/ui';
import styles from './Flex.module.css';

const cx = classNames.bind(styles);

interface FlexOwnProps {
  children?: ReactNode;
  direction?: FlexDirection | undefined;
  justify?: FlexJustify | undefined;
  align?: FlexAlign | undefined;
  wrap?: FlexWrap | undefined;
  gap?: FlexGap | undefined;
  inline?: boolean | undefined;
}

type FlexProps<TComponent extends ElementType = 'div'> = PolymorphicProps<TComponent, FlexOwnProps>;

const Flex = forwardRef(
  <TComponent extends ElementType = 'div'>(
    {
      as,
      children,
      className,
      direction,
      justify,
      align,
      wrap,
      gap,
      inline,
      ...props
    }: FlexProps<TComponent>,
    ref: any
  ) => {
    const Component = as ?? 'div';
    const flexClassName = cx(
      'flex',
      {
        'flex--inline': inline === true,
        [`flex--direction-${direction}`]: direction !== undefined,
        [`flex--justify-${justify}`]: justify !== undefined,
        [`flex--align-${align}`]: align !== undefined,
        [`flex--wrap-${wrap}`]: wrap !== undefined,
        [`flex--gap-${gap}`]: gap !== undefined,
      },
      className
    );

    return (
      <Component ref={ref} className={flexClassName} {...props}>
        {children}
      </Component>
    );
  }
) as PolymorphicComponent<'div', FlexOwnProps>;

Flex.displayName = 'Flex';

export default Flex;
