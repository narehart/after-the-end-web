/* eslint-disable @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
import { forwardRef, type ReactNode } from 'react';
import classNames from 'classnames/bind';
import type { PolymorphicComponent, PolymorphicProps } from '../../types/polymorphic';
import type { TextAlign, TextElement, TextSize, TextSpacing, TextType } from '../../types/ui';
import styles from './Text.module.css';

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
