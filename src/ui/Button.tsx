/* eslint-disable local/types-in-types-directory -- Component-specific prop types */
import { forwardRef, type ComponentPropsWithRef, type ReactNode } from 'react';
import classNames from 'classnames/bind';
import styles from './Button.module.css';

type ButtonVariant = 'default' | 'text' | 'toolbar' | 'ghost';

const cx = classNames.bind(styles);

interface ButtonProps extends ComponentPropsWithRef<'button'> {
  children?: ReactNode;
  variant?: ButtonVariant | undefined;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'default', className, ...props }, ref) => {
    const buttonClass = cx('button', `button--${variant}`);
    const fullClassName = className !== undefined ? `${buttonClass} ${className}` : buttonClass;

    return (
      <button ref={ref} className={fullClassName} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
