/* eslint-disable @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
/* eslint-disable local/types-in-types-directory -- Component-specific prop types */
import { forwardRef, type ReactNode } from 'react';
import classNames from 'classnames/bind';
import type { PolymorphicComponent, PolymorphicProps } from '../types/polymorphic';
import styles from './Text.module.css';

type TextElement = 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label';
type TextType = 'secondary' | 'muted';
type TextSize = 'xs' | 'sm' | 'base' | 'lg';
type TextAlign = 'left' | 'center' | 'right';
type TextSpacing = 'tight' | 'normal' | 'wide';

const cx = classNames.bind(styles);

interface TextOwnProps {
  children?: ReactNode;
  type?: TextType | undefined;
  size?: TextSize | undefined;
  strong?: boolean | undefined;
  bold?: boolean | undefined;
  code?: boolean | undefined;
  ellipsis?: boolean | undefined;
  uppercase?: boolean | undefined;
  align?: TextAlign | undefined;
  spacing?: TextSpacing | undefined;
  grow?: boolean | undefined;
}

type TextProps<TComponent extends TextElement = 'span'> = PolymorphicProps<
  TComponent,
  TextOwnProps
>;

const Text = forwardRef(
  <TComponent extends TextElement = 'span'>(
    {
      as,
      children,
      type,
      size,
      strong,
      bold,
      code,
      ellipsis,
      uppercase,
      align,
      spacing,
      grow,
      className,
      ...props
    }: TextProps<TComponent>,
    ref: any
  ) => {
    const Component: any = as ?? 'span';
    const textClass = cx('text', {
      [`text--${type}`]: type !== undefined,
      [`text--${size}`]: size !== undefined,
      'text--strong': strong === true,
      'text--bold': bold === true,
      'text--code': code === true,
      'text--ellipsis': ellipsis === true,
      'text--uppercase': uppercase === true,
      [`text--align-${align}`]: align !== undefined,
      [`text--spacing-${spacing}`]: spacing !== undefined,
      'text--grow': grow === true,
    });
    const fullClassName = className !== undefined ? `${textClass} ${className}` : textClass;

    return (
      <Component ref={ref} className={fullClassName} {...props}>
        {children}
      </Component>
    );
  }
) as PolymorphicComponent<'span', TextOwnProps>;

Text.displayName = 'Text';

export default Text;
